'use strict';

const Helpers = require('../helpers');
const Article = require('../../models/article');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/articles/{slug}',
    options: {
        validate: {
            params: {
                slug: Article.field('slug')
            }
        },
        auth: { strategy: 'jwt', mode: 'optional' },
        handler: async (request) => {

            const { slug } = request.params;
            const { articleService, displayService } = request.services();
            const currentUserId = Helpers.currentUserId(request);

            const article = await articleService.findBySlug(slug);

            return {
                article: await displayService.articles(currentUserId, article)
            };
        }
    }
});
