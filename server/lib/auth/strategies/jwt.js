'use strict';

const Bounce = require('bounce');
const { NotFoundError } = require('objection');

module.exports = (server, options) => ({
    scheme: 'jwt',
    options: {
        key: options.jwtKey,
        urlKey: false,
        cookieKey: false,
        tokenType: 'Token',
        verifyOptions: { algorithms: ['HS256'] },
        validate: async (decoded, request) => {

            const { userService } = request.services();

            try {
                return {
                    isValid: true,
                    credentials: await userService.findById(decoded.id)
                };
            }
            catch (error) {
                Bounce.ignore(error, NotFoundError);
                return {
                    isValid: false
                };
            }
        }
    }
});
