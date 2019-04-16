Cypress.Commands.add('login', () => {
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
