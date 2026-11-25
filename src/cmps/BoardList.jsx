import { BoardPreview } from './BoardPreview.jsx'
import { BoardEdit } from './BoardEdit.jsx'
import PropTypes from 'prop-types'

export function BoardList({
  boards,
  onRemoveBoard,
  onEditBoard,
  onAddBoard,
  onToggleStar,
  showCreateBoard = true,
  showBoardActions = true,
  listClassName = '',
  boardToEdit,
  listSource,
  onSaveBoard,
  onCancelEdit,
}) {
  return (
    <ul className={`board-list ${listClassName}`.trim()}>
      {boards.map((board) => (
          <li className="board-card" key={board._id}>
          <BoardPreview board={board} onToggleStar={onToggleStar} />
          {showBoardActions && (
            <div className="board-actions">
              <button
                className="board-edit"
                type="button"
                onClick={() => onEditBoard(board, listSource)}
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
            </div>
          )}
          {boardToEdit && boardToEdit._id === board._id && (
            <BoardEdit
              boardToEdit={boardToEdit}
              onSaveBoard={onSaveBoard}
              onCancelEdit={onCancelEdit}
              isCreateModal
            />
          )}
        </li>
      ))}
      {showCreateBoard && (
        <li className="create-board-wrapper">
          <button
            className="create-board-card"
            type="button"
            onClick={onAddBoard}
          >
            Create new board
          </button>
          {boardToEdit && !boardToEdit._id && (
            <BoardEdit
              boardToEdit={boardToEdit}
              onSaveBoard={onSaveBoard}
              onCancelEdit={onCancelEdit}
            />
          )}
        </li>
      )}
    </ul>
  )
}

BoardList.propTypes = {
  boards: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
  })).isRequired,
  onRemoveBoard: PropTypes.func.isRequired,
  onEditBoard: PropTypes.func.isRequired,
  onAddBoard: PropTypes.func.isRequired,
  onToggleStar: PropTypes.func.isRequired,
  showCreateBoard: PropTypes.bool,
  showBoardActions: PropTypes.bool,
  listClassName: PropTypes.string,
  boardToEdit: PropTypes.object,
  listSource: PropTypes.oneOf(['starred', 'workspace']),
  onSaveBoard: PropTypes.func,
  onCancelEdit: PropTypes.func,
}
