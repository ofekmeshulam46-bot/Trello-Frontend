import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { saveTask } from "../store/actions/board.actions.js"

export function TaskDetails() {
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [comment, setComment] = useState('')
    const [saveError, setSaveError] = useState('')

    const navigate = useNavigate()
    const { boardId, taskId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)
    const loggedInUser = useSelector(storeState => storeState.userModule.user)

    const group = board?.groups.find(group =>
        group.tasks.some(task => task.id === taskId)
    )
    const task = group?.tasks.find(task => task.id === taskId)
    const labels = board?.labels || []
    const members = board?.members || []
    const activities = (board?.activities || []).filter(activity => activity.task?.id === taskId)
    const taskLabels = labels.filter(label => task?.labelIds?.includes(label.id))
    const taskMembers = members.filter(member => task?.memberIds?.includes(member._id))
    const checklists = task?.checklists || []
    const checklistItems = checklists.flatMap(checklist => checklist.todos || [])
    const completedItems = checklistItems.filter(item => item.isDone).length
    const comments = task?.comments || []

    useEffect(() => {
        setDescription(task?.description || '')
        setTitle(task?.title || '')
        setDueDate(task?.dueDate || '')
    }, [task?.description, task?.title, task?.dueDate])

    useEffect(() => {
        function onKeyDown(ev) {
            if (ev.key === 'Escape') navigate(`/board/${boardId}`)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [boardId, navigate])

    function onClose() {
        navigate(`/board/${boardId}`)
    }

    async function onSaveField(field, value) {
        if (!task || !group) return false
        setSaveError('')
        try {
            await saveTask(boardId, group.id, { ...task, [field]: value })
            return true
        } catch (err) {
            console.error('Unable to save task details', err)
            setSaveError('Unable to save your changes. Please try again.')
            return false
        }
    }

    function onToggleItem(field, itemId) {
        const currentIds = task?.[field] || []
        const updatedIds = currentIds.includes(itemId)
            ? currentIds.filter(id => id !== itemId)
            : [...currentIds, itemId]
        onSaveField(field, updatedIds)
    }

    async function onAddComment(ev) {
        ev.preventDefault()
        const text = comment.trim()
        if (!text) return
        const newComment = {
            id: `comment-${Date.now()}`,
            title: text,
            createdAt: Date.now(),
            byMember: loggedInUser ? {
                _id: loggedInUser._id,
                fullname: loggedInUser.fullname,
                imgUrl: loggedInUser.imgUrl,
            } : { fullname: 'You' },
        }
        if (await onSaveField('comments', [...comments, newComment])) setComment('')
    }

    function formatDate(date) {
        if (!date) return ''
        const parsedDate = new Date(date)
        return Number.isNaN(parsedDate.getTime())
            ? ''
            : parsedDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    }

    if (!task) return null

    return <div
        className="modal-overlay"
        onMouseDown={ev => {
            if (ev.target === ev.currentTarget) onClose()
        }}
    >
        <section className="task-details-modal" role="dialog" aria-modal="true" aria-label="Task details">
            <header
                className={`task-details-cover${task.style?.backgroundImage ? ' has-image' : ''}`}
                style={{
                    backgroundColor: task.style?.backgroundColor || '#b6a99a',
                    backgroundImage: task.style?.backgroundImage
                        ? `url("${task.style.backgroundImage}")`
                        : undefined,
                }}
            >
                <span className="task-details-status">{group?.title}</span>
                <div className="task-details-header-actions">
                    <button type="button" aria-label="More task actions">•••</button>
                    <button type="button" aria-label="Close task details" onClick={onClose}>×</button>
                </div>
            </header>

            <div className="task-details-columns">
                <main className="task-details-main">
                    <div className="task-details-title-row">
                        <span className="task-details-complete" aria-hidden="true" />
                        <input
                            className="task-details-title"
                            aria-label="Task title"
                            type="text"
                            value={title}
                            onChange={ev => setTitle(ev.target.value)}
                            onBlur={() => {
                                if (title !== task.title) onSaveField('title', title)
                            }}
                            onKeyDown={ev => {
                                if (ev.key === 'Enter') ev.currentTarget.blur()
                            }}
                        />
                    </div>

                    <div className="task-details-attributes">
                        <div className="task-detail-field">
                            <span className="task-detail-label">Members</span>
                            <div className="task-detail-options">
                                {taskMembers.map(member => (
                                    <button
                                        className="task-member-avatar"
                                        key={member._id}
                                        type="button"
                                        title={`Remove ${member.fullname}`}
                                        onClick={() => onToggleItem('memberIds', member._id)}
                                    >
                                        {member.fullname?.charAt(0).toUpperCase() || '?'}
                                    </button>
                                ))}
                                {members.filter(member => !task?.memberIds?.includes(member._id)).map(member => (
                                    <button
                                        className="task-add-option"
                                        key={member._id}
                                        type="button"
                                        aria-label={`Add ${member.fullname}`}
                                        onClick={() => onToggleItem('memberIds', member._id)}
                                    >+</button>
                                ))}
                            </div>
                        </div>
                        <div className="task-detail-field">
                            <span className="task-detail-label">Labels</span>
                            <div className="task-detail-options">
                                {taskLabels.map(label => (
                                    <button
                                        className="task-label-chip"
                                        key={label.id}
                                        type="button"
                                        title={`Remove ${label.title}`}
                                        style={label.color ? { backgroundColor: label.color } : undefined}
                                        onClick={() => onToggleItem('labelIds', label.id)}
                                    >{label.title}</button>
                                ))}
                                {labels.filter(label => !task?.labelIds?.includes(label.id)).length > 0 && (
                                    <details className="task-label-picker">
                                        <summary className="task-add-option" aria-label="Add label">+</summary>
                                        <div className="task-label-menu">
                                            {labels.filter(label => !task?.labelIds?.includes(label.id)).map(label => (
                                                <button
                                                    type="button"
                                                    key={label.id}
                                                    onClick={() => onToggleItem('labelIds', label.id)}
                                                >{label.title}</button>
                                            ))}
                                        </div>
                                    </details>
                                )}
                            </div>
                        </div>
                        <div className="task-detail-field">
                            <label className="task-detail-label" htmlFor="task-due-date">Due date</label>
                            <input
                                id="task-due-date"
                                className="task-due-date-input"
                                type="date"
                                value={dueDate}
                                onChange={ev => {
                                    setDueDate(ev.target.value)
                                    onSaveField('dueDate', ev.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <section className="task-details-section">
                        <h2><span aria-hidden="true">☰</span>Description</h2>
                        <textarea
                            value={description}
                            onChange={ev => setDescription(ev.target.value)}
                            placeholder="Add a more detailed description..."
                            onBlur={() => {
                                if (description !== task.description) onSaveField('description', description)
                            }}
                        />
                    </section>

                    {checklists.map(checklist => (
                        <section className="task-details-section" key={checklist.id}>
                            <h2><span aria-hidden="true">☑</span>{checklist.title}</h2>
                            <div className="task-checklist-progress">
                                {checklist.todos?.filter(item => item.isDone).length || 0}/
                                {checklist.todos?.length || 0} completed
                            </div>
                            {(checklist.todos || []).map(item => (
                                <label className="task-checklist-item" key={item.id}>
                                    <input type="checkbox" checked={item.isDone} readOnly />
                                    {item.title}
                                </label>
                            ))}
                        </section>
                    ))}
                    {checklistItems.length > 0 && (
                        <div className="task-checklist-total">{completedItems} of {checklistItems.length} checklist items complete</div>
                    )}
                </main>

                <aside className="task-details-activity">
                    <div className="task-activity-heading">
                        <h2><span aria-hidden="true">▤</span>Comments and activity</h2>
                    </div>
                    <form className="task-comment-form" onSubmit={onAddComment}>
                        <textarea
                            aria-label="Write a comment"
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={ev => setComment(ev.target.value)}
                            rows="1"
                        />
                        {comment.trim() && <button type="submit">Save</button>}
                    </form>

                    <div className="task-activity-list">
                        {comments.map(item => (
                            <article className="task-activity-entry" key={item.id}>
                                <span className="task-activity-avatar">
                                    {item.byMember?.fullname?.charAt(0).toUpperCase() || '?'}
                                </span>
                                <div>
                                    <p><strong>{item.byMember?.fullname || 'A member'}</strong> {item.title}</p>
                                    <time>{formatDate(item.createdAt)}</time>
                                </div>
                            </article>
                        ))}
                        {activities.map(item => (
                            <article className="task-activity-entry" key={item.id}>
                                <span className="task-activity-avatar">
                                    {item.byMember?.fullname?.charAt(0).toUpperCase() || '?'}
                                </span>
                                <div>
                                    <p><strong>{item.byMember?.fullname || 'A member'}</strong> {item.title}</p>
                                    <time>{formatDate(item.createdAt)}</time>
                                </div>
                            </article>
                        ))}
                        {!comments.length && !activities.length && (
                            <p className="task-activity-empty">Activity and comments will appear here.</p>
                        )}
                    </div>
                    {saveError && <p className="task-save-error" role="alert">{saveError}</p>}
                </aside>
            </div>
        </section>
    </div>
}
