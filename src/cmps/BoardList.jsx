
import { BoardPreview } from "./BoardPreview.jsx"

export function BoardList({ boards, onRemoveBoard, onEditBoard,  }) {
    console.log(boards)
    return <ul className="board-list">
        {boards.map(board => <li key={board._id}>
            <BoardPreview board={board} />

            <div className="actions">
                <button onClick={() => onRemoveBoard(board._id)}>x</button>
                <button onClick={() => onEditBoard(board)}>Edit</button>
            </div>
        </li>)}
    </ul>
}