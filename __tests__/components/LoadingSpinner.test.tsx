import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '@/app/components/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('displays loading message', () => {
    render(<LoadingSpinner />)

    expect(
      screen.getByText(/loading recipes/i)
    ).toBeInTheDocument()
  })
})
