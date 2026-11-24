
import { useState, useRef, useEffect } from 'react'
import { GroupPreview } from './GroupPreview.jsx'
import { addGroup } from '../store/actions/board.actions.js'

export function GroupList({ groups, labels = [], boardId }) {
    const [isAddingGroup, setIsAddingGroup] = useState(false)
    const [newGroupTitle, setNewGroupTitle] = useState('')
    const addGroupRef = useRef(null)
    const isSavingGroupRef = useRef(false)

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
            <ul className="group-list">
                {groups.map(group => (
                    <li key={group.id}>
                        <GroupPreview
                            group={group}
                            labels={labels}
                            boardId={boardId}
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
