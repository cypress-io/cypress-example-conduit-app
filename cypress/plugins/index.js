const { join } = require('path')
const knexFactory = require('knex')

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    deleteAllArticles () {
      const filename = join(__dirname, '..', '..', 'server', '.tmp.db')
      const knex = knexFactory({
        client: 'sqlite3',
        connection: {
          filename
        },
        useNullAsDefault: true
      })
      // if we are trying to truncate a non-existing table
      // that is ok - the server API will create them
      const onError = err =>
        err.toString().includes('no such table') ? null : Promise.reject(err)

      // truncates all tables created by previous tests
      // or manually by using the application
      return Promise.all([
        knex.truncate('Articles').catch(onError),
        knex.truncate('ArticleTags').catch(onError),
        knex.truncate('Comments').catch(onError)
      ])
    }
  })
}
