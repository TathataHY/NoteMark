import { NotePreview } from '@/components'
import { useNotesList } from '@/hooks/useNotesList'
import { isEmpty } from 'lodash'
import { twMerge } from 'tailwind-merge'
import type { NotePreviewListProps } from './types'

export const NotePreviewList = ({ onSelect, className, ...props }: NotePreviewListProps) => {
  const { notes, selectedNoteIndex, handleSelectNote } = useNotesList({ onSelect })

  if (!notes) return null

  if (isEmpty(notes)) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
        <span>No Notes Yet!</span>
      </ul>
    )
  }

  return (
    <ul className={className} {...props}>
      {notes.map((note, index) => (
        <NotePreview
          key={note.title + note.lastEditTime}
          {...note}
          isActive={selectedNoteIndex === index}
          onClick={handleSelectNote(index)}
        />
      ))}
    </ul>
  )
}
