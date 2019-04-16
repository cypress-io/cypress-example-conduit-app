/// <reference types="Cypress" />

import { title, about, article, tags } from '../fixtures/post'

describe('New post', () => {
  beforeEach(() => {
    cy.task('deleteAllArticles')
    cy.login()
  })

  it('adds a new post', () => {
    cy.contains('a.nav-link', 'New Post').click()

    // I have added "data-cy" attributes to select input fields
    cy.get('[data-cy=title]').type(title)
    cy.get('[data-cy=about]').type(about)

    // typing entire post as a human user takes too long
    // just set it at once!

    // instead of
    // cy.get('[data-cy=article]').type(article)

    // dispatch Redux actions
    cy.window()
      .its('store')
      .invoke('dispatch', {
        type: 'UPDATE_FIELD_EDITOR',
        key: 'body',
        value: article
      })

    // need to click "Enter" after each tag
    cy.get('[data-cy=tags]').type(tags.split(',').join('{enter}') + '{enter}')

    // and post the new article
    cy.contains('button', 'Publish Article').click()

    // the url should show the new article
    cy.url().should('include', '/article/' + Cypress._.kebabCase(title))
  })
})
