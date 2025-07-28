import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import Editor from './Editor'

describe('Editor', () => {
  it('should call onChange when typing in textarea', () => {
    const mockOnChange = vi.fn()
    const mockOnKeyUp = vi.fn()
    const mockOnSave = vi.fn()

    render(
      <Editor 
        value="" 
        onChange={mockOnChange} 
        onKeyUp={mockOnKeyUp} 
        onSave={mockOnSave} 
      />
    )

    const textarea = document.querySelector('textarea')
    fireEvent.change(textarea!, { target: { value: 'Hello world' } })

    expect(mockOnChange).toHaveBeenCalledWith('Hello world')
  })
}) 