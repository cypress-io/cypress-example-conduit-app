'use strict';

const Helpers = require('../helpers');
const Article = require('../../models/article');

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/articles/{slug}/favorite',
    options: {
        validate: {
            params: {
                slug: Article.field('slug')
            }
        },
        auth: 'jwt',
        handler: async (request, h) => {

            const { slug } = request.params;
            const { articleService, displayService } = request.services();
            const currentUserId = Helpers.currentUserId(request);

            const article = await articleService.findBySlug(slug);

            const favoriteAndFetchArticle = async (txn) => {

                await articleService.favorite(currentUserId, article.id, txn);

                return await displayService.articles(currentUserId, article, txn);
            };

            return {
                article: await h.context.transaction(favoriteAndFetchArticle)
            };
        }
    }
});
