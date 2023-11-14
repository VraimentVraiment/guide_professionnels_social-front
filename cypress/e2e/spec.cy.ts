describe('Before auth spec', () => {
  it('Can access the app', () => {
    cy.visit('http://localhost:3000/')
  })

  it('Redirects unauthorized users to login', () => {
    cy.visit('http://localhost:3000/dispositifs')
    cy.url().should('include', '/login')
  })

  it('Can login', () => {
    cy.login()
  })
})

describe('After auth spec', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Redirects authorized users from "/login" to "/"', () => {
    cy.visit('http://localhost:3000/login')
    cy.url().should('match', /\/$/)
  })

  // it('Can logout', () => {
  // })

  it('Can access to home if authenticated', () => {
    cy.visit('http://localhost:3000/')
    cy.get('h1').should('contain', 'Accueil')
  })
})

describe('Gps spec', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Can select a thematique', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.fr-tile').should('have.length', 4)
    cy.get('.fr-tile a').first().click()
    // cy.url().should('include', '?thematique=1')
  })
})
