import { useEffect, useRef, useState } from "react"
import DatePicker from "react-datepicker"

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

    const hasDateOnlyValue = /^\d{4}-\d{2}-\d{2}$/.test(dueDate)
    const [year, month, day] = hasDateOnlyValue
        ? dueDate.split('-').map(Number)
        : []
    const parsedDate = hasDateOnlyValue ? new Date(year, month - 1, day) : null
    const due = parsedDate
        && parsedDate.getFullYear() === year
        && parsedDate.getMonth() === month - 1
        && parsedDate.getDate() === day
        ? parsedDate
        : null
    const hasValidDate = Boolean(due)
    const isOverdue = hasValidDate && due < new Date()
    const formattedDate = hasValidDate
        ? due.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
        : ''

    return <div className="task-detail-field task-attribute-picker task-dates-field" ref={pickerRef}>
        <span className="task-detail-label">Due date</span>
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
            <div className="task-toolbar-popover task-date-picker" role="dialog" aria-label="Dates">
                <header className="task-date-picker-header">
                    <h2>Dates</h2>
                    <button
                        type="button"
                        aria-label="Close date picker"
                        onClick={() => setIsOpen(false)}
                    >
                        ×
                    </button>
                </header>
                <DatePicker
                    calendarClassName="task-trello-calendar"
                    selected={due}
                    inline
                    onChange={date => {
                        if (!date) return
                        onChange(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`)
                    }}
                    renderCustomHeader={({ date, decreaseMonth, increaseMonth, decreaseYear, increaseYear }) => (
                        <div className="task-date-calendar-header">
                            <button type="button" aria-label="Previous year" onClick={decreaseYear}>«</button>
                            <button type="button" aria-label="Previous month" onClick={decreaseMonth}>‹</button>
                            <strong>{date.toLocaleDateString([], { month: 'long', year: 'numeric' })}</strong>
                            <button type="button" aria-label="Next month" onClick={increaseMonth}>›</button>
                            <button type="button" aria-label="Next year" onClick={increaseYear}>»</button>
                        </div>
                    )}
                />
                {dueDate && (
                    <button className="task-date-clear" type="button" onClick={() => {
                        onChange('')
                        setIsOpen(false)
                    }}>Remove date</button>
                )}
            </div>
        )}
    </div>
}
