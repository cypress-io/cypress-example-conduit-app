'use strict';

const Joi = require('joi');
const Slugify = require('slugify');
const RandomString = require('randomstring');
const { Model } = require('./helpers');

const internals = {};

module.exports = class Article extends Model {

    static get tableName() {

        return 'Articles';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
            authorId: Joi.number().integer().greater(0).required(),
            slug: Joi.string(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            body: Joi.string().required()
        });
    }

    static get relationMappings() {

        const Tag = require('./tag');
        const User = require('./user');

        return {
            author: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'Articles.authorId',
                    to: 'Users.id'
                }
            },
            tags: {
                relation: Model.ManyToManyRelation,
                modelClass: Tag,
                join: {
                    from: 'Articles.id',
                    through: {
                        from: 'ArticleTags.articleId',
                        to: 'ArticleTags.tagId'
                    },
                    to: 'Tags.id'
                }
            },
            favoritedBy: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'Articles.id',
                    through: {
                        from: 'ArticleFavorites.articleId',
                        to: 'ArticleFavorites.userId'
                    },
                    to: 'Users.id'
                }
            }
        };
    }

    async $beforeInsert(ctx) {

        const now = new Date();

        this.createdAt = now;
        this.updatedAt = now;
        await this._setSlug(ctx.transaction);
    }

    async $beforeUpdate(opt, ctx) {

        const now = new Date();

        this.updatedAt = now;
        await this._setSlug(ctx.transaction);
    }

    $parseDatabaseJson(json) {

        json = super.$parseDatabaseJson(json);

        json.createdAt = json.createdAt && new Date(json.createdAt);
        json.updatedAt = json.updatedAt && new Date(json.updatedAt);

        return json;
    }

    async _setSlug(txn) {

        if (typeof this.title === 'undefined') {
            return;
        }

        const slug = Slugify(this.title, { lower: true });
        const exists = await this.constructor.query(txn).where({ slug }).resultSize();

        this.slug = exists ? `${slug}-${RandomString.generate(6)}` : slug;
    }
};
