describe('Suppression utilisateur - flow mocké complet', () => {
  // 1. Données fictives
  const fakeSession = {
    id: 2,
    name: "Pilates du soir",
    date: new Date(),
    teacher_id: 2,
    description: "Un cours doux pour finir la journée en détente.",
    users: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const fakeUser = {
    id: 2,
    firstName: 'Alice',
    lastName: 'Martin',
    email: 'alice.martin@example.org',
    admin: false,
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-05-10T09:00:00Z'
  };

  beforeEach(() => {
    // Intercept login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { id: 2, token: 'fake-jwt-token', username: 'alice.martin@example.org' }
    }).as('login');

    // Intercept GET /api/session (listing)
    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [fakeSession]
    }).as('getSessions');

    // Intercept GET /api/user/2 (pour /me)
    cy.intercept('GET', '/api/user/2', {
      statusCode: 200,
      body: fakeUser
    }).as('getUser');

    // Intercept DELETE /api/user/2 (suppression)
    cy.intercept('DELETE', '/api/user/2', {
      statusCode: 200,
      body: { message: 'User deleted successfully' }
    }).as('deleteUser');
  });

  it('Utilisateur connecté, consulte ses sessions, va dans /me et voit le bouton delete', () => {
    // 2. Connexion
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('alice.martin@example.org');
    cy.get('input[formControlName=password]').type('superSecret123');
    cy.get('form').submit();
    cy.wait('@login').then(() => {
      // Stocke la session utilisateur (adapte le nom de la clé si nécessaire)
      window.localStorage.setItem('sessionInformation', JSON.stringify({
        id: 2,
        token: 'fake-jwt-token',
        username: 'alice.martin@example.org'
      }));
    });

    // 3. Vérifie l’arrivée sur /sessions et la présence d'une session
    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');
    cy.contains(fakeSession.name);
    cy.contains(fakeSession.description);

    // 4. Clique sur "Account"
    cy.contains('span.link', 'Account').click();

    // 5. Vérification sur /me
    cy.url().should('include', '/me');
    cy.wait('@getUser');
    cy.contains('Name: Alice MARTIN');
    cy.contains('alice.martin@example.org');
    cy.contains('Delete my account:');
    cy.get('button').contains(/delete/i).should('be.visible');
    
    // 6. Clique sur Delete et vérifie le message de succès
    cy.get('button').contains(/delete/i).click();
    cy.wait('@deleteUser');
    cy.get('.mat-snack-bar-container').should('be.visible').and('contain', 'Your account has been deleted !');
  });
});