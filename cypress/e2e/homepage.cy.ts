describe('Homepage - Recipes Listing', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display recipes list', () => {
    // poczekaj na tytuł
    cy.get('[data-cy="recipes-title"]', { timeout: 15000 }).should('be.visible')
    // poczekaj na linki do przepisów
    cy.get('a[href^="/recipes/"]', { timeout: 15000 }).should('have.length.greaterThan', 0)
  })

  it('should filter recipes by diet', () => {
    cy.get('[data-cy="filter-vegan"]', { timeout: 10000 }).click()
    cy.get('[alt="Vegan"]').should('exist')
  })

  it('should search recipes', () => {
    cy.get('[data-cy="search-input"]', { timeout: 10000 }).type('tagliatelle')
    cy.get('a[href^="/recipes/"]').each($el => {
      cy.wrap($el).contains(/tagliatelle/i)
    })
  })
})
