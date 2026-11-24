import { useEffect, useRef, useState } from "react"

export function TaskDates({ dueDate = '', onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const pickerRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return
        function onPointerDown(ev) {
            if (!pickerRef.current?.contains(ev.target)) setIsOpen(false)
        }
        document.addEventListener('pointerdown', onPointerDown)
        return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [isOpen])

    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dueDate)
    const due = dueDate
        ? new Date(dateOnly ? `${dueDate}T00:00:00` : dueDate)
        : null
    const hasValidDate = due && !Number.isNaN(due.getTime())
    const isOverdue = hasValidDate && due < new Date()
    const dateInputValue = hasValidDate
        ? `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, '0')}-${String(due.getDate()).padStart(2, '0')}`
        : ''
    const formattedDate = hasValidDate
        ? due.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
        : ''

    return <div className="task-detail-field task-attribute-picker task-dates-field" ref={pickerRef}>
        <label className="task-detail-label" htmlFor="task-due-date">Due date</label>
        <button
            className="task-due-date-button"
            type="button"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(open => !open)}
        >
            <span>{formattedDate || 'Set due date'}</span>
            {isOverdue && <span className="task-due-date-overdue">Overdue</span>}
            <span className="task-due-date-chevron" aria-hidden="true">⌄</span>
        </button>
        {isOpen && (
            <div className="task-toolbar-popover task-date-picker">
                <input
                    id="task-due-date"
                    className="task-due-date-input"
                    type="date"
                    value={dateInputValue}
                    onChange={ev => {
                        onChange(ev.target.value)
                        setIsOpen(false)
                    }}
                />
                {dueDate && (
                    <button type="button" onClick={() => {
                        onChange('')
                        setIsOpen(false)
                    }}>Remove date</button>
                )}
            </div>
        )}
    </div>
}
