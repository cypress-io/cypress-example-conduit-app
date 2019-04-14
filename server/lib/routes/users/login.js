'use strict';

const Joi = require('joi');
const Helpers = require('../helpers');
const User = require('../../models/user');

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/users/login',
    options: {
        validate: {
            payload: {
                user: Joi.object().required().keys({
                    email: User.field('email').required(),
                    password: Joi.string().required()
                })
            }
        },
        handler: async (request, h) => {

            const { user: { email, password } } = request.payload;
            const { userService, displayService } = request.services();

            const login = async (txn) => {

                return await userService.login({ email, password }, txn);
            };

            const user = await h.context.transaction(login);
            const token = await userService.createToken(user.id);

            return {
                user: displayService.user(user, token)
            };
        }
    }
});
