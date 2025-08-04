import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Trash2 } from "lucide-react"

interface SidebarProps {
  notes: string[]
  onDeleteNote: (index: number) => void
  onLoadNote: (note: string, index: number) => void
  onNewNote: () => void
  noteIndex: number | null
}

const Sidebar = ({ notes, onDeleteNote, onLoadNote, onNewNote, noteIndex }: SidebarProps) => {
  const hasEmptyNote = notes.some(note => note.trim() === '')

  return (
    <div className="w-64 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
      <div className="flex justify-end items-center mb-4">
        <Button size="icon" variant="outline" className="cursor-pointer" onClick={onNewNote} disabled={hasEmptyNote}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">New Note</span>
        </Button>
      </div>
      <ul className="space-y-2">
        {notes.map((note, index) => (
          <li 
            key={index} 
            className={`border border-gray-300 rounded-md p-3 cursor-pointer transition-colors ${
              noteIndex === index 
                ? 'bg-primary text-primary-foreground' // Selected note
                : 'bg-white hover:bg-gray-50' // Unselected note
            }`}
            onClick={() => onLoadNote(note, index)}
          >
            <div className="flex justify-between items-center">
              <span 
                className="flex-1 text-sm text-gray-700 cursor-pointer"
              >
                {note.split('\n')[0].slice(0, 20)}...
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More Options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onDeleteNote(index)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar 