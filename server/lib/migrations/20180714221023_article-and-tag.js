'use strict';

exports.up = async (knex) => {

    await knex.schema
        .createTable('Articles', (t) => {

            t.increments('id').primary();
            t.datetime('createdAt');
            t.datetime('updatedAt');
            t.integer('authorId').unsigned().notNullable().references('Users.id');
            t.string('slug').notNullable().unique();
            t.string('title').notNullable();
            t.text('description').notNullable();
            t.text('body').notNullable();
        })
        .createTable('Tags', (t) => {

            t.increments('id').primary();
            t.string('name').notNullable().unique();
        })
        .createTable('ArticleTags', (t) => {

            t.integer('articleId').unsigned().notNullable()
                .references('Articles.id')
                .onDelete('cascade');
            t.integer('tagId').unsigned().notNullable()
                .references('Tags.id')
                .onDelete('cascade');
            t.primary(['articleId', 'tagId']);
        })
        .createTable('ArticleFavorites', (t) => {

            t.integer('articleId').unsigned().notNullable()
                .references('Articles.id')
                .onDelete('cascade');
            t.integer('userId').unsigned().notNullable()
                .references('Users.id')
                .onDelete('cascade');
            t.primary(['articleId', 'userId']);
        });
};

exports.down = async (knex) => {

    await knex.schema
        .dropTable('ArticleFavorites')
        .dropTable('ArticleTags')
        .dropTable('Tags')
        .dropTable('Articles');
};
