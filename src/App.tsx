import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import { Navigate, Route, Routes } from 'react-router-dom'
import { NewNote } from './components/NewNote'
import { useLocalStorage } from './components/useLocalStorage'
import { useMemo } from 'react'
import { v4 as uuidV4} from 'uuid'
import { NoteLIst } from './components/NoteLIst'
import { NoteLayout } from './components/NoteLayout'
import { Note } from './components/Note'
import { EditNote } from './components/EditNote'

export type Note = { 
  id: string
 } & NoteData

export type NoteData = {
    title: string
    markdown: string
    tags: Tag[]
  }

  export type RawNote ={
    id: string
  } & RawNoteData

  export type RawNoteData = {
    title: string
    markdown: string
    tagIds: string[]
  }

 export type Tag = {
    id: string
    label: string
  }


function App() {

  const [ notes, setNotes ] = useLocalStorage<RawNote[]>('NOTES', [])
  const [ tags, setTags ] = useLocalStorage<Tag[]>('TAGS', [])

   const notesWitchTags = useMemo(() => {
    return notes.map(note => {
      return {...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
    })
   },[notes, tags])

   const onCreateNote = ({tags, ...data}: NoteData ) => {
    setNotes(prevNotes => {
      return [...prevNotes, {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}]
    })
   }

   const addTag = (tag: Tag) => {
    setTags(prev => [...prev, tag])
   }

   const onUpdateNote = (id: string, {tags, ...data}: NoteData) => {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if ( note.id === id) {
          return {...note,...data, tagIds: tags.map(tag => tag.id)}
        } else return note
      })
    })
   }

   const onDeleteNote = (id: string) => {
    setNotes(prev => {
      return prev.filter(item => item.id !== id)
    })
   }

   const updateTag = (id: string, label: string) => {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if ( tag.id === id) {
          return {...tag, label }
        } else return tag
      })
    })
   }

   const deleteTag = (id: string) => {
    setTags(prev => {
      return prev.filter(item => item.id !== id)
    })
   }

  return (
    <>
    <Container className='my-5' >
      <Routes>
        <Route 
        path='/' 
        element={
          <NoteLIst 
          notes={notesWitchTags}  
          availableTags={tags} 
          onUpdateTag={updateTag} 
          onDeleteTag={deleteTag} />} />

        <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />} />
        <Route path='/:id' element={<NoteLayout notes={notesWitchTags} />} >
          <Route index element={<Note onDeleteNote={onDeleteNote} />} />
          <Route path='edit' element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags}/>} />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
      </Container>
    </>
  )
}

export default App
