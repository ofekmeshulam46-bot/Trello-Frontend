import { storageService } from "../async-storage.service.js"
import {
  makeId,
  makeLorem,
  getRandomIntInclusive,
  loadFromStorage,
  saveToStorage,
  debounce,
} from "../util.service.js"
import { userService } from "../user/user.service.local.js"

const STORAGE_KEY = "boardDB"

const boardNames = [
  "Marketing Tasks",
  "Product Roadmap",
  "Sales Pipeline",
  "Content Calendar",
  "Bug Tracker",
  "Team Onboarding",
  "Daily To-Do List",
  "Personal Tasks",
  "Reading List",
  "Trip Planner",
  "Weekly Meal Plan",
  "Event Planning",
  "Project Ideas",
  "2026 Goals",
  "Design Requests",
  "Client Projects",
]

const labels = [
  "On wheels",
  "Box game",
  "Art",
  "Baby",
  "Doll",
  "Puzzle",
  "Outdoor",
  "Battery Powered",
]

_createBoards()

export const boardService = {
  query,
  getById,
  save,
  remove,
  getEmptyBoard,
  getDefaultFilter,
}

async function query(filterBy = {}) {
  try {
    let boards = await storageService.query(STORAGE_KEY)
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, "i")
      boards = boards.filter((board) => regExp.test(board.name))
    }
    if (filterBy.maxPrice) {
      boards = boards.filter((board) => board.price <= +filterBy.maxPrice)
    }
    return boards
  } catch (err) {
    console.log(err)
    showErrorMsg("query error")
    throw err
  }
}

function getById(boardId) {
  return storageService.get(STORAGE_KEY, boardId)
}

function remove(boardId) {
  return storageService.remove(STORAGE_KEY, boardId)
}

function save(board) {
  if (board._id) {
    return storageService.put(STORAGE_KEY, board)
  } else {
    // when switching to backend - remove the next line     <????
    board.owner = userService.getLoggedinUser()
    return storageService.post(STORAGE_KEY, board)
  }
}

function getEmptyBoard() {
  return {
    name: boardNames[getRandomIntInclusive(0, boardNames.length - 1)],
    price: getRandomIntInclusive(1000, 9000),
    labels: labels[getRandomIntInclusive(0, labels.length - 1)],
    createdAt: Date.now(),
    inStock: true,
  }
}

function _createBoards() {
  const boards = loadFromStorage(STORAGE_KEY) || []
  if (boards.length > 0) return

  for (var i = 0; i < 4; i++) {
    const board = _createBoard()
    boards.push(board)
  }
  saveToStorage(STORAGE_KEY, boards)
}

function _createBoard() {
  const board = getEmptyBoard()
  board._id = makeId()
  return board
}

function getDefaultFilter() {
  return { txt: "", maxPrice: "" }
}
