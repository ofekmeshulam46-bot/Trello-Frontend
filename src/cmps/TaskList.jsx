import { useState, useEffect } from 'react'
import { TaskPreview } from "./TaskPreview.jsx"
import { moveTask, transferTask } from "../store/actions/board.actions.js"

export function TaskList({ tasks, labels = [], boardId, groupId }) {

    const [dropIndicator, setDropIndicator] = useState(null)
    const [draggingTaskId, setDraggingTaskId] = useState(null)

    useEffect(() => {
        function handleActiveDropList(ev) {
            if (ev.detail.groupId !== groupId) {
                setDropIndicator(null)
            }
        }

        document.addEventListener(
            'trello-active-drop-list',
            handleActiveDropList
        )

        return () => {
            document.removeEventListener(
                'trello-active-drop-list',
                handleActiveDropList
            )
        }
    }, [groupId])

    function onTaskDragStart(ev, taskId) {

        setDraggingTaskId(taskId)

        ev.stopPropagation()

        ev.dataTransfer.effectAllowed = 'move'
        ev.dataTransfer.setData(
            'application/x-trello-task',
            JSON.stringify({
                taskId,
                sourceGroupId: groupId
            })
        )
    }


    function onTaskDragOver(ev, targetTaskId = null) {
        if (!ev.dataTransfer.types.includes('application/x-trello-task')) {
            return
        }

        ev.preventDefault()
        ev.stopPropagation()
        ev.dataTransfer.dropEffect = 'move'

        document.dispatchEvent(
            new CustomEvent('trello-active-drop-list', {
                detail: { groupId }
            })
        )

        if (targetTaskId) {
            const rect = ev.currentTarget.getBoundingClientRect()
            const middleY = rect.top + rect.height / 2

            const position =
                ev.clientY > middleY ? 'after' : 'before'

            setDropIndicator(prev => {
                if (
                    prev?.taskId === targetTaskId &&
                    prev?.position === position
                ) return prev

                return { taskId: targetTaskId, position }
            })

            return
        }

        // Handle empty spaces between cards
        const taskElements = [
            ...ev.currentTarget.querySelectorAll('.task-list > li')
        ]

        const targetIndex = taskElements.findIndex(element => {
            const rect = element.getBoundingClientRect()
            return ev.clientY < rect.top + rect.height / 2
        })

        if (!tasks.length) {
            setDropIndicator({ taskId: null, position: 'empty' })
            return
        }

        if (targetIndex === -1) {
            setDropIndicator({
                taskId: tasks[tasks.length - 1].id,
                position: 'after'
            })
        } else {
            setDropIndicator({
                taskId: tasks[targetIndex].id,
                position: 'before'
            })
        }
    }




    async function onTaskDrop(ev, targetTaskId = null) {
        if (!ev.dataTransfer.types.includes('application/x-trello-task')) {
            return
        }

        ev.preventDefault()
        ev.stopPropagation()
        setDropIndicator(null)

        let dragData

        try {
            dragData = JSON.parse(
                ev.dataTransfer.getData('application/x-trello-task')
            )
        } catch (err) {
            console.error('Invalid drag data:', err)
            return
        }

        const { taskId, sourceGroupId } = dragData

        if (!taskId || !sourceGroupId) return

        try {

            if (sourceGroupId === groupId) {
                // Reorder within the same list
                if (!targetTaskId || taskId === targetTaskId) return

                const rect = ev.currentTarget.getBoundingClientRect()
                const middleY = rect.top + rect.height / 2

                const position =
                    ev.clientY > middleY ? 'after' : 'before'

                await moveTask(
                    boardId,
                    groupId,
                    taskId,
                    targetTaskId,
                    position
                )
            } else {

                let insertBeforeTaskId = targetTaskId

                if (targetTaskId) {
                    const rect = ev.currentTarget.getBoundingClientRect()
                    const middleY = rect.top + rect.height / 2

                    // If dropped on the lower half,
                    // insert before the NEXT card instead
                    if (ev.clientY > middleY) {
                        const targetIndex = tasks.findIndex(
                            task => task.id === targetTaskId
                        )

                        insertBeforeTaskId =
                            tasks[targetIndex + 1]?.id ?? null
                    }
                }

                await transferTask(
                    boardId,
                    sourceGroupId,
                    groupId,
                    taskId,
                    insertBeforeTaskId
                )
            }
        } catch (err) {
            console.error('Failed to move task:', err)
            alert('Could not move card')
        }
    }


    async function onTaskDropInGap(ev) {
        if (!ev.dataTransfer.types.includes('application/x-trello-task')) {
            return
        }

        ev.preventDefault()
        ev.stopPropagation()
        setDropIndicator(null)

        let dragData

        try {
            dragData = JSON.parse(
                ev.dataTransfer.getData('application/x-trello-task')
            )
        } catch (err) {
            console.error('Invalid drag data:', err)
            return
        }

        const { taskId, sourceGroupId } = dragData

        if (!taskId || !sourceGroupId) return

        // Find the task cards inside this list
        const taskElements = [
            ...ev.currentTarget.querySelectorAll('.task-list > li')
        ]

        // Find the first card whose midpoint is below the cursor
        const targetIndex = taskElements.findIndex(element => {
            const rect = element.getBoundingClientRect()
            return ev.clientY < rect.top + rect.height / 2
        })

        // If no card is below the cursor, insert at the end
        const insertIndex =
            targetIndex === -1 ? tasks.length : targetIndex

        try {
            if (sourceGroupId === groupId) {
                // Reorder inside the same list
                if (!tasks.length) return

                if (insertIndex === tasks.length) {
                    await moveTask(
                        boardId,
                        groupId,
                        taskId,
                        tasks[tasks.length - 1].id,
                        'after'
                    )
                } else {
                    await moveTask(
                        boardId,
                        groupId,
                        taskId,
                        tasks[insertIndex].id,
                        'before'
                    )
                }
            } else {
                // Move from another list
                const targetTaskId =
                    tasks[insertIndex]?.id ?? null

                await transferTask(
                    boardId,
                    sourceGroupId,
                    groupId,
                    taskId,
                    targetTaskId
                )
            }
        } catch (err) {
            console.error('Failed to move task:', err)
            alert('Could not move card')
        }
    }




    return (
        <section
            className={`group-cards ${dropIndicator?.position === 'empty' ? 'drop-empty' : ''
                }`}
            onDragOver={ev => {
                // Card drag events are handled by the card itself
                if (ev.target.closest('.task-list > li')) return

                onTaskDragOver(ev)
            }}
            onDrop={onTaskDropInGap}
            onDragLeave={ev => {
                if (!ev.currentTarget.contains(ev.relatedTarget)) {
                    setDropIndicator(null)
                }
            }}
        >

            <ul className="task-list">
                {tasks.map(task =>
                    <li
                        key={task.id}
                        draggable
                        className={[
                            dropIndicator?.taskId === task.id
                                ? `drop-${dropIndicator.position}`
                                : '',
                            draggingTaskId === task.id ? 'task-dragging' : ''
                        ].filter(Boolean).join(' ')}
                        onDragStart={ev => onTaskDragStart(ev, task.id)}
                        onDragOver={ev => onTaskDragOver(ev, task.id)}
                        onDrop={ev => onTaskDrop(ev, task.id)}
                        onDragEnd={() => {
                            setDraggingTaskId(null)
                            setDropIndicator(null)
                        }}
                    >
                        <TaskPreview
                            task={task}
                            labels={labels}
                            boardId={boardId}
                            groupId={groupId} />
                    </li>
                )}
            </ul>
        </section>
    )
}