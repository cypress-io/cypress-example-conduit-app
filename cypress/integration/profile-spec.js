/// <reference types="Cypress" />

describe('Profile', () => {
  beforeEach(() => {
    cy.registerUserIfNeeded()
    cy.login()
  })

  it('shows my profile', () => {
    cy.get('[data-cy=profile]').click()
    cy.location('pathname').should('equal', '/@testuser')
    cy.get('[data-cy="edit-profile-settings"]').click()
  })

  it('can update my profile', () => {
    cy.get('[data-cy=profile]').click()
    cy.location('pathname').should('equal', '/@testuser')
    cy.get('[data-cy="edit-profile-settings"]').click()
    cy.get('[data-cy=bio]')
      .clear()
      .type('my new bio')
    cy.get('form').submit()

    // saved bio should be displayed
    cy.get('[data-cy=profile]').click()
    cy.get('[data-cy=user-info]')
      .should('be.visible')
      .find('[data-cy=bio]')
      .should('have.text', 'my new bio')
  })
})
