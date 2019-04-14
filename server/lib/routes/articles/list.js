'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const User = require('../../models/user');
const Tag = require('../../models/tag');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/articles',
    options: {
        validate: {
            query: {
                tag: Tag.field('name').empty(''),
                author: User.field('username').empty(''),
                favorited: User.field('username').empty(''),
                limit: Joi.number().integer().min(1).default(20),
                offset: Joi.number().integer().min(0).default(0)
            }
        },
        auth: { strategy: 'jwt', mode: 'optional' },
        handler: async (request) => {

            const { articleService, displayService } = request.services();
            const currentUserId = Helpers.currentUserId(request);

            const { articles, total } = await articleService.find(request.query);

            return {
                articles: await displayService.articles(currentUserId, articles),
                articlesCount: total
            };
        }
    }
});
