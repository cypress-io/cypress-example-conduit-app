/// <reference types="Cypress" />

import { title, about, article, tags } from '../fixtures/post'
import { stripIndent } from 'common-tags'

describe('New post', () => {
  before(() => cy.registerUserIfNeeded())
  beforeEach(() => {
    cy.task('deleteAllArticles')
    cy.login()
  })

  it('writes a post and comments on it', () => {
    cy.contains('a.nav-link', 'New Post').click()

    // I have added "data-cy" attributes to select input fields
    cy.get('[data-cy=title]').type('my title')
    cy.get('[data-cy=about]').type('about X')
    cy.get('[data-cy=article]').type('this post is **important**.')
    cy.get('[data-cy=tags]').type('test{enter}')
    cy.get('[data-cy=publish]').click()

    cy.get('[data-cy=comment-text]').type('great post 👍')
    cy.get('[data-cy=post-comment]').click()

    cy.contains('[data-cy=comment]', 'great post 👍').should('be.visible')
  })

  it('sets tags', () => {
    cy.contains('a.nav-link', 'New Post').click()

    // I have added "data-cy" attributes to select input fields
    cy.get('[data-cy=title]').type('my title')
    cy.get('[data-cy=about]').type('about X')
    cy.get('[data-cy=article]').type('this post is **important**.')

    const tags = ['code', 'testing', 'cypress.io']
    cy.get('[data-cy=tags]').type(tags.join('{enter}') + '{enter}')
    cy.get('[data-cy=publish]').click()

    // check that each tag is displayed after post is shown
    cy.url().should('match', /my-title$/)
    tags.forEach(tag => cy.contains('.tag-default', tag))
  })

  it('sets the post body at once', () => {
    cy.contains('a.nav-link', 'New Post').click()

    // I have added "data-cy" attributes to select input fields
    cy.get('[data-cy=title]').type('my title')
    cy.get('[data-cy=about]').type('about X')

    // to speed up creating the post, set the text as value
    // and then trigger change event by typing "Enter"
    const post = stripIndent`
      # Fast tests

      > Speed up your tests using direct access to DOM elements

      You can set long text all at once and then trigger \`onChange\` event.
    `

    cy.get('[data-cy=article]')
      .invoke('val', post)
      .type('{enter}')

    cy.get('[data-cy=tags]').type('test{enter}')
    cy.get('[data-cy=publish]').click()

    cy.contains('h1', 'my title')
  })

  it('adds a new post', () => {
    cy.contains('a.nav-link', 'New Post').click()

    // instead hard-coding text in this test
    // the blog post contents comes from cypress/fixtures/post.js
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
    cy.get('[data-cy=tags]').type(tags.join('{enter}') + '{enter}')

    // and post the new article
    cy.get('[data-cy=publish]').click()

    // the url should show the new article
    cy.url().should('include', '/article/' + Cypress._.kebabCase(title))

    // new article should be on the server
    cy.request('http://localhost:3000/api/articles?limit=10&offset=0')
      .its('body')
      .should(body => {
        expect(body).to.have.property('articlesCount', 1)
        expect(body.articles).to.have.length(1)
        const firstPost = body.articles[0]
        expect(firstPost).to.contain({
          title,
          description: about,
          body: article
        })
        expect(firstPost)
          .property('tagList')
          .to.deep.equal(tags)
      })
  })
})
