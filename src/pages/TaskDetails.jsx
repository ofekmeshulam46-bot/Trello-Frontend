import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { saveBoard, saveTask, addActivity } from "../store/actions/board.actions.js"
import { makeId } from "../services/util.service.js"
import { TaskDescription } from "../cmps/task/TaskDescription.jsx"
import { TaskDates } from "../cmps/task/TaskDates.jsx"
import { TaskLabels } from "../cmps/task/TaskLabels.jsx"
import { TaskMembers } from "../cmps/task/TaskMembers.jsx"

export function TaskDetails() {
    const [title, setTitle] = useState('')
    const [comment, setComment] = useState('')
    const [saveError, setSaveError] = useState('')

    const [areDetailsVisible, setAreDetailsVisible] = useState(true)

    const navigate = useNavigate()
    const { boardId, taskId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)
    const loggedInUser = useSelector(storeState => storeState.userModule.user)

    const group = board?.groups.find(group =>
        group.tasks.some(task => task.id === taskId)
    )
    const task = group?.tasks.find(task => task.id === taskId)

    const activities = (board?.activities || []).filter(activity => activity.task?.id === taskId)

    const comments = task?.comments || []

    useEffect(() => {
        setTitle(task?.title || '')
    }, [task?.title])

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
            await saveTask(boardId, group.id, task.id, { [field]: value })
            return true
        } catch (err) {
            console.error('Unable to save task details', err)
            setSaveError('Unable to save your changes. Please try again.')
            return false
        }
    }

    async function onCreateLabel(labelData) {
        if (!board || !task || !group) return false
        const label = { ...labelData, id: makeId() }
        const updatedBoard = {
            ...board,
            labels: [...(board.labels || []), label],
            groups: board.groups.map(boardGroup => boardGroup.id !== group.id
                ? boardGroup
                : {
                    ...boardGroup,
                    tasks: boardGroup.tasks.map(boardTask => boardTask.id !== task.id
                        ? boardTask
                        : {
                            ...boardTask,
                            labelIds: [...(boardTask.labelIds || []), label.id],
                        })
                })
        }

        setSaveError('')
        try {
            await saveBoard(updatedBoard)
            return true
        } catch (err) {
            console.error('Unable to create task label', err)
            setSaveError('Unable to create label. Please try again.')
            return false
        }
    }

    async function onAddComment(ev) {
        ev.preventDefault()
        const text = comment.trim()
        if (!text) return
        const activity = {
            id: makeId(),
            txt: text,
            createdAt: Date.now(),
            byMember: loggedInUser,
            group: { id: group.id, title: group.title },
            task: { id: task.id, title: task.title }
        }

        try {
            await addActivity(boardId, activity)
            setComment('')
            setSaveError('')
        } catch (err) {
            console.error('Unable to add task comment', err)
            setSaveError('Unable to post your comment. Please try again.')
        }
    }

    const activityItems = [
        ...comments.map(item => ({ ...item, txt: item.title })),
        ...activities
    ].sort((a, b) => b.createdAt - a.createdAt)

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

            <div className={`task-details-columns${areDetailsVisible ? '' : ' details-hidden'}`}>
                {areDetailsVisible && <main className="task-details-main">
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
                        <TaskMembers
                            members={board?.members || []}
                            memberIds={task?.memberIds || []}
                            onChange={memberIds => onSaveField('memberIds', memberIds)}
                        />
                        <TaskLabels
                            labels={board?.labels || []}
                            labelIds={task?.labelIds || []}
                            onChange={labelIds => onSaveField('labelIds', labelIds)}
                            onCreateLabel={onCreateLabel}
                        />
                        <TaskDates
                            dueDate={task?.dueDate || ''}
                            onChange={dueDate => onSaveField('dueDate', dueDate)}
                        />
                    </div>

                    <TaskDescription
                        savedDescription={task?.description || ''}
                        onSaveDescription={value => onSaveField('description', value)}
                    />

                </main>}

                <aside className="task-details-activity">
                    <div className="task-activity-heading">
                        <h2><span aria-hidden="true">▤</span>Comments and activity</h2>
                        <button type="button" onClick={() => setAreDetailsVisible(visible => !visible)}>
                            {areDetailsVisible ? 'Hide details' : 'Show details'}
                        </button>
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
                        {activityItems.map(item => (
                            <article className="task-activity-entry" key={item.id}>
                                <span className="task-activity-avatar">
                                    {item.byMember?.fullname?.charAt(0).toUpperCase() || '?'}
                                </span>
                                <div>
                                    <p>
                                        <strong>{item.byMember?.fullname || 'A member'}</strong> {item.txt}
                                    </p>
                                    <time>{formatDate(item.createdAt)}</time>
                                </div>
                            </article>
                        ))}

                        {!activityItems.length && (
                            <p className="task-activity-empty">
                                Activity and comments will appear here.
                            </p>
                        )}
                    </div>
                    {saveError && <p className="task-save-error" role="alert">{saveError}</p>}
                </aside>
            </div>
        </section>
    </div>
}
