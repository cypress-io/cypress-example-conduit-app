// a custom Cypress command to login using XHR call
// and then set the received token in the local storage
Cypress.Commands.add("login", () => {
  cy.request("POST", "http://localhost:3000/api/users/login", {
    user: Cypress.env("user")
  })
    .its("body.user.token")
    .should("exist")
    .then(token => {
      localStorage.setItem("jwt", token);
      // with this token set, when we visit the page
      // the web application will have the user logged in
    });

  cy.visit("/");
});

Cypress.Commands.add("registerUserIfNeeded", () => {
  cy.request({
    method: "POST",
    url: "http://localhost:3000/api/users",
    body: {
      user: {
        username: "testuser",
        ...Cypress.env("user")
      }
    },
    failOnStatusCode: false
  });
});
