'use strict';

const Joi = require('joi');
const { Model } = require('./helpers');

const internals = {};

module.exports = class Comment extends Model {

    static get tableName() {

        return 'Comments';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
            authorId: Joi.number().integer().greater(0).required(),
            articleId: Joi.number().integer().greater(0).required(),
            body: Joi.string().required()
        });
    }

    static get relationMappings() {

        const User = require('./user');
        const Article = require('./article');

        return {
            author: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'Comments.authorId',
                    to: 'Users.id'
                }
            },
            article: {
                relation: Model.BelongsToOneRelation,
                modelClass: Article,
                join: {
                    from: 'Comments.articleId',
                    to: 'Articles.id'
                }
            }
        };
    }

    $beforeInsert(ctx) {

        const now = new Date();

        this.createdAt = now;
        this.updatedAt = now;
    }

    $beforeUpdate(opt, ctx) {

        const now = new Date();

        this.updatedAt = now;
    }

    $parseDatabaseJson(json) {

        json = super.$parseDatabaseJson(json);

        json.createdAt = json.createdAt && new Date(json.createdAt);
        json.updatedAt = json.updatedAt && new Date(json.updatedAt);

        return json;
    }
};
