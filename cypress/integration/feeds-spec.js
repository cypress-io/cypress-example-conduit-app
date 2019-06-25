/// <reference types="Cypress" />

describe('Conduit', () => {
  before(() => cy.registerUserIfNeeded())
  beforeEach(() => {
    cy.task('deleteAllArticles')
    cy.login()
  })

  it('shows feeds', () => {
    cy.contains('a.nav-link', 'Your Feed').should('have.class', 'active')
    cy.contains('a.nav-link', 'Global Feed')
      .should('not.have.class', 'active')
      .click()
      .should('have.class', 'active')
  })
})
