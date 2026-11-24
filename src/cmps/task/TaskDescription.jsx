import { useState } from "react"
import { TaskDescriptionEditor } from "./TaskDescriptionEditor.jsx"

export function TaskDescription({ savedDescription = '', onSaveDescription }) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [view, setView] = useState('open')

    async function onSave(text) {
        const saved = await onSaveDescription(text)
        if (saved) setView('open')
        return saved
    }

    function onCancel() {
        setView('open')
    }

    return <section className="task-details-section">
        <h2 className="task-description-heading">
            <button
                className="task-description-toggle"
                type="button"
                aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
                aria-expanded={isExpanded}
                onClick={() => setIsExpanded(expanded => !expanded)}
            >
                {isExpanded ? (
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M3 6h18M3 12h18M3 18h18" />
                    </svg>
                ) : (
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                )}
            </button>
            Description
        </h2>
        <div className="task-description-content" hidden={!isExpanded}>
            {view === 'editing' ? (
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
                    onClick={() => setView('editing')}
                >
                    {savedDescription || 'Add a more detailed description...'}
                </button>
            )}
        </div>
    </section>
}
