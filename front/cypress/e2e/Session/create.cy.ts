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

  beforeEach(() => {
    // Visitez la page de connexion
    cy.visit('/login');

    // Attendez que la page soit complètement chargée
    cy.contains('Login').should('be.visible');

    // Intercepte la requête GET vers '/api/teacher'
    cy.intercept('GET', '/api/teacher', {
      body: teachers
    });

    // Simulez la connexion de l'utilisateur en tant qu'administrateur
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    });

    // Remplissez le formulaire de connexion
    cy.get('input[formControlName=email]').should('be.visible').type("yoga@studio.com");
    cy.get('input[formControlName=password]').should('be.visible').type("test!1234");
    cy.get('form').submit();

    // Vérifiez que l'utilisateur est connecté et redirigé vers la page des sessions
    cy.url().should('include', '/sessions');

    // Cliquez sur le bouton pour créer une nouvelle session
    cy.contains('Create').should('be.visible').click();
  });

  it('should create a new session successfully', () => {
    // Remplissez le formulaire de création de session
    cy.get('input[formControlName=name]').should('be.visible').type('New Session');
    cy.get('input[formControlName=date]').should('be.visible').type('2025-06-01');

    // Sélectionnez un enseignant
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('.cdk-overlay-container .mat-select-panel .mat-option-text').contains(teachers[0].firstName).click();

    cy.get('textarea[formControlName=description]').should('be.visible').type('Description of the new session');

    // Intercepte la requête POST pour créer une session
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

    // Cliquez sur le bouton "Save" pour soumettre le formulaire
    cy.get('button[type="submit"]').contains('Save').should('be.visible').click();


    // Vérifiez que l'utilisateur est redirigé vers la page des sessions
    cy.url().should('include', '/sessions');
     // Vérifiez que le message de succès est affiché
     cy.get('.mat-snack-bar-container').should('be.visible').and('contain', 'Session created !');

  });
});
