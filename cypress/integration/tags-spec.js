/// <reference types="Cypress" />

describe('New post', () => {
  beforeEach(() => {
    cy.task('cleanDatabase')
    cy.registerUserIfNeeded()
    cy.login()
  })

  it('tags article', () => {
    // TODO use data-cy for new post link
    cy.contains('a.nav-link', 'New Post').click()
    cy.location('pathname').should('equal', '/editor')

    // separate Redux actions for each field
    cy.dispatch({
      type: 'UPDATE_FIELD_EDITOR',
      key: 'title',
      value: 'first post'
    })

    cy.dispatch({
      type: 'UPDATE_FIELD_EDITOR',
      key: 'description',
      value: 'this is just the beginning'
    })

    cy.dispatch({
      type: 'UPDATE_FIELD_EDITOR',
      key: 'body',
      value: 'something **important**'
    })

    cy.get('[data-cy=tags]').type('first{enter}testing{enter}')

    cy.get('.tag-pill').should('have.length', 2)
    cy.get('[data-cy=publish]').click()

    cy.location('pathname').should('equal', '/article/first-post')
    cy.get('.tag-pill')
      .should('have.length', 2)
      .each(tag => {
        cy.wrap(tag).should('have.class', 'tag-outline')
      })
  })

  it('removes a tag', () => {
    cy.get('[data-cy=new-post]').click()
    cy.location('pathname').should('equal', '/editor')

    // separate Redux actions for each field
    cy.dispatch({
      type: 'UPDATE_FIELD_EDITOR',
      key: 'title',
      value: 'first post'
    })

    cy.dispatch({
      type: 'UPDATE_FIELD_EDITOR',
      key: 'description',
      value: 'this is just the beginning'
    })

    cy.dispatch({
      type: 'UPDATE_FIELD_EDITOR',
      key: 'body',
      value: 'something **important**'
    })

    cy.get('[data-cy=tags]').type('first{enter}testing{enter}')
    cy.get('.tag-pill')
      .should('have.length', 2)
      // now delete a tag
      .first()
      .find('[data-cy=remove-tag]')
      .click()
    cy.get('.tag-pill').should('have.length', 1)
  })

  it('filters articles by tag', () => {
    // note the tags for two posts:
    // they each have an own tag
    // and a common tag "testing"

    cy.article({
      title: 'first post',
      description: 'first description',
      body: 'first article',
      tagList: ['first', 'testing']
    })

    cy.location('pathname').should('equal', '/article/first-post')

    cy.article({
      title: 'second post',
      description: 'second description',
      body: 'second article',
      tagList: ['second', 'testing']
    })

    cy.location('pathname').should('equal', '/article/second-post')

    cy.get('[data-cy=home]').click()
    cy.log('Both articles under tag **testing**')
    cy.contains('[data-cy=tag]', 'testing').click()
    cy.contains('[data-cy=tag-feed]', 'testing').should('be.visible')
    cy.get('.article-preview').should('have.length', 2)

    cy.log('One articles under tag **first**')
    cy.contains('[data-cy=tag]', 'first').click()
    cy.contains('[data-cy=tag-feed]', 'first').should('be.visible')
    cy.get('.article-preview').should('have.length', 1)

    cy.log('One articles under tag **second**')
    cy.contains('[data-cy=tag]', 'second').click()
    cy.contains('[data-cy=tag-feed]', 'second').should('be.visible')
    cy.get('.article-preview').should('have.length', 1)
  })
})
