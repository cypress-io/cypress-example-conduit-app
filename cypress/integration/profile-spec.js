/// <reference types="Cypress" />

describe('Profile', () => {
  before(() => cy.registerUserIfNeeded())
  beforeEach(() => {
    cy.login()
  })

  it('shows my profile', () => {
    cy.get('[data-cy=profile]').click()
    cy.location('pathname').should('equal', '/@testuser')
    cy.get('[data-cy="edit-profile-settings"]').click()
  })
})
