declare namespace Cypress {
   interface Chainable<Subject = any> {
     login(email: string, password: string, admin?: boolean): void;
     loginAsAdmin(): void;
   }
}

// Connexion générique : admin ou non-admin selon le paramètre
function login(email: string, password: string, admin: boolean = false): void {
  cy.visit('/login');

  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: admin ? 1 : 2,
      username: email,
      firstName: admin ? 'Admin' : 'User',
      lastName: admin ? 'User' : 'Test',
      admin: admin
    },
  }).as("login");

  cy.get('input[formControlName=email]').should('be.visible').type(email);
  cy.get('input[formControlName=password]').should('be.visible').type(`${password}{enter}{enter}`);
  cy.wait('@login');
  cy.url().should('include', '/sessions');
}

// Connexion admin dédiée
function loginAsAdmin(): void {
  login('yoga@studio.com', 'test!1234', true);
}

Cypress.Commands.add('login', login);
Cypress.Commands.add('loginAsAdmin', loginAsAdmin);

// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
