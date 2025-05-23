describe('User e2e me test', () => {
  it('Me', () => {

    let sessionUsers = [];

    // 1. Visiter la page login et remplir le formulaire
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('john.doe@example.com');
    cy.get('input[formControlName=password]').type('SecurePassword123!');
    cy.get('form').submit();

    // 2. Intercepter la requête POST login pour valider le token (optionnel si backend réel)
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        username: 'john.doe@example.com'
      }
    }).as('loginRequest');

    // 3. Attendre la redirection vers /sessions (login réussi)
    cy.url().should('include', '/sessions');

    // 4. Intercepter les requêtes GET qui seront faites après login

    // GET user/1 (ou /api/user/me selon API)
    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/1',
      },
      {
        id: 1,
        username: 'JohnDoe',
        firstName: 'John',
        lastName: 'Doe',
        email: "john.doe@example.com",
        admin: false,
        password: "password",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ).as('user');

    // GET /api/session (liste des sessions)
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Session name',
          date: new Date().toISOString(),
          teacher_id: 1,
          description: "A small description",
          users: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]).as('session');

    // GET /api/session/1 (détail d'une session)
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session/1',
      },
      {
        id: 1,
        name: 'Session name',
        date: new Date().toISOString(),
        teacher_id: 1,
        description: "A small description",
        users: sessionUsers,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ).as('sessionDetail');

    // 5. Clique sur le lien vers la page /me (détails utilisateur)
    cy.get('span[routerLink=me]').click();

    // 6. Vérifie l'URL et les infos affichées
    cy.url().should('include', '/me');
    cy.get('p').contains("Name: John DOE");
    cy.get('p').contains("Email: john.doe@example.com");


  });
});
