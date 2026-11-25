import { useEffect, useRef, useState } from "react"
import { ChecklistIcon, ClockIcon, CloseIcon, LabelsIcon, MembersIcon, PlusIcon } from "../../assets/icons/task-icons.jsx"

export function TaskAddMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return

        function onPointerDown(ev) {
            if (!menuRef.current?.contains(ev.target)) setIsOpen(false)
        }

        function onKeyDown(ev) {
            if (ev.key === 'Escape') {
                ev.stopPropagation()
                setIsOpen(false)
            }
        }

        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown, true)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown, true)
        }
    }, [isOpen])

    return <div className="task-add-menu" ref={menuRef}>
        <button
            className="task-toolbar-button task-add-menu-trigger"
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-controls="task-add-menu-panel"
            onClick={() => setIsOpen(open => !open)}
        >
            <span className="task-add-menu-icon" aria-hidden="true">{PlusIcon}</span>
            Add
        </button>
        {isOpen && (
            <section className="panel" id="task-add-menu-panel" role="dialog" aria-label="Add to card">
                <header className="header">
                    <h2>Add to card</h2>
                    <button
                        type="button"
                        aria-label="Close add menu"
                        onClick={() => setIsOpen(false)}
                    >{CloseIcon}</button>
                </header>
                <div className="options">
                    <div className="option">
                        <span className="icon" aria-hidden="true">
                            {LabelsIcon}
                        </span>
                        <span>
                            <strong>Labels</strong>
                            <small>Organize, categorize, and prioritize</small>
                        </span>
                    </div>
                    <div className="option">
                        <span className="icon" aria-hidden="true">
                            {ClockIcon}
                        </span>
                        <span>
                            <strong>Dates</strong>
                            <small>Start dates, due dates, and reminders</small>
                        </span>
                    </div>
                    <div className="option">
                        <span className="icon" aria-hidden="true">
                            {ChecklistIcon}
                        </span>
                        <span>
                            <strong>Checklist</strong>
                            <small>Add subtasks</small>
                        </span>
                    </div>
                    <div className="option">
                        <span className="icon" aria-hidden="true">
                            {MembersIcon}
                        </span>
                        <span>
                            <strong>Members</strong>
                            <small>Assign members</small>
                        </span>
                    </div>
                </div>
            </section>
        )}
    </div>
}
