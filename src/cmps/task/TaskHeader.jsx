
export function TaskHeader({ task, group, onClose }) {
    return <header
        className={`task-header${task.style?.backgroundImage ? ' has-image' : ''}`}
        style={{
            backgroundColor: task.style?.backgroundColor || 'var(--board-muted-text)',
            backgroundImage: task.style?.backgroundImage
                ? `url("${task.style.backgroundImage}")`
                : undefined,
        }}
    >
        <span className="status">{group?.title}</span>
        <div className="actions">
            <button type="button" aria-label="Close task details" onClick={onClose}>×</button>
        </div>
    </header>
}