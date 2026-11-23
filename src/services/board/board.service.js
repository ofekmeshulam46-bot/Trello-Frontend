import { storageService } from '../async-storage.service.js'
import {
  makeId,
  getRandomIntInclusive,
  loadFromStorage,
  saveToStorage,
} from '../util.service.js'
import { showErrorMsg } from '../event-bus.service.js'
import { userService } from '../user/user.service.local.js'
import { demoBoards } from './board.demo.data.js'

const STORAGE_KEY = 'board'
_createBoards()

export const boardService = {
  query,
  getById,
  save,
  remove,
  getEmptyBoard,
  getDefaultFilter,
  getEmptyGroup,
  saveTask,
}



async function query(filterBy = {}) {
  try {
    let boards = await storageService.query(STORAGE_KEY)
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, 'i')
      boards = boards.filter(board => regExp.test(board.title))
    }
    return boards
  } catch (err) {
    console.log('Cannot load boards', err)
    showErrorMsg('Cannot load boards')
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
  if (board._id) return storageService.put(STORAGE_KEY, board)
  return storageService.post(STORAGE_KEY, {
    ...board,
    createdBy: board.createdBy || userService.getLoggedinUser(),
  })
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
      fullname: 'Baba Blue',
      imgUrl: 'http://some-img',
    }

  return {
    title: '',
    isStarred: false,
    archivedAt: null,
    createdBy: { ...creator },
    createdAt: Date.now(),
    style: {
      backgroundImage: '',
    },
    labels: [],
    members: [creator],
    groups: [],
    activities: [],
  }
}

function getEmptyGroup() {
  return {
    id: makeId(),
    title: '',
    archivedAt: '',
    tasks: [],
    style: {},
  }
}

async function saveTask(boardId, groupId, taskId, changes) {
  const board = await getById(boardId)

  const group = board.groups.find(group => group.id === groupId)
  if (!group) throw new Error('Group not found')

  const isTaskFound = group.tasks.some(task => task.id === taskId)
  if (!isTaskFound) throw new Error('Task not found')

  group.tasks = group.tasks.map(task =>
    task.id === taskId
      ? { ...task, ...changes }
      : task
  )
  return await save(board)
}


function _createBoards() {
  const boards = loadFromStorage(STORAGE_KEY)
  if (boards !== undefined) return

  saveToStorage(STORAGE_KEY, demoBoards)
}


function getDefaultFilter() {
  return { txt: '' }
}
