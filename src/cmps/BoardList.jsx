import { Link } from 'react-router-dom'
import { BoardPreview } from './BoardPreview.jsx'

export function BoardList({
  boards,
  onRemoveBoard,
  onEditBoard,
  onAddBoard,
  onToggleStar,
  showCreateBoard = true,
  showBoardActions = true,
  listClassName = '',
}) {
  return (
    <ul className={`board-list ${listClassName}`.trim()}>
      {boards.map((board) => (
        <li className="board-card" key={board._id}>
          <BoardPreview board={board} onToggleStar={onToggleStar} />
          {showBoardActions && (
            <>
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
            </>
          )}
        </li>
      ))}
      {showCreateBoard && (
        <li>
          <button
            className="create-board-card"
            type="button"
            onClick={onAddBoard}
          >
            Create new board
          </button>
        </li>
      )}
    </ul>
  )
}
