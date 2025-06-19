describe('Create Session', () => {
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

  function loginAsAdmin() {
    cy.visit('/login');
    cy.contains('Login').should('be.visible');
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    }).as('login');
    cy.get('input[formControlName=email]').should('be.visible').type("yoga@studio.com");
    cy.get('input[formControlName=password]').should('be.visible').type("test!1234");
    cy.get('form').submit();
    cy.wait('@login');
    cy.url().should('include', '/sessions');
  }

  beforeEach(() => {
    cy.intercept('GET', '/api/teacher', {
      body: teachers
    }).as('getTeachers');
    loginAsAdmin();
    cy.contains('Create').should('be.visible').click();
  });

  it('should create a new session successfully', () => {
    cy.get('input[formControlName=name]').should('be.visible').type('New Session');
    cy.get('input[formControlName=date]').should('be.visible').type('2025-06-01');

    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('.cdk-overlay-container .mat-select-panel .mat-option-text').contains(teachers[0].firstName).click();

    cy.get('textarea[formControlName=description]').should('be.visible').type('Description of the new session');

    cy.intercept('POST', '/api/session', {
      statusCode: 201,
      body: {
        id: 1,
        name: 'New Session',
        date: '2025-06-01',
        teacher_id: teachers[0].id,
        description: 'Description of the new session'
      }
    }).as('createSession');

    cy.get('button[type="submit"]').contains('Save').should('be.visible').click();

    cy.wait('@createSession');
    cy.url().should('include', '/sessions');
    cy.get('.mat-snack-bar-container').should('be.visible').and('contain', 'Session created !');
  });

  it('should keep the Save button disabled if required fields are missing', () => {
    // On est déjà connecté et sur la page de création grâce au beforeEach
    // Le bouton doit être désactivé si le formulaire est vide
    cy.get('button[type="submit"]').should('be.disabled');

    // Remplir seulement un champ
    cy.get('input[formControlName=name]').type('Incomplete Session');
    cy.get('button[type="submit"]').should('be.disabled');

    // Remplir tous les champs sauf un
    cy.get('input[formControlName=date]').type('2025-06-01');
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('.cdk-overlay-container .mat-select-panel .mat-option-text').contains(teachers[0].firstName).click();
    // Ne pas remplir la description
    cy.get('button[type="submit"]').should('be.disabled');

    // Remplir tous les champs
    cy.get('textarea[formControlName=description]').type('Description complète');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});
