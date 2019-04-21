/// <reference types="Cypress" />

import { title, about, article, tags } from '../../fixtures/post'

describe('New post', () => {
  before(() => cy.registerUserIfNeeded())
  beforeEach(() => {
    cy.task('deleteAllArticles')
    cy.login()
  })

  beforeEach(function() {
    cy.eyesOpen({
      testName: this.currentTest.title,
      appName: 'Conduit',
      batchName: 'Cypress/Applitools Webinar˘',
    })
  })
  afterEach(() => cy.eyesClose())

  it('adds a new post', () => {
    cy.contains('a.nav-link', 'New Post').click()

    cy.eyesCheckWindow('Empty new post page')

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
        value: article,
      })

    // need to click "Enter" after each tag
    cy.get('[data-cy=tags]').type(tags.join('{enter}') + '{enter}')

    cy.eyesCheckWindow('Filled new post page')

    // and post the new article
    cy.get('[data-cy=publish]').click()

    cy.get('.article-content')

    // the url should show the new article
    // cy.url().should('include', '/article/' + Cypress._.kebabCase(title))
    cy.eyesCheckWindow('Published lorem ipsum article')
  })
})
