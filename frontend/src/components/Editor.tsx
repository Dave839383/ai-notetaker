import { forwardRef } from 'react'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  onKeyUp: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onSave: () => void
}

const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(({ value, onChange, onKeyUp, onSave }, ref) => {
  return (
    <div className="flex-1 flex flex-col">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={onKeyUp}
        placeholder="Write your notes here... Use '@ai' and press Enter to ask a question."
        className="flex-1 w-full p-8 text-lg leading-relaxed border-none resize-none font-mono bg-gray-50 outline-none overflow-y-auto"
      />
      <button
        onClick={onSave}
        className="p-4 text-base border-t border-gray-300 bg-blue-100 hover:bg-gray-200 transition-colors"
      >
        Save Note
      </button>
    </div>
  )
})

Editor.displayName = 'Editor'

export default Editor 