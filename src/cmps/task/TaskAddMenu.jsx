import { useEffect, useRef, useState } from "react"

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
            className="task-toolbar-button"
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-controls="task-add-menu-panel"
            onClick={() => setIsOpen(open => !open)}
        >
            <span aria-hidden="true">+</span>
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
                    >×</button>
                </header>
                <div className="options">
                    <div className="option">
                        <span className="icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <path d="M4 5.5h9l7 7-7.5 7.5-7-7z" />
                                <circle cx="9" cy="10" r="1" />
                            </svg>
                        </span>
                        <span>
                            <strong>Labels</strong>
                            <small>Organize, categorize, and prioritize</small>
                        </span>
                    </div>
                    <div className="option">
                        <span className="icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="8.5" />
                                <path d="M12 7v5l3 2" />
                            </svg>
                        </span>
                        <span>
                            <strong>Dates</strong>
                            <small>Start dates, due dates, and reminders</small>
                        </span>
                    </div>
                    <div className="option">
                        <span className="icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <rect x="4" y="4" width="16" height="16" rx="2" />
                                <path d="m8 12 2.5 2.5L16 9" />
                            </svg>
                        </span>
                        <span>
                            <strong>Checklist</strong>
                            <small>Add subtasks</small>
                        </span>
                    </div>
                    <div className="option">
                        <span className="icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="3.5" />
                                <path d="M5 20v-1a7 7 0 0 1 14 0v1z" />
                            </svg>
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
