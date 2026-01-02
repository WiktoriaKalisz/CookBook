import { getRecipe } from '@/sanity/lib/getRecipe'
import { client } from '@/sanity/lib/client'

jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}))

describe('getRecipe', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches a single recipe by slug', async () => {
    const mockRecipe = {
      title: 'Pasta Carbonara',
      slug: { current: 'pasta-carbonara' },
      image: null,
      prepTime: 10,
      cookTime: 20,
      difficulty: 'medium',
      isVegan: false,
      isVegetarian: false,
      isSpicy: false,
      ingredients: ['pasta', 'eggs', 'bacon'],
      instructions: ['Cook pasta', 'Mix eggs'],
      description: 'Classic Italian pasta',
      servings: 4,
    }

    ;(client.fetch as jest.Mock).mockResolvedValue(mockRecipe)

    const result = await getRecipe('pasta-carbonara')

    expect(result).toEqual(mockRecipe)
    expect(client.fetch).toHaveBeenCalled()
  })

  it('passes slug as parameter to client.fetch', async () => {
    ;(client.fetch as jest.Mock).mockResolvedValue({})

    await getRecipe('test-recipe')

    expect(client.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ slug: 'test-recipe' })
    )
  })

  it('handles fetch errors gracefully', async () => {
    const error = new Error('Sanity API error')
    ;(client.fetch as jest.Mock).mockRejectedValue(error)

    await expect(getRecipe('any-slug')).rejects.toThrow('Sanity API error')
  })

  it('builds correct Sanity query', async () => {
  ;(client.fetch as jest.Mock).mockResolvedValue({})

  await getRecipe('test-recipe')

  const query = (client.fetch as jest.Mock).mock.calls[0][0]

  expect(query).toContain('_type == "recipe"')
  expect(query).toContain('slug.current == $slug')
  expect(query).toContain('[0]')
  expect(query).toContain('ingredients')
  expect(query).toContain('instructions')
})
})
