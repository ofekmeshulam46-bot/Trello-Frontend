import { Link } from 'react-router-dom'
import { StarWithCoverIcon } from '../assets/icons/board-icons.jsx'

export function BoardPreview({ board, onToggleStar }) {
  return (
    <article className="board-preview">
      <Link className="board-preview-link" to={`/board/${board._id}`}>
        <div className="board-cover" />
        <p className="board-name" title={board.title}>{board.title}</p>
      </Link>
      <button
        className={`board-star${board.isStarred === true ? ' starred' : ''}`}
        type="button"
        onClick={() => onToggleStar(board)}
        aria-label={`${board.isStarred === true ? 'Remove' : 'Add'} ${board.title} ${board.isStarred === true ? 'from' : 'to'} starred boards`}
        aria-pressed={board.isStarred === true}
      >
        {StarWithCoverIcon}
      </button>
    </article>
  )
}
