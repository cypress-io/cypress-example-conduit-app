'use strict';

const Boom = require('boom');
const Helpers = require('../helpers');
const Article = require('../../models/article');

module.exports = Helpers.withDefaults({
    method: 'delete',
    path: '/articles/{slug}',
    options: {
        validate: {
            params: {
                slug: Article.field('slug')
            }
        },
        auth: 'jwt',
        handler: async (request, h) => {

            const { slug } = request.params;
            const { articleService } = request.services();
            const currentUserId = Helpers.currentUserId(request);

            const { id, authorId } = await articleService.findBySlug(slug);

            if (authorId !== currentUserId) {
                throw Boom.forbidden();
            }

            await articleService.delete(id);

            return null;
        }
    }
});
