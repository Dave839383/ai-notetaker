import { useState, useRef, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Editor from './components/Editor'
import AIPopup from './components/AIPopup'
import axios from 'axios'
import { API_CONFIG } from './config/api'

interface AIPopupData {
  lineIndex: number
  question: string
  response: string
}

interface Note {
  id: string
  text: string
}

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note>({ id: '', text: '' })
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null) // Track which note is open
  const [aiPopup, setAiPopup] = useState<AIPopupData | null>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const mockAIResponse = async (question: string): Promise<string> => {
    try {
      const response = await axios.post(`${API_CONFIG.baseURL}/question`, {
        question: question
      })
      return `🤖 AI: ${response.data.answer}`
    } catch (error) {
      console.error('Error asking AI:', error)
      return `🤖 AI: Sorry, I couldn't process your question.`
    }
  }

  const createNoteResponse = async (note: string): Promise<string> => {
    try {
      const response = await axios.post(`${API_CONFIG.baseURL}/note`, {
        text: note
      })
      
      // Check if response was successful
      if (response.status >= 200 && response.status < 300) {
        return response.data.id
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error creating note:', error)
      throw error // Re-throw to let caller handle it
    }
  }

  const cleanupEmptyNotes = () => {
    setNotes(prev => prev.filter(note => note.text.trim() !== ''))
  }

  const handleSaveNote = async (): Promise<void> => {
    console.log("handleSaveNote ", currentNoteIndex)
    const text = currentNote.text.trim()
    
    if (currentNote.id !== '') {
      // Update existing note
      if (text === '') {
        // Remove the note if it's empty
        setNotes(prev => prev.filter((_, index) => index !== currentNoteIndex))
      } else {
        // Update the note with new text
        setNotes(prev => prev.map((note, index) => 
          index === currentNoteIndex ? { ...note, text } : note
        ))
      }
    } else {
      // Create new note (only if it has content)
      if (text !== '') {
        try {
          const noteId = await createNoteResponse(text)
          
          // Check if the response was successful
          if (noteId && noteId !== 'Error creating note') {
            setNotes(prev => [{ id: noteId, text }, ...prev])
          } else {
            console.error('Failed to create note:', noteId)
            // Optionally show error to user
          }
        } catch (error) {
          console.error('Error creating note:', error)
          // Optionally show error to user
        }
      }
    }
    
    cleanupEmptyNotes() // Remove any empty notes
    setCurrentNote({ id: '', text: '' })
    setCurrentNoteIndex(null)
    setAiPopup(null)
  }

  const handleDeleteNote = (index: number): void => {
    console.log('handleDeleteNote ', index)
    console.log('notes length ', notes.length)
    const remainingNotes = notes.filter((_, i) => i !== index)
    setNotes(remainingNotes)
    if (remainingNotes.length < 1) {
      setCurrentNote({ id: '', text: '' })
      setCurrentNoteIndex(null)
    } else {
      console.log('notes length ', notes.length)
      console.log('handleDeleteNote ', remainingNotes[0])
      setCurrentNote(remainingNotes[0])
      setCurrentNoteIndex(0)
    }
    setAiPopup(null)
  }

  const handleLoadNote = (note: Note, index: number): void => {
    console.log('handleLoadNote ', note, index)
    setCurrentNote(note)
    setCurrentNoteIndex(index) // Track which note is being edited
    setAiPopup(null)
  }

  const handleNewNote = (): void => {
    setCurrentNote({ id: '', text: '' })
    setCurrentNoteIndex(0)
    setAiPopup(null)
    setNotes(prev => [{ id: 'new', text: '' }, ...prev])
  }

  const handleEditorKeyUp = async (e: React.KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
    if (e.key === 'Enter') {
      const lines = currentNote.text.split('\n')
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
            response: await mockAIResponse(question)
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
        const lines = currentNote.text.split('\n')
        const charStart = lines.slice(0, aiPopup.lineIndex).join('\n').length + (aiPopup.lineIndex > 0 ? 1 : 0)
        const lineLength = lines[aiPopup.lineIndex]?.length || 0

        editorRef.current.focus()
        editorRef.current.setSelectionRange(charStart, charStart + lineLength)
      }
    }
  }

  useEffect(() => {
    // only add the event listener on mount, not on every re-render
    // useEffect only runs when the dependencies change, so empty array means run only once
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        console.log('Clicked outside editor')
        if (currentNote.text.trim()) {
          console.log('handleClickOutside ', currentNote)
        }
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [currentNote])

  useEffect(() => {
    console.log('currentNote changed to:', currentNote)
  }, [currentNote])
  
  useEffect(() => {
    console.log('notes changed to:', notes)
  }, [notes])
  // Use nested grids when the layout is hierarchical (e.g., header on top, then columns inside).
  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <Header  />
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] overflow-hidden">
        <Sidebar 
          notes={notes} 
          currentNote={currentNote}
          onDeleteNote={handleDeleteNote}
          onLoadNote={handleLoadNote}
          onNewNote={handleNewNote}
          noteIndex={currentNoteIndex}
        />
        <div className="flex-1 flex flex-col relative">
          <Editor
            ref={editorRef}
            value={currentNote.text}
            onChange={(text) => setCurrentNote(prev => ({ ...prev, text }))}  // ✅ Update text while preserving ID
            onKeyUp={handleEditorKeyUp}
            onSave={handleSaveNote}  // ✅ This is fine
            currentNoteIndex={currentNoteIndex}  // ✅ Add this
          />
          {aiPopup && (
            <AIPopup
              popup={aiPopup}
              onClose={() => setAiPopup(null)}
              editorRef={editorRef}
              currentNote={currentNote.text}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App