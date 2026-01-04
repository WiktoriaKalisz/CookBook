describe('Navigation and Routing', () => {
  it('should navigate to homepage', () => {
    cy.visit('/')
    cy.url().should('eq', 'http://localhost:3000/')
  })

  it('should navigate to recipe details', () => {
    cy.visit('/')
    cy.get('a[href^="/recipes/"]').first().click()
    cy.url().should('include', '/recipes/')
    cy.get('h1').should('exist')
  })
})
