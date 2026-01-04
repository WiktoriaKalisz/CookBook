describe('Recipe Details', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('a[href^="/recipes/"]').first().click()
  })

  it('should display recipe title and ingredients', () => {
    cy.get('h1').should('exist')
    cy.contains('Ingredients').should('exist')
  })

  it('should increase and decrease servings', () => {
    cy.get('button[aria-label="Increase servings"]').click()
    cy.get('span').contains('2').should('exist')

    cy.get('button[aria-label="Decrease servings"]').click()
    cy.get('span').contains('1').should('exist')
  })

  it('should display instructions', () => {
    cy.contains('Instructions').should('exist')
    cy.get('ol li').should('have.length.greaterThan', 0)
  })
})
