import { storageService } from "../async-storage.service.js"
import {
  makeId,
  getRandomIntInclusive,
  loadFromStorage,
  saveToStorage,
} from "../util.service.js"
import { showErrorMsg } from "../event-bus.service.js"
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
      boards = boards.filter((board) => regExp.test(board.title))
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
    board.title = prompt("Enter Board Name")
    board.createdBy = board.createdBy || userService.getLoggedinUser()
    return storageService.post(STORAGE_KEY, board)
  }
}

function getEmptyBoard() {
  const loggedInUser = userService.getLoggedinUser()
  const creator = loggedInUser
    ? {
        _id: loggedInUser._id,
        fullname: loggedInUser.fullname,
        imgUrl: loggedInUser.imgUrl,
      }
    : {
        _id: makeId(),
        fullname: "Baba Blue",
        imgUrl: "http://some-img",
      }
  const members = [
    { _id: makeId(), fullname: "Ofek Meshulam", imgUrl: "https://www.google.com" },
    { _id: makeId(), fullname: "Einav Cohen", imgUrl: "https://www.google.com" },
    { _id: makeId(), fullname: "Atir Yosef", imgUrl: "https://www.google.com" },
  ]
  const taskMember = {
    _id: members[0]._id,
    fullname: "Ofek Meshulam",
    imgUrl: "",
  }
  const firstTask = { id: makeId(), title: "Replace logo" }
  const secondTask = { id: makeId(), title: "Add Samples" }
  const group1 = {
    id: makeId(),
    title: "Group 1",
    archivedAt: 1589983468418,
    tasks: [firstTask, secondTask],
    style: {},
  }
  const detailedTask = {
    id: makeId(),
    title: "Help me",
    status: "inProgress",
    priority: "high",
    dueDate: "2024-09-24",
    description: "description",
    comments: [
      {
        id: makeId(),
        title: "also @yaronb please CR this",
        createdAt: Date.now(),
        byMember: { ...taskMember },
      },
    ],
    checklists: [
      {
        id: makeId(),
        title: "Checklist",
        todos: [{ id: makeId(), title: "To Do 1", isDone: false }],
      },
    ],
    memberIds: [taskMember._id],
    labelIds: [],
    byMember: { ...taskMember },
    style: { backgroundColor: "#26de81" },
  }
  const group2 = {
    id: makeId(),
    title: "Group 2",
    tasks: [
      { id: makeId(), title: "Do that", archivedAt: 1589983468418 },
      detailedTask,
    ],
    style: {},
  }

  return {
    title: "",
    isStarred: false,
    archivedAt: null,
    createdBy: { ...creator },
    createdAt: Date.now(),
    style: {
      backgroundImage: "",
    },
    labels: [],
    members,
    groups: [group1, group2],
    activities: [
      {
        id: makeId(),
        title: "Changed Color",
        createdAt: Date.now(),
        byMember: { ...creator },
        group: { id: group1.id, title: group1.title },
        task: { id: firstTask.id, title: firstTask.title },
      },
    ],
  }
}

function _createBoards() {
  const boards = loadFromStorage(STORAGE_KEY) || []
  if (boards.length > 0) return

  for (var i = 0; i < 4; i++) {
    const board = _createBoard()
    board.title = boardNames[getRandomIntInclusive(0, boardNames.length - 1)]
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
