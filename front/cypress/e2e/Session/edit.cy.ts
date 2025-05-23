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

  it('Edit a session', () => {
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

    cy.intercept('PUT', '/api/session/1', { statusCode: 200 }).as('updateSession');

    // ─── 2. VISIT + LOGIN ────────────────────────────────────
    cy.visit('/login');
    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type("test!1234");
    cy.get('form').submit();

    // Attends que la redirection soit faite et que le listing soit récupéré
    cy.wait('@login');
    cy.wait('@getSessions');

    // ─── 3. CLIQUE SUR “Edit” ───────────────────────────────
    // Attend que le bouton soit dans le DOM, puis utilise un sélecteur plus robuste
    cy.contains('button', 'Edit').should('be.visible').click();

    // Attend que la requête de détail soit faite
    cy.wait('@getSession');

    // ─── 4. VÉRIFICATIONS FINALES ────────────────────────────
    cy.url().should('include', '/sessions/update/1');

    // Utilisez un sélecteur plus spécifique pour cibler l'élément input
    cy.get('mat-form-field input[formControlName=name]').should('be.visible').clear().type("A session name");

    // Soumettez le formulaire
    cy.get('button[type=submit]').click();

    // Attendez que la requête de mise à jour soit terminée
    cy.wait('@updateSession');

    // Vérifiez que l'utilisateur est redirigé vers la page des sessions
    cy.url().should('include', '/sessions');
  });
});
