import { ActionButton } from '@/components'
import { newNoteAtom } from '@/store'
import { useSetAtom } from 'jotai'
import { LuFileSignature } from 'react-icons/lu'
import type { ActionButtonProps } from './types'

export const NewNoteButton = ({ ...props }: ActionButtonProps) => {
  const createNote = useSetAtom(newNoteAtom)

  const handleCreate = async () => {
    await createNote()
  }

  return (
    <ActionButton onClick={handleCreate} {...props}>
      <LuFileSignature className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
    </ActionButton>
  )
}
