describe('Delete Session', () => {
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

  it('Delete a session', () => {
    // ─── 1. FAKE BACKEND ─────────────────────────────────────
    cy.intercept('POST', '/api/auth/login', {
      body: { id: 1, username: 'userName', admin: true }
    }).as('login');

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

    cy.intercept('DELETE', '/api/session/1', { statusCode: 200 }).as('deleteSession');

    // ─── 2. VISIT + LOGIN ────────────────────────────────────
    cy.visit('/login');
    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type("test!1234");
    cy.get('form').submit();

    // Attends que la redirection soit faite et que le listing soit récupéré
    cy.wait('@login');
    cy.wait('@getSessions');

    // ─── 3. CLIQUE SUR “Edit” ───────────────────────────────
    // Trouvez une session dans la liste et cliquez sur le bouton "Edit"
    cy.contains('A session name').parents('mat-card').first().within(() => {
      cy.get('button').contains("Detail").click();
    });

    // Attend que la requête de détail soit faite
    cy.wait('@getSession');

    // ─── 4. CLIQUE SUR “Delete” ───────────────────────────────
    // Cliquez sur le bouton "Delete" pour supprimer la session
    cy.get('button').contains("Delete").click();

    // Attend que la requête de suppression soit terminée
    cy.wait('@deleteSession');

    // ─── 5. VÉRIFICATIONS FINALES ────────────────────────────
    // Vérifiez que le message de succès est affiché
    cy.get('.mat-snack-bar-container').should('be.visible').and('contain', 'Session deleted !');

  });
});
