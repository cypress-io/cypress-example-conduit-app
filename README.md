# cypress-applitools-webinar

Companion Code to "Functional and Visual Testing with Cypress.io and Applitools" webinar

## Functional tests

in folder [cypress/integration](cypress/integration)

- installed [Cypress](https://www.cypress.io) with `npm i -D cypress`
- scaffolded Cypress folder with `npx @bahmutov/cly init`
- set the base url in [cypress.json](cypress.json) file

```json
{
  "baseUrl": "http://localhost:4100"
}
```

- manually made a test user account: `tester@test.com` `password1234` and set the user profile picture to `https://robohash.org/6FJ.png?set=set3&size=150x150`

![robot](https://robohash.org/6FJ.png?set=set3&size=150x150)

- looked at the login action. The user logs in via XHR call to `POST http://localhost:3000/api/users/login` which returns JWT and sets it in local storage under `jwt` key. The payload to login is `{user: {email: "tester@test.com", password: "password1234"}}`. Implemented the same functionality using [cy.request](https://on.cypress.io/request) by grabbing the user account object from `cypress.json` environment object

```js
describe('Conduit', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3000/api/users/login', {
      user: Cypress.env('user')
    })
      .its('body.user.token')
      .should('exist')
      .then(token => {
        localStorage.setItem('jwt', token)
      })

    cy.visit('/')
  })

  it('shows feeds', () => {
    cy.contains('a.nav-link', 'Your Feed').should('have.class', 'active')
    cy.contains('a.nav-link', 'Global Feed').should('not.have.class', 'active')
  })
})
```

And we are in business!

![Shows feeds test](images/shows-feeds.png)

**Tip:** find different ways to quickly login in [Logging in](https://github.com/cypress-io/cypress-example-recipes#logging-in-recipes) recipes.
