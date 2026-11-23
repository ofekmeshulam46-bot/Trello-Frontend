import { Link } from "react-router-dom"
import { TaskDetails } from "../pages/TaskDetails"

export function TaskPreview({ task, labels = [] ,boardId} ) {

    const taskLabels = labels.filter(label => task.labelIds?.includes(label.id))
    const checklistItems = (task.checklists || []).flatMap(checklist => checklist.todos || [])
    const completedItems = checklistItems.filter(item => item.isDone).length
    const dueDate = task.dueDate ? new Date(task.dueDate) : null
    const hasValidDueDate = dueDate && !Number.isNaN(dueDate.getTime())

    return <Link className="task-details-link" to={`/board/${boardId}/task/${task.id}`}>
        <article className="task-card">
 
        {task.style?.backgroundImage && (
            <div className="task-cover" style={{ backgroundImage: `url("${task.style.backgroundImage}")` }} />
        )}
        {taskLabels.length > 0 && (
            <div className="task-labels">
                {taskLabels.map(label => (
                    <span
                        className="task-label"
                        key={label.id}
                        style={label.color ? { backgroundColor: label.color } : undefined}
                    >
                        {label.title}
                    </span>
                ))}
            </div>
        )}
        <h3>{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
        {(hasValidDueDate || task.comments?.length || checklistItems.length || task.byMember) && (
            <footer className="task-meta">
                {hasValidDueDate && <span className="task-due-date">◷ {dueDate.toLocaleDateString()}</span>}
                {task.comments?.length > 0 && <span>◉ {task.comments.length}</span>}
                {checklistItems.length > 0 && <span>☑ {completedItems}/{checklistItems.length}</span>}
                {task.byMember && (
                    <span className="task-member" title={task.byMember.fullname}>
                        {task.byMember.fullname?.charAt(0).toUpperCase() || '?'}
                    </span>
                )}
            </footer>
        )}
    </article>
     </Link>
}