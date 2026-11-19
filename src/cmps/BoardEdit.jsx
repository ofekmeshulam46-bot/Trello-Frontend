import { useState } from 'react'

export function BoardEdit({ boardToEdit, onSaveBoard, onCancelEdit }) {
    const [boardName, setBoardName] = useState(boardToEdit.name)

    function handleChange(ev) {
        setBoardName(ev.target.value)
    }

    function onSubmit(ev) {
        ev.preventDefault()
        const name = boardName.trim()
        if (!name) return
        onSaveBoard({ ...boardToEdit, name })
    }

    return (
        <div className="board-edit-modal" role="presentation">
            <form className="board-edit-form" onSubmit={onSubmit}>
                <h2>{boardToEdit._id ? 'Edit board' : 'Create board'}</h2>
                <label htmlFor="board-name">Board name</label>
                <input
                    id="board-name"
                    name="name"
                    value={boardName}
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
