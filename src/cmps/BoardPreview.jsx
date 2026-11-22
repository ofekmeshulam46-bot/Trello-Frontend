import { StarIcon } from '../assets/icons/board-icons.jsx'

export function BoardPreview({ board, onToggleStar }) {
  return (
    <article className="board-preview">
      <div className="board-cover">
        <button
          className={`board-star${board.isStarred === true ? ' starred' : ''}`}
          type="button"
          onClick={(ev) => {
            ev.stopPropagation()
            onToggleStar(board)
          }}
          aria-label={`${board.isStarred === true ? 'Remove' : 'Add'} ${board.title} ${board.isStarred === true ? 'from' : 'to'} starred boards`}
          aria-pressed={board.isStarred === true}
        >
          {StarIcon}
        </button>
      </div>
      <p className="board-name">{board.title}</p>
    </article>
  )
}
