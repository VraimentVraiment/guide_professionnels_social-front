describe('Before auth spec', () => {
  it('Can access the app', () => {
    cy.visit('http://localhost:3000/')
  })

  it('Redirects unauthorized users to auth page', () => {
    cy.visit('http://localhost:3000/dispositifs')
    cy.url().should('include', '/auth')
  })

  it('Can login', () => {
    cy.login()
  })
})

describe('After auth spec', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Redirects authorized users from "/auth" to "/"', () => {
    cy.visit('http://localhost:3000/auth')
    cy.url().should('match', /\/$/)
  })

  it('Can access to home if authenticated', () => {
    cy.visit('http://localhost:3000/')
    cy.get('h1').should('contain', 'Accueil')
  })

  it('Can logout', () => {
    cy.visit('http://localhost:3000/')
    cy.get('a[name="logout"]').click()
    cy.url().should('include', '/auth')
  })
})

describe('Gps spec', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Can select a thematique', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.fr-tile').should('have.length.greaterThan', 0)
    cy.get('.fr-tile a').first().click()
    cy.url().should('match', /thematique=\d+/)
  })
})
