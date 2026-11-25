import { TaskList } from "./TaskList.jsx"
import { removeGroup, addTask, updateGroup } from "../store/actions/board.actions.js"
import { useState, useRef, useEffect } from 'react'

export function GroupPreview({ group, labels = [], boardId, onGroupDragStart }) {

    const tasks = group.tasks
    const [isEditing, setIsEditing] = useState(false)
    const [editedTitle, setEditedTitle] = useState('')
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const addTaskRef = useRef(null)
    const isSavingTaskRef = useRef(false)
    const taskInputRef = useRef(null)



    useEffect(() => {
        if (!isAddingTask) return

        function handleOutsideClick(ev) {
            if (
                addTaskRef.current &&
                !addTaskRef.current.contains(ev.target)
            ) {
                onCancelAddTask()
            }
        }

        document.addEventListener('pointerdown', handleOutsideClick)

        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick)
        }
    }, [isAddingTask])



    async function onSaveGroupTitle() {
        const title = editedTitle.trim()

        setIsEditing(false)

        if (!title || title === group.title) return

        try {
            await updateGroup(boardId, group.id, title)
        } catch (err) {
            console.error('Failed to update group title:', err)
            alert('Could not rename the list')
        }
    }



    async function saveNewTask(keepOpen = true) {
        if (isSavingTaskRef.current) return

        const title = newTaskTitle.trim()

        if (!title) return

        isSavingTaskRef.current = true

        try {
            await addTask(boardId, group.id, title)

            setNewTaskTitle('')
            setIsAddingTask(keepOpen)

            if (keepOpen) {
                taskInputRef.current?.focus()
            }

        } catch (err) {
            console.error('Failed to add task:', err)
            alert('Could not create task')
        } finally {
            isSavingTaskRef.current = false
        }
    }

    async function onAddTask(ev) {
        ev.preventDefault()
        await saveNewTask(true)
    }



    function onCancelAddTask() {
        setIsAddingTask(false)
        setNewTaskTitle('')
    }

    async function onRemoveGroup() {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${group.title}" and all ${group.tasks?.length || 0} cards inside it?`
        )

        if (!confirmed) return

        try {
            await removeGroup(boardId, group.id)
        } catch (err) {
            console.error('Failed to delete group:', err)
            alert('Could not delete the list. Please try again.')
        }
    }

    return <article className="group-preview">
        <header className="group-header">
            <span
                className="group-drag-handle"
                draggable
                onDragStart={ev => onGroupDragStart(ev, group.id)}
                title="Drag to move list"
                aria-label="Drag to move list"
            >
                ⠿
            </span>
            {isEditing ? (
                <input
                    type="text"
                    value={editedTitle}
                    autoFocus
                    onChange={ev => setEditedTitle(ev.target.value)}
                    onBlur={onSaveGroupTitle}
                    onKeyDown={ev => {
                        if (ev.key === 'Enter') {
                            ev.currentTarget.blur()
                        }

                        if (ev.key === 'Escape') {
                            setIsEditing(false)
                        }
                    }}
                    aria-label="Group title"
                />
            ) : (
                <h2
                    onClick={() => {
                        setEditedTitle(group.title)
                        setIsEditing(true)
                    }}
                    title="Click to rename list"
                    style={{ cursor: 'pointer' }}
                >
                    {group.title}
                </h2>
            )}
            <span className="group-task-count">{tasks.length}</span>
            <button onClick={onRemoveGroup}>Delete</button>
            <button type="button" aria-label={`More options for ${group.title}`}>•••</button>
        </header>
        <TaskList
            tasks={tasks}
            labels={labels}
            boardId={boardId}
            groupId={group.id} />


        {isAddingTask ? (
            <form
                ref={addTaskRef}
                className="add-task-form"
                onSubmit={onAddTask}
            >
                <textarea
                    ref={taskInputRef}
                    className="add-task-input"
                    placeholder="Enter a title for this card..."
                    value={newTaskTitle}
                    onChange={ev => setNewTaskTitle(ev.target.value)}
                    onKeyDown={ev => {
                        if (ev.key === 'Escape') {
                            ev.preventDefault()
                            onCancelAddTask()
                            return
                        }

                        if (
                            ev.key === 'Enter' &&
                            !ev.shiftKey &&
                            !ev.ctrlKey &&
                            !ev.metaKey
                        ) {
                            ev.preventDefault()
                            ev.currentTarget.form.requestSubmit()
                        }
                        if (ev.key === 'Enter' && !ev.shiftKey) {
                            ev.preventDefault()
                            ev.currentTarget.form.requestSubmit()
                        }
                    }}
                    autoFocus
                    rows={2}
                />

                <div className="add-task-actions">
                    <button
                        type="submit"
                        className="add-task-submit"
                        disabled={!newTaskTitle.trim()}
                    >
                        Add card
                    </button>

                    <button
                        type="button"
                        className="add-task-cancel"
                        onClick={onCancelAddTask}
                        aria-label="Cancel adding card"
                    >
                        ×
                    </button>
                </div>
            </form>
        ) : (
            <button
                className="add-task"
                type="button"
                onClick={() => setIsAddingTask(true)}
            >
                <span>＋</span> Add a card
            </button>
        )}
        {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
    </article>
}