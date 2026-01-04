describe('Theme Toggle', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should toggle theme', () => {
    cy.get('[aria-label="Toggle theme"]').click()
    cy.get('html').should('have.attr', 'class').and('match', /dark|light/)
  })
})
