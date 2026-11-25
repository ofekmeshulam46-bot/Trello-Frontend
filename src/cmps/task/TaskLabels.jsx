import { useEffect, useRef, useState } from "react"
import { CloseIcon, LabelsIcon, PlusIcon } from "../../assets/icons/task-icons.jsx"

const LABEL_COLORS = [
    '#61bd4f',
    '#f2d600',
    '#ff9f1a',
    '#eb5a46',
    '#c377e0',
    '#0079bf',
    '#00c2e0',
    '#344563',
]

export function TaskLabels({ labels = [], labelIds = [], onChange, onCreateLabel }) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [isCreatingLabel, setIsCreatingLabel] = useState(false)
    const [newLabelTitle, setNewLabelTitle] = useState('')
    const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0])
    const [createError, setCreateError] = useState('')
    const pickerRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return
        function onPointerDown(ev) {
            if (!pickerRef.current?.contains(ev.target)) {
                setIsOpen(false)
                setIsCreatingLabel(false)
            }
        }
        document.addEventListener('pointerdown', onPointerDown)
        return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [isOpen])

    const selectedLabels = labels.filter(label => labelIds.includes(label.id))
    const searchTerm = searchText.trim().toLowerCase()
    const filteredLabels = labels.filter(label =>
        (label.title || '').toLowerCase().includes(searchTerm)
    )


    function onToggleLabel(labelId) {
        const nextLabelIds = labelIds.includes(labelId)
            ? labelIds.filter(id => id !== labelId)
            : [...labelIds, labelId]
        onChange(nextLabelIds)
    }

    async function onSubmitNewLabel(ev) {
        ev.preventDefault()
        const title = newLabelTitle.trim()
        if (!title) return
        if (labels.some(label => (label.title || '').trim().toLowerCase() === title.toLowerCase())) {
            setCreateError('A label with this title already exists.')
            return
        }

        setCreateError('')
        const wasCreated = await onCreateLabel({ title, color: newLabelColor })
        if (!wasCreated) {
            setCreateError('Unable to create label. Please try again.')
            return
        }
        setIsOpen(false)
        setIsCreatingLabel(false)
        setSearchText('')
        setNewLabelTitle('')
        setNewLabelColor(LABEL_COLORS[0])
    }

    return <div className="task-detail-field task-attribute-picker task-labels-field" ref={pickerRef}>
        <span className="task-detail-label">Labels</span>
        <div className="task-detail-options task-label-options">
            {selectedLabels.map(label => (
                <button
                    className="task-label-chip"
                    key={label.id}
                    title={label.title}
                    type="button"
                    aria-label={`Open label options for ${label.title}`}
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    onClick={() => {
                        setIsOpen(true)
                        setIsCreatingLabel(false)
                    }}
                    style={label.color ? { backgroundColor: label.color } : undefined}
                >
                   
                    {label.title}
                </button>
            ))}
            <button
                className="task-add-option"
                type="button"
                aria-label={isOpen ? 'Close label picker' : 'Choose labels'}
                aria-expanded={isOpen}
                onClick={() => {
                    setIsOpen(open => !open)
                    setIsCreatingLabel(false)
                }}
            >{PlusIcon}</button>
        </div>
        {isOpen && (
            <section className="task-toolbar-popover task-label-picker-panel" role="dialog" aria-label="Labels">
                <header className="task-picker-header">
                    {isCreatingLabel && (
                        <button
                            className="task-picker-back"
                            type="button"
                            aria-label="Back to labels"
                            onClick={() => {
                                setIsCreatingLabel(false)
                                setCreateError('')
                            }}
                        >‹</button>
                    )}
                    <h3>{isCreatingLabel ? 'Create label' : 'Labels'}</h3>
                    <button
                        type="button"
                        aria-label="Close label picker"
                        onClick={() => {
                            setIsOpen(false)
                            setIsCreatingLabel(false)
                        }}
                    >{CloseIcon}</button>
                </header>
                {isCreatingLabel ? (
                    <form className="task-label-create-form" onSubmit={onSubmitNewLabel}>
                        <span
                            className="task-label-create-preview"
                            style={{ backgroundColor: newLabelColor }}
                        >
                            <span className="task-label-pattern task-label-pattern-0" aria-hidden="true" />
                            {newLabelTitle.trim() || 'Label preview'}
                        </span>
                        <label htmlFor="task-new-label-title">Title</label>
                        <input
                            id="task-new-label-title"
                            className="task-picker-search"
                            type="text"
                            maxLength="40"
                            value={newLabelTitle}
                            onChange={ev => {
                                setNewLabelTitle(ev.target.value)
                                setCreateError('')
                            }}
                            autoFocus
                            required
                        />
                        <span className="task-label-create-color-title">Select a color</span>
                        <div className="task-label-create-colors" role="group" aria-label="Label color">
                            {LABEL_COLORS.map(color => (
                                <button
                                    className={newLabelColor === color ? 'selected' : ''}
                                    key={color}
                                    type="button"
                                    aria-label={`Select ${color} label color`}
                                    aria-pressed={newLabelColor === color}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setNewLabelColor(color)}
                                />
                            ))}
                        </div>
                        {createError && <p className="task-label-create-error" role="alert">{createError}</p>}
                        <button className="task-label-create-submit" type="submit" disabled={!newLabelTitle.trim()}>
                            Create
                        </button>
                    </form>
                ) : (
                    <>
                        <input
                            className="task-picker-search"
                            type="search"
                            placeholder="Search labels..."
                            aria-label="Search labels"
                            value={searchText}
                            onChange={ev => setSearchText(ev.target.value)}
                        />
                        <div className="task-picker-section">
                            <h4>Labels</h4>
                            {filteredLabels.map(label => (
                                <label className="task-label-picker-row" key={label.id}>
                                    <input
                                        type="checkbox"
                                        checked={labelIds.includes(label.id)}
                                        onChange={() => onToggleLabel(label.id)}
                                    />
                                    <span
                                        className="task-label-picker-swatch"
                                        style={{ backgroundColor: label.color || '#dfe1e6' }}
                                    >
                                        
                                        {label.title}
                                    </span>
                                </label>
                            ))}
                            {filteredLabels.length === 0 && (
                                <p className="task-picker-empty">No labels found.</p>
                            )}
                        </div>
                        <button
                            className="task-label-create-trigger"
                            type="button"
                            onClick={() => {
                                setIsCreatingLabel(true)
                                setCreateError('')
                            }}
                        >Create a new label</button>
                    </>
                )}
            </section>
        )}
    </div>
}
