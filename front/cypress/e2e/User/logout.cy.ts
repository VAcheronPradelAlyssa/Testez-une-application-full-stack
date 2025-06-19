describe('Logout', () => {
  beforeEach(() => {
    // Utilise la commande login classique (pas admin)
    cy.login('yoga@studio.com', 'test!1234');
  });

  it('should log out the user correctly', () => {
    // Cliquez sur le bouton de déconnexion
    cy.contains('Logout').should('be.visible').click();

    // Vérifie la redirection vers la page d'accueil ou de login
    cy.url().should('match', /\/($|login)/);

    // Vérifie que la session est supprimée du localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('sessionInformation')).to.be.null;
    });
  });
});
