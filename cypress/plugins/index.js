const { join } = require('path')

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    deleteAllArticles () {
      const knex = require('knex')({
        client: 'sqlite3',
        connection: {
          filename: join(__dirname, '..', '..', 'server', '.tmp.db')
        },
        useNullAsDefault: true
      })
      return Promise.all([
        knex.truncate('Articles'),
        knex.truncate('ArticleTags'),
        knex.truncate('Comments')
      ])
    }
  })
}
