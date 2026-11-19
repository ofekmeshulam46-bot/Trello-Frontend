import { boardService } from '../../services/board/board.service.js'
import { store } from '../store'
import {
    ADD_BOARD,
    EDIT_BOARD,
    REMOVE_BOARD,
    SET_BOARDS,
    SET_BOARD,
} from '../reducers/board.reducer'

export async function loadBoards(filterBy) {
    try {
        const boards = await boardService.query(filterBy)
        store.dispatch(getCmdSetBoards(boards))
    } catch (err) {
        console.log('Cannot load boards', err)
        throw err
    }
}

export async function loadBoard(boardId) {
    try {
        const board = await boardService.getById(boardId)
        store.dispatch(getCmdSetBoard(board))
    } catch(err) {
        console.log('Cannot load board', err)
        throw err
    }
}

export async function removeBoard(boardId) {
    try {
        await boardService.remove(boardId)
        store.dispatch(getCmdRemoveBoard(boardId))
    } catch (err) {
        console.log('Cannot remove board', err)
        throw err
    }
}

export async function saveBoard(board) {
    try {
        const isEdit = !!board._id
        const savedBoard = await boardService.save(board)
        store.dispatch(isEdit
            ? getCmdEditBoard(savedBoard)
            : getCmdAddBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot save board', err)
        throw err
    }
}

function getCmdSetBoards(boards) {
    return { type: SET_BOARDS, boards }
}

function getCmdSetBoard(board) {
    return { type: SET_BOARD, board}
}

function getCmdAddBoard(board) {
    return { type: ADD_BOARD, board }
}

function getCmdEditBoard(board) {
    return { type: EDIT_BOARD, board }
}

function getCmdRemoveBoard(boardId) {
    return { type: REMOVE_BOARD, boardId }
}
