import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const PHOTO_BACKGROUNDS = [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=90',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=90',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=90',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=90',
]

const GRADIENT_BACKGROUNDS = [
    'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
    'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
    'linear-gradient(135deg, #4338ca 0%, #9333ea 100%)',
    'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
]

export function BoardEdit({ boardToEdit, onSaveBoard, onCancelEdit, isCreateModal = false, position = null }) {
    const [boardTitle, setBoardTitle] = useState(boardToEdit.title)
    const [selectedBackground, setSelectedBackground] = useState(
        boardToEdit.style?.backgroundImage || `url("${PHOTO_BACKGROUNDS[0]}")`
    )
    const isCreate = isCreateModal || !boardToEdit._id
    const isTitleValid = boardTitle.trim().length > 0

    useEffect(() => {
        function handleEscape(ev) {
            if (ev.key === 'Escape') onCancelEdit()
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [onCancelEdit])

    function handleChange(ev) {
        setBoardTitle(ev.target.value)
    }

    function onSubmit(ev) {
        ev.preventDefault()
        const title = boardTitle.trim()
        if (!title) return

        onSaveBoard({
            ...boardToEdit,
            title,
            style: {
                ...boardToEdit.style,
                backgroundImage: selectedBackground,
            },
        })
    }

    function onSelectBackground(backgroundImage) {
        setSelectedBackground(backgroundImage)
    }

    function getPreviewClass() {
        const photoIdx = PHOTO_BACKGROUNDS.findIndex(url =>
            selectedBackground === `url("${url}")` ||
            selectedBackground === `url('${url}')`
        )
        if (photoIdx !== -1) return `background-photo-${photoIdx + 1}`

        const gradientIdx = GRADIENT_BACKGROUNDS.indexOf(selectedBackground)
        return gradientIdx !== -1 ? `background-gradient-${gradientIdx + 1}` : 'background-gradient-1'
    }

    return (
        <div
            className={`board-edit-modal${isCreate ? ' creating' : ' editing'}${position ? ' positioned' : ''}`}
            style={position ? { left: position.left, top: position.top } : undefined}
            role="presentation"
            onPointerDown={(ev) => {
            if (ev.target === ev.currentTarget) onCancelEdit()
        }}>
            <form className="board-edit-form" onSubmit={onSubmit} noValidate>
                <header className="modal-header">
                    <h2>{boardToEdit._id ? 'Edit Board' : 'Create board'}</h2>
                    <button
                        className="close-btn"
                        type="button"
                        onClick={onCancelEdit}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </header>

                {isCreate && (
                    <>
                        <div className="board-preview-container">
                            <div className={`board-preview ${getPreviewClass()}`} aria-label="Board background preview">
                                <svg width="186" height="103" viewBox="0 0 186 103" fill="none" aria-hidden="true">
                                    <rect x="6" y="6" width="54" height="91" rx="3" fill="white" fillOpacity="0.9" />
                                    <rect x="12" y="13" width="32" height="5" rx="2.5" fill="#DFE1E6" />
                                    <rect x="12" y="23" width="42" height="18" rx="2" fill="#F1F2F4" />
                                    <rect x="12" y="45" width="42" height="24" rx="2" fill="#F1F2F4" />
                                    <rect x="12" y="73" width="42" height="16" rx="2" fill="#F1F2F4" />
                                    <rect x="66" y="6" width="54" height="68" rx="3" fill="white" fillOpacity="0.9" />
                                    <rect x="72" y="13" width="28" height="5" rx="2.5" fill="#DFE1E6" />
                                    <rect x="72" y="23" width="42" height="22" rx="2" fill="#F1F2F4" />
                                    <rect x="72" y="49" width="42" height="17" rx="2" fill="#F1F2F4" />
                                    <rect x="126" y="6" width="54" height="82" rx="3" fill="white" fillOpacity="0.9" />
                                    <rect x="132" y="13" width="35" height="5" rx="2.5" fill="#DFE1E6" />
                                    <rect x="132" y="23" width="42" height="16" rx="2" fill="#F1F2F4" />
                                    <rect x="132" y="43" width="42" height="16" rx="2" fill="#F1F2F4" />
                                    <rect x="132" y="63" width="42" height="17" rx="2" fill="#F1F2F4" />
                                </svg>
                            </div>
                        </div>

                        <div className="form-group">
                            <span className="form-label">Background</span>
                            <div className="bg-grid-photos" aria-label="Photo backgrounds">
                                {PHOTO_BACKGROUNDS.map((url, idx) => (
                                    <button
                                        className={`bg-swatch photo-${idx + 1}${selectedBackground === `url("${url}")` || selectedBackground === `url('${url}')` ? ' selected' : ''}`}
                                        type="button"
                                        onClick={() => onSelectBackground(`url("${url}")`)}
                                        aria-label={`Photo background ${idx + 1}`}
                                        aria-pressed={selectedBackground === `url("${url}")` || selectedBackground === `url('${url}')`}
                                        key={url}
                                    />
                                ))}
                            </div>
                            <div className="bg-grid-colors" aria-label="Color backgrounds">
                                {GRADIENT_BACKGROUNDS.map((gradient, idx) => (
                                    <button
                                        className={`bg-swatch gradient-${idx + 1}${selectedBackground === gradient ? ' selected' : ''}`}
                                        type="button"
                                        onClick={() => onSelectBackground(gradient)}
                                        aria-label={`Color background ${idx + 1}`}
                                        aria-pressed={selectedBackground === gradient}
                                        key={gradient}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <div className="form-group">
                    <label className="form-label" htmlFor="board-title">
                        Board title <span className="required-star">*</span>
                    </label>
                    <input
                        id="board-title"
                        name="title"
                        className={`text-input${isTitleValid ? '' : ' error'}`}
                        value={boardTitle}
                        onChange={handleChange}
                        autoComplete="off"
                        autoFocus
                        required
                    />
                    {!isTitleValid && (
                        <div className="validation-msg">
                            <span>👋</span>
                            <span>Board title is required</span>
                        </div>
                    )}
                </div>

                <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={!isTitleValid}
                >
                    {boardToEdit._id ? 'Save' : 'Create'}
                </button>
            </form>
        </div>
    )
}

BoardEdit.propTypes = {
    boardToEdit: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        style: PropTypes.shape({
            backgroundImage: PropTypes.string,
        }),
    }).isRequired,
    onSaveBoard: PropTypes.func.isRequired,
    onCancelEdit: PropTypes.func.isRequired,
    isCreateModal: PropTypes.bool,
    position: PropTypes.shape({
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
    }),
}
