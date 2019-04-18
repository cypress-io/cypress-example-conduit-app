const { join } = require("path");
const knexFactory = require("knex");

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("task", {
    deleteAllArticles() {
      const knex = knexFactory({
        client: "sqlite3",
        connection: {
          filename: join(__dirname, "..", "..", "server", ".tmp.db")
        },
        useNullAsDefault: true
      });
      return Promise.all([
        knex
          .truncate("Articles")
          .catch(err =>
            err.toString().includes("no such table")
              ? undefined
              : Promise.reject(err)
          ),
        knex
          .truncate("ArticleTags")
          .catch(err =>
            err.toString().includes("no such table")
              ? undefined
              : Promise.reject(err)
          ),
        ,
        knex
          .truncate("Comments")
          .catch(err =>
            err.toString().includes("no such table")
              ? undefined
              : Promise.reject(err)
          )
      ]);
    },
    registerNewUserIfNeeded() {}
  });
};
