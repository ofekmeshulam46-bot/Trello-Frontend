import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { StarWithCoverIcon } from '../assets/icons/BoardIndex/board-icons.jsx'

export function BoardPreview({ board, onToggleStar }) {
  const coverRef = useRef(null)
  const backgroundImage = board.style?.backgroundImage?.trim() || ''

  useEffect(() => {
    const coverEl = coverRef.current
    if (!coverEl) return

    coverEl.style.background = ''
    coverEl.style.backgroundImage = ''

    if (!backgroundImage || backgroundImage === 'https://unsplash.com') return

    if (backgroundImage.startsWith('linear-gradient')) {
      coverEl.style.background = backgroundImage
      return
    }

    const imageUrl = backgroundImage.startsWith('url(')
      ? backgroundImage
      : `url("${backgroundImage}")`
    coverEl.style.backgroundImage = imageUrl
    coverEl.style.backgroundSize = 'cover'
    coverEl.style.backgroundPosition = 'center'
  }, [backgroundImage])

  return (
    <article className="board-preview">
      <Link className="board-preview-link" to={`/board/${board._id}`}>
        <div className="board-cover" ref={coverRef} />
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

BoardPreview.propTypes = {
  board: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isStarred: PropTypes.bool,
    style: PropTypes.shape({
      backgroundImage: PropTypes.string,
    }),
  }).isRequired,
  onToggleStar: PropTypes.func.isRequired,
}
