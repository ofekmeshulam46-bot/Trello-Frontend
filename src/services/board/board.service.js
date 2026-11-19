import { storageService } from '../async-storage.service.js'
import {
    makeId,
    getRandomIntInclusive,
    loadFromStorage,
    saveToStorage,
} from '../util.service.js'
import { userService } from '../user'

const STORAGE_KEY = 'board'

const boardNames = [
    'Marketing Tasks',
    'Product Roadmap',
    'Sales Pipeline',
    'Content Calendar',
    'Bug Tracker',
    'Team Onboarding',
    'Daily To-Do List',
    'Personal Tasks',
]

const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']

export const boardService = {
    query,
    getById,
    save,
    remove,
    getEmptyBoard,
    getDefaultFilter,
}

_createBoards()

async function query(filterBy = {}) {
    let boards = await storageService.query(STORAGE_KEY)
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        boards = boards.filter(board => regExp.test(board.name))
    }
    return boards
}

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

function remove(boardId) {
    return storageService.remove(STORAGE_KEY, boardId)
}

function save(board) {
    if (board._id) return storageService.put(STORAGE_KEY, board)
    return storageService.post(STORAGE_KEY, {
        ...board,
        owner: userService.getLoggedinUser(),
    })
}

function getEmptyBoard() {
    return {
        name: '',
        labels: labels[getRandomIntInclusive(0, labels.length - 1)],
        createdAt: Date.now(),
    }
}

function getDefaultFilter() {
    return { txt: '' }
}

function _createBoards() {
    let boards = loadFromStorage(STORAGE_KEY)
    if (!boards) boards = loadFromStorage('boardDB') || []
    if (boards.length > 0) {
        saveToStorage(STORAGE_KEY, boards)
        return
    }

    boards = []
    for (var i = 0; i < 4; i++) {
        const board = _createBoard()
        board.name = boardNames[getRandomIntInclusive(0, boardNames.length - 1)]
        boards.push(board)
    }
    saveToStorage(STORAGE_KEY, boards)
}

function _createBoard() {
    const board = getEmptyBoard()
    board._id = makeId()
    return board
}
