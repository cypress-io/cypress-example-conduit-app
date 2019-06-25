# realworld [![renovate-app badge][renovate-badge]][renovate-app] [![CircleCI](https://circleci.com/gh/bahmutov/realworld/tree/master.svg?style=svg)](https://circleci.com/gh/bahmutov/realworld/tree/master)

Fork of [applitools/cypress-applitools-webinar](https://github.com/applitools/cypress-applitools-webinar) which is a fork of [gothinkster/realworld](https://github.com/gothinkster/realworld).

## Full code coverage

Is collected using [@cypress/code-coverage](https://github.com/cypress-io/code-coverage). We run locally instrumented server and client using `npm run dev:coverage`, backend coverage is exposed in [server/server/index.js](server/server/index.js) via endpoint listed in [cypress.json](cypress.json). Frontend coverage is collected by instrumenting source code on the fly, see [client/.babelrc](client/.babelrc) file.

Combined report is saved in `coverage/index.html`

![Example full coverage report](images/full-coverage.png)

Read [Cypress code coverage guide](https://on.cypress.io/coverage)

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
