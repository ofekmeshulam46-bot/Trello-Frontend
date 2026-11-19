import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { loadBoard } from '../store/actions/board.actions'

export function BoardDetails() {
    const {boardId} = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    useEffect(() => {
        loadBoard(boardId)
    }, [boardId])





    return <section className="board-details">
        <h1>Board Deatils</h1>
        <pre>{JSON.stringify(board, null, 2)}</pre>
    </section>
}