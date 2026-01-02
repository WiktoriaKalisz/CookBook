import React from 'react'
import { render, screen } from '@testing-library/react'
import { RecipeIcon } from '@/app/components/RecipeIcon'
import { useTheme } from 'next-themes'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      data-testid="recipe-icon"
    />
  ),
}))

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

const mockTheme = (theme: 'light' | 'dark') => {
  ;(useTheme as jest.Mock).mockReturnValue({ resolvedTheme: theme })
}

describe('RecipeIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders icon after mount', async () => {
    mockTheme('light')

    render(<RecipeIcon type="vegan" />)

    const icon = await screen.findByTestId('recipe-icon')
    expect(icon).toBeInTheDocument()
  })

  it('renders correct vegan icon in light mode', async () => {
    mockTheme('light')

    render(<RecipeIcon type="vegan" />)

    const icon = (await screen.findByTestId('recipe-icon')) as HTMLImageElement
    expect(icon.src).toContain('/icons/vegan.png')
  })

  it('renders correct vegan icon in dark mode', async () => {
    mockTheme('dark')

    render(<RecipeIcon type="vegan" />)

    const icon = (await screen.findByTestId('recipe-icon')) as HTMLImageElement
    expect(icon.src).toContain('/icons/vegan2.png')
  })

  it('renders vegetarian icon', async () => {
    mockTheme('light')

    render(<RecipeIcon type="vegetarian" />)

    const icon = (await screen.findByTestId('recipe-icon')) as HTMLImageElement
    expect(icon.src).toContain('/icons/vegetarian.png')
  })

  it('renders spicy icon', async () => {
    mockTheme('light')

    render(<RecipeIcon type="spicy" />)

    const icon = (await screen.findByTestId('recipe-icon')) as HTMLImageElement
    expect(icon.src).toContain('/icons/spicy.png')
  })

  it('uses custom alt text when provided', async () => {
    mockTheme('light')

    render(<RecipeIcon type="vegan" alt="Vegan recipe badge" />)

    const icon = await screen.findByTestId('recipe-icon')
    expect(icon).toHaveAttribute('alt', 'Vegan recipe badge')
  })

  it('uses icon type as default alt text', async () => {
    mockTheme('light')

    render(<RecipeIcon type="vegan" />)

    const icon = await screen.findByTestId('recipe-icon')
    expect(icon).toHaveAttribute('alt', 'vegan')
  })

  it('uses custom width and height', async () => {
    mockTheme('light')

    render(<RecipeIcon type="vegan" width={32} height={32} />)

    const icon = (await screen.findByTestId('recipe-icon')) as HTMLImageElement
    expect(icon.width).toBe(32)
    expect(icon.height).toBe(32)
  })

  it('uses default width and height when not provided', async () => {
    mockTheme('light')

    render(<RecipeIcon type="vegan" />)

    const icon = (await screen.findByTestId('recipe-icon')) as HTMLImageElement
    expect(icon.width).toBe(20)
    expect(icon.height).toBe(20)
  })
})
