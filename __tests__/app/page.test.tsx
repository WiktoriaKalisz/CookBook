import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecipesPage from '@/app/page'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  }
})

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
    theme: 'light',
    systemTheme: 'light',
    setTheme: jest.fn(),
  }),
}))

// Mock components
jest.mock('@/app/components', () => ({
  ThemeIcon: ({ type, alt }: any) => <div data-testid={`theme-icon-${type}`}>{alt}</div>,
  RecipeIcon: ({ type, alt }: any) => <div data-testid={`recipe-icon-${type}`}>{alt}</div>,
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}))

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaSearch: () => <div data-testid="search-icon">Search</div>,
}))

// Mock getRecipes
jest.mock('@/sanity/lib/getRecipes', () => ({
  getRecipes: jest.fn(),
}))

// Mock sanity image url
jest.mock('@/sanity/lib/image', () => ({
  urlFor: (image: any) => ({
    width: jest.fn().mockReturnThis(),
    height: jest.fn().mockReturnThis(),
    url: jest.fn().mockReturnValue('https://example.com/image.jpg'),
  }),
}))

const mockRecipes = [
  {
    _id: '1',
    title: 'Chocolate Cake',
    slug: { current: 'chocolate-cake' },
    category: 'Dessert',
    image: { _type: 'image', asset: { _ref: 'image1' } },
    isVegan: false,
    isVegetarian: true,
    isSpicy: false,
    difficulty: 'easy',
  },
  {
    _id: '2',
    title: 'Spicy Tacos',
    slug: { current: 'spicy-tacos' },
    category: 'Main Course',
    image: { _type: 'image', asset: { _ref: 'image2' } },
    isVegan: false,
    isVegetarian: false,
    isSpicy: true,
    difficulty: 'medium',
  },
  {
    _id: '3',
    title: 'Vegan Burger',
    slug: { current: 'vegan-burger' },
    category: 'Main Course',
    image: { _type: 'image', asset: { _ref: 'image3' } },
    isVegan: true,
    isVegetarian: true,
    isSpicy: false,
    difficulty: 'hard',
  },
]

describe('RecipesPage Component', () => {
  beforeEach(() => {
    const { getRecipes } = require('@/sanity/lib/getRecipes')
    getRecipes.mockResolvedValue(mockRecipes)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading spinner initially', async () => {
    const { getRecipes } = require('@/sanity/lib/getRecipes')
    getRecipes.mockImplementationOnce(() => new Promise(() => {}))

    render(<RecipesPage />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders CookBook header title', async () => {
    render(<RecipesPage />)
    await waitFor(() => {
      expect(screen.getByText('CookBook')).toBeInTheDocument()
    })
  })

  it('renders search input', async () => {
    render(<RecipesPage />)
    await waitFor(() => {
      expect(screen.getByLabelText('Search recipes')).toBeInTheDocument()
    })
  })

  it('renders difficulty filter buttons', async () => {
    render(<RecipesPage />)
    await waitFor(() => {
      expect(screen.getByLabelText('Filter by Easy difficulty')).toBeInTheDocument()
      expect(screen.getByLabelText('Filter by Medium difficulty')).toBeInTheDocument()
      expect(screen.getByLabelText('Filter by Hard difficulty')).toBeInTheDocument()
    })
  })

  it('renders dietary filter buttons', async () => {
    render(<RecipesPage />)
    await waitFor(() => {
      expect(screen.getByLabelText('Filter by Spicy')).toBeInTheDocument()
      expect(screen.getByLabelText('Filter by Vegetarian')).toBeInTheDocument()
      expect(screen.getByLabelText('Filter by Vegan')).toBeInTheDocument()
    })
  })

  it('renders all recipes', async () => {
    render(<RecipesPage />)
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
      expect(screen.getByText('Spicy Tacos')).toBeInTheDocument()
      expect(screen.getByText('Vegan Burger')).toBeInTheDocument()
    })
  })

  it('displays recipe categories', async () => {
    render(<RecipesPage />)
    await waitFor(() => {
      expect(screen.getByText('Dessert')).toBeInTheDocument()
      expect(screen.getAllByText('Main Course')).toHaveLength(2)
    })
  })

  it('filters recipes by search term', async () => {
    render(<RecipesPage />)
    const searchInput = await screen.findByLabelText('Search recipes')

    fireEvent.change(searchInput, { target: { value: 'Chocolate' } })

    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
      expect(screen.queryByText('Spicy Tacos')).not.toBeInTheDocument()
      expect(screen.queryByText('Vegan Burger')).not.toBeInTheDocument()
    })
  })

  it('filters recipes by search term case-insensitively', async () => {
    render(<RecipesPage />)
    const searchInput = await screen.findByLabelText('Search recipes')

    fireEvent.change(searchInput, { target: { value: 'vegan' } })

    await waitFor(() => {
      expect(screen.getByText('Vegan Burger')).toBeInTheDocument()
      expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
    })
  })

  it('filters recipes by difficulty level', async () => {
    render(<RecipesPage />)
    const easyButton = await screen.findByLabelText('Filter by Easy difficulty')

    fireEvent.click(easyButton)

    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
      expect(screen.queryByText('Spicy Tacos')).not.toBeInTheDocument()
      expect(screen.queryByText('Vegan Burger')).not.toBeInTheDocument()
    })
  })

  it('filters recipes by dietary restrictions', async () => {
    render(<RecipesPage />)
    const veganButton = await screen.findByLabelText('Filter by Vegan')

    fireEvent.click(veganButton)

    await waitFor(() => {
      expect(screen.getByText('Vegan Burger')).toBeInTheDocument()
      expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
      expect(screen.queryByText('Spicy Tacos')).not.toBeInTheDocument()
    })
  })

  it('filters recipes by vegetarian', async () => {
    render(<RecipesPage />)
    const vegetarianButton = await screen.findByLabelText('Filter by Vegetarian')

    fireEvent.click(vegetarianButton)

    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
      expect(screen.getByText('Vegan Burger')).toBeInTheDocument()
      expect(screen.queryByText('Spicy Tacos')).not.toBeInTheDocument()
    })
  })

  it('filters recipes by spicy', async () => {
    render(<RecipesPage />)
    const spicyButton = await screen.findByLabelText('Filter by Spicy')

    fireEvent.click(spicyButton)

    await waitFor(() => {
      expect(screen.getByText('Spicy Tacos')).toBeInTheDocument()
      expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
      expect(screen.queryByText('Vegan Burger')).not.toBeInTheDocument()
    })
  })

  it('clears difficulty filter when clicking selected button', async () => {
    render(<RecipesPage />)
    const mediumButton = await screen.findByLabelText('Filter by Medium difficulty')

    fireEvent.click(mediumButton)
    await waitFor(() => {
      expect(screen.getByText('Spicy Tacos')).toBeInTheDocument()
    })

    fireEvent.click(mediumButton)
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
      expect(screen.getByText('Spicy Tacos')).toBeInTheDocument()
      expect(screen.getByText('Vegan Burger')).toBeInTheDocument()
    })
  })

  it('clears dietary filter when clicking selected button', async () => {
    render(<RecipesPage />)
    const veganButton = await screen.findByLabelText('Filter by Vegan')

    fireEvent.click(veganButton)
    await waitFor(() => {
      expect(screen.getByText('Vegan Burger')).toBeInTheDocument()
    })

    fireEvent.click(veganButton)
    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
      expect(screen.getByText('Spicy Tacos')).toBeInTheDocument()
      expect(screen.getByText('Vegan Burger')).toBeInTheDocument()
    })
  })

  it('combines search and difficulty filters', async () => {
    render(<RecipesPage />)
    const searchInput = await screen.findByLabelText('Search recipes')
    const easyButton = await screen.findByLabelText('Filter by Easy difficulty')

    fireEvent.change(searchInput, { target: { value: 'Cake' } })
    fireEvent.click(easyButton)

    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
      expect(screen.queryByText('Spicy Tacos')).not.toBeInTheDocument()
      expect(screen.queryByText('Vegan Burger')).not.toBeInTheDocument()
    })
  })

  it('displays message when no recipes match filters', async () => {
    render(<RecipesPage />)
    const searchInput = await screen.findByLabelText('Search recipes')

    fireEvent.change(searchInput, { target: { value: 'NonExistentRecipe' } })

    await waitFor(() => {
      expect(screen.getByText('No recipes match your filters.')).toBeInTheDocument()
    })
  })

  it('displays error message when data fetching fails', async () => {
    const { getRecipes } = require('@/sanity/lib/getRecipes')
    getRecipes.mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<RecipesPage />)

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Failed to load recipes. Please try again later.')).toBeInTheDocument()
    })
  })

  it('displays try again button on error', async () => {
    const { getRecipes } = require('@/sanity/lib/getRecipes')
    getRecipes.mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<RecipesPage />)

    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
  })

  it('shows recipe icons for dietary properties', async () => {
    render(<RecipesPage />)

    await waitFor(() => {
      const veganIcons = screen.getAllByTestId('recipe-icon-vegan')
      expect(veganIcons.length).toBeGreaterThan(0)
      expect(screen.getAllByTestId('recipe-icon-vegetarian').length).toBeGreaterThan(0)
      expect(screen.getAllByTestId('recipe-icon-spicy').length).toBeGreaterThan(0)
    })
  })

  it('renders recipe links to detail pages', async () => {
    render(<RecipesPage />)

    await waitFor(() => {
      const links = screen.getAllByRole('link')
      const recipeLinks = links.filter(link => link.href.includes('/recipes/'))
      expect(recipeLinks.length).toBeGreaterThan(0)
      expect(recipeLinks[0].href).toContain('/recipes/chocolate-cake')
    })
  })

  it('handles multiple filters at once', async () => {
    render(<RecipesPage />)
    const vegetarianButton = await screen.findByLabelText('Filter by Vegetarian')
    const hardButton = await screen.findByLabelText('Filter by Hard difficulty')

    fireEvent.click(vegetarianButton)
    fireEvent.click(hardButton)

    await waitFor(() => {
      expect(screen.getByText('Vegan Burger')).toBeInTheDocument()
      expect(screen.queryByText('Chocolate Cake')).not.toBeInTheDocument()
      expect(screen.queryByText('Spicy Tacos')).not.toBeInTheDocument()
    })
  })

  it('displays all recipes initially without filters', async () => {
    render(<RecipesPage />)

    await waitFor(() => {
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
      expect(screen.getByText('Spicy Tacos')).toBeInTheDocument()
      expect(screen.getByText('Vegan Burger')).toBeInTheDocument()
    })
  })

  it('shows no recipes message when recipes list is empty', async () => {
    const { getRecipes } = require('@/sanity/lib/getRecipes')
    getRecipes.mockResolvedValueOnce([])

    render(<RecipesPage />)

    await waitFor(() => {
      expect(screen.getByText('No recipes found.')).toBeInTheDocument()
    })
  })
})
