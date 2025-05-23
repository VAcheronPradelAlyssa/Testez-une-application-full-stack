describe('User e2e me test', () => {
  it('Me', () => {
    let sessionUsers = [];

    // 1. Intercepter toutes les requêtes REST avant la visite ou les actions utilisateur
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        username: 'john.doe@example.com'
      }
    }).as('loginRequest');

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

    // 2. Maintenant on visite la page login
    cy.visit('/login');

    // 3. Remplir le formulaire et soumettre
    cy.get('input[formControlName=email]').type('john.doe@example.com');
    cy.get('input[formControlName=password]').type('SecurePassword123!');
    cy.get('form').submit();

    // 4. Attendre la réponse mockée du login
    cy.wait('@loginRequest');

    // 5. Attendre la redirection vers /sessions
    cy.url().should('include', '/sessions');

    // 6. Cliquer vers la page /me
    cy.get('span[routerLink=me]').click();

    // 7. Vérifier l'URL et le contenu de la page /me
    cy.url().should('include', '/me');
    cy.get('p').contains("Name: John DOE");
    cy.get('p').contains("Email: john.doe@example.com");
  });
});
