import { NoteContent, NoteInfo } from '@shared/models'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

const getNotes = async () => {
  const notes = await window.context.getNotes()

  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

const notes = atom<NoteInfo[] | Promise<NoteInfo[]>>(getNotes())

export const notesAtom = unwrap(notes, (notes) => notes)

export const selectedNoteIndexAtom = atom<number | null>(null)

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const index = get(selectedNoteIndexAtom)
  if (index === null || !notes) return null
  const note = notes[index]
  const content = await window.context.readNote(note.title)
  return {
    ...note,
    content
  }
})

export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  (note) =>
    note ?? {
      title: '',
      content: '',
      lastEditTime: new Date().getTime()
    }
)

export const newNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)
  if (!notes) return
  const title = await window.context.createNote()
  if (!title) return
  const newNote: NoteInfo = {
    title,
    lastEditTime: new Date().getTime()
  }
  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])
  set(selectedNoteIndexAtom, 0)
})

export const deleteNoteAtom = atom(null, async (get, set) => {
  const index = get(selectedNoteIndexAtom)
  if (index === null) return
  const notes = get(notesAtom)
  if (!notes) return
  const deleted = await window.context.deleteNote(notes[index].title)
  if (!deleted) return
  set(notesAtom, [...notes.filter((_, i) => i !== index)])
  set(selectedNoteIndexAtom, null)
})

export const saveNoteAtom = atom(null, async (get, set, content: NoteContent) => {
  const selectedNote = get(selectedNoteAtom)
  if (!selectedNote) return
  const notes = get(notesAtom)
  if (!notes) return
  await window.context.writeNote(selectedNote.title, content)
  set(notesAtom, [
    ...notes.map((note) => {
      if (note.title === selectedNote.title) {
        return {
          ...note,
          lastEditTime: new Date().getTime()
          // content: selectedNote.content
        }
      }
      return note
    })
  ])
})
