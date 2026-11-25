import { useEffect, useState } from "react"

export function TaskDescriptionEditor({ description, onSave, onCancel }) {
    const [text, setText] = useState(description || '')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        setText(description || '')
    }, [description])

    async function onSubmit(ev) {
        ev.preventDefault()

        setIsSaving(true)
        try {
            await onSave(text)
        } finally {
            setIsSaving(false)
        }
    }

    function onCancelEdit() {
        setText(description || '')
        onCancel()
    }

    return <form className="task-description-editor" onSubmit={onSubmit}>
        <div className="task-description-editor-frame">
            
            <textarea
                aria-label="Task description"
                value={text}
                onChange={ev => setText(ev.target.value)}
                placeholder="😄 Say it with an emoji, just type ':' "
            />
        </div>
        <div className="task-description-editor-actions">
            <div className="task-description-editor-actions-main">
                <button className="task-description-save" type="submit" disabled={isSaving}>Save</button>
                <button className="task-description-cancel" type="button" disabled={isSaving} onClick={onCancelEdit}>Cancel</button>
            </div>
            
        </div>
    </form>
}
