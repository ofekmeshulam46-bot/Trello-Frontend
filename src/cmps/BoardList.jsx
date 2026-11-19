import { BoardPreview } from "./BoardPreview.jsx"

export function BoardList({ boards, onRemoveBoard, onEditBoard, onAddBoard }) {
  return (
    <ul className="board-list">
      {boards.map((board) => (
        <li className="board-card" key={board._id}>
          <BoardPreview board={board} />
          <button
            className="board-edit"
            type="button"
            onClick={() => onEditBoard(board)}
            aria-label={`Edit ${board.title}`}
          >
            Edit
          </button>
          <button
            className="board-remove"
            type="button"
            onClick={() => onRemoveBoard(board._id, board.title)}
            aria-label={`Remove ${board.title}`}
          >
            x
          </button>
        </li>
      ))}
      <li>
        <button
          className="create-board-card"
          type="button"
          onClick={onAddBoard}
        >
          Create new board
        </button>
      </li>
    </ul>
  )
}
