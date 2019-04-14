'use strict';

exports.up = async (knex) => {

    await knex.schema
        .table('Users', (t) => {

            t.string('username').notNullable().defaultTo('').unique();
            t.text('bio');
            t.string('image');
        })
        .createTable('Followers', (t) => {

            t.integer('followerId').unsigned().notNullable()
                .references('Users.id')
                .onDelete('cascade');
            t.integer('userId').unsigned().notNullable()
                .references('Users.id')
                .onDelete('cascade');
            t.primary(['followerId', 'userId']);
        });
};

exports.down = async (knex) => {

    await knex.schema
        .dropTable('Followers')
        .table('Users', (t) => {

            t.dropColumn('username');
            t.dropColumn('bio');
            t.dropColumn('image');
        });
};
