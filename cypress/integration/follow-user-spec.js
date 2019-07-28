// We use "cy.api" custom command that comes from a plugin.
// We should load "@bahmutov/cy-api" TypeScript definition,
// which will in turn load Cypress TypeScript definition.
/// <reference types="@bahmutov/cy-api" />

describe('following user', () => {
  const secondUser = {
    username: 'seconduser',
    image: 'https://robohash.org/MQ9.png?set=set3&size=150x150',
    email: 'seconduser@email.com',
    password: 'seconduser'
  }

  beforeEach(() => {
    cy.task('cleanDatabase')
    cy.registerUserIfNeeded(secondUser)
    cy.registerUserIfNeeded()
  })

  it('can follow second user', () => {
    // the second user should write a post
    cy.login(secondUser)
    cy.contains('[data-cy=profile]', secondUser.username).should('be.visible')
    // write post
    cy.contains('a.nav-link', 'New Post').click()
    cy.get('[data-cy=title]').type('my title')
    cy.get('[data-cy=about]').type('about X')
    cy.get('[data-cy=article]').type('this post is **important**.')
    cy.get('[data-cy=tags]').type('test{enter}')
    cy.get('[data-cy=publish]').click()
    // wait for the article to be published
    // otherwise if we just click on the profile link right away
    // we might load profile - THEN immediately load the article
    // because we clicked on it first
    cy.location('pathname').should('equal', '/article/my-title')

    // log out
    cy.contains('[data-cy=profile]', secondUser.username).click()
    cy.get('[data-cy="edit-profile-settings"]')
      .should('be.visible')
      .click()
    cy.get('[data-cy=logout]').click()
    cy.get('[data-cy=sign-in]').should('be.visible')
    // login as our test user
    cy.login()
    cy.get('[data-cy=global-feed]').click()
    cy.get('.article-preview')
      .should('have.length', 1)
      .first()
      .find('.author')
      .click()
    // we should get to the user profile page
    cy.location('pathname').should('equal', '/@seconduser')
    cy.get('[data-cy=follow-unfollow-user]')
      .should(c => {
        expect(c.text()).to.include('Follow seconduser')
      })
      .click()
    // unfollow user
    cy.get('[data-cy=follow-unfollow-user]')
      .should(c => {
        expect(c.text()).to.include('Unfollow seconduser')
      })
      .click()
  })

  it('user cannot follow themselves', () => {
    const user = Cypress.env('user')
    cy.getLoginToken(user).then(token => {
      const apiUrl = Cypress.env('apiUrl')
      cy.api({
        method: 'POST',
        url: `${apiUrl}/api/profiles/${user.username}/follow`,
        headers: {
          authorization: `Token ${token}`
        },
        failOnStatusCode: false // we expect failure
      })
        .its('body')
        .should('deep.equal', {
          errors: {
            forbidden: ['You cannot follow yourself']
          }
        })
    })
  })
})
