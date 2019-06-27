/// <reference types="Cypress" />

describe('Pagination', () => {
  beforeEach(() => {
    cy.task('cleanDatabase')
    cy.registerUserIfNeeded()
    cy.login()
  })

  it('shows pagination', () => {
    Cypress._.times(20, k =>
      cy.postArticle({
        title: `post ${k + 1}`,
        description: 'description',
        body: 'article',
        tagList: []
      })
    )
    cy.get('[data-cy=global-feed]').click()
    // only the last 10 articles should be shown
    cy.get('.article-preview')
      .should('have.length', 10)
      .contains('.article-preview', 'post 20')

    // the pagination controls should be visible
    cy.get('.pagination').should('be.visible')
    cy.get('[data-cy=page-link]')
      .should('have.length', 2)
      .first()
      .parent()
      .should('have.class', 'active')
    cy.get('[data-cy=page-link]')
      .should('have.length', 2)
      .eq(1)
      .parent()
      .should('not.have.class', 'active')
    cy.log('going to second page')
    cy.get('[data-cy=page-link]')
      .eq(1)
      .click()
    // very first article should be there
    cy.get('.article-preview')
      .should('have.length', 10)
      .contains('.article-preview', 'post 1')
  })
})
