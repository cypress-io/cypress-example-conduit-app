'use strict';

const Helpers = require('../helpers');
const Article = require('../../models/article');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/articles/{slug}/comments',
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

            const { id: articleId } = await articleService.findBySlug(slug);
            const comments = await articleService.findCommentsByArticle(articleId);

            return {
                comments: await displayService.comments(currentUserId, comments)
            };
        }
    }
});
