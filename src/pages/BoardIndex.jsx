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
    <section>
      <h3>YOUR WORKSPACES</h3>
      <div className="trello-workspace">
        <span>T</span>
        <h3>Trello Workspace</h3>
        <div className="workspace-utilities">
          <a href="">Boards</a>
          <a href="">Members</a>
          <a href="">Settings</a>
        </div>
      </div>
      <main>
        <button onClick={onAddBoard}>Add a Board</button>
        <BoardList
          boards={boards}
          onRemoveBoard={onRemoveBoard}
          onEditBoard={onEditBoard}
        />
      </main>
    </section>
  )
}
