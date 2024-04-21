import { appName, fileEncoding, welcomeNoteFilename } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import type { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readdir, readFile, remove, stat, writeFile } from 'fs-extra'
import { isEmpty } from 'lodash'
import { homedir } from 'os'
import path from 'path'
import welcomeNote from '../../../resources/welcomeNote.md?asset'

const getNoteMarkDir = () => {
  return path.join(homedir(), appName)
}

const getNote = async (notePath: string): Promise<NoteInfo> => {
  const note = await stat(`${getNoteMarkDir()}/${notePath}`)

  return {
    title: notePath.replace(/\.md$/, ''),
    lastEditTime: note.mtimeMs
  }
}

export const getNotes: GetNotes = async () => {
  const noteMarkDir = getNoteMarkDir()

  await ensureDir(noteMarkDir)

  const files = await readdir(noteMarkDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = files.filter((file) => file.endsWith('.md'))

  if (isEmpty(notes)) {
    const content = await readFile(welcomeNote, {
      encoding: fileEncoding
    })
    await writeFile(`${noteMarkDir}/${welcomeNoteFilename}`, content, {
      encoding: fileEncoding
    })

    notes.push(welcomeNoteFilename)
  }

  return Promise.all(notes.map(getNote))
}

export const readNote: ReadNote = async (notePath: string) => {
  return await readFile(`${getNoteMarkDir()}/${notePath}.md`, {
    encoding: fileEncoding
  })
}

export const writeNote: WriteNote = async (notePath: string, content: string) => {
  return await writeFile(`${getNoteMarkDir()}/${notePath}.md`, content, {
    encoding: fileEncoding
  })
}

export const createNote: CreateNote = async () => {
  const noteMarkDir = getNoteMarkDir()

  await ensureDir(noteMarkDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'Create Note',
    defaultPath: `${noteMarkDir}/Untitled.md`,
    filters: [{ name: 'Markdown', extensions: ['md'] }],
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false
  })

  if (canceled || !filePath) {
    return false
  }

  const { name, dir } = path.parse(filePath)

  if (dir !== noteMarkDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Create failed',
      message: `All notes must be created in the "${noteMarkDir}" directory.
      Avoid using other directories.`
    })
    return false
  }

  await writeFile(filePath, '')

  return name
}

export const deleteNote: DeleteNote = async (notePath: string) => {
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete Note',
    message: `Are you sure you want to delete "${notePath}"?`,
    buttons: ['Delete', 'Cancel'],
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    return false
  }

  const noteMarkDir = getNoteMarkDir()
  const filePath = path.join(noteMarkDir, `${notePath}.md`)

  await remove(filePath)

  return true
}
