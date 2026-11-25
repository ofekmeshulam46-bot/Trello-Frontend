import { makeId } from '../../services/util.service.js'
import { boardService } from '../../services/board/board.service.local.js'
import { store } from '../store'
import { reorderGroups, reorderTasks, moveTaskBetweenGroups } from '../../services/board/board.drag-and-drop.js'

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

export async function updateGroup(boardId, groupId, newTitle) {
    try {
        const title = newTitle.trim()
        if (!title) return

        const board = await boardService.getById(boardId)
        if (!board) throw new Error('Board not found')

        const updatedGroups = board.groups.map(group =>
            group.id === groupId
                ? { ...group, title }
                : group
        )

        const updatedBoard = {
            ...board,
            groups: updatedGroups
        }

        const savedBoard = await boardService.save(updatedBoard)
        store.dispatch(getCmdSetBoard(savedBoard))

        return savedBoard
    } catch (err) {
        console.error('Cannot update group:', err)
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

export async function saveTask(boardId, groupId, taskId, changes) {
    try {
        const savedBoard = await boardService.saveTask(boardId, groupId, taskId, changes)
        store.dispatch(getCmdSetBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot save task', err)
        throw err
    }
}

export async function addActivity(boardId, activity) {
    try {
        const savedBoard = await boardService.addActivity(boardId, activity)
        store.dispatch(getCmdSetBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot add activity', err)
        throw err
    }
}

export async function addTask(boardId, groupId, taskTitle) {
    try {
        const title = taskTitle.trim()
        if (!title) return

        const board = await boardService.getById(boardId)

        if (!board) throw new Error('Board not found')

        const groupExists = board.groups.some(
            group => group.id === groupId
        )

        if (!groupExists) throw new Error('Group not found')

        const newTask = {
            id: makeId(),
            title,
            description: '',
            labelIds: [],
            memberIds: [],
            comments: [],
            checklists: [],
            dueDate: '',
            style: {}
        }

        const updatedGroups = board.groups.map(group => {
            if (group.id !== groupId) return group

            return {
                ...group,
                tasks: [...(group.tasks || []), newTask]
            }
        })

        const updatedBoard = {
            ...board,
            groups: updatedGroups
        }

        const savedBoard = await boardService.save(updatedBoard)

        store.dispatch(getCmdSetBoard(savedBoard))

        return newTask

    } catch (err) {
        console.error('Cannot add task:', err)
        throw err
    }
}

export async function removeTask(boardId, groupId, taskId) {
    try {
        const board = await boardService.getById(boardId)

        if (!board) throw new Error('Board not found')

        const updatedGroups = board.groups.map(group => {
            if (group.id !== groupId) return group

            return {
                ...group,
                tasks: group.tasks.filter(task => task.id !== taskId)
            }
        })

        const updatedBoard = {
            ...board,
            groups: updatedGroups
        }

        const savedBoard = await boardService.save(updatedBoard)

        store.dispatch(getCmdSetBoard(savedBoard))

        return savedBoard
    } catch (err) {
        console.error('Cannot remove task:', err)
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
export async function moveGroup(boardId, draggedGroupId, targetGroupId, position = 'before') {
    try {
        const board = await boardService.getById(boardId)

        if (!board) throw new Error('Board not found')

        const updatedGroups = reorderGroups(board.groups, draggedGroupId, targetGroupId, position)

        if (updatedGroups === board.groups) return

        const updatedBoard = {
            ...board,
            groups: updatedGroups
        }

        const savedBoard = await boardService.save(updatedBoard)

        store.dispatch(getCmdSetBoard(savedBoard))

        return savedBoard
    } catch (err) {
        console.error('Cannot move group:', err)
        throw err
    }
}


export async function moveTask(
    boardId,
    groupId,
    draggedTaskId,
    targetTaskId,
    position = 'before'
) {
    try {
        const board = await boardService.getById(boardId)

        if (!board) throw new Error('Board not found')

        const updatedGroups = reorderTasks(
            board.groups,
            groupId,
            draggedTaskId,
            targetTaskId,
            position
        )

        const updatedBoard = {
            ...board,
            groups: updatedGroups
        }

        const savedBoard = await boardService.save(updatedBoard)

        store.dispatch(getCmdSetBoard(savedBoard))

        return savedBoard
    } catch (err) {
        console.error('Cannot move task:', err)
        throw err
    }
}


export async function transferTask(
    boardId,
    sourceGroupId,
    targetGroupId,
    taskId,
    targetTaskId = null
) {
    try {
        const board = await boardService.getById(boardId)

        if (!board) throw new Error('Board not found')

        const updatedGroups = moveTaskBetweenGroups(
            board.groups,
            sourceGroupId,
            targetGroupId,
            taskId,
            targetTaskId
        )

        // Don't save if nothing changed
        if (updatedGroups === board.groups) return

        const updatedBoard = {
            ...board,
            groups: updatedGroups
        }

        const savedBoard = await boardService.save(updatedBoard)

        store.dispatch(getCmdSetBoard(savedBoard))

        return savedBoard

    } catch (err) {
        console.error('Cannot transfer task:', err)
        throw err
    }
}

