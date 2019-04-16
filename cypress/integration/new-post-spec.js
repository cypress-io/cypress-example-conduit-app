/// <reference types="Cypress" />

import { title, about, article, tags } from '../fixtures/post'

describe('New post', () => {
  beforeEach(() => {
    cy.task('deleteAllArticles')
    cy.login()
  })

  it('adds a new post', () => {
    cy.contains('a.nav-link', 'New Post').click()

    const randomTitle = `${title} ${Cypress._.random(1e6, 1e7)}`
    cy.get('[data-cy=title]').type(randomTitle)
    cy.get('[data-cy=about]').type(about)

    // typing entire post as a human user takes too long
    // just set it at once!
    cy.window()
      .its('store')
      .invoke('dispatch', {
        type: 'UPDATE_FIELD_EDITOR',
        key: 'body',
        value: article
      })
    // cy.get('[data-cy=article]').invoke('text', article)

    // need to click "Enter" after each tag
    cy.get('[data-cy=tags]').type(tags.split(',').join('{enter}') + '{enter}')
  })
})
