export const SET_BOARDS = 'SET_BOARDS'
export const SET_BOARD = 'SET_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const EDIT_BOARD = 'EDIT_BOARD'
export const ADD_BOARD_MSG = 'ADD_BOARD_MSG'

const initialState = {
  boards: [],
  board: null,
}

export function boardReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_BOARDS:
      return { ...state, boards: action.boards }
    case SET_BOARD:
      return { ...state, board: action.board }
    case REMOVE_BOARD: {
      const lastRemovedBoard = state.boards.find(board => board._id === action.boardId)
      const boards = state.boards.filter(board => board._id !== action.boardId)
      return { ...state, boards, lastRemovedBoard }
    }
    case ADD_BOARD:
      return { ...state, boards: [...state.boards, action.board] }
    case EDIT_BOARD: {
      const boards = state.boards.map(board =>
        board._id === action.board._id ? action.board : board)
      return { ...state, boards }
    }
    case ADD_BOARD_MSG:
      if (action.msg && state.board) {
        return {
          ...state,
          board: {
            ...state.board,
            msgs: [...(state.board.msgs || []), action.msg],
          },
        }
      }
      return state
    default:
      return state
  }
}
