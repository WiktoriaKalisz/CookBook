import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RecipeDetails from '@/app/recipes/[slug]/RecipeDetails'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  }
})

jest.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
    theme: 'light',
    systemTheme: 'light',
    setTheme: jest.fn(),
  }),
}))

jest.mock('@/app/components', () => ({
  ThemeIcon: ({ type, alt }: any) => <div data-testid={`theme-icon-${type}`}>{alt}</div>,
  RecipeIcon: ({ type, alt }: any) => <div data-testid={`recipe-icon-${type}`}>{alt}</div>,
}))

jest.mock('@/sanity/lib/image', () => ({
  urlFor: (image: any) => ({
    width: jest.fn().mockReturnThis(),
    height: jest.fn().mockReturnThis(),
    url: jest.fn().mockReturnValue('https://example.com/image.jpg'),
  }),
}))

const mockRecipe = {
  _id: '1',
  title: 'Chocolate Cake',
  slug: { current: 'chocolate-cake' },
  description: 'Delicious chocolate cake',
  servings: 4,
  prepTime: 15,
  cookTime: 30,
  isVegan: false,
  isVegetarian: true,
  isSpicy: false,
  difficulty: 'easy',
  image: { _type: 'image', asset: { _ref: 'image123' } },
  ingredients: [
    { name: 'Flour', amount: 2, unit: 'cups' },
    { name: 'Sugar', amount: 1, unit: 'cup' },
    'Salt',
  ],
  instructions: [
    'Mix dry ingredients',
    'Add wet ingredients',
    'Bake at 350°F for 30 minutes',
  ],
}

describe('RecipeDetails Component', () => {
  it('renders recipe title', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
  })

  it('renders recipe description', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    expect(screen.getByText('Delicious chocolate cake')).toBeInTheDocument()
  })

  it('displays prep and cook times', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    expect(screen.getByText(/Prep time:/)).toBeInTheDocument()
    expect(screen.getByText(/Cook time:/)).toBeInTheDocument()
    const prepTimeElement = screen.getByText(/Prep time:/).closest('p')
    const cookTimeElement = screen.getByText(/Cook time:/).closest('p')
    expect(prepTimeElement?.textContent).toContain('15')
    expect(cookTimeElement?.textContent).toContain('30')
  })

  it('displays servings', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    const servingsElement = screen.getByText(/Servings:/).closest('p')
    expect(servingsElement?.textContent).toContain('4')
  })

  it('shows difficulty badge', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    expect(screen.getByText('easy')).toBeInTheDocument()
  })

  it('displays recipe icons for dietary restrictions', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    expect(screen.getByTestId('recipe-icon-vegetarian')).toBeInTheDocument()
  })

  it('does not display vegan icon when not vegan', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    expect(screen.queryByTestId('recipe-icon-vegan')).not.toBeInTheDocument()
  })

  it('displays spicy icon when isSpicy is true', () => {
    const spicyRecipe = { ...mockRecipe, isSpicy: true }
    render(<RecipeDetails recipe={spicyRecipe} />)
    expect(screen.getByTestId('recipe-icon-spicy')).toBeInTheDocument()
  })

  it('renders logo icon link', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    expect(screen.getByTestId('theme-icon-logo')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    const themeToggle = screen.getByTestId('theme-icon-theme-toggle')
    expect(themeToggle).toBeInTheDocument()
  })

  it('renders ingredients section with title', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    expect(screen.getByText('Ingredients')).toBeInTheDocument()
  })

  it('renders all ingredients', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    expect(screen.getByText('Flour')).toBeInTheDocument()
    expect(screen.getByText('Sugar')).toBeInTheDocument()
    const lists = screen.getAllByRole('list')
    expect(lists[0].textContent).toContain('Salt')
  })

  it('displays ingredient amounts with units', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    const lists = screen.getAllByRole('list')
    const ingredientsList = lists[0]
    expect(ingredientsList.textContent).toMatch(/2.*cups/)
    expect(ingredientsList.textContent).toMatch(/1.*cup/)
  })

  it('calculates scaled ingredient amounts when servings change', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    const increaseButton = screen.getByLabelText('Increase servings')

    fireEvent.click(increaseButton)
    fireEvent.click(increaseButton)
    fireEvent.click(increaseButton)
    fireEvent.click(increaseButton)

    // 2 cups * 2 = 4 cups, 1 cup * 2 = 2 cups
    const lists = screen.getAllByRole('list')
    const ingredientsList = lists[0]
    expect(ingredientsList.textContent).toMatch(/4.*cups/)
    expect(ingredientsList.textContent).toMatch(/2.*cup/)
  })

  it('decreases servings with minus button', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    const decreaseButton = screen.getByLabelText('Decrease servings')
    const servingsElement = screen.getByText(/Servings:/).closest('p')
    fireEvent.click(decreaseButton)
    fireEvent.click(decreaseButton)
    expect(servingsElement?.textContent).toContain('2')
  })

  it('prevents servings from going below 1', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    const decreaseButton = screen.getByLabelText('Decrease servings')

    for (let i = 0; i < 10; i++) {
      fireEvent.click(decreaseButton)
    }

    // should still show 1 serving
    const servingsElement = screen.getByText(/Servings:/).closest('p')
    expect(servingsElement?.textContent).toContain('1')
  })

  it('renders instructions section with title', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    expect(screen.getByText('Instructions')).toBeInTheDocument()
  })

  it('renders all instructions', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    expect(screen.getByText('Mix dry ingredients')).toBeInTheDocument()
    expect(screen.getByText('Add wet ingredients')).toBeInTheDocument()
    expect(screen.getByText('Bake at 350°F for 30 minutes')).toBeInTheDocument()
  })

  it('does not render ingredients section when no ingredients', () => {
    const recipeWithoutIngredients = { ...mockRecipe, ingredients: [] }
    render(<RecipeDetails recipe={recipeWithoutIngredients} />)
    expect(screen.queryByText('Ingredients')).not.toBeInTheDocument()
  })

  it('does not render instructions section when no instructions', () => {
    const recipeWithoutInstructions = { ...mockRecipe, instructions: [] }
    render(<RecipeDetails recipe={recipeWithoutInstructions} />)
    expect(screen.queryByText('Instructions')).not.toBeInTheDocument()
  })

  it('renders recipe without optional fields', () => {
    const minimalRecipe = {
      _id: '1',
      title: 'Simple Recipe',
      slug: { current: 'simple-recipe' },
    }
    render(<RecipeDetails recipe={minimalRecipe as any} />)
    expect(screen.getByText('Simple Recipe')).toBeInTheDocument()
  })

  it('handles string ingredients in the list', () => {
    const recipeWithStringIngredients = {
      ...mockRecipe,
      ingredients: ['Flour', 'Sugar', { name: 'Eggs', amount: 2, unit: 'pieces' }],
    }
    render(<RecipeDetails recipe={recipeWithStringIngredients} />)
    const lists = screen.getAllByRole('list')
    const ingredientsList = lists[0]
    expect(ingredientsList.textContent).toContain('Flour')
    expect(ingredientsList.textContent).toContain('Sugar')
    expect(ingredientsList.textContent).toContain('Eggs')
  })

  it('changes servings display when servings button is clicked', () => {
    render(<RecipeDetails recipe={mockRecipe} />)
    const increaseButton = screen.getByLabelText('Increase servings')
    const servingsElement = screen.getByText(/Servings:/).closest('p')

    expect(servingsElement?.textContent).toContain('4')

    fireEvent.click(increaseButton)
    expect(servingsElement?.textContent).toContain('5')
    fireEvent.click(increaseButton)
    expect(servingsElement?.textContent).toContain('6')
  })
})
