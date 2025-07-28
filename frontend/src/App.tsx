import { useState, useRef, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import AIPopup from './components/AIPopup'

interface AIPopupData {
  lineIndex: number
  question: string
  response: string
}

function App() {
  const [notes, setNotes] = useState<string[]>([])
  const [currentNote, setCurrentNote] = useState('')
  const [aiPopup, setAiPopup] = useState<AIPopupData | null>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const mockAIResponse = (question: string): string => {
    return `🤖 AI: This is a fake answer to '${question}'`
  }

  const handleSaveNote = (): void => {
    const text = currentNote.trim()
    if (text) {
      setNotes(prev => [...prev, text])
      setCurrentNote('')
      setAiPopup(null)
    }
  }

  const handleDeleteNote = (index: number): void => {
    setNotes(prev => prev.filter((_, i) => i !== index))
    setCurrentNote('')
    setAiPopup(null)
  }

  const handleLoadNote = (note: string): void => {
    setCurrentNote(note)
    setAiPopup(null)
  }

  const handleEditorKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter') {
      const lines = currentNote.split('\n')
      const cursorPosition = e.currentTarget.selectionStart

      // Figure out which line was just submitted
      let charCount = 0
      let lineIndex = 0

      for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1 // +1 for newline
        if (charCount > cursorPosition) {
          lineIndex = i
          break
        }
      }

      const prevLineIndex = lineIndex - 1
      const prevLine = lines[prevLineIndex]?.trim()

      if (prevLine && prevLine.startsWith('@ai')) {
        const question = prevLine.replace('@ai', '').trim()
        if (question.length > 0) {
          setAiPopup({
            lineIndex: prevLineIndex,
            question,
            response: mockAIResponse(question)
          })
        }
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && aiPopup) {
      setAiPopup(null)
      // Focus back on the editor and select the @ai line
      if (editorRef.current) {
        const lines = currentNote.split('\n')
        const charStart = lines.slice(0, aiPopup.lineIndex).join('\n').length + (aiPopup.lineIndex > 0 ? 1 : 0)
        const lineLength = lines[aiPopup.lineIndex]?.length || 0

        editorRef.current.focus()
        editorRef.current.setSelectionRange(charStart, charStart + lineLength)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [aiPopup])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        notes={notes} 
        onDeleteNote={handleDeleteNote}
        onLoadNote={handleLoadNote}
      />
      <div className="flex-1 flex flex-col relative">
        <Editor
          ref={editorRef}
          value={currentNote}
          onChange={setCurrentNote}
          onKeyUp={handleEditorKeyUp}
          onSave={handleSaveNote}
        />
        {aiPopup && (
          <AIPopup
            popup={aiPopup}
            onClose={() => setAiPopup(null)}
            editorRef={editorRef}
            currentNote={currentNote}
          />
        )}
      </div>
    </div>
  )
}

export default App 