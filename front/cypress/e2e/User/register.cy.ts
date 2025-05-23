describe('User Registration', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register a new user and redirect to /login', () => {
    // Stub de l'inscription réussie
    cy.intercept('POST', '/api/auth/register', { statusCode: 200 }).as('registerUser');

    // Remplir et soumettre le formulaire
    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('john.doe@example.com');
    cy.get('input[formControlName=password]').type('SecurePassword123!');
    cy.get('form').submit();

    // Attendre la requête réseau et vérifier la redirection
    cy.wait('@registerUser');
    cy.url().should('include', '/login');
  });

  it('should handle existing email error', () => {
    // Stub d'une erreur pour email existant
    cy.intercept('POST', '/api/auth/register', { statusCode: 400 }).as('registerExisting');

    // Remplir et soumettre le formulaire
    cy.get('input[formControlName=firstName]').type('Jane');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('existing.user@example.com');
    cy.get('input[formControlName=password]').type('AnotherPassword123!');
    cy.get('form').submit();

    // Attendre l’appel réseau sans autre vérification
    cy.wait('@registerExisting');
  });
});
