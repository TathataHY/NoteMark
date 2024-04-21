import {
  ActionButtonsRow,
  Content,
  DraggableTopBar,
  FloatingNoteTitle,
  Layout,
  MarkdownEditor,
  NotePreviewList,
  Sidebar
} from '@/components'
import { useRef } from 'react'

const App = () => {
  const contentRef = useRef<HTMLDivElement>(null)

  const resetScrollPosition = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  return (
    <>
      <DraggableTopBar />
      <Layout>
        <Sidebar className="p-2">
          <ActionButtonsRow className="flex justify-between mt-1" />
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScrollPosition} />
        </Sidebar>
        <Content ref={contentRef} className="border-l border-l-white/20 bg-zinc-900/50">
          <FloatingNoteTitle className="pt-2" />
          <MarkdownEditor />
        </Content>
      </Layout>
    </>
  )
}

export default App
