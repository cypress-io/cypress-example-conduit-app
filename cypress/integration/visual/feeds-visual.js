/// <reference types="Cypress" />

describe('Conduit', () => {
  before(() => cy.registerUserIfNeeded())
  beforeEach(() => {
    // Login
    cy.request('POST', 'http://localhost:3000/api/users/login', {
      user: Cypress.env('user')
    })
      .its('body.user.token')
      .should('exist')
      .then(token => {
        localStorage.setItem('jwt', token)
      })

    cy.visit('/')
  })
  beforeEach(function() {
    cy.eyesOpen({
      testName: this.currentTest.title,
      appName: 'Conduit',
      batchName: 'Cypress/Applitools Webinar˘',
    })
  })
  afterEach(() => cy.eyesClose())

  it('shows feeds', () => {
    // cy.contains('a.nav-link', 'Your Feed').should('have.class', 'active')
    // cy.contains('a.nav-link', 'Global Feed').should('not.have.class', 'active')

    cy.get('.article-preview')

    cy.eyesCheckWindow('feed')
  })
})
