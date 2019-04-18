/// <reference types="Cypress" />

describe('Conduit', () => {
  before(() => cy.registerUserIfNeeded())
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
