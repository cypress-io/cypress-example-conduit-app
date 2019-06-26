/// <reference types="Cypress" />

describe('Register', () => {
  beforeEach(() => {
    cy.task('cleanDatabase')
    cy.visit('/')
    // we are not logged in
  })

  it('registers new user', () => {
    const username = 'visitor'
    const email = 'visitor@email.com'
    const password = 'visiting'
    cy.contains('a.nav-link', 'Sign up').click()

    cy.location('pathname').should('equal', '/register')
    cy.get('[data-cy=username]').type(username)
    cy.get('[data-cy=email]').type(email)
    cy.get('[data-cy=password]').type(password)
    cy.get('form').submit()

    cy.location('pathname').should('equal', '/')
    cy.contains('[data-cy=profile]', username).should('be.visible')
  })
})
