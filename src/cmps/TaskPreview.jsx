
import { Link } from 'react-router-dom'
import { removeTask } from '../store/actions/board.actions.js'

export function TaskPreview({ task, labels = [], boardId, groupId }) {
    const taskLabels = labels.filter(label =>
        task.labelIds?.includes(label.id)
    )

    const checklistItems = (task.checklists || [])
        .flatMap(checklist => checklist.todos || [])

    const completedItems = checklistItems
        .filter(item => item.isDone).length

    const dueDate = task.dueDate ? new Date(task.dueDate) : null
    const hasValidDueDate =
        dueDate && !Number.isNaN(dueDate.getTime())

    async function onDeleteTask(ev) {
        ev.preventDefault()
        ev.stopPropagation()

        const confirmed = window.confirm(
            `Are you sure you want to delete "${task.title}"?`
        )

        if (!confirmed) return

        try {
            await removeTask(boardId, groupId, task.id)
        } catch (err) {
            console.error('Failed to delete task:', err)
            alert('Could not delete task')
        }
    }

    return (
        <div className="task-preview-wrapper">
            <Link
                className="task-details-link"
                to={`/board/${boardId}/task/${task.id}`}
            >
                <article className="task-card">
                    {task.style?.backgroundImage && (
                        <div
                            className="task-cover"
                            style={{
                                backgroundImage:
                                    `url("${task.style.backgroundImage}")`
                            }}
                        />
                    )}

                    {taskLabels.length > 0 && (
                        <div className="task-labels">
                            {taskLabels.map(label => (
                                <span
                                    className="task-label"
                                    key={label.id}
                                    style={label.color
                                        ? { backgroundColor: label.color }
                                        : undefined}
                                >
                                    {label.title}
                                </span>
                            ))}
                        </div>
                    )}

                    <h3>{task.title}</h3>

                    {task.description && (
                        <p className="task-description">
                            {task.description}
                        </p>
                    )}

                    {(hasValidDueDate ||
                        task.comments?.length > 0 ||
                        checklistItems.length > 0 ||
                        task.byMember) && (
                        <footer className="task-meta">
                            {hasValidDueDate && (
                                <span className="task-due-date">
                                    ◷ {dueDate.toLocaleDateString()}
                                </span>
                            )}

                            {task.comments?.length > 0 && (
                                <span>◉ {task.comments.length}</span>
                            )}

                            {checklistItems.length > 0 && (
                                <span>
                                    ☑ {completedItems}/{checklistItems.length}
                                </span>
                            )}

                            {task.byMember && (
                                <span
                                    className="task-member"
                                    title={task.byMember.fullname}
                                >
                                    {task.byMember.fullname
                                        ?.charAt(0).toUpperCase() || '?'}
                                </span>
                            )}
                        </footer>
                    )}
                </article>
            </Link>

            <button
                type="button"
                className="task-delete-btn"
                onClick={onDeleteTask}
                aria-label={`Delete ${task.title}`}
                title="Delete task"
            >
                ×
            </button>
        </div>
    )
}
