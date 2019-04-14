'use strict';

const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class Tag extends Model {

    static get tableName() {

        return 'Tags';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            name: Joi.string().required()
        });
    }
};
