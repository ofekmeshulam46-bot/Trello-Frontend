import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BoardList } from '../cmps/BoardList.jsx'
import { BoardEdit } from '../cmps/BoardEdit.jsx'
import {
    BoardsIcon,
    ChevronDownIcon,
    HomeIcon,
    StarIcon,
} from '../assets/icons/BoardIndex/board-icons.jsx'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { boardService } from '../services/board/board.service.local.js'
import {
    loadBoards,
    removeBoard,
    saveBoard,
} from '../store/actions/board.actions.js'

export function BoardIndex() {
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const [createBoardToEdit, setCreateBoardToEdit] = useState(null)
  const [starredBoardToEdit, setStarredBoardToEdit] = useState(null)
  const [workspaceBoardToEdit, setWorkspaceBoardToEdit] = useState(null)
  const [createModalPosition, setCreateModalPosition] = useState(null)
  const starredBoards = boards.filter((board) => board.isStarred === true)

  useEffect(() => {
    loadBoards()
  }, [])

  useEffect(() => {
    function handleHeaderCreate(ev) {
      setStarredBoardToEdit(null)
      setWorkspaceBoardToEdit(null)
      setCreateModalPosition({
        left: ev.detail.left,
        top: ev.detail.top,
      })
      setCreateBoardToEdit(boardService.getEmptyBoard())
    }

    document.addEventListener('trello-open-create-board', handleHeaderCreate)
    return () => document.removeEventListener('trello-open-create-board', handleHeaderCreate)
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
    setStarredBoardToEdit(null)
    setWorkspaceBoardToEdit(null)
    setCreateModalPosition(null)
    setCreateBoardToEdit(boardService.getEmptyBoard())
  }

  function onEditBoard(board, source) {
    const boardToClone = structuredClone(board)
    setCreateBoardToEdit(null)
    if (source === 'starred') {
      setWorkspaceBoardToEdit(null)
      setStarredBoardToEdit(boardToClone)
      return
    }
    setStarredBoardToEdit(null)
    setWorkspaceBoardToEdit(boardToClone)
  }

  async function onSaveBoard(board) {
    try {
      const savedBoard = await saveBoard(board)
      showSuccessMsg(board._id
        ? `Board name updated to "${savedBoard.title}"`
        : `Board "${savedBoard.title}" was added`)
      setStarredBoardToEdit(null)
      setWorkspaceBoardToEdit(null)
      setCreateBoardToEdit(null)
      setCreateModalPosition(null)
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
        <nav className="sidebar-nav" aria-label="Workspace navigation">
          <button className="sidebar-nav-item active" type="button">
            {BoardsIcon}
            <span>Boards</span>
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
              <span>Starred Boards</span>
            </h3>
            <BoardList
              boards={starredBoards}
              onRemoveBoard={onRemoveBoard}
              onEditBoard={onEditBoard}
              onAddBoard={onAddBoard}
              onToggleStar={onToggleStar}
              showCreateBoard={false}
              showBoardActions={true}
              listClassName="starred-boards-list"
              boardToEdit={starredBoardToEdit}
              listSource="starred"
              onSaveBoard={onSaveBoard}
              onCancelEdit={() => {
                setStarredBoardToEdit(null)
              }}
            />
          </section>
        )}

        <h3 className="workspace-title">YOUR WORKSPACES</h3>
        <div className="workspace-header">
          <span className="workspace-logo">T</span>
          <h3 className="workspace-name">Trello Workspace</h3>
        </div>
        <BoardList
          boards={boards}
          onRemoveBoard={onRemoveBoard}
          onEditBoard={onEditBoard}
          onAddBoard={onAddBoard}
          onToggleStar={onToggleStar}
          boardToEdit={createBoardToEdit && !createModalPosition
            ? createBoardToEdit
            : workspaceBoardToEdit}
          listSource="workspace"
          onSaveBoard={onSaveBoard}
          onCancelEdit={() => {
            setCreateBoardToEdit(null)
            setWorkspaceBoardToEdit(null)
          }}
        />
      </main>
      {createBoardToEdit && createModalPosition && (
        <BoardEdit
          boardToEdit={createBoardToEdit}
          onSaveBoard={onSaveBoard}
          onCancelEdit={() => {
            setCreateBoardToEdit(null)
            setCreateModalPosition(null)
          }}
          position={createModalPosition}
          isCreateModal
        />
      )}
    </section>
  )
}
