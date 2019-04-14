'use strict';

const Boom = require('boom');
const Toys = require('toys');
const Avocat = require('avocat');
const { NotFoundError, ValidationError } = require('objection');

const internals = {};

module.exports = Toys.onPreResponse((request, h) => {

    const { response: error } = request;
    const { formatError, mapError } = internals;

    if (!error.isBoom) {
        return h.continue;
    }

    throw formatError(mapError(error));
});

internals.mapError = (error) => {

    // Handle joi input validation error.
    // Info available due to default failAction in routes/helpers.

    if (error.output.payload.validation) {

        // e.g. '"body" is required' -> 'is required'
        const stripFieldName = (str) => str.replace(/^".*?" /, '');
        const { source } = error.output.payload.validation;

        const validation = error.details.reduce((collector, { path, message }) => {

            const field = path[path.length - 1] || source;

            return {
                ...collector,
                [field]: (collector[field] || []).concat(stripFieldName(message))
            };
        }, {});

        return Boom.badData(null, { validation });
    }

    // Handle some specific db errors

    if (error instanceof ValidationError) {
        return Boom.badData(null, { validation: {} }); // No specifics, avoid leaking model details
    }

    if (error instanceof NotFoundError) {
        return Boom.notFound(`${error.modelName || 'Record'} Not Found`);
    }

    // Handle all other db errors with avocat

    return Avocat.rethrow(error, { return: true, includeMessage: false }) || error;
};

internals.formatError = (error) => {

    const { message } = error.output.payload;
    const payload = error.output.payload = { errors: {} };

    if (error.data && error.data.validation) {
        payload.errors = error.data.validation;
    }
    else {
        const type = (error.typeof && error.typeof.name) || 'error';
        payload.errors = {
            [type]: [message]
        };
    }

    return error;
};
