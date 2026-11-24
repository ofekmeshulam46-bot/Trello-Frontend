import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { loadBoard, saveBoard } from '../store/actions/board.actions'
import { GroupList } from '../cmps/GroupList'
import { Outlet } from 'react-router-dom'

export function BoardDetails() {
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [editedTitle, setEditedTitle] = useState('')
    const [isShareOpen, setIsShareOpen] = useState(false)
    const shareRef = useRef(null)
    const { boardId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    useEffect(() => {
        loadBoard(boardId)
    }, [boardId])
    useEffect(() => {
    if (!isShareOpen) return

    function handleOutsideClick(ev) {
        if (shareRef.current && !shareRef.current.contains(ev.target)) {
            setIsShareOpen(false)
        }
    }

    function handleEscape(ev) {
        if (ev.key === 'Escape') {
            setIsShareOpen(false)
        }
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
        document.removeEventListener('pointerdown', handleOutsideClick)
        document.removeEventListener('keydown', handleEscape)
    }
}, [isShareOpen])

    if (!board) return <p>Loading board...</p>

    async function onSaveTitle() {
    const newTitle = editedTitle.trim()

    setIsEditingTitle(false)

    // don't save empty/unchanged titles
    if (!newTitle || newTitle === board.title) return

    try {
        await saveBoard({ ...board, title: newTitle })
    } catch (err) {
        console.error('Failed to update board title:', err)
        alert('Could not save board title. Please try again.')
    }
}
    const groups = board.groups

    return <section className="board-details">
        <header className="board-topbar">
            <div className="board-brand"><span className="board-brand-mark">▥</span> Trello</div>
            <div className="board-search" aria-label="Search">⌕ <span>Search</span></div>
            <button className="board-create" type="button">Create</button>
        </header>
        <div className="board-toolbar">
            {isEditingTitle ? (                      //checks if we are editing title
                <input
                    type="text"
                    value={editedTitle}
                    autoFocus
                    onChange={(ev) => setEditedTitle(ev.target.value)}
                    onBlur={() => {  //saves when we click outside the title
                        if (isEditingTitle) onSaveTitle()
                    }}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.currentTarget.blur()
                        }
                        if (ev.key === 'Escape') {
                            setIsEditingTitle(false)
                            ev.currentTarget.blur()
                        }
                    }}
                />
            ) : (
                <h1
                    onClick={() => {                //switches to editing mnode when we click the title
                        setEditedTitle(board.title || '')
                        setIsEditingTitle(true)
                    }}
                    style={{ cursor: 'pointer' }}
                    title="Click to edit board title"
                >
                    {board.title || 'Untitled board'}
                </h1>
            )}
            <div className="board-toolbar-actions" aria-label="Board actions">
                <span className="board-members">
                    {(board.members || []).slice(0, 4).map((member, index) =>
                        <span className="board-member" key={member._id || index} title={member.fullname}>
                            {member.fullname?.charAt(0).toUpperCase() || '?'}
                        </span>
                    )}
                </span>
                <button type="button">⚡</button>
                <button type="button">☰</button>
                <button
    type="button"
    onClick={async () => {
        try {
            await saveBoard({
                ...board,
                isStarred: !board.isStarred
            })
        } catch (err) {
            console.error('Failed to update starred status:', err)
        }
    }}
    aria-label={board.isStarred ? 'Unstar board' : 'Star board'}
    title={board.isStarred ? 'Remove from starred boards' : 'Star board'}
    style={{
        color: board.isStarred ? '#FFD700' : 'white'
    }}
>
    {board.isStarred ? '★' : '☆'}
</button>
                <div className="board-share-container" ref={shareRef}>
    <button
        className="board-share"
        type="button"
        onClick={() => setIsShareOpen(prev => !prev)}
        aria-expanded={isShareOpen}
        aria-controls="board-share-popover"
    >
        Share
    </button>

    {isShareOpen && (
        <div
            id="board-share-popover"
            className="board-share-popover"
        >
            <div className="board-share-header">
                <h3>Board members</h3>
                <button
                    type="button"
                    onClick={() => setIsShareOpen(false)}
                    aria-label="Close share popover"
                >
                    ×
                </button>
            </div>

            <div className="board-share-members">
                {(board.members || []).length > 0 ? (
                    board.members.map(member => (
                        <div
                            className="board-share-member"
                            key={member._id}
                        >
                            <span className="board-share-avatar">
                                {member.fullname?.charAt(0).toUpperCase() || '?'}
                            </span>
                            <span>{member.fullname}</span>
                        </div>
                    ))
                ) : (
                    <p>No board members yet.</p>
                )}
            </div>
        </div>
    )}
</div>
            </div>
        </div>
        <GroupList
            groups={groups || []}
            labels={board.labels || []}
            boardId={board._id} />
        <nav className="board-bottom-nav" aria-label="Board navigation">
            <span>▤ Inbox</span>
            <span>▦ Planner</span>
            <span className="selected">▥ Board</span>
            <span>▣ Switch boards</span>
        </nav>
        {/* <pre>{JSON.stringify(board, null, 2)}</pre> */}
        <Outlet />
    </section>
}