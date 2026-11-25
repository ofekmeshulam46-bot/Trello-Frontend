import { useState } from "react"
import { TaskDescriptionEditor } from "./TaskDescriptionEditor.jsx"
import { ChevronDownIcon, ChevronRightIcon, DescriptionIcon } from "../../assets/icons/task-icons.jsx"

export function TaskDescription({ savedDescription = '', onSaveDescription }) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    async function onSave(text) {
        const saved = await onSaveDescription(text)
        if (saved) setIsEditing(false)
        return saved
    }

    function onCancel() {
        setIsEditing(false)
    }

    return <section className="task-description-section">
        <h2 className="task-description-heading">
            <button
                className="task-description-toggle"
                type="button"
                aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
                aria-expanded={isExpanded}
                onClick={() => setIsExpanded(expanded => !expanded)}
            >
                {isExpanded ? (
                    <>
                        <span className="task-description-toggle-default">{DescriptionIcon}</span>
                        <span className="task-description-toggle-hover">{ChevronDownIcon}</span>
                    </>
                ) : ChevronRightIcon}
            </button>
            Description
        </h2>
        <div className="task-description-content" hidden={!isExpanded}>
            {isEditing ? (
                <TaskDescriptionEditor
                    description={savedDescription}
                    onSave={onSave}
                    onCancel={onCancel}
                />
            ) : (
                <button
                    className={`task-description-display${savedDescription ? '' : ' is-empty'}`}
                    type="button"
                    aria-label="Edit description"
                    onClick={() => setIsEditing(true)}
                >
                    {savedDescription || 'Add a more detailed description...'}
                </button>
            )}
        </div>
    </section>
}
