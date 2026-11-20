import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { loadBoard } from '../store/actions/board.actions'
import { GroupList } from '../cmps/GroupList'

export function BoardDetails() {
    const {boardId} = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    useEffect(() => {
        loadBoard(boardId)
    }, [boardId])

    if(!board) return <p>Loading board...</p>
    
    const groups = board.groups
 
    return <section className="board-details">
        <header className="board-topbar">
            <div className="board-brand"><span className="board-brand-mark">▥</span> Trello</div>
            <div className="board-search" aria-label="Search">⌕ <span>Search</span></div>
            <button className="board-create" type="button">Create</button>
        </header>
        <div className="board-toolbar">
            <h1>{board.title || 'Untitled board'}</h1>
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
                <button type="button">☆</button>
                <button className="board-share" type="button">Share</button>
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
    </section>
}