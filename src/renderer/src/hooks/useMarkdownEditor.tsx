import { saveNoteAtom, selectedNoteAtom } from '@/store'
import { MDXEditorMethods } from '@mdxeditor/editor'
import { autoSavingTime } from '@shared/constants'
import { useAtomValue, useSetAtom } from 'jotai'
import { throttle } from 'lodash'
import { useRef } from 'react'

export const useMarkdownEditor = () => {
  const selectedNote = useAtomValue(selectedNoteAtom)
  const saveNote = useSetAtom(saveNoteAtom)
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleAutoSave = throttle(
    async () => {
      if (!selectedNote) return
      const content = editorRef.current?.getMarkdown() || ''
      await saveNote(content)
    },
    autoSavingTime,
    { leading: false, trailing: true }
  )

  const handleBlur = async () => {
    if (!selectedNote) return
    handleAutoSave.cancel()
    const content = editorRef.current?.getMarkdown() || ''
    await saveNote(content)
  }

  return {
    selectedNote,
    editorRef,
    handleAutoSave,
    handleBlur
  }
}
