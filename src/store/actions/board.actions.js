import { boardService } from "../../services/board/board.service.js"
import { store } from "../store"
import {
  ADD_BOARD,
  REMOVE_BOARD,
  SET_BOARDS,
  SET_BOARD,
  UPDATE_BOARD,
  ADD_BOARD_MSG,
} from "../reducers/board.reducer"

export async function loadBoards(filterBy) {
  // const regExp = new RegExp(filterBy.txt, "i")
  try {
    const boards = await boardService.query(filterBy)

    return store.dispatch({ type: SET_BOARDS, boards })
  } catch (err) {
    console.log("Cannot remove car", err)
    throw err
  }
}

export async function removeBoard(boardId) {
  try {
    await boardService.remove(boardId)
    return store.dispatch({ type: REMOVE_BOARD, boardId })
  } catch (err) {
    console.log("removing board failed", err)
    showErrorMsg("removing board failed")
  }
}

export async function saveBoard(board) {
  const type = board._id ? EDIT_BOARD : ADD_BOARD
  try {
    const savedBoard = await boardService.save(board)
    store.dispatch({ type, board: savedBoard })
    return savedBoard
  } catch (err) {
    console.log("saving board failed", err)
    showErrorMsg("saving board failed")
  }
}

export function setFilterBy(filterBy) {
  // console.log(filterBy)
  store.dispatch({ type: SET_FILTER_BY, filterBy })
}
