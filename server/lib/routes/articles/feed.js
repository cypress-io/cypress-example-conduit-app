'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/articles/feed',
    options: {
        validate: {
            query: {
                limit: Joi.number().integer().min(1).default(20),
                offset: Joi.number().integer().min(0).default(0)
            }
        },
        auth: 'jwt',
        handler: async (request) => {

            const { limit, offset } = request.query;
            const { articleService, displayService } = request.services();
            const currentUserId = Helpers.currentUserId(request);

            const { articles, total } = await articleService.feed(currentUserId, { limit, offset });

            return {
                articles: await displayService.articles(currentUserId, articles),
                articlesCount: total
            };
        }
    }
});
