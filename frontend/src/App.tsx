import { useState, useRef, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
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
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null) // Track which note is open
  const [aiPopup, setAiPopup] = useState<AIPopupData | null>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const mockAIResponse = (question: string): string => {
    return `🤖 AI: This is a fake answer to '${question}'`
  }

  const cleanupEmptyNotes = () => {
    setNotes(prev => prev.filter(note => note.trim() !== ''))
  }

  const handleSaveNote = (): void => {
    const text = currentNote.trim()
    
    if (currentNoteIndex !== null) {
      // Update existing note
      if (text === '') {
        // Remove the note if it's empty
        setNotes(prev => prev.filter((_, index) => index !== currentNoteIndex))
      } else {
        // Update the note with new text
        setNotes(prev => prev.map((note, index) => 
          index === currentNoteIndex ? text : note
        ))
      }
    } else {
      // Create new note (only if it has content)
      if (text !== '') {
        setNotes(prev => [text, ...prev])
      }
    }
    
    cleanupEmptyNotes() // Remove any empty notes
    setCurrentNote('')
    setCurrentNoteIndex(null)
    setAiPopup(null)
  }

  const handleDeleteNote = (index: number): void => {
    setNotes(prev => prev.filter((_, i) => i !== index))
    setCurrentNote('')
    setAiPopup(null)
  }

  const handleLoadNote = (note: string, index: number): void => {
    setCurrentNote(note)
    setCurrentNoteIndex(index) // Track which note is being edited
    setAiPopup(null)
  }

  const handleNewNote = (): void => {
    setCurrentNote('')
    setCurrentNoteIndex(0)
    setAiPopup(null)
    setNotes(prev => ['', ...prev])
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

  // Use nested grids when the layout is hierarchical (e.g., header on top, then columns inside).
  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <Header  />
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] overflow-hidden">
        <Sidebar 
          notes={notes} 
          onDeleteNote={handleDeleteNote}
          onLoadNote={handleLoadNote}
          onNewNote={handleNewNote}
          noteIndex={currentNoteIndex}
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
    </div>
  )
}

export default App 