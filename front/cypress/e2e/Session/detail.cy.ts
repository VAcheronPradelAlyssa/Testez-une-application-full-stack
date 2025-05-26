describe('Detail Session for Non-Admin User', () => {
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

  it('View details of a session as a non-admin user', () => {
    // ─── 1. FAKE BACKEND ─────────────────────────────────────
    cy.intercept('POST', '/api/auth/login', {
      body: { id: 2, username: 'nonAdminUser', admin: false } // Utilisateur non-administrateur
    }).as('login');

    cy.intercept('GET', '/api/teacher', { body: teachers }).as('getTeachers');

    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: "Test",
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

    // ─── 2. VISIT + LOGIN ────────────────────────────────────
    cy.visit('/login');
    cy.get('input[formControlName=email]').type("nonadmin@studio.com"); // Adresse e-mail non-administrateur
    cy.get('input[formControlName=password]').type("test!1234");
    cy.get('form').submit();

    // Attends que la redirection soit faite et que le listing soit récupéré
    cy.wait('@login');
    cy.wait('@getSessions');

    // ─── 3. CLIQUE SUR “Detail” ───────────────────────────────
    // Trouvez une session dans la liste et cliquez sur le bouton "Detail"
    cy.contains('Test').parents('mat-card').first().within(() => {
      cy.get('button').contains("Detail").click();
    });

    // Attend que la requête de détail soit faite
    cy.wait('@getSession');

    // ─── 4. VÉRIFICATIONS FINALES ────────────────────────────
    // Vérifiez que l'utilisateur est redirigé vers la page de détails de la session
    cy.url().should('include', '/sessions/detail/1');

    // Vérifiez que les détails de la session sont correctement affichés
    cy.contains('Test').should('be.visible');
    cy.contains('A small description').should('be.visible');
    cy.contains('0 attendees').should('be.visible');
    cy.contains('Create at:').should('be.visible');
    cy.contains('Last update:').should('be.visible');

    // Vérifiez que le bouton "Participate" est visible pour un utilisateur non-administrateur
    cy.contains('Participate').should('be.visible');
  });
});
