'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const Article = require('../../models/article');

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/articles/{slug}/comments',
    options: {
        validate: {
            params: {
                slug: Article.field('slug')
            },
            payload: {
                comment: Joi.object().required().keys({
                    body: Article.field('body').required()
                })
            }
        },
        auth: 'jwt',
        handler: async (request, h) => {

            const { slug } = request.params;
            const { comment: commentInfo } = request.payload;
            const { articleService, displayService } = request.services();
            const currentUserId = Helpers.currentUserId(request);

            const { id: articleId } = await articleService.findBySlug(slug);

            const createAndFetchComment = async (txn) => {

                const commentId = await articleService.addComment(currentUserId, articleId, commentInfo, txn);

                return await articleService.findCommentById(commentId, txn);
            };

            const comment = await h.context.transaction(createAndFetchComment);

            return {
                comment: await displayService.comments(currentUserId, comment)
            };
        }
    }
});
