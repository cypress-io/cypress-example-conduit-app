/// <reference types="Cypress" />

describe('comments', () => {
  beforeEach(() => {
    cy.task('cleanDatabase')
    cy.registerUserIfNeeded()
    cy.login()
  })

  // typical post
  const article = {
    title: 'my title',
    description: 'about X',
    body: 'this post is **important**.',
    tagList: ['test']
  }

  const tagsToCypress = tags => tags.join('{enter}') + '{enter}'

  // notice how this test is 70% the same as the "writes a post" test above
  // because to create a new post it executes same DOM commands
  it('writes a post and comments on it', () => {
    cy.get('[data-cy=new-post]').click()

    cy.get('[data-cy=title]').type(article.title)
    cy.get('[data-cy=about]').type(article.description)
    cy.get('[data-cy=article]').type(article.body)
    cy.get('[data-cy=tags]').type(tagsToCypress(article.tagList))
    cy.get('[data-cy=publish]').click()

    // changed url means the post was successfully created
    cy.location('pathname').should('equal', '/article/my-title')

    // comment on the post
    cy.get('[data-cy=comment-text]').type('great post 👍')
    cy.get('[data-cy=post-comment]').click()

    cy.contains('[data-cy=comment]', 'great post 👍').should('be.visible')
  })

  it('writes a post (via page object) and comments on it', () => {
    // page object encapsulating code for writing a post
    // by executing page commands = DOM actions
    const editor = {
      writeArticle () {
        cy.get('[data-cy=new-post]').click()

        cy.get('[data-cy=title]').type(article.title)
        cy.get('[data-cy=about]').type(article.description)
        cy.get('[data-cy=article]').type(article.body)
        cy.get('[data-cy=tags]').type(tagsToCypress(article.tagList))
        cy.get('[data-cy=publish]').click()

        // changed url means the post was successfully created
        cy.location('pathname').should('equal', '/article/my-title')
      }
    }

    // use "Editor" page wrapper to write a new post
    editor.writeArticle()

    // comment on the post
    cy.get('[data-cy=comment-text]').type('great post 👍')
    cy.get('[data-cy=post-comment]').click()

    cy.contains('[data-cy=comment]', 'great post 👍').should('be.visible')
  })

  it('writes a post (via app action) and comments on it', () => {
    cy.window()
      .its('agent.Articles')
      .invoke('create', article) // resolves with new article object
      .its('article.slug')
      .then(slug => {
        cy.visit(`/article/${slug}`)
      })
    // comment on the post
    cy.get('[data-cy=comment-text]').type('great post 👍')
    cy.get('[data-cy=post-comment]').click()

    cy.contains('[data-cy=comment]', 'great post 👍').should('be.visible')
  })

  it('writes a post (via app action custom command) and comments on it', () => {
    cy.writeArticle(article)
    // comment on the post
    cy.get('[data-cy=comment-text]').type('great post 👍')
    cy.get('[data-cy=post-comment]').click()

    cy.contains('[data-cy=comment]', 'great post 👍').should('be.visible')
  })

  it('writes a post (via API) and comments on it', () => {
    cy.postArticle(article)
      .its('body.article.slug')
      .then(slug => {
        cy.visit(`/article/${slug}`)
      })
    // comment on the post
    cy.get('[data-cy=comment-text]').type('great post 👍')
    cy.get('[data-cy=post-comment]').click()

    cy.contains('[data-cy=comment]', 'great post 👍').should('be.visible')
  })

  it('deletes a comment', () => {
    cy.writeArticle(article).then(slug => {
      cy.postComment(slug, 'great post 👍')
    })

    cy.contains('[data-cy=comment]', 'great post 👍')
      .should('be.visible')
      .find('[data-cy=delete-button]')
      .click()
    cy.contains('[data-cy=comment]', 'great post 👍').should('not.exist')
  })
})
