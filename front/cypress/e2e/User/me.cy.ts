/// <reference types="cypress" />

describe('E2E Test for Existing User Profile (mock)', () => {
  const email = 'amelie.durand@example.com';
  const password = 'motdepasse123';
  const fakeUser = {
    id: 5,
    firstName: 'Amélie',
    lastName: 'Durand',
    email: email,
    admin: false,
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-05-10T15:42:00Z'
  };

  beforeEach(() => {
    // Mock login API
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 5,
        token: 'mocked-jwt-token',
        username: email
      }
    }).as('loginRequest');

    // Mock GET user API
    cy.intercept('GET', '/api/user/5', {
      statusCode: 200,
      body: fakeUser
    }).as('getUser');

    // Mock DELETE user API
    cy.intercept('DELETE', '/api/user/5', {
      statusCode: 200,
      body: { message: 'User deleted successfully' }
    }).as('deleteUser');
  });

  it('Should display user information on /me page (mocked)', () => {
    // Login
    cy.visit('/login');
    cy.get('input[formControlName=email]').type(email);
    cy.get('input[formControlName=password]').type(password);
    cy.get('form').submit();

    cy.wait('@loginRequest').then(() => {
      window.localStorage.setItem('sessionInformation', JSON.stringify({
        id: 5,
        token: 'mocked-jwt-token',
        username: email
      }));
    });

    cy.url().should('include', '/sessions');

    // Aller sur /me
    cy.contains('span.link', 'Account').click();
    cy.url().should('include', '/me');
    cy.wait('@getUser');

    // Vérifie l'affichage des infos
    cy.get('p').contains('Name: Amélie DURAND');
    cy.get('p').contains('Email: amelie.durand@example.com');
  });

  it('Should delete user account and logout', () => {
    // Login et aller sur /me
    cy.visit('/login');
    cy.get('input[formControlName=email]').type(email);
    cy.get('input[formControlName=password]').type(password);
    cy.get('form').submit();

    cy.wait('@loginRequest').then(() => {
      window.localStorage.setItem('sessionInformation', JSON.stringify({
        id: 5,
        token: 'mocked-jwt-token',
        username: email
      }));
    });

    cy.url().should('include', '/sessions');
    cy.contains('span.link', 'Account').click();
    cy.url().should('include', '/me');
    cy.wait('@getUser');

    // Clique sur Delete
    cy.get('button').contains(/delete/i).should('be.visible').click();
    cy.wait('@deleteUser');
    cy.get('.mat-snack-bar-container').should('be.visible').and('contain', 'Your account has been deleted !');
    cy.url().should('include', '/');
  });
});