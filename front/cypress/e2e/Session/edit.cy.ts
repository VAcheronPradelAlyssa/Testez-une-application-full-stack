/// <reference types="cypress" />

describe('Session edit e2e test', () => {
  const teachers = [
    {
      id: 1,
      lastName: "Doe",
      firstName: "John",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      lastName: "Dupont",
      firstName: "Louis",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  beforeEach(() => {
    cy.intercept('GET', '/api/teacher', { body: teachers }).as('getTeachers');
    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: "A session name",
          date: new Date(),
          teacher_id: 1,
          description: "A small description",
          users: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }).as('getSessions');
    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: "Test",
        date: new Date(),
        teacher_id: 1,
        description: "A small description",
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }).as('getSession');
    cy.intercept('PUT', '/api/session/1', { statusCode: 200 }).as('updateSession');
    cy.loginAsAdmin();
    cy.wait('@getSessions');
    cy.contains('button', 'Edit').should('be.visible').click();
    cy.wait('@getSession');
    cy.url().should('include', '/sessions/update/1');
  });

  it('Edit a session successfully', () => {
    cy.get('mat-form-field input[formControlName=name]').should('be.visible').clear().type("A session name modifiée");
    cy.get('input[formControlName=date]').clear().type('2025-07-01');
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('.cdk-overlay-container .mat-select-panel .mat-option-text').contains(teachers[1].firstName).click();
    cy.get('textarea[formControlName=description]').clear().type('Nouvelle description');
    cy.get('button[type=submit]').should('not.be.disabled').click();
    cy.wait('@updateSession');
    cy.url().should('include', '/sessions');
    cy.get('.mat-snack-bar-container').should('be.visible').and('contain', 'Session updated !');
  });

  it('should keep the Save button disabled if required fields are missing', () => {
    // Vide un champ obligatoire
    cy.get('mat-form-field input[formControlName=name]').clear();
    cy.get('button[type=submit]').should('be.disabled');
    // Remplis le champ name, mais vide la description
    cy.get('mat-form-field input[formControlName=name]').type('A session name');
    cy.get('textarea[formControlName=description]').clear();
    cy.get('button[type=submit]').should('be.disabled');
    // Remplis tous les champs pour vérifier que le bouton s'active
    cy.get('textarea[formControlName=description]').type('Nouvelle description');
    cy.get('button[type=submit]').should('not.be.disabled');
  });
});
