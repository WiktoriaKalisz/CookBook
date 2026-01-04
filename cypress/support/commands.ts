// Cypress support file - common commands and setups
Cypress.Commands.add('visitHomepage', () => {
  cy.visit('/', { failOnStatusCode: false })
})

Cypress.Commands.add('visitRecipe', (slug: string) => {
  cy.visit(`/recipes/${slug}`, { failOnStatusCode: false })
})

Cypress.Commands.add('getByTestId', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`)
})

declare global {
  namespace Cypress {
    interface Chainable {
      visitHomepage(): Chainable<void>
      visitRecipe(slug: string): Chainable<void>
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
    }
  }
}
