interface SidebarProps {
  notes: string[]
  onDeleteNote: (index: number) => void
  onLoadNote: (note: string) => void
}

const Sidebar = ({ notes, onDeleteNote, onLoadNote }: SidebarProps) => {
  return (
    <div className="w-64 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">My Notes</h2>
      <ul className="space-y-2">
        {notes.map((note, index) => (
          <li key={index} className="bg-white border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
              <span 
                className="flex-1 text-sm text-gray-700 cursor-pointer"
                onClick={() => onLoadNote(note)}
              >
                {note.split('\n')[0].slice(0, 30)}...
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteNote(index)
                }}
                className="ml-2 bg-red-500 text-white border-none rounded px-2 py-1 text-xs cursor-pointer hover:bg-red-600 transition-colors"
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar 