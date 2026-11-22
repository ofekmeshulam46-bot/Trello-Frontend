import { StarIcon } from '../assets/icons/board-icons.jsx'

export function BoardPreview({ board, onToggleStar }) {
  return (
    <article className="board-preview">
      <div className="board-cover">
        <button
          className={`board-star${board.isStarred ? ' starred' : ''}`}
          type="button"
          onClick={(ev) => {
            ev.stopPropagation()
            onToggleStar(board)
          }}
          aria-label={`${board.isStarred ? 'Remove' : 'Add'} ${board.title} ${board.isStarred ? 'from' : 'to'} starred boards`}
          aria-pressed={!!board.isStarred}
        >
          {StarIcon}
        </button>
      </div>
      <p className="board-name">{board.title}</p>
    </article>
  )
}
