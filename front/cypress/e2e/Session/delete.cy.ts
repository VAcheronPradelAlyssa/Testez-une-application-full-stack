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
    // 1. Mock backend
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

    // 2. Connexion admin via la commande custom
    cy.loginAsAdmin();

    cy.wait('@getSessions');

    // 3. CLIQUE SUR “Detail”
    cy.contains('A session name').parents('mat-card').first().within(() => {
      cy.get('button').contains("Detail").click();
    });

    cy.wait('@getSession');

    // 4. CLIQUE SUR “Delete”
    cy.get('button').contains("Delete").click();

    cy.wait('@deleteSession');

    // 5. Vérifie le message de succès
    cy.get('.mat-snack-bar-container').should('be.visible').and('contain', 'Session deleted !');
  });
});
