'use strict';

const Util = require('util');
const Boom = require('boom');
const Bounce = require('bounce');
const { UniqueViolationError } = require('objection-db-errors');
const SecurePassword = require('secure-password');
const Schmervice = require('schmervice');
const JWT = require('jsonwebtoken');

module.exports = class UserService extends Schmervice.Service {

    constructor(...args) {

        super(...args);

        const pwd = new SecurePassword();

        this.pwd = {
            hash: Util.promisify(pwd.hash.bind(pwd)),
            verify: Util.promisify(pwd.verify.bind(pwd))
        };
    }

    async findById(id, txn) {

        const { User } = this.server.models();

        return await User.query(txn).throwIfNotFound().findById(id);
    }

    async findByUsername(username, txn) {

        const { User } = this.server.models();

        return await User.query(txn).throwIfNotFound().first().where({ username });
    }

    async follow(currentUserId, id, txn) {

        const { User } = this.server.models();

        if (currentUserId === id) {
            throw Boom.forbidden();
        }

        const currentUser = User.fromJson({ id: currentUserId }, { skipValidation: true });

        try {
            await currentUser.$relatedQuery('following', txn).relate(id);
        }
        catch (err) {
            Bounce.ignore(err, UniqueViolationError);
        }
    }

    async unfollow(currentUserId, id, txn) {

        const { User } = this.server.models();

        if (currentUserId === id) {
            throw Boom.forbidden();
        }

        const currentUser = User.fromJson({ id: currentUserId }, { skipValidation: true });

        await currentUser.$relatedQuery('following', txn).unrelate().where({ id });
    }

    async signup({ password, ...userInfo }, txn) {

        const { User } = this.server.models();

        const { id } = await User.query(txn).insert(userInfo);

        await this.changePassword(id, password, txn);

        return id;
    }

    async update(id, { password, ...userInfo }, txn) {

        const { User } = this.server.models();

        if (Object.keys(userInfo).length > 0) {
            await User.query(txn).throwIfNotFound().where({ id }).patch(userInfo);
        }

        if (password) {
            await this.changePassword(id, password, txn);
        }

        return id;
    }

    async login({ email, password }, txn) {

        const { User } = this.server.models();

        const user = await User.query(txn).throwIfNotFound().first().where({
            email: User.raw('? collate nocase', email)
        });

        const passwordCheck = await this.pwd.verify(Buffer.from(password), user.password);

        if (passwordCheck === SecurePassword.VALID_NEEDS_REHASH) {
            await this.changePassword(user.id, password, txn);
        }
        else if (passwordCheck !== SecurePassword.VALID) {
            throw User.createNotFoundError();
        }

        return user;
    }

    async createToken(id) {

        return await JWT.sign({ id }, this.options.jwtKey, {
            algorithm: 'HS256',
            expiresIn: '7d'
        });
    }

    async changePassword(id, password, txn) {

        const { User } = this.server.models();

        await User.query(txn).throwIfNotFound().where({ id }).patch({
            password: await this.pwd.hash(Buffer.from(password))
        });

        return id;
    }
};
