import { NoteData, Tag } from "../App"
import { NoteForm } from "./NoteForm"

type NewNoteProps = {
    onSubmit: (data:NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

export const NewNote = ({onSubmit, onAddTag, availableTags}:NewNoteProps ) => {
    return <>
        <h1 className="mb-3" >NewNote</h1>
        <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags} />
    </>
}