/// <reference types="cypress" />

describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Login successful', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        firstName: 'First',
        lastName: 'Last',
        admin: true,
        token: 'fake-jwt-token',
      },
    }).as('loginRequest');

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

    cy.get('input[formControlName=email]').type("example@domain.com");
    cy.get('input[formControlName=password]').type("test!1234");
    cy.get('form').submit();

    cy.wait('@loginRequest');
    cy.url().should('include', '/sessions');
    cy.wait('@sessionRequest');
  });

  it('Affiche "An error occurred" si le mot de passe est incorrect', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('loginRequest');

    cy.get('input[formControlName=email]').type("example@domain.com");
    cy.get('input[formControlName=password]').type("wrongpassword");
    cy.get('form').submit();

    cy.wait('@loginRequest');
    cy.contains('An error occurred').should('be.visible');
  });

  it('Affiche "An error occurred" si le champ email est vide', () => {
    cy.get('input[formControlName=password]').type("test!1234");
    cy.get('form').submit();
    cy.contains('An error occurred').should('be.visible');
  });

  it('Affiche "An error occurred" si le champ mot de passe est vide', () => {
    cy.get('input[formControlName=email]').type("example@domain.com");
    cy.get('form').submit();
    cy.contains('An error occurred').should('be.visible');
  });

  it('Affiche "An error occurred" si les deux champs sont vides', () => {
    cy.get('form').submit();
    cy.contains('An error occurred').should('be.visible');
  });

  it('Bloque l’accès aux pages protégées sans être connecté', () => {
    cy.visit('/sessions');
    cy.url().should('include', '/login');
  });
});