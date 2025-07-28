import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    // This test will pass if the component renders without errors
    expect(document.body).toBeInTheDocument()
  })
}) 