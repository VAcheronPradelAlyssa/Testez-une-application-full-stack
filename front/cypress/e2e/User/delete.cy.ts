describe('User e2e me test with delete account', () => {
  it('Me and delete account', () => {

    let sessionUsers = [];

    // Connexion
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('john.doe@example.com');
    cy.get('input[formControlName=password]').type('SecurePassword123!');
    cy.get('form').submit();

    // Interception POST login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        username: 'john.doe@example.com'
      }
    }).as('loginRequest');

    // Attendre la redirection vers /sessions
    cy.url().should('include', '/sessions');

    // Interceptions GET utilisateur et sessions
    cy.intercept('GET', '/api/user/1', {
      id: 1,
      username: 'JohnDoe',
      firstName: 'John',
      lastName: 'Doe',
      email: "john.doe@example.com",
      admin: false,
      password: "password",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).as('user');

    cy.intercept('GET', '/api/session', [
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

    cy.intercept('GET', '/api/session/1', {
      id: 1,
      name: 'Session name',
      date: new Date().toISOString(),
      teacher_id: 1,
      description: "A small description",
      users: sessionUsers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).as('sessionDetail');

    // Navigation vers /me
    cy.get('span[routerLink=me]').click();
    cy.url().should('include', '/me');

    cy.get('p').contains("Name: John DOE");
    cy.get('p').contains("Email: john.doe@example.com");

    // --- Suppression du compte ---

    // Interception de la requête DELETE
    cy.intercept('DELETE', '/api/user/1', {
      statusCode: 200,
      body: { message: 'User deleted successfully' }
    }).as('deleteUser');

    // Clique sur le bouton "Delete my account"
    // (adapter le sélecteur au bouton exact de ta page)
    cy.contains('Delete my account').click();

    // On peut confirmer un modal ou un prompt si tu en as, par exemple :
    // cy.get('.confirm-delete-button').click();



    // Vérifie qu'après suppression on est redirigé vers /login (ou une autre page)
    cy.url().should('include', '/');

    // Ou si tu affiches un message de succès :
    // cy.contains('User deleted successfully').should('be.visible');

  });
});
