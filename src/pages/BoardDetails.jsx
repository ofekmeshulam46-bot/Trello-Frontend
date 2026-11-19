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
        <h1>Board Deatils</h1>
        <GroupList groups={groups} />
        {/* <pre>{JSON.stringify(board, null, 2)}</pre> */}
    </section>
}