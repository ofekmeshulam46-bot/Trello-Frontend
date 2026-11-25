export function AppHeader() {
  return (
    <header className="app-header board-topbar">
      <div className="board-brand">
        <span className="board-brand-mark">▥</span> Trello
      </div>
      <div className="board-search" aria-label="Search">
        ⌕ <span>Search</span>
      </div>
      <button className="board-create" type="button">
        Create
      </button>
    </header>
  )
}
