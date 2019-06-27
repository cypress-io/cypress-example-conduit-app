const { join } = require('path')
const knexFactory = require('knex')

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // tasks for code coverage
  on('task', require('@cypress/code-coverage/task'))

  // tasks for resetting database during tests
  on('task', {
    cleanDatabase () {
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

      // truncates all tables which removes data left by previous tests
      return Promise.all([
        knex
          .truncate('Users')
          .catch(err =>
            err.toString().includes('no such table')
              ? undefined
              : Promise.reject(err)
          ),
        knex
          .truncate('Articles')
          .catch(err =>
            err.toString().includes('no such table')
              ? undefined
              : Promise.reject(err)
          ),
        knex
          .truncate('ArticleTags')
          .catch(err =>
            err.toString().includes('no such table')
              ? undefined
              : Promise.reject(err)
          ),
        knex
          .truncate('Comments')
          .catch(err =>
            err.toString().includes('no such table')
              ? undefined
              : Promise.reject(err)
          ),
        knex
          .truncate('Followers')
          .catch(err =>
            err.toString().includes('no such table')
              ? undefined
              : Promise.reject(err)
          ),
        knex
          .truncate('ArticleFavorites')
          .catch(err =>
            err.toString().includes('no such table')
              ? undefined
              : Promise.reject(err)
          )
      ])
    },
    registerNewUserIfNeeded () {}
  })
}
