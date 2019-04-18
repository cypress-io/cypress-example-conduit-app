import '@applitools/eyes-cypress/commands'

// a custom Cypress command to login using XHR call
// and then set the received token in the local storage

Cypress.Commands.add('login', () => {
  cy.request('POST', 'http://localhost:3000/api/users/login', {
    user: Cypress.env('user'),
  })
    .its('body.user.token')
    .should('exist')
    .then((token) => {
      localStorage.setItem('jwt', token)
      // with this token set, when we visit the page
      // the web application will have the user logged in
    })

  cy.visit('/')
})

// creates a user with email and password
// defined in cypress.json environment variables
// if the user already exists, ignores the error
Cypress.Commands.add('registerUserIfNeeded', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/users',
    body: {
      user: {
        username: 'testuser',
        image: 'https://robohash.org/6FJ.png?set=set3&size=150x150',
        // email, password
        ...Cypress.env('user'),
      },
    },
    failOnStatusCode: false,
  })
})
