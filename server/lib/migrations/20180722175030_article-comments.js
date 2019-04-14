'use strict';

exports.up = async (knex) => {

    await knex.schema.createTable('Comments', (t) => {

        t.increments('id').primary();
        t.datetime('createdAt');
        t.datetime('updatedAt');
        t.integer('authorId').unsigned().notNullable().references('Users.id');
        t.integer('articleId').unsigned().notNullable().references('Articles.id');
        t.text('body').notNullable();
    });
};

exports.down = async (knex) => {

    await knex.schema.dropTable('Comments');
};
