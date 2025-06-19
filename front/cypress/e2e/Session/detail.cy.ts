describe('Detail Session - affichage infos et boutons selon le rôle', () => {
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

  const session = {
    id: 1,
    name: "Test",
    date: new Date(),
    teacher_id: 1,
    description: "A small description",
    users: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  function interceptCommon() {
    cy.intercept('GET', '/api/teacher', { body: teachers }).as('getTeachers');
    cy.intercept('GET', '/api/session', { body: [session] }).as('getSessions');
    cy.intercept('GET', '/api/session/1', { body: session }).as('getSession');
  }

  it('affiche les détails et le bouton Participate pour un non-admin', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: { id: 2, username: 'nonAdminUser', admin: false }
    }).as('login');
    interceptCommon();

    cy.visit('/login');
    cy.get('input[formControlName=email]').type("nonadmin@studio.com");
    cy.get('input[formControlName=password]').type("test!1234");
    cy.get('form').submit();

    cy.wait('@login');
    cy.wait('@getSessions');

    cy.contains('Test').parents('mat-card').first().within(() => {
      cy.get('button').contains("Detail").click();
    });
    cy.wait('@getSession');

    cy.url().should('include', '/sessions/detail/1');
    cy.contains('Test').should('be.visible');
    cy.contains('A small description').should('be.visible');
    cy.contains('0 attendees').should('be.visible');
    cy.contains('Create at:').should('be.visible');
    cy.contains('Last update:').should('be.visible');
    cy.contains('Participate').should('be.visible');
    cy.contains('Delete').should('not.exist');
  });

  it('affiche les détails et le bouton Delete pour un admin', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: { id: 1, username: 'adminUser', admin: true }
    }).as('login');
    interceptCommon();

    cy.visit('/login');
    cy.get('input[formControlName=email]').type("admin@studio.com");
    cy.get('input[formControlName=password]').type("adminpass");
    cy.get('form').submit();

    cy.wait('@login');
    cy.wait('@getSessions');

    cy.contains('Test').parents('mat-card').first().within(() => {
      cy.get('button').contains("Detail").click();
    });
    cy.wait('@getSession');

    cy.url().should('include', '/sessions/detail/1');
    cy.contains('Test').should('be.visible');
    cy.contains('A small description').should('be.visible');
    cy.contains('0 attendees').should('be.visible');
    cy.contains('Create at:').should('be.visible');
    cy.contains('Last update:').should('be.visible');
    cy.contains('Delete').should('be.visible');
    cy.contains('Participate').should('not.exist');
  });
});
