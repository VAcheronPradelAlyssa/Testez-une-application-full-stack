/// <reference types="cypress" />

describe('Login spec', () => {
  it('Login successful', () => {
    cy.visit('/login');

    // Interception de la requête POST pour le login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        firstName: 'First',
        lastName: 'Last',
        admin: true,
        token: 'fake-jwt-token', // Assurez-vous d'ajouter un token si nécessaire
      },
    }).as('loginRequest');

    // Interception de la requête GET pour récupérer la session
    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        firstName: 'First',
        lastName: 'Last',
        admin: true,
      },
    }).as('sessionRequest');

    // Remplir le formulaire de connexion avec une autre adresse email
    cy.get('input[formControlName=email]').type("example@domain.com"); // Nouvelle adresse email
    cy.get('input[formControlName=password]').type("test!1234");

    // Clic sur le bouton de soumission du formulaire
    cy.get('form').submit();

    // Attendre la réponse de la connexion
    cy.wait('@loginRequest');

    // Vérifier que l'URL a changé pour inclure /sessions
    cy.url().should('include', '/sessions');

    // Attendre la requête de session et vérifier que la session est accessible
    cy.wait('@sessionRequest');
  });
});