'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Helpers = require('../helpers');
const Article = require('../../models/article');
const Tag = require('../../models/tag');

module.exports = Helpers.withDefaults({
    method: 'put',
    path: '/articles/{slug}',
    options: {
        validate: {
            params: {
                slug: Article.field('slug')
            },
            payload: {
                article: Joi.object().required().keys({
                    title: Article.field('title'),
                    description: Article.field('description'),
                    body: Article.field('body'),
                    tagList: Joi.array().items(Tag.field('name'))
                })
            }
        },
        auth: 'jwt',
        handler: async (request, h) => {

            const { slug } = request.params;
            const { article: articleInfo } = request.payload;
            const { articleService, displayService } = request.services();
            const currentUserId = Helpers.currentUserId(request);

            const { id, authorId } = await articleService.findBySlug(slug);

            if (authorId !== currentUserId) {
                throw Boom.forbidden();
            }

            const updateAndFetchArticle = async (txn) => {

                await articleService.update(id, articleInfo, txn);

                return await articleService.findById(id, txn);
            };

            const article = await h.context.transaction(updateAndFetchArticle);

            return {
                article: await displayService.articles(currentUserId, article)
            };
        }
    }
});
