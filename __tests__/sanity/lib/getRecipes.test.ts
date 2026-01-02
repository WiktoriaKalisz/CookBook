import { getRecipes } from '@/sanity/lib/getRecipes'
import { client } from '@/sanity/lib/client'

jest.mock('@/sanity/lib/client', () => ({
  client: {
    fetch: jest.fn(),
  },
}))

describe('getRecipes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches recipes with correct query', async () => {
    const mockRecipes = [
      {
        _id: '1',
        title: 'Test Recipe',
        slug: { current: 'test-recipe' },
        category: 'dessert',
        image: null,
        isVegan: false,
        isVegetarian: true,
        difficulty: 'easy',
        isSpicy: false,
      },
    ]

    ;(client.fetch as jest.Mock).mockResolvedValue(mockRecipes)

    const result = await getRecipes()

    expect(result).toEqual(mockRecipes)
    expect(client.fetch).toHaveBeenCalled()
  })

  it('returns empty array when no recipes exist', async () => {
    ;(client.fetch as jest.Mock).mockResolvedValue([])

    const result = await getRecipes()

    expect(result).toEqual([])
  })

  it('propagates fetch errors', async () => {
    const error = new Error('Sanity API error')
    ;(client.fetch as jest.Mock).mockRejectedValue(error)

    await expect(getRecipes()).rejects.toThrow('Sanity API error')
  })

  it('orders recipes by creation date descending', async () => {
    ;(client.fetch as jest.Mock).mockResolvedValue([])

    await getRecipes()

    const queryArg = (client.fetch as jest.Mock).mock.calls[0][0]
    expect(queryArg).toContain('order(_createdAt desc)')
  })

  it('fetches only required fields', async () => {
    ;(client.fetch as jest.Mock).mockResolvedValue([])

    await getRecipes()

    const queryArg = (client.fetch as jest.Mock).mock.calls[0][0]
    expect(queryArg).toContain('_id')
    expect(queryArg).toContain('title')
    expect(queryArg).toContain('slug')
    expect(queryArg).toContain('category')
    expect(queryArg).toContain('image')
  })
})
