'use strict';

const Helpers = require('../helpers');

module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/user',
    options: {
        auth: 'jwt',
        handler: (request, h) => {

            const { credentials: user, artifacts: token } = request.auth;
            const { displayService } = request.services();

            return {
                user: displayService.user(user, token)
            };
        }
    }
});
