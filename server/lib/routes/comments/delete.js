'use strict';

const Boom = require('boom');
const Helpers = require('../helpers');
const Article = require('../../models/article');
const Comment = require('../../models/comment');

module.exports = Helpers.withDefaults({
    method: 'delete',
    path: '/articles/{slug}/comments/{commentId}',
    options: {
        validate: {
            params: {
                slug: Article.field('slug'),
                commentId: Comment.field('id')
            }
        },
        auth: 'jwt',
        handler: async (request) => {

            const { slug, commentId } = request.params;
            const { articleService } = request.services();
            const currentUserId = Helpers.currentUserId(request);

            const { id: articleId } = await articleService.findBySlug(slug);
            const comment = await articleService.findCommentById(commentId);

            if (comment.articleId !== articleId) {
                throw Boom.notFound();
            }

            if (comment.authorId !== currentUserId) {
                throw Boom.forbidden();
            }

            await articleService.removeComment(comment.id);

            return null;
        }
    }
});
