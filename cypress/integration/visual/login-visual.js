/// <reference types="Cypress" />

describe('Conduit Login', () => {
  before(() => cy.registerUserIfNeeded())
  beforeEach(() => {
    cy.visit('/')
    // we are not logged in
  })

  beforeEach(function() {
    cy.eyesOpen({
      testName: this.currentTest.title,
      appName: 'Conduit',
      batchName: 'Cypress/Applitools Webinar˘',
    })
  })
  afterEach(() => cy.eyesClose())

  it('does not work with wrong credentials', () => {
    cy.contains('a.nav-link', 'Sign in').click()

    cy.get('input[type="email"]')
    cy.eyesCheckWindow('Empty login page')

    cy.get('input[type="email"]').type('wrong@email.com')
    cy.get('input[type="password"]').type('no-such-user')
    cy.get('button[type="submit"]').click()

    // error message is shown and we remain on the login page
    // cy.contains('.error-messages li', 'User Not Found')
    // cy.url().should('contain', '/login')
    cy.get('.error-messages')
    cy.eyesCheckWindow('User not found error')
  })

  it('logs in', () => {
    cy.contains('a.nav-link', 'Sign in').click()

    cy.eyesCheckWindow('Login page')

    const user = Cypress.env('user')
    cy.get('input[type="email"]').type(user.email)
    cy.get('input[type="password"]').type(user.password)
    cy.get('button[type="submit"]').click()

    cy.get('.article-preview')

    cy.eyesCheckWindow('Empty home page after login')
  })
})
