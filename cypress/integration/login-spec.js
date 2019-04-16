/// <reference types="Cypress" />

describe('Conduit Login', () => {
  beforeEach(() => {
    cy.visit('/')
    // we are not logged in
  })

  it('logs in', () => {
    cy.contains('a.nav-link', 'Sign in').click()

    const user = Cypress.env('user')
    cy.get('input[type="email"]').type(user.email)
    cy.get('input[type="password"]').type(user.password)
    cy.get('button[type="submit"]').click()

    // when we are logged in, there should be two feeds
    cy.contains('a.nav-link', 'Your Feed').should('have.class', 'active')
    cy.contains('a.nav-link', 'Global Feed').should('not.have.class', 'active')
  })
})
