'use strict';

// Load modules

const Fs = require('fs');
const Util = require('util');
const Bounce = require('bounce');
const Code = require('code');
const Lab = require('lab');
const Toys = require('toys');
const Newman = require('newman');
const Server = require('../server');

// Test shortcuts

const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Deployment', () => {

    const dropDb = async () => {

        try {
            await Util.promisify(Fs.unlink)('.test.db');
        }
        catch (error) {
            Bounce.ignore(error, { code: 'ENOENT' });
        }
    };

    it('allows a user to login, signup, then fetch their user info.', async () => {

        await dropDb();

        const server = await Server.deployment();

        const signup = await server.inject({
            method: 'post',
            url: '/api/users',
            payload: {
                user: {
                    username: 'test-user',
                    password: 'test-pass',
                    email: 'x@y.com'
                }
            }
        });

        expect(signup.statusCode).to.equal(200);
        expect(signup.result).to.equal({
            user: {
                id: 1,
                username: 'test-user',
                email: 'x@y.com',
                bio: null,
                image: null,
                token: signup.result.user.token
            }
        });

        expect(signup.result.user.token).to.be.a.string();

        const login = await server.inject({
            method: 'post',
            url: '/api/users/login',
            payload: {
                user: {
                    email: 'x@y.com',
                    password: 'test-pass'
                }
            }
        });

        expect(login.statusCode).to.equal(200);
        expect(login.result).to.equal({
            user: {
                id: 1,
                username: 'test-user',
                email: 'x@y.com',
                bio: null,
                image: null,
                token: login.result.user.token
            }
        });

        expect(login.result.user.token).to.be.a.string();

        const getCurrentUser = await server.inject({
            method: 'get',
            url: '/api/user',
            headers: {
                authorization: `Token ${login.result.user.token}`
            }
        });

        expect(getCurrentUser.statusCode).to.equal(200);
        expect(getCurrentUser.result).to.equal({
            user: {
                id: 1,
                username: 'test-user',
                email: 'x@y.com',
                bio: null,
                image: null,
                token: login.result.user.token
            }
        });
    });

    it('passes postman tests.', { timeout: 5000 }, async (flags) => {

        await dropDb();

        const server = await Server.deployment();

        await server.start();

        flags.onCleanup = async () => await server.stop();

        // Create a user to follow/unfollow (referenced within postman collection)

        await server.services().userService.signup({
            username: 'rick',
            password: 'secret-rick',
            email: 'rick@rick.com'
        });

        // Run postman tests

        const newman = Newman.run({
            reporters: 'cli',
            collection: require('./postman-collection.json'),
            environment: {
                values: [
                    {
                        enabled: true,
                        key: 'apiUrl',
                        value: `${server.info.uri}/api`,
                        type: 'text'
                    }
                ]
            }
        });

        await Toys.event(newman, 'done');

        expect(newman.summary.run.error).to.not.exist();
        expect(newman.summary.run.failures.length).to.equal(0);
    });
});
