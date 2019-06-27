/// <reference types="Cypress" />

describe('Force logout', () => {
  beforeEach(() => {
    cy.task('cleanDatabase')
    cy.registerUserIfNeeded()
    cy.login()
  })

  it('logs user out if API request gets back unauthorized', () => {
    cy.get('[data-cy=profile]').should('be.visible')
    cy.window()
      .its('agent')
      .invoke('setToken', 'foobar')
    cy.get('[data-cy=global-feed]').click()

    // the user should be logged out
    cy.get('[data-cy=profile]').should('not.exist')
    cy.get('[data-cy=sign-in]').should('be.visible')
  })
})
