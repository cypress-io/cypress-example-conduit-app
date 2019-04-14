'use strict';

const Objection = require('objection');

module.exports = (server) => ({
    transaction: (fn) => Objection.transaction(server.knex(), fn)
});
