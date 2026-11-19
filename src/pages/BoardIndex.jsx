import { useEffect } from "react"
import { useSelector } from "react-redux"

import { BoardList } from "../cmps/BoardList.jsx"
// import { BoardFilter } from "../cmps/BoardFilter.jsx"

import { boardService } from "../services/board/board.service.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import {
  loadBoards,
  removeBoard,
  saveBoard,
  // setFilterBy,
} from "../store/actions/board.actions.js"

export function Boardindex() {
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  // const filterBy = useSelector((storeState) => storeState.filterBy)
  useEffect(() => {
    loadBoards()
  }, [])

  // useEffect(() => {
  //   const regExp = new RegExp(filterBy.txt, "i")
  //   loadBoards(filterBy)
  // }, [filterBy])

  // function onSetFilter(filterBy) {
  //   // console.log(filterBy)
  //   setFilterBy(filterBy)
  // }

  async function onRemoveBoard(boardId, boardTitle) {
    try {
      await removeBoard(boardId)
      showSuccessMsg(` removed "${boardTitle}" `)
    } catch (err) {
      console.log("Cannot remove board", err)
      showErrorMsg("Cannot remove board")
    }
  }

  async function onAddBoard() {
    const boardToSave = boardService.getEmptyBoard()

    try {
      await saveBoard(boardToSave)
      showSuccessMsg(`Board "${boardToSave.title}" was added `)
    } catch (err) {
      console.log("Cannot add board", err)
      showErrorMsg("Cannot add board")
    }
  }

  async function onEditBoard(board) {
    const title = prompt("New name?", board.title)
    if (title === null) return
    const boardToSave = { ...board, title }
    try {
      await saveBoard(boardToSave)
      showSuccessMsg(`Board name updated to : ${boardToSave.title}`)
    } catch (err) {
      console.log("Cannot update board", err)
      showErrorMsg("Cannot update board")
    }
  }

  return (
    <section className="board-index">
      <aside className="board-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-app-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <rect x="6" y="6" width="4" height="12" rx="1" />
              <rect x="14" y="6" width="4" height="8" rx="1" />
            </svg>
          </span>
          <span className="sidebar-brand-name">Trello</span>
          <button className="sidebar-switcher" type="button" aria-label="Open app switcher">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="6" cy="6" r="1" />
              <circle cx="12" cy="6" r="1" />
              <circle cx="18" cy="6" r="1" />
              <circle cx="6" cy="12" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="18" cy="12" r="1" />
              <circle cx="6" cy="18" r="1" />
              <circle cx="12" cy="18" r="1" />
              <circle cx="18" cy="18" r="1" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Workspace navigation">
          <button className="sidebar-nav-item active" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18M15 3v18" />
            </svg>
            <span>Boards</span>
          </button>
          <button className="sidebar-nav-item" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5" />
            </svg>
            <span>Templates</span>
          </button>
          <button className="sidebar-nav-item" type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12h4l2-5 4 10 2-5h6" />
            </svg>
            <span>Home</span>
          </button>
        </nav>

        <div className="sidebar-workspaces">
          <h4>Workspaces</h4>
          <button className="sidebar-workspace" type="button">
            <span className="sidebar-workspace-logo">T</span>
            <span>Trello Workspace</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m7 9 5 5 5-5" />
            </svg>
          </button>
        </div>
      </aside>

      <main className="board-main">
        <h3 className="workspace-title">YOUR WORKSPACES</h3>
        <div className="workspace-header">
          <span className="workspace-logo">T</span>
          <h3 className="workspace-name">Trello Workspace</h3>
          <div className="workspace-utilities">
            <button className="workspace-utility" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18M15 3v18" />
              </svg>
              <span>Boards</span>
            </button>
            <button className="workspace-utility" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" />
              </svg>
              <span>Members</span>
            </button>
            <button className="workspace-utility" type="button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06A1.7 1.7 0 0 0 16.44 18a1.7 1.7 0 0 0-1 1.55V20h-2v-.45A1.7 1.7 0 0 0 12.4 18a1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.44 15a1.7 1.7 0 0 0-1.55-1H7.4v-2h.49A1.7 1.7 0 0 0 9.44 11a1.7 1.7 0 0 0-.34-1.88l-.06-.06L10.46 7.64l.06.06A1.7 1.7 0 0 0 12.4 7.4a1.7 1.7 0 0 0 1-1.55V5.4h2v.45a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.36 11a1.7 1.7 0 0 0 1.55 1h.49v2h-.49A1.7 1.7 0 0 0 19.4 15Z" />
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </div>
        <BoardList
          boards={boards}
          onRemoveBoard={onRemoveBoard}
          onEditBoard={onEditBoard}
          onAddBoard={onAddBoard}
        />
      </main>
    </section>
  )
}
