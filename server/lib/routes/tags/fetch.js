'use strict';

const Helpers = require('../helpers');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/tags',
    options: {
        auth: { strategy: 'jwt', mode: 'optional' },
        handler: async (request) => {

            const { articleService, displayService } = request.services();

            const tags = await articleService.tags();

            return {
                tags: displayService.tags(tags)
            };
        }
    }
});
