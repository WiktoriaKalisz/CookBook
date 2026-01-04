describe('Error handling', () => {
  it('shows empty state when no recipes exist', () => {
    cy.intercept(
      { method: 'GET', url: '**/data/query/**' },
      { statusCode: 200, body: { result: [] } }
    )

    cy.visit('/')

    cy.contains('No recipes found.', { timeout: 15000 }).should('exist')
  })

  it('shows error page when API fails', () => {
    cy.intercept(
      { method: 'GET', url: '**/data/query/**' },
      { statusCode: 500, body: {} }
    )

    cy.visit('/')

    cy.contains('Failed to load recipes').should('exist')
    cy.contains('Try Again').should('exist')
  })

  it('shows 404 page for unknown route', () => {
    cy.visit('/non-existent-page', { failOnStatusCode: false })
    cy.contains('Page Not Found').should('exist')
  })
})
