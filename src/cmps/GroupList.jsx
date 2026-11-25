
import { useState, useRef, useEffect } from 'react'
import { GroupPreview } from './GroupPreview.jsx'
import { addGroup, moveGroup } from '../store/actions/board.actions.js'


export function GroupList({ groups, labels = [], boardId }) {
    const [isAddingGroup, setIsAddingGroup] = useState(false)
    const [newGroupTitle, setNewGroupTitle] = useState('')
    const addGroupRef = useRef(null)
    const isSavingGroupRef = useRef(false)
    const [draggingGroupId, setDraggingGroupId] = useState(null)


    function onGroupDragStart(ev, groupId) {
        setDraggingGroupId(groupId)

        ev.dataTransfer.effectAllowed = 'move'
        ev.dataTransfer.setData('text/plain', groupId)
    }

    function onGroupDragOver(ev) {
        ev.preventDefault()
        ev.dataTransfer.dropEffect = 'move'
    }

    async function onGroupDrop(ev, targetGroupId) {
        if (!ev.dataTransfer.types.includes('text/plain')) return

        ev.preventDefault()
        ev.stopPropagation()

        const draggedGroupId = ev.dataTransfer.getData('text/plain')

        if (!draggedGroupId || draggedGroupId === targetGroupId) return

        const rect = ev.currentTarget.getBoundingClientRect()
        const middleX = rect.left + rect.width / 2

        const position = ev.clientX < middleX
            ? 'before'
            : 'after'

        try {
            await moveGroup(
                boardId,
                draggedGroupId,
                targetGroupId,
                position
            )
        } catch (err) {
            console.error('Failed to move group:', err)
            alert('Could not move list')
        }
    }

    async function onGroupDropInGap(ev) {
        if (!ev.dataTransfer.types.includes('text/plain')) return

        ev.preventDefault()
        ev.stopPropagation()

        const draggedGroupId = ev.dataTransfer.getData('text/plain')

        if (!groups.some(group => group.id === draggedGroupId)) return

        // Get all actual list elements, excluding "Add another list"
        const groupElements = [
            ...ev.currentTarget.querySelectorAll(
                ':scope > li:not(.add-group)'
            )
        ]

        // Find the first list whose midpoint is to the right of the cursor
        const targetIndex = groupElements.findIndex(element => {
            const rect = element.getBoundingClientRect()
            const middleX = rect.left + rect.width / 2

            return ev.clientX < middleX
        })

        try {
            if (targetIndex === -1) {
                // Drop after the last list
                const lastGroup = groups[groups.length - 1]

                if (!lastGroup) return

                await moveGroup(
                    boardId,
                    draggedGroupId,
                    lastGroup.id,
                    'after'
                )
            } else {
                // Drop before the list at targetIndex
                await moveGroup(
                    boardId,
                    draggedGroupId,
                    groups[targetIndex].id,
                    'before'
                )
            }
        } catch (err) {
            console.error('Failed to move group:', err)
            alert('Could not move list')
        }
    }


    useEffect(() => {
        if (!isAddingGroup) return

        function handleOutsideClick(ev) {
            if (
                addGroupRef.current &&
                !addGroupRef.current.contains(ev.target)
            ) {
                onCancelAddGroup()
            }
        }

        document.addEventListener('pointerdown', handleOutsideClick)

        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick)
        }
    }, [isAddingGroup])

    function onCancelAddGroup() {
        setIsAddingGroup(false)
        setNewGroupTitle('')
    }

    async function onAddGroup(ev) {
        ev.preventDefault()

        if (isSavingGroupRef.current) return

        const title = newGroupTitle.trim()
        if (!title) return

        isSavingGroupRef.current = true

        try {
            await addGroup(boardId, title)

            setNewGroupTitle('')
            setIsAddingGroup(false)
        } catch (err) {
            console.error('Failed to add group:', err)
            alert('Could not create list')
        } finally {
            isSavingGroupRef.current = false
        }
    }

    return (
        <section className="board-groups">

            <ul
                className="group-list"
                onDragOver={ev => {
                    if (!ev.dataTransfer.types.includes('text/plain')) return

                    const listItem = ev.target.closest('.group-list > li')

                    // Existing lists handle their own drag-over events
                    if (listItem && !listItem.classList.contains('add-group')) {
                        return
                    }

                    ev.preventDefault()
                    ev.dataTransfer.dropEffect = 'move'
                }}
                onDrop={ev => {
                    const listItem = ev.target.closest('.group-list > li')

                    if (listItem && !listItem.classList.contains('add-group')) {
                        return
                    }

                    onGroupDropInGap(ev)
                }}
            >

                {groups.map(group => (
                    <li
                        key={group.id}
                        className={
                            draggingGroupId === group.id
                                ? 'group-dragging'
                                : ''
                        }
                        onDragOver={onGroupDragOver}
                        onDrop={ev => onGroupDrop(ev, group.id)}
                        onDragEnd={() => setDraggingGroupId(null)}
                    >
                        <GroupPreview
                            group={group}
                            labels={labels}
                            boardId={boardId}
                            onGroupDragStart={onGroupDragStart}
                        />
                    </li>
                ))}

                <li className="add-group">
                    {isAddingGroup ? (
                        <form
                            ref={addGroupRef}
                            className="add-group-form"
                            onSubmit={onAddGroup}
                        >
                            <input
                                type="text"
                                className="add-group-input"
                                placeholder="Enter list title..."
                                value={newGroupTitle}
                                onChange={ev =>
                                    setNewGroupTitle(ev.target.value)
                                }
                                onKeyDown={ev => {
                                    if (ev.key === 'Escape') {
                                        ev.preventDefault()
                                        onCancelAddGroup()
                                    }
                                }}
                                autoFocus
                            />

                            <div className="add-group-actions">
                                <button
                                    type="submit"
                                    className="add-group-submit"
                                    disabled={!newGroupTitle.trim()}
                                >
                                    Add list
                                </button>

                                <button
                                    type="button"
                                    className="add-group-cancel"
                                    onClick={onCancelAddGroup}
                                    aria-label="Cancel adding list"
                                >
                                    ×
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsAddingGroup(true)}
                        >
                            <span>＋</span> Add another list
                        </button>
                    )}
                </li>
            </ul>
        </section>
    )
}
