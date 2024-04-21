import { NoteInfo } from '@shared/models'
import { ComponentProps } from 'react'

export type NotePreviewProps = NoteInfo & {
  isActive?: boolean
} & ComponentProps<'div'>

export type NotePreviewListProps = ComponentProps<'ul'> & {
  onSelect?: () => void
}
