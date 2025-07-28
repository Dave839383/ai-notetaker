import { useEffect, useState, type RefObject } from 'react'

interface AIPopupData {
  lineIndex: number
  question: string
  response: string
}

interface AIPopupProps {
  popup: AIPopupData
  onClose: () => void
  editorRef: RefObject<HTMLTextAreaElement | null>
  currentNote: string
}

const AIPopup = ({ popup, onClose, editorRef, currentNote }: AIPopupProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (editorRef.current) {
      const getCaretCoordinates = (lineIndex: number) => {
        const editor = editorRef.current!
        const div = document.createElement('div')
        const pre = document.createElement('pre')
        const span = document.createElement('span')

        div.style.position = 'absolute'
        div.style.visibility = 'hidden'
        div.style.whiteSpace = 'pre-wrap'
        div.style.font = window.getComputedStyle(editor).font
        div.style.lineHeight = window.getComputedStyle(editor).lineHeight
        div.style.padding = window.getComputedStyle(editor).padding
        div.style.width = editor.clientWidth + 'px'

        const lines = currentNote.split('\n')
        pre.textContent = lines.slice(0, lineIndex).join('\n') + '\n'
        span.textContent = lines[lineIndex] || ''

        pre.appendChild(span)
        div.appendChild(pre)
        editor.parentElement?.appendChild(div)

        const rect = span.getBoundingClientRect()
        const containerRect = editor.parentElement?.getBoundingClientRect()

        if (editor.parentElement && containerRect) {
          editor.parentElement.removeChild(div)

          return {
            top: rect.top - containerRect.top + editor.scrollTop,
            left: 40
          }
        }

        return { top: 0, left: 0 }
      }

      const pos = getCaretCoordinates(popup.lineIndex)
      setPosition({
        top: pos.top + 30,
        left: pos.left
      })
    }
  }, [popup, editorRef, currentNote])

  const handleClose = () => {
    onClose()
    // Select the @ai line in the textarea
    if (editorRef.current) {
      const lines = currentNote.split('\n')
      const charStart = lines.slice(0, popup.lineIndex).join('\n').length + (popup.lineIndex > 0 ? 1 : 0)
      const lineLength = lines[popup.lineIndex]?.length || 0

      editorRef.current.focus()
      editorRef.current.setSelectionRange(charStart, charStart + lineLength)
    }
  }

  return (
    <div
      className="absolute max-w-md bg-indigo-50 border border-gray-300 border-l-4 border-l-purple-500 p-4 text-sm z-50 shadow-lg rounded-md"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <button
        onClick={handleClose}
        className="absolute top-1 right-2 bg-transparent border-none text-lg cursor-pointer text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <div className="pr-6">{popup.response}</div>
    </div>
  )
}

export default AIPopup 