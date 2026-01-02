import React from 'react'
import { render } from '@testing-library/react'
import { ThemeIcon } from '@/app/components/ThemeIcon'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

jest.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
    theme: 'light',
    systemTheme: 'light',
    setTheme: jest.fn(),
  }),
}))

describe('ThemeIcon Component', () => {
  it('renders without crashing', () => {
    render(<ThemeIcon type="logo" />)
  })

  it('renders theme toggle icon', () => {
    render(<ThemeIcon type="theme-toggle" />)
  })
})
