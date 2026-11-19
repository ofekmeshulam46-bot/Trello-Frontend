import { useState } from 'react'

export function BoardEdit({ boardToEdit, onSaveBoard, onCancelEdit }) {
    const [boardTitle, setBoardTitle] = useState(boardToEdit.title)

    function handleChange(ev) {
        setBoardTitle(ev.target.value)
    }

    function onSubmit(ev) {
        ev.preventDefault()
        const title = boardTitle.trim()
        if (!title) return
        onSaveBoard({ ...boardToEdit, title })
    }

    return (
        <div className="board-edit-modal" role="presentation">
            <form className="board-edit-form" onSubmit={onSubmit}>
                <h2>{boardToEdit._id ? 'Edit board' : 'Create board'}</h2>
                <label htmlFor="board-title">Board name</label>
                <input
                    id="board-title"
                    name="title"
                    value={boardTitle}
                    onChange={handleChange}
                    autoFocus
                    required
                />
                <div className="actions">
                    <button className="btn-clear" type="button" onClick={onCancelEdit}>Cancel</button>
                    <button className="btn-primary" type="submit">Save</button>
                </div>
            </form>
        </div>
    )
}
