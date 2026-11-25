import { useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import boardBrand from '../assets/icons/main-icons/board-brand.svg'
import boardBrandLight from '../assets/icons/main-icons/board-brand-light.svg'

export function AppHeader() {
  const createBtnRef = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isBoardsPage = pathname === '/boards'

  function onCreateBoard() {
    const rect = createBtnRef.current?.getBoundingClientRect()
    if (!rect) return

    navigate('/boards')

    window.setTimeout(() => {
      document.dispatchEvent(new CustomEvent('trello-open-create-board', {
        detail: {
          left: rect.left,
          top: rect.bottom,
        },
      }))
    }, 0)
  }

  return (
    <header className={`app-header board-topbar${isBoardsPage ? ' boards-page-header' : ' board-page-header'}`}>
      <Link className="board-brand" to="/boards" aria-label="Go to boards">
        <img
          src={isBoardsPage ? boardBrand : boardBrandLight}
          alt="Trello"
        />
      </Link>
      <div className="board-search" aria-label="Search">
        ⌕ <span>Search</span>
      </div>
      <button
        ref={createBtnRef}
        className="board-create"
        type="button"
        onClick={onCreateBoard}
      >
        Create
      </button>
    </header>
  )
}
