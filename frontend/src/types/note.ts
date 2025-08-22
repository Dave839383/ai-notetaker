export interface Note {
  id: string
  text: string
}

export interface CreateNoteRequest {
  text: string
}

export interface UpdateNoteRequest {
  text: string
}

export interface NoteResponse {
  id: string
  text: string
  status: string
}
