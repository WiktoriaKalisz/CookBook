# E2E Testing Guidelines

This document provides guidelines for writing and maintaining e2e tests with Cypress.

## When to Add E2E Tests

Add e2e tests for:
- **Critical user workflows** (browsing recipes, switching themes, navigating)
- **Form submissions** (if you add any forms)
- **Page transitions** and navigation flows
- **Error scenarios** (404 pages, API failures)
- **Cross-browser/device compatibility** (responsive design)
- **Feature flags or A/B tests**

Do NOT add e2e tests for:
- Simple static content (use unit tests instead)
- Internal component logic (use Jest tests)
- Complex business logic (use unit tests)

## Test Structure

Each test file should follow this structure:

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
    cy.visitHomepage()
  })

  afterEach(() => {
    // Cleanup after each test (if needed)
  })

  it('should do something specific', () => {
    // Arrange - prepare data/state
    cy.get('button').contains('Click me')
    
    // Act - perform user action
    .click()
    
    // Assert - verify result
    cy.url().should('include', '/expected-url')
  })
})
```

## Best Practices

### 1. Write User-Centric Tests
```typescript
// ❌ Bad - implementation detail
cy.get('[class*="recipe-card"]').first().click()

// ✅ Good - user perspective
cy.contains('a', 'Pasta Carbonara').click()
```

### 2. Use Data Test IDs for Complex Selectors
```typescript
// In your component
<button data-testid="recipe-save-btn">Save Recipe</button>

// In your test
cy.getByTestId('recipe-save-btn').click()
```

### 3. Wait for Elements Properly
```typescript
// ❌ Bad - no wait
cy.get('.recipe-card').click()

// ✅ Good - explicit wait
cy.get('.recipe-card', { timeout: 5000 }).click()

// ✅ Better - wait for specific condition
cy.contains('a', 'Pasta').should('be.visible').click()
```

### 4. Test Independence
Each test should be independent:
```typescript
// ❌ Bad - depends on previous test
it('test 1', () => { /* logs in */ })
it('test 2', () => { /* uses logged in state */ })

// ✅ Good - each test is independent
it('test 1', () => { 
  cy.visitHomepage()
  // test code
})
it('test 2', () => { 
  cy.visitHomepage()
  // test code
})
```

### 5. Avoid Hard Waits
```typescript
// ❌ Bad
cy.wait(1000)
cy.get('.element')

// ✅ Good
cy.get('.element', { timeout: 5000 })

// ✅ Better - wait for specific element
cy.intercept('GET', '/api/recipes').as('getRecipes')
cy.wait('@getRecipes')
cy.get('.recipe-list').should('not.be.empty')
```

### 6. Use Meaningful Assertions
```typescript
// ❌ Bad - vague assertion
cy.get('div').should('exist')

// ✅ Good - specific assertion
cy.contains('h1', 'Recipes').should('be.visible')
cy.get('[role="button"]').should('have.length', 3)
```

## Adding New Tests

### Step 1: Identify User Journey
Map out what a user does:
1. Visit homepage
2. Click on a recipe
3. See recipe details
4. Go back

### Step 2: Create Test File
Create file in `cypress/e2e/` with naming pattern: `feature.cy.ts`

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visitHomepage()
  })

  it('should complete user journey', () => {
    // Your test here
  })
})
```

### Step 3: Write Test Cases
Write multiple test cases covering:
- Happy path (everything works)
- Edge cases (empty states, errors)
- Accessibility (keyboard navigation, screen readers)

### Step 4: Run and Debug
```bash
# Run specific file
npm run e2e:open
# Click on your test file in the UI
```

## Custom Commands

Defined in `cypress/support/commands.ts`:

### `cy.visitHomepage()`
Navigates to the homepage.
```typescript
cy.visitHomepage()
```

### `cy.visitRecipe(slug)`
Navigates to a recipe page.
```typescript
cy.visitRecipe('pasta-carbonara')
```

### `cy.getByTestId(testId)`
Gets element by data-testid attribute.
```typescript
cy.getByTestId('recipe-card').click()
```

## Adding Custom Commands

1. Add to `cypress/support/commands.ts`:
```typescript
Cypress.Commands.add('loginUser', (email, password) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
})
```

2. Update type definitions:
```typescript
declare global {
  namespace Cypress {
    interface Chainable {
      loginUser(email: string, password: string): Chainable<void>
    }
  }
}
```

3. Use in tests:
```typescript
cy.loginUser('user@example.com', 'password123')
```

## Debugging Tests

### Visual Debugging
```bash
npm run e2e:open
```
Tests run visually with ability to pause and step through.

### Console Output
```typescript
cy.get('element').debug() // Pause and show in console
cy.log('Message') // Log custom message
```

### Screenshots and Videos
Automatically generated in:
- `cypress/screenshots/` (on failure)
- `cypress/videos/` (if configured)

## Common Pitfalls

### 1. Testing Implementation Details
```typescript
// ❌ Bad - tests internals
cy.get('#recipe-card-1').should('have.class', 'active')

// ✅ Good - tests behavior
cy.get('[data-testid="recipe-card"]').should('have.attr', 'aria-selected', 'true')
```

### 2. Brittle Selectors
```typescript
// ❌ Bad - brittle CSS selector
cy.get('div > div > button:nth-child(3)')

// ✅ Good - semantic selector
cy.get('[role="button"]').contains('Save')
```

### 3. Missing Waits
```typescript
// ❌ Bad - might fail if API slow
cy.visit('/recipes')
cy.get('.recipe-card').should('have.length', 10)

// ✅ Good - waits for content
cy.visit('/recipes')
cy.get('.recipe-card', { timeout: 5000 }).should('have.length.greaterThan', 0)
```

## Performance Tips

1. **Use baseUrl** to avoid repeating domain
2. **Share login state** across tests if needed
3. **Mock API calls** for faster, more reliable tests
4. **Run tests in headless mode** in CI/CD
5. **Parallelize tests** for faster execution

## Resources

- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library Principles](https://testing-library.com/docs/queries/about)
- [Cypress API](https://docs.cypress.io/api/table-of-contents)
- [Debugging Guide](https://docs.cypress.io/guides/guides/debugging)
