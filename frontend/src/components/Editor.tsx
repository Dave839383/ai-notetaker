import { forwardRef } from 'react'
import { Button } from './ui/button'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  onKeyUp: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onSave: () => void
  currentNoteIndex: number | null
}

// forwardRef is used to pass the ref to the textarea element
// it wraps the function
const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(({ value, onChange, onKeyUp, onSave, currentNoteIndex }, ref) => {
  return (
    // flex-1 is used to make the textarea take up all available space
    // flex-col is used to make the textarea and button stack vertically
    <div className="flex-1 flex flex-col">
      <textarea
        key={currentNoteIndex}
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={onKeyUp}
        placeholder="Write your notes here... Use '@ai' and press Enter to ask a question."
        className="flex-1 w-full p-8 text-lg leading-relaxed border-none resize-none font-mono bg-gray-50 outline-none overflow-y-auto"
      />
      <Button
        onClick={onSave}
        className="p-4 text-base bg-primary hover:bg-primary/90 transition-colors"
      >
        Save Note
      </Button>
    </div>
  )
})

Editor.displayName = 'Editor'

export default Editor 