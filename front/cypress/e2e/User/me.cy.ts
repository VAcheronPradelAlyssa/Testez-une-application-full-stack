/// <reference types="cypress" />

describe('E2E Test for Existing User Profile (mock)', () => {
  it('Should display user information on /me page (mocked)', () => {
    const email = 'amelie.durand@example.com';
    const password = 'motdepasse123';

    // Mock login API
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 5,
        token: 'mocked-jwt-token',
        username: email
      }
    }).as('loginRequest');

    // Mock GET user API (adapt path and id as in your backend)
    cy.intercept('GET', '/api/user/5', {
      statusCode: 200,
      body: {
        id: 5,
        firstName: 'Amélie',
        lastName: 'Durand',
        email: email,
        admin: false,
        createdAt: '2024-03-10T10:00:00Z',
        updatedAt: '2024-05-10T15:42:00Z'
      }
    }).as('getUser');

    // Visit login page and perform login
    cy.visit('/login');
    cy.get('input[formControlName=email]').type(email);
    cy.get('input[formControlName=password]').type(password);
    cy.get('form').submit();

    // Wait for login, set session information in storage as expected by your app
    cy.wait('@loginRequest').then(() => {
      window.localStorage.setItem('sessionInformation', JSON.stringify({
        id: 5,
        token: 'mocked-jwt-token',
        username: email
      }));
    });

    // Check redirect to /sessions
    cy.url().should('include', '/sessions');

    // Go to /me by clicking the Account link (adapt selector if needed)
    cy.contains('span.link', 'Account').click();
    cy.url().should('include', '/me');

    // Wait for user details and check displayed information
    cy.wait('@getUser');
    cy.get('p').contains('Name: Amélie DURAND');
    cy.get('p').contains('Email: amelie.durand@example.com');
  });
});