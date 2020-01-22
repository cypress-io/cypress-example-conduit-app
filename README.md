# realworld [![renovate-app badge][renovate-badge]][renovate-app] [![CircleCI](https://circleci.com/gh/cypress-io/cypress-example-realworld/tree/master.svg?style=svg&circle-token=f127e83138e505b26bb90ab7c0bcb60e5265fecb)](https://circleci.com/gh/cypress-io/cypress-example-realworld/tree/master) [![Coverage Status](https://coveralls.io/repos/github/cypress-io/cypress-example-realworld/badge.svg?branch=master)](https://coveralls.io/github/cypress-io/cypress-example-realworld?branch=master) [![Cypress.io Test Dashboard](https://img.shields.io/badge/cypress.io-dashboard-green.svg?style=flat-square)](https://dashboard.cypress.io/#/projects/bh5j1d)


Fork of [applitools/cypress-applitools-webinar](https://github.com/applitools/cypress-applitools-webinar) which is a fork of [gothinkster/realworld](https://github.com/gothinkster/realworld) "Conduit" blogging application.

![Application](images/app.png)

## Tests

The tests are in [cypress/integration](cypress/integration) folder

- [feeds-spec.js](cypress/integration/feeds-spec.js) shows how to check the favorite articles feed and the global feed
- [follow-user-spec.js](cypress/integration/follow-user-spec.js) shows how to create two users and check if one user can follow the other
- [login-spec.js](cypress/integration/login-spec.js) checks if the user can log in via UI and via API
- [new-post-spec.js](cypress/integration/new-post-spec.js) verifies that a new article can be published and updated
- [profile-spec.js](cypress/integration/profile-spec.js) lets the user edit their profile
- [register-spec.js](cypress/integration/register-spec.js) tests if a new user can register
- [tags-spec.js](cypress/integration/tags-spec.js) checks if tags work
- [pagination-spec.js](cypress/integration/pagination-spec.js) creates many articles via API calls and then checks if they are displayed across two pages
- [force-logout-spec.js](cypress/integration/force-logout-spec.js) verifies that unauthorized API calls force the user session to finish

## Full code coverage

Front- and back-end coverage for this application is collected using the [@cypress/code-coverage](https://github.com/cypress-io/code-coverage) plugin. You can run the locally instrumented server and client using `npm run dev:coverage` command. The backend coverage is exposed in [server/server/index.js](server/server/index.js) via endpoint listed in [cypress.json](cypress.json) (usually `GET /__coverage`). The frontend coverage is collected by instrumenting the web application source code on the fly, see the [client/.babelrc](client/.babelrc) file.

The combined report is saved in `coverage/index.html` after the tests finish:

![Example full coverage report](images/full-coverage.png)

The coverage is sent to [Coveralls.io](https://coveralls.io/repos/github/cypress-io/cypress-example-realworld) using command `npm run coveralls` from CircleCI AFTER partial coverage information from parallel E2E test runs is combined, see [circle.yml](circle.yml) file.

To learn more, read the [Cypress code coverage guide](https://on.cypress.io/coverage).

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/

Requires Python 2.7 for node-gyp to be compiled.
