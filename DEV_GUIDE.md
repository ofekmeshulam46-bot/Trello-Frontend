# Yeyllo Frontend: Developer Guide

This guide is for developers who are new to the codebase. It covers:

1. How the app is put together (layers, folders, routing)
2. How data flows: **Component → Action → Service → Storage/Backend → Store → UI**
3. How CRUD works for boards, groups (lists), tasks (cards) and the things inside a card
4. The JSON data model, field by field
5. Steps for building a new Trello clone with the same structure
6. Known quirks and bugs to watch for

---

## 1. Tech stack

| Concern | Library |
|---|---|
| UI | React 18 + Vite |
| Routing | react-router-dom v6 (nested routes) |
| State | Redux (`legacy_createStore`, no toolkit, no thunk) |
| HTTP | axios (`withCredentials: true`, cookie auth) |
| Real-time | socket.io-client |
| Drag & drop | react-beautiful-dnd |
| Styling | SCSS (`src/assets/styles`) |
| Images | Cloudinary (upload from the browser) |
| Misc | dayjs, react-datepicker, quill (rich text), colorthief (board color), MUI |

---

## 2. Folder structure

```
Yeyllo-Frontend/
├── data/
│   ├── board.js          ← seed data: demo boards, background palette, workspace (used in LOCAL mode)
│   └── data.json         ← a sample of a single board document (handy reference)
├── public/img, fonts…    ← static assets
└── src/
    ├── index.jsx         ← mounts <Provider store> + <BrowserRouter> + <RootCmp>
    ├── RootCmp.jsx       ← AppHeader + all <Routes>
    ├── pages/            ← route-level components (smart / connected to store)
    │   ├── HomePage, Login, Signup, LoginSignup
    │   ├── workspace/BoardIndex.jsx   ← list of boards (/workspace/home)
    │   ├── BoardDetails.jsx           ← one board: groups + DnD (/board/:boardId)
    │   └── TaskDetails.jsx            ← card modal (/board/:boardId/:groupId/task/:taskId)
    ├── cmps/             ← presentational + feature components
    │   ├── GroupList → GroupPreview → TaskList → TaskPreview
    │   ├── Labels, Members, Checklist, Dates, Cover, Attachment, Description…
    │   ├── board/ (BoardHeader, BoardFilter, boardMenu/*)
    │   └── workspace/ (BoardList, BoardPreview, AddBoard modal…)
    ├── services/
    │   ├── board/index.js               ← PUBLIC board service (picks local or remote)
    │   ├── board/board.service.local.js ← localStorage implementation
    │   ├── board/board.service.remote.js← REST implementation (axios)
    │   ├── user/…                       ← same local/remote pattern for auth & users
    │   ├── workspace/workspace.service.js
    │   ├── async-storage.service.js     ← fake async DB on top of localStorage
    │   ├── http.service.js              ← axios wrapper (BASE_URL, 401 handling)
    │   ├── socket.service.js            ← socket.io wrapper
    │   ├── event-bus.service.js         ← pub/sub for toast messages (showSuccessMsg/showErrorMsg)
    │   ├── upload.service.js            ← Cloudinary upload
    │   └── util.service.js              ← makeId, storage helpers, color helpers, debounce
    └── store/
        ├── store.js                     ← combineReducers({ boardModule, userModule, systemModule })
        ├── actions/board.actions.js     ← async functions: call service, then dispatch
        ├── actions/user.actions.js
        └── reducers/*.reducer.js
```

---

## 3. Architecture in one picture

```
┌──────────────┐   calls    ┌──────────────────┐   calls   ┌──────────────────────┐
│  Component   │ ─────────► │  Store Action    │ ────────► │  boardService        │
│ (page / cmp) │            │ board.actions.js │           │  services/board/     │
└──────▲───────┘            └────────┬─────────┘           └─────────┬────────────┘
       │ useSelector                 │ store.dispatch                │
       │                             ▼                               ▼
┌──────┴───────┐            ┌──────────────────┐        VITE_LOCAL=true?  ── yes ──► localStorage
│ Redux Store  │ ◄───────── │  board.reducer   │                  │                (async-storage)
│ boardModule  │  newState  └──────────────────┘                  no
└──────▲───────┘                                                  ▼
       │  dispatch UPDATE_BOARD                          http.service (axios)
       │                                                          ▼
       └──────────── socket 'board-updated' ◄──────── Backend (Node/Express/Mongo)
```

Rules the code follows:

- **Components never call `httpService` or `localStorage` directly.** They call **actions** (or, in a few places, `boardService` helpers).
- **Actions** are plain `async` functions, not thunks. They import `store` and call `store.dispatch(...)` themselves.
- **Reducers** are pure and only replace state.
- **There is one "aggregate": the board.** Groups, tasks, checklists, labels and members all live *inside* the board document. There is no `groupService` or `taskService`. To change a task you change the board and save the whole board.

---

## 4. App boot flow

1. `index.jsx` renders `<Provider store>` → `<Router>` → `<RootCmp>`.
2. Importing the store runs the reducers' `initialState`:
   - `userModule.user = userService.getLoggedinUser()` (read from **sessionStorage**; the remote service falls back to a hard-coded **Guest** user).
   - `boardModule.filterBy = boardService.getDefaultFilter()`.
3. Importing `board.service.local.js` runs `_createBoards()`. If `localStorage.board` is empty, it seeds it from `data/board.js`. The workspace service does the same for `workspace`.
4. Importing `socket.service.js` runs `socketService.setup()`. It connects to `//localhost:3030` (dev) or the same origin (prod), and emits `set-user-socket` when a user is logged in.
5. `RootCmp` renders `<AppHeader>` (hidden on `/login`) and the routes.

### Routes

| Path | Element | Notes |
|---|---|---|
| `/` | redirects to `/home` | |
| `/home` | `HomePage` | marketing page |
| `/login`, `/login/signup` | `LoginSignup` → `Login` / `Signup` | nested via `<Outlet>` |
| `/workspace/home` | `BoardIndex` | all boards |
| `/workspace/templates` | `Templates` | |
| `/board/:boardId` | `BoardDetails` | the board view |
| `/board/:boardId/:groupId/task/:taskId` | `TaskDetails` | **nested route**. Rendered through an `<Outlet>` inside `TaskPreview.jsx`, which opens the card modal |
| `/user/:id` | `UserDetails` | |

---

## 5. Local vs remote services (the most important pattern)

`src/services/board/index.js`:

```js
const { DEV, VITE_LOCAL } = import.meta.env
import { boardService as local }  from './board.service.local'
import { boardService as remote } from './board.service.remote'

const service = VITE_LOCAL === 'true' ? local : remote
export const boardService = {
  getEmptyBoard, getDefaultFilter, getBackgroundPallet,
  getBackgroundEmoji, getArchivedItems,   // shared helpers (no I/O)
  ...service                              // query/getById/save/remove/... from local OR remote
}
```

- `npm run dev` uses the **remote** service. It needs the backend on `localhost:3030`.
- `npm run dev:local` (Windows) or `npm run dev:local:mac` sets `VITE_LOCAL=true` and uses **localStorage**.
- The user service (`services/user/index.js`) uses the same switch.

Both implementations expose the same interface, so actions and components don't know which one is active.

### 5.1 `async-storage.service.js`: a fake DB

It simulates a REST backend over `localStorage`, with a 500ms delay:

| Function | What it does |
|---|---|
| `query(entityType)` | returns the whole array stored under the key |
| `get(entityType, id)` | finds by `_id`, throws if missing |
| `post(entityType, entity)` | assigns a random 5-char `_id`, pushes, saves |
| `put(entityType, entity)` | merges `{...old, ...new}` by `_id`, saves |
| `remove(entityType, id)` | splices by `_id`, saves |

### 5.2 `board.service.local.js`

| Function | Implementation |
|---|---|
| `query(filterBy)` | `storageService.query('board')` (text filter is mostly leftover) |
| `getById(id)` | `storageService.get('board', id)` |
| `save(board)` | has `_id` → `put`, otherwise adds `createdAt` → `post` |
| `remove(id)` | `storageService.remove` |
| `uploadImg(file)` | Cloudinary upload |

### 5.3 `board.service.remote.js`: the REST contract

The backend must implement these endpoints (prefix `/api/`):

| Function | HTTP | Endpoint | Body / params |
|---|---|---|---|
| `query(filterBy)` | GET | `board` | query params = filterBy |
| `getById(id)` | GET | `board/:id` | |
| `save(board)` (new) | POST | `board` | full board |
| `save(board)` (existing) | PUT | `board/:id` | full board (without `activities`) |
| `remove(id)` | DELETE | `board/:id` | |
| `addActivity(activity)` | POST | `board/:boardId/activity` | one activity object |
| `addBoardMsg(id, txt)` | POST | `board/:id/msg` | `{ txt }` |
| `generateAiBoard(topic, urls)` | POST | `board/generate-board` | `{ topic, urls }` (OpenAI on the server) |

`getFilteredBoard(board, filterBy)` is a **pure client-side** function. It deep-clones the board and filters tasks by `keyword` (task title or label title) and `members` (a member id, or `'no-member'`).

Auth (user.service.remote): `POST auth/login`, `POST auth/signup`, `POST auth/logout`, `GET user`, `GET/PUT/DELETE user/:id`.

`http.service.js` returns `res.data` and logs errors. On **401** it redirects to `/`.

---

## 6. Redux store

```js
combineReducers({
  boardModule:  boardReducer,   // workspace, boards, board, filterBy, labels, members, dynamicBg, brightness, lastBoard
  userModule:   userReducer,    // user (logged in), users, watchedUser
  systemModule: systemReducer,  // isLoading
})
```

### boardModule state

| Key | Meaning |
|---|---|
| `boards` | array for the board index page |
| `board` | the **currently open board** (full document) |
| `lastBoard` | snapshot used to undo after a failed optimistic update |
| `filterBy` | `{ keyword, members: [] }` for filtering tasks inside a board |
| `labels` | the 6 default label colors, merged with `board.labels` on `SET_BOARD` |
| `members` | `board.members` (shortcut) |
| `workspace` | workspace object |
| `dynamicBg`, `brightness` | header color and theme computed from the board background |

### Board action types

`SET_BOARDS`, `SET_BOARD`, `ADD_BOARD`, `UPDATE_BOARD`, `REMOVE_BOARD`, `UNLOAD_BOARD`, `BOARD_UNDO`, `SET_FILTER_BY`, `SET_WORKSPACE`, `SET_DYNAMIC_BG`, `SET_BRIGHTNESS`, `SET_LABELS`.

### Actions (`store/actions/board.actions.js`)

| Action | Flow |
|---|---|
| `loadBoards()` | `boardService.query(filterBy)` → `SET_BOARDS` |
| `loadBoard(id)` | `boardService.getById(id)` → `SET_BOARD` |
| `addBoard(board)` | `boardService.save(board)` → `addActivity("created this board")` → `ADD_BOARD` → returns the saved board (the caller navigates to it) |
| `updateBoard(board, activity?)` | if there's an activity → `boardService.addActivity(activity)`; then **strips `activities`** and calls `boardService.save(board)` → `UPDATE_BOARD` |
| `updateBoardOptimistic(board)` | dispatch `UPDATE_BOARD` **first**, then save; on error → `BOARD_UNDO` (restores `lastBoard`). Used for drag & drop so the UI doesn't jump |
| `removeBoard(id)` | `boardService.remove` → `REMOVE_BOARD` |
| `setFilterBy`, `setBrightness`, `setDynamicBg`, `unloadBoard`, `loadWorkspace` | simple dispatches |

---

## 7. CRUD flows by entity

Every CRUD operation below a board ends the same way:

> **copy/modify the board → `onUpdateBoard(board, activity)` → `updateBoard()` → `PUT /api/board/:id` → `UPDATE_BOARD` → re-render.**

`BoardDetails` owns `onUpdateBoard` and passes it down as a prop:
`BoardDetails → GroupList → GroupPreview → TaskList → TaskPreview`.

### 7.1 Board

| Op | Where | How |
|---|---|---|
| **Read all** | `BoardIndex.jsx` | `useEffect → loadBoards()`, then `useSelector(boardModule.boards)` |
| **Read one** | `BoardDetails.jsx` | `useEffect([boardId]) → loadBoard(boardId)`; on unmount → `unloadBoard()` |
| **Create** | `AddBoard` modal / `AppHeader` / `CopyBoard` / `AiModal` | build from `boardService.getEmptyBoard()`, set title & style → `addBoard(board)` → `navigate('/board/' + saved._id)` |
| **Update** (title, star, background) | `BoardHeader`, `BoardMenu`, `Dropdown` | `updateBoard({...board, isStarred: !board.isStarred})` |
| **Delete / close** | `CloseBoard.jsx` | `removeBoard(id)` → navigate to `/workspace/home` |

### 7.2 Group (list)

| Op | File | Code idea |
|---|---|---|
| Create | `GroupList.jsx › onAddGroup` | `const g = getEmptyGroup(); g.title = title; board.groups.push(g); onUpdateBoard(board, activity)` |
| Rename | `GroupPreview.jsx › onEditTitleGroup` | find group → set `title` → `onUpdateBoard(board)` |
| Color / collapse | `GroupPreview.jsx › onChangeGroupColor / onCollapse` | change `group.style` or `group.isCollapsed` → save |
| Copy | `GroupMenu.jsx › onCopyGroup` | clone the group with new ids → insert → save |
| Delete | `GroupPreview.jsx › onRemoveGroup` | `board.groups.splice(idx, 1)` → `onUpdateBoard(board, activity)` |
| Reorder | `BoardDetails.jsx › handleDragDrop (type 'group')` | splice in `board.groups` → `onUpdateBoard` |

### 7.3 Task (card)

| Op | File | Code idea |
|---|---|---|
| Create | `TaskList.jsx › onAddTask` | `{ id: makeId(), title, coverSize: 'half' }` pushed to `group.tasks` → save with activity |
| Open | `TaskPreview.jsx` | `navigate('/board/:boardId/:groupId/task/:taskId')` → `<Outlet>` renders `TaskDetails` |
| Edit | `TaskDetails.jsx` | the task is copied into local state `task`; sub-components call `setTask(...)`; on close / backdrop click → `onSaveTask()` replaces the task in its group → `saveBoard()` → `updateBoard(boardToSave, activity)` |
| Delete | `TaskDetails.jsx › onRemoveTask` | filter the task out of the group → save with activity |
| Archive | set `task.archivedAt = Date.now()`; `boardService.getArchivedItems(board)` lists them in `ArchiveMenu` |
| Move / reorder | `BoardDetails.jsx › handleDragDrop (type task)` | remove from the source group's tasks, insert into the destination group's tasks → `updateBoardOptimistic(board)` |

### 7.4 Inside a task (all edit the local `task` in TaskDetails, saved on close)

| Feature | Component | Field changed |
|---|---|---|
| Members | `Members.jsx` | `task.memberIds: string[]` (ids from `board.members`) |
| Labels | `Labels.jsx`, `LabelEdit.jsx` | `task.labelIds: string[]` (ids from `board.labels`); editing a label's text or color edits `board.labels` |
| Checklists / todos | `AddChecklist.jsx`, `Checklist.jsx` | `task.checklists[].todos[]` (`{id, title, isDone}`) |
| Dates | `Dates.jsx` | `task.dueDate`, `task.startDate`, `task.isDone` |
| Cover | `Cover.jsx`, `CoverSize.jsx` | `task.style.backgroundColor` / `backgroundImage`, `task.coverSize: 'half'|'full'` |
| Attachments | `Attachment/*` | `task.attachments[]` (Cloudinary URLs) |
| Description | `Description.jsx` (Quill) | `task.description` (HTML string) |
| Drawing | `Canvas.jsx` | saved as an image attachment / cover |

### 7.5 Activities

Activities are **never saved as part of the board PUT**. `updateBoard` removes `activities` from the payload and sends one activity separately:

```js
const activity = {
  txt: `added card "${title}" to "${group.title}"`,
  boardId, groupId, taskId,                       // null when not relevant
  byMember: { _id, fullname, imgUrl },
  createdAt: Date.now(),
}
await updateBoard(board, activity)   // → POST /api/board/:boardId/activity
```

The backend `$push`es it into `board.activities` and can broadcast it over sockets. `boardMenu/Activity.jsx` reads `board.activities`.

### 7.6 Filtering a board

`BoardFilter.jsx` → `setFilterBy({keyword, members})` → `SET_FILTER_BY`
→ `BoardDetails` `useEffect([board, filterBy])` → `boardService.getFilteredBoard(board, filterBy)` → local `filteredBoard` state.

`GroupList` receives **both** `board={filteredBoard}` (for display) and `originBoard={board}` (the real one).

### 7.7 Real-time (sockets)

`BoardDetails.jsx`:

```js
socketService.emit('join-board', boardId)                      // on mount
socketService.on('board-updated', b => dispatch({type: UPDATE_BOARD, board: b}))
// on unmount: off('board-updated'), emit('leave-board', boardId)
```

When another user saves, the server emits `board-updated` to that board's room, and every open client replaces its board. There is **no conflict resolution**; the last write wins.

### 7.8 User messages (toasts)

`showSuccessMsg(txt)` / `showErrorMsg(txt)` emit on `eventBus`. The `<UserMsg>` component in `RootCmp` listens and shows the toast.

---

## 8. The JSON data model

### 8.1 Board (the main document; one Mongo document per board)

```jsonc
{
  "_id": "b101",                         // DB id (Mongo ObjectId / 5-char id in local mode)
  "title": "Robot dev proj",
  "isStarred": true,                     // shown in "Starred boards"
  "archivedAt": null,                    // timestamp when the board was closed/archived
  "createdAt": 1731412138862,
  "createdBy": {                         // MINI-USER (denormalized copy, not a reference)
    "_id": "u101", "fullname": "Abi Abambi", "imgUrl": "/img/user/gal.png"
  },

  "style": {                             // spread straight onto the root <div> style
    "backgroundImage": "url(https://res.cloudinary.com/.../starry-night.jpg)",
    "backgroundColor": ""                // used for plain color backgrounds
  },
  "urls": { "regular": "https://…jpg" }, // raw image url (used for previews / colorthief)

  "labels": [                            // board-level label definitions
    { "id": "l101", "title": "Done",     "color": "#4BCE97", "fontColor": "#164b35" },
    { "id": "l102", "title": "Progress", "color": "#F5CD47" }
  ],

  "members": [                           // who can be assigned to cards (mini-users)
    { "_id": "u101", "fullname": "Abi Abambi", "imgUrl": "/img/user/gal.png" }
  ],

  "groups": [ /* see 8.2 – order in the array = order on screen */ ],

  "activities": [ /* see 8.4 – newest first */ ]
}
```

### 8.2 Group (a list / column)

```jsonc
{
  "id": "g101",            // client-generated with makeId() (NOT _id: it's a sub-document)
  "title": "To Do",
  "archivedAt": null,
  "isCollapsed": false,    // collapsed column
  "style": {               // header color picked from groupColorPalette
    "backgroundColor": "#BAF3DB"
  },
  "tasks": [ /* see 8.3 – order in array = order in column */ ]
}
```

### 8.3 Task (a card)

```jsonc
{
  "id": "c104",                     // makeId()
  "title": "Help me",
  "description": "<p>rich text from Quill</p>",
  "archivedAt": null,               // archived cards are hidden but kept
  "isDone": false,                  // "complete" checkbox on dates
  "startDate": null,
  "dueDate": "2024-11-11",          // ⚠ the seed data mixes '2024-11-11' and '11/12/2024' formats
  "status": "inProgress",           // optional (Monday-style leftover)
  "priority": "high",               // optional

  "memberIds": ["u101"],            // → board.members[]._id
  "labelIds":  ["l101", "l102"],    // → board.labels[].id

  "checklists": [
    {
      "id": "YEhmF",
      "title": "Checklist",
      "todos": [
        { "id": "212jX", "title": "To Do 1", "isDone": false }
      ]
    }
  ],

  "attachments": ["https://res.cloudinary.com/.../file.png"],

  "coverSize": "half",              // 'half' = strip above title, 'full' = whole card
  "style": {                        // card cover
    "backgroundColor": "#26de81"
    // or "backgroundImage": "url(...)"
  },

  "byMember": { "_id": "u101", "fullname": "Tal", "imgUrl": "…" },  // creator
  "comments": [                     // optional; Trello-style comments can also be activities
    { "id": "ZdPnm", "title": "please CR this", "createdAt": 1590999817436,
      "byMember": { "_id": "u101", "fullname": "Tal", "imgUrl": "…" } }
  ]
}
```

**Why ids instead of objects for members and labels?** When you rename a label or change its color in `board.labels`, every card that holds its id updates automatically. A card shows a label like this:
`task.labelIds.map(id => board.labels.find(l => l.id === id))`.

### 8.4 Activity

```jsonc
{
  "id": "a101",                    // set by the backend
  "txt": "added card \"Fix bug\" to \"To Do\"",
  "boardId": "b101",
  "groupId": "g101",               // or null
  "taskId":  "c101",               // or null
  "byMember": { "_id": "u101", "fullname": "Abi Abambi", "imgUrl": "…" },
  "createdAt": 1731412138862
}
```

To show a task's own activity, filter `board.activities` by `taskId`. Nothing is stored per task.

### 8.5 User

```jsonc
// in DB
{ "_id": "u101", "username": "abi@ababmi.com", "password": "<hashed>",
  "fullname": "Abi Abambi", "imgUrl": "/img/user/gal.png", "isAdmin": false }

// in sessionStorage 'loggedinUser' (mini-user, no password)
{ "_id": "u101", "fullname": "Abi Abambi", "imgUrl": "/img/user/gal.png", "isAdmin": false }
```

### 8.6 Other seed data (`data/board.js`)

- `backgroundPallet.photos`: Cloudinary photo URLs for board backgrounds.
- `backgroundPallet.colors`: gradient SVG URLs and plain `rgb()` colors.
- `backgroundEmoj`: emoji shown on the gradient color tiles.
- `workspace`: `{ title, memebers: [] }` (note the typo).
- The file ends with commented "guidelines" from the course (activity design, Monday dynamic cmps). Reading them is worthwhile.

### 8.7 Relations at a glance

```
Board ─┬─ labels[]      {id,title,color}          ◄── task.labelIds[]
       ├─ members[]     {_id,fullname,imgUrl}     ◄── task.memberIds[]
       ├─ activities[]  {txt,boardId,groupId,taskId,byMember,createdAt}
       └─ groups[] ── tasks[] ─┬─ checklists[] ── todos[]
                               ├─ attachments[]
                               └─ style / coverSize / dates
```

---

## 9. Build a new Trello clone with this structure

Follow these steps in order. Each step leaves you with a working app.

### Step 1: Scaffold

```bash
npm create vite@latest my-trello -- --template react
cd my-trello
npm i react-router-dom redux react-redux axios socket.io-client react-beautiful-dnd dayjs
npm i -D sass
```

Add scripts to `package.json`:

```json
"dev": "vite",
"dev:local": "set VITE_LOCAL=true&&vite",
"dev:local:mac": "export VITE_LOCAL=true && vite"
```

### Step 2: Base services (copy these almost verbatim)

1. `services/util.service.js`: `makeId`, `saveToStorage`, `loadFromStorage`, `debounce`.
2. `services/async-storage.service.js`: `query/get/post/put/remove` (section 5.1).
3. `services/http.service.js`: an axios instance with `BASE_URL` and `withCredentials`.
4. `services/event-bus.service.js` and a `<UserMsg>` component.

### Step 3: Seed data

Create `data/board.js` exporting `boardData = { boards: [...] }`, using the shape in section 8. Start small: one board, two groups, three tasks.

### Step 4: Board service (local first)

```js
// services/board/board.service.local.js
const KEY = 'board'
_createBoards()
export const boardService = { query, getById, save, remove, addActivity, getFilteredBoard }

function query()        { return storageService.query(KEY) }
function getById(id)    { return storageService.get(KEY, id) }
function remove(id)     { return storageService.remove(KEY, id) }
function save(board)    { return board._id ? storageService.put(KEY, board)
                                           : storageService.post(KEY, { ...board, createdAt: Date.now() }) }
async function addActivity(activity) {          // emulate the backend $push
  const board = await getById(activity.boardId)
  board.activities = [{ id: makeId(), ...activity }, ...(board.activities || [])]
  return storageService.put(KEY, board)
}
function _createBoards() { if (!loadFromStorage(KEY)?.length) saveToStorage(KEY, boardData.boards) }
```

Then `board.service.remote.js` with the same functions using `httpService` (section 5.3), and `board/index.js` that picks one of them and adds `getEmptyBoard`, `getEmptyGroup`, `getEmptyTask`, `getDefaultFilter`.

> Put `getFilteredBoard` in `index.js` (shared), **not** only in `remote`. It's pure logic, so local mode needs it too.

### Step 5: Store

1. `store/reducers/board.reducer.js` with `SET_BOARDS, SET_BOARD, ADD_BOARD, UPDATE_BOARD, REMOVE_BOARD, BOARD_UNDO, SET_FILTER_BY`.
2. `store/store.js` with `combineReducers` and Redux DevTools.
3. `store/actions/board.actions.js` with `loadBoards, loadBoard, addBoard, updateBoard, updateBoardOptimistic, removeBoard`.
4. Do the same for the user (`SET_USER`, login, signup, logout).

### Step 6: Routing and pages

```
/                         → redirect /home
/workspace/home           → BoardIndex       (loadBoards, BoardList, AddBoard modal)
/board/:boardId           → BoardDetails     (loadBoard, GroupList, DnD)
  :groupId/task/:taskId   → TaskDetails      (nested: render an <Outlet/>)
/login, /login/signup     → LoginSignup      (<Outlet/>)
```

### Step 7: The board view component tree

```
BoardDetails  (owns onUpdateBoard, DragDropContext, sockets, filter)
 ├─ BoardHeader   (title, star, filter, menu button)
 ├─ GroupList     (Droppable "ROOT" type="group", add-list form)
 │   └─ GroupPreview   (Draggable, header/menu, color, collapse)
 │       └─ TaskList   (Droppable droppableId={group.id}, add-card form)
 │           └─ TaskPreview  (Draggable, labels/members/badges, <Outlet/>)
 └─ BoardMenu     (background, activity, archive, copy, close)
```

### Step 8: CRUD, always the same recipe

```js
// e.g. add task
const boardToSave = structuredClone(board)              // ✅ clone, don't mutate store state
const group = boardToSave.groups.find(g => g.id === groupId)
group.tasks.push({ id: makeId(), title })
await updateBoard(boardToSave, {
  txt: `added card "${title}" to "${group.title}"`,
  boardId: board._id, groupId, taskId: null,
  byMember: miniUser, createdAt: Date.now(),
})
```

Do it in this order: group add/rename/delete → task add/delete → TaskDetails with members, labels, checklists, dates, cover → attachments → archive.

### Step 9: Drag & drop

Wrap the board in `<DragDropContext onDragEnd>`. Use **one** handler and switch on `type`:

- `type === 'group'`: reorder `board.groups`.
- otherwise: move a task between `source.droppableId` and `destination.droppableId` (these are group ids).
- Save with `updateBoardOptimistic` so the drop doesn't flicker.

### Step 10: Backend and real-time

The backend needs the REST endpoints from section 5.3, plus socket rooms by `boardId`:
- `join-board` / `leave-board` → `socket.join(boardId)` / `socket.leave(boardId)`
- After every `PUT board/:id`, emit `board-updated` with the saved board to the room (excluding the sender).

### Step 11: Polish

Filters, background picker (colorthief to compute header brightness), toasts, loader, AI board generation, and so on.

---

## 10. Known quirks and bugs (read before you change things)

| # | Where | Issue | Fix |
|---|---|---|---|
| 1 | `board.service.local.js` | Missing `addActivity`, `getFilteredBoard`, `generateAiBoard`. **Local mode crashes** when you open a board (`getFilteredBoard is not a function`) | Add them (see step 4), or move `getFilteredBoard` to `board/index.js` |
| 2 | `board.actions.js › addBoard` | `getCmdAddBoard(savedBoard.activities.unshift(activity))` dispatches a **number** (unshift returns the new length) | `savedBoard.activities.unshift(activity); dispatch(getCmdAddBoard(savedBoard))` |
| 3 | `GroupList`, `GroupPreview`, `TaskList`, `BoardDetails` DnD | They **mutate store state directly** (`board.groups.push`, `splice`) before dispatch. React may not re-render, and `BOARD_UNDO` can't restore | Clone first (`structuredClone(board)`) |
| 4 | `board/index.js › getEmptyBoard` | Calls the `useSelector` hook inside a regular function. That only works when it's called during a component render | Pass the user as an argument or use `store.getState()` |
| 5 | `board.service.local.js › query(filterBy = { closed })` | `closed` resolves to `window.closed` by accident | `query(filterBy = {})` |
| 6 | `workspace.service.js › save` | Assigns `updatedWorkspace` without declaring it, which throws in strict mode | `const updatedWorkspace = …` |
| 7 | `user.service.*.js › addActivity` | Calls `_saveUser`, which doesn't exist | Implement it or remove it |
| 8 | Seed data | Typos: `activites` (some boards) and `memebers` (workspace). Mixed `dueDate` formats | Normalize to `activities`, `members`, ISO dates or timestamps |
| 9 | `BoardDetails.jsx` | `baseTheme` is defined twice, and `catch { console.log(err) }` references an undefined `err` | Clean up |
| 10 | Sockets | `socket.service.js` connects even in local mode and logs connection errors | Skip `setup()` when `VITE_LOCAL === 'true'` |
| 11 | Concurrency | The whole board is PUT on every change, and the last write wins | Acceptable for the course. For production, save at the task level or add versioning |

---

## 11. Quick debugging tips

- In dev, `window.boardService`, `window.userService` and `window.socketService` are exposed. Try `await boardService.query()` in the console.
- Use the Redux DevTools extension. Every `UPDATE_BOARD` shows the full board.
- To reset local data, run `localStorage.removeItem('board')` and refresh. The seed reloads.
- Remote mode needs the backend running on **port 3030**, and cookies must be allowed (`withCredentials`).
