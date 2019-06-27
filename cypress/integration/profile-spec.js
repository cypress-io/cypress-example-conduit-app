/// <reference types="Cypress" />

describe('Profile', () => {
  beforeEach(() => {
    cy.task('cleanDatabase')
    cy.registerUserIfNeeded()
    cy.login()
  })

  it('shows my profile', () => {
    cy.get('[data-cy=profile]').click()
    cy.location('pathname').should('equal', '/@testuser')
    cy.get('[data-cy=edit-profile-settings]').click()
  })

  it('logs out via profile', () => {
    cy.get('[data-cy=profile]').click()
    cy.location('pathname').should('equal', '/@testuser')
    cy.get('[data-cy=edit-profile-settings]').click()
    cy.get('[data-cy=logout]').click()
    cy.get('[data-cy=sign-in]').should('be.visible')
  })

  it('can update my profile', () => {
    cy.get('[data-cy=profile]').click()
    cy.location('pathname').should('equal', '/@testuser')
    cy.get('[data-cy="edit-profile-settings"]').click()
    cy.get('[data-cy=bio]')
      .clear()
      .type('my new bio')
    cy.get('form').submit()
    cy.location('pathname').should('equal', '/')

    // saved bio should be displayed
    cy.get('[data-cy=profile]').click()
    cy.location('pathname').should('equal', '/@testuser')
    cy.get('[data-cy=user-info]')
      .should('be.visible')
      .find('[data-cy=bio]')
      .should('have.text', 'my new bio')
  })

  it('shows favorite articles', () => {
    cy.article({
      title: 'first post',
      description: 'first description',
      body: 'first article',
      tagList: ['first', 'testing']
    })

    cy.location('pathname').should('equal', '/article/first-post')
    cy.get('[data-cy=home]').click()
    cy.get('[data-cy=global-feed]').click()
    cy.get('.article-preview')
      .should('have.length', 1)
      .first()
      .find('[data-cy=fav-article]')
      .click()
      // check if the click has registered and the favorite flag has been set
      .should('not.have.class', 'btn-outline-primary')

    // check favorited articles feed
    cy.get('[data-cy=profile]').click()
    cy.get('[data-cy=favorited-articles]').click()
    cy.get('.article-preview').should('have.length', 1)
  })
})
