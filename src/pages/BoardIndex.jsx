import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

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
  const dispatch = useDispatch()

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

  async function onRemoveBoard(boardId, boardName) {
    try {
      await removeBoard(boardId)
      showSuccessMsg(` removed "${boardName}" `)
    } catch (err) {
      console.log("Cannot remove board", err)
      showErrorMsg("Cannot remove board")
    }
  }

  async function onAddBoard() {
    const boardToSave = boardService.getEmptyBoard()

    try {
      await saveBoard(boardToSave)
      showSuccessMsg(`Board "${boardToSave.name}" was added `)
    } catch (err) {
      console.log("Cannot add board", err)
      showErrorMsg("Cannot add board")
    }
  }

  async function onEditBoard(board) {
    const name = prompt("New name?")
    const boardToSave = { ...board, name }
    try {
      await saveBoard(boardToSave)
      showSuccessMsg(`Board name updated to : ${boardToSave.name}`)
    } catch (err) {
      console.log("Cannot update board", err)
      showErrorMsg("Cannot update board")
    }
  }

  return (
    <section className="board-index">
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
