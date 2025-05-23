describe('Logout', () => {
  beforeEach(() => {
    // Visitez la page de connexion
    cy.visit('/login');

    // Attendez que la page soit complètement chargée
    cy.contains('Login').should('be.visible');

    // Simulez la connexion de l'utilisateur
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
  });

  it('should log out the user correctly', () => {
    // Cliquez sur le bouton de déconnexion
    cy.contains('Logout').should('be.visible').click();

    // Vérifiez que l'utilisateur est redirigé vers la page de connexion
    cy.url().should('include', '/');
  });
});
