import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BoardList } from '../cmps/BoardList.jsx'
import { BoardEdit } from '../cmps/BoardEdit.jsx'
import {
    AppSwitcherIcon,
    BoardsIcon,
    ChevronDownIcon,
    HomeIcon,
    MembersIcon,
    SettingsIcon,
    StarIcon,
    TemplatesIcon,
    TrelloIcon,
} from '../assets/icons/board-icons.jsx'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { boardService } from '../services/board/board.service.js'
import {
    loadBoards,
    removeBoard,
    saveBoard,
} from '../store/actions/board.actions.js'

export function BoardIndex() {
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const [boardToEdit, setBoardToEdit] = useState(null)
  const starredBoards = boards.filter((board) => board.isStarred === true)

  useEffect(() => {
    loadBoards()
  }, [])

  async function onRemoveBoard(boardId, boardTitle) {
    try {
      await removeBoard(boardId)
      showSuccessMsg(`removed "${boardTitle}"`)
    } catch (err) {
      console.log("Cannot remove board", err)
      showErrorMsg("Cannot remove board")
    }
  }

  function onAddBoard() {
    setBoardToEdit(boardService.getEmptyBoard())
  }

  function onEditBoard(board) {
    setBoardToEdit(structuredClone(board))
  }

  async function onSaveBoard(board) {
    try {
      const savedBoard = await saveBoard(board)
      showSuccessMsg(board._id
        ? `Board name updated to "${savedBoard.title}"`
        : `Board "${savedBoard.title}" was added`)
      setBoardToEdit(null)
    } catch (err) {
      console.log("Cannot save board", err)
      showErrorMsg("Cannot save board")
    }
  }

  async function onToggleStar(board) {
    const isStarred = board.isStarred === true
      ? false
      : true
    const boardToUpdate = {
      ...structuredClone(board),
      isStarred,
    }

    try {
      await saveBoard(boardToUpdate)
    } catch (err) {
      console.log("Cannot update starred board", err)
      showErrorMsg("Cannot update board")
    }
  }

  return (
    <section className="board-index">
      <aside className="board-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-app-icon" aria-hidden="true">
            {TrelloIcon}
          </span>
          <span className="sidebar-brand-name">Trello</span>
          <button className="sidebar-switcher" type="button" aria-label="Open app switcher">
            {AppSwitcherIcon}
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Workspace navigation">
          <button className="sidebar-nav-item active" type="button">
            {BoardsIcon}
            <span>Boards</span>
          </button>
          <button className="sidebar-nav-item" type="button">
            {TemplatesIcon}
            <span>Templates</span>
          </button>
          <button className="sidebar-nav-item" type="button">
            {HomeIcon}
            <span>Home</span>
          </button>
        </nav>

        <div className="sidebar-workspaces">
          <h4>Workspaces</h4>
          <button className="sidebar-workspace" type="button">
            <span className="sidebar-workspace-logo">T</span>
            <span>Trello Workspace</span>
            {ChevronDownIcon}
          </button>
        </div>
      </aside>

      <main className="board-main">
        {starredBoards.length > 0 && (
          <section className="board-section starred-boards-section">
            <h3 className="board-section-title">
              <span className="board-section-icon" aria-hidden="true">
                {StarIcon}
              </span>
              <span>Starred boards</span>
            </h3>
            <BoardList
              boards={starredBoards}
              onRemoveBoard={onRemoveBoard}
              onEditBoard={onEditBoard}
              onAddBoard={onAddBoard}
              onToggleStar={onToggleStar}
              showCreateBoard={false}
              showBoardActions={false}
              listClassName="board-section-list"
            />
          </section>
        )}

        <h3 className="workspace-title">YOUR WORKSPACES</h3>
        <div className="workspace-header">
          <span className="workspace-logo">T</span>
          <h3 className="workspace-name">Trello Workspace</h3>
          <div className="workspace-utilities">
            <button className="workspace-utility" type="button">
              {BoardsIcon}
              <span>Boards</span>
            </button>
            <button className="workspace-utility" type="button">
              {MembersIcon}
              <span>Members</span>
            </button>
            <button className="workspace-utility" type="button">
              {SettingsIcon}
              <span>Settings</span>
            </button>
          </div>
        </div>
        <BoardList
          boards={boards}
          onRemoveBoard={onRemoveBoard}
          onEditBoard={onEditBoard}
          onAddBoard={onAddBoard}
          onToggleStar={onToggleStar}
        />
      </main>
      {boardToEdit && (
          <BoardEdit
              boardToEdit={boardToEdit}
              onSaveBoard={onSaveBoard}
              onCancelEdit={() => setBoardToEdit(null)}
          />
      )}
    </section>
  )
}
