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
    } catch (err) {
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

export async function addGroup(boardId, groupTitle) {
    try {
        const board = await boardService.getById(boardId)

        const group = boardService.getEmptyGroup()
        group.title = groupTitle

        const updatedBoard = {
            ...board,
            groups: [...board.groups, group]
        }
        const savedBoard = await boardService.save(updatedBoard)
        store.dispatch(getCmdSetBoard(savedBoard))

        return savedBoard
    } catch (err) {
        console.log('Cannot add group', err)
        throw err
    }
}


export async function removeGroup(boardId, groupId) {
    try {
        const board = await boardService.getById(boardId)
        const updatedGroups = board.groups.filter(group => group.id !== groupId)

        const updatedBoard = {
            ...board,
            groups: updatedGroups
        }

        const savedBoard = await boardService.save(updatedBoard)
        store.dispatch(getCmdSetBoard(savedBoard))

        return savedBoard
    } catch (err) {
        console.log('Cannot remove group', err)
        throw err
    }
}


function getCmdSetBoards(boards) {
    return { type: SET_BOARDS, boards }
}

function getCmdSetBoard(board) {
    return { type: SET_BOARD, board }
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