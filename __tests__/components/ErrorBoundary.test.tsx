import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from '@/app/components/ErrorBoundary'

const ThrowError = () => {
  throw new Error('Test error')
}

// suppress console.error for these tests
const originalError = console.error

beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  describe('with ThrowError component', () => {
    it('renders error UI when error is caught', () => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('displays the error message', () => {
      expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    it('renders reload button', () => {
      expect(screen.getByText('Reload Page')).toBeInTheDocument()
    })

    it('reload button calls window.location.reload', () => {
      const reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {})
      fireEvent.click(screen.getByText('Reload Page'))
      expect(reloadSpy).toHaveBeenCalled()
      reloadSpy.mockRestore()
    })
  })

  it('displays default error message when error has no message', () => {
    const ThrowErrorWithoutMessage = () => {
      throw new Error()
    }

    render(
      <ErrorBoundary>
        <ThrowErrorWithoutMessage />
      </ErrorBoundary>
    )

    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })
})
