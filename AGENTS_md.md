# AGENTS.md — Frontend Coding Conventions

This repo is a **starter template**. New projects are built from it, so its domain (cars, reviews, chat...) will be replaced, but the **coding conventions stay**. Follow this file whenever you add or change code.

## How to read this file

- `<entity>` / `<entities>` = your domain entity in camelCase, singular and plural (e.g. `toy` / `toys`, `stay` / `stays`, `board` / `boards`).
- `<Entity>` = PascalCase (`Toy`). `<ENTITY>` = UPPER_SNAKE_CASE (`TOY`). `<entity-kebab>` = kebab-case (`toy-preview`).
- Code samples use a sample entity called **`toy`** so they stay valid JS. Replace it with your own entity. The template's `car` files follow exactly the same pattern.
- Rules are written generically. When the code and this file disagree, **this file wins** (see [Anti-patterns](#anti-patterns--do-not-copy)).

### What is infrastructure (keep) vs. demo (replace)

| Keep and reuse (infrastructure) | Demo content (replace with your domain) |
|---|---|
| `services/async-storage.service.js`, `http.service.js`, `event-bus.service.js`, `socket.service.js`, `upload.service.js`, `util.service.js` | `services/car/*`, `services/review/*` |
| `services/user/*` (auth / logged-in user) | `store/*/car.*`, `store/*/review.*` |
| `store/store.js`, `user.reducer/actions`, `system.reducer` | `pages/CarIndex`, `CarDetails`, `ReviewIndex`, `Chat`, `AboutUs`, `HomePage` contents |
| `RootCmp.jsx`, `AppHeader`, `AppFooter`, `UserMsg`, `ImgUploader`, `LoginSignup` | `cmps/Car*`, `cmps/Review*` |
| `customHooks/*` | `cmps/car/*.css`, `cmps/review/*.css`, `AboutUs.css` demo classes |
| `assets/styles/setup`, `basics`, `main.css` structure | the color values in `var.css` (keep the variable **names**) |

---

## 1. Stack & scripts

- **React 18** (function components + hooks only), **Vite**, **React Router v6**, **Redux 4** (`legacy_createStore`, no Redux Toolkit), **react-redux**, **axios**, **socket.io-client**.
- Plain **CSS** with native nesting. No CSS modules, no Sass, no Tailwind, no CSS-in-JS, no UI component libraries unless the team agrees to add one.
- Scripts:
  - `npm run dev` — **remote** services (backend at `//localhost:3030/api/`)
  - `npm run dev:local` (Windows) / `npm run dev:local:mac` — sets `VITE_LOCAL=true` → services use **localStorage** with no backend
  - `npm run build`, `npm run lint`

---

## 2. Folder structure

```
src/
  index.jsx                    # Provider + Router + the main.css import
  RootCmp.jsx                  # App shell (header, UserMsg, <main> + <Routes>, footer)
  pages/                       # Route-level components: <Entity>Index, <Entity>Details, ...
  cmps/                        # Reusable components: <Entity>List, <Entity>Preview, <Entity>Filter, <Entity>Edit, ...
  customHooks/                 # use<Name>.js
  services/
    async-storage.service.js   # localStorage "fake backend"
    http.service.js            # axios wrapper
    event-bus.service.js       # user messages (toasts)
    socket.service.js          # socket.io wrapper + event name constants
    upload.service.js          # Cloudinary upload
    util.service.js            # generic helpers
    <entity>/
      index.js                     # picks local/remote + shared helpers
      <entity>.service.local.js    # localStorage implementation
      <entity>.service.remote.js   # HTTP implementation
  store/
    store.js
    actions/<entity>.actions.js
    reducers/<entity>.reducer.js
  assets/styles/
    main.css                   # the ONLY CSS imported from JS; @imports everything else
    setup/                     # var.css (design tokens), typography.css
    basics/                    # helpers.css, layout.css, base.css, forms.css
    cmps/                      # one CSS file per component/page
      <entity>/                # grouped by entity
```

---

## 3. Naming

| Thing | Convention | Example (`toy`) |
|---|---|---|
| Component file | PascalCase `.jsx` | `ToyPreview.jsx` |
| Component | named `export function`, same name as the file | `export function ToyPreview({ toy })` |
| List page | `<Entity>Index` | `ToyIndex` |
| Single-item page | `<Entity>Details` | `ToyDetails` |
| Child components | `<Entity>List`, `<Entity>Preview`, `<Entity>Edit`, `<Entity>Filter` | `ToyList` |
| Service file | kebab-case + `.service.js`; per-entity: `<entity>.service.local.js` / `.remote.js` | `toy.service.local.js` |
| Service object | `<entity>Service` | `toyService` |
| Actions file | `<entity>.actions.js` | `toy.actions.js` |
| Reducer file / function | `<entity>.reducer.js` / `<entity>Reducer` | `toyReducer` |
| Store slice key | `<entity>Module` | `toyModule` |
| Action type constant | `UPPER_SNAKE_CASE`, value = the same string | `export const SET_TOYS = 'SET_TOYS'` |
| Custom hook | `use<Name>`, camelCase file | `useForm.js` |
| CSS file | same name as the component | `cmps/toy/ToyPreview.css` |
| CSS root class | the component name in kebab-case | `.toy-preview` |
| Private module helper | `_` prefix | `_save`, `_makeId`, `_createToys` |

**Function / variable names inside components**

- Handlers that do work or call actions: `on<Verb><Entity>` — `onRemoveToy`, `onAddToy`, `onUpdateToy`, `onLogin`.
- Pass handlers down under the same name: `<ToyList onRemoveToy={onRemoveToy} />`.
- Input change handler: `handleChange(ev)`, which uses `ev.target.name` as the field name.
- Booleans: `is…`, `has…`, `shouldShow…` — `isLoading`, `isAdmin`, `shouldShowActionBtns(toy)`.
- An object being edited in local state: `<entity>ToEdit` — `toyToEdit`, `filterToEdit`.
- Filter object: `filterBy`. Default filter: `<entity>Service.getDefaultFilter()`.
- Empty entity: `<entity>Service.getEmpty<Entity>()`.
- Saved result from an action/service: `saved<Entity>` — `savedToy`.

**Shared abbreviations** (keep using them): `cmp(s)`, `msg(s)`, `txt`, `ev`, `err`, `idx`, `btn`, `img`, `clr`.

---

## 4. Code style

- **No semicolons.** **Single quotes** in JS, double quotes for JSX attributes.
- 4-space indentation.
- `async/await` with `try/catch`. No `.then()` chains (except inside `async-storage.service.js`).
- **Named exports only.** No default exports (config files are the exception).
- Destructure props in the signature: `function ToyList({ toys, onRemoveToy, onUpdateToy })`.
- Update immutably with spread: `{ ...state, toys }`, `[...state.toys, toy]`.
- Entity ids are always **`_id`**. Nested sub-items (msgs, comments...) use `id` made with `makeId()`.
- Use `structuredClone` when copying an incoming prop into editable local state.
- No inline `style={{}}`. Styles go in the component's CSS file.

---

## 5. Services layer

### 5.1 Local vs. remote switch

Every entity has **two implementations with the same API**, and `index.js` picks one based on `VITE_LOCAL`:

```js
// services/toy/index.js
const { DEV, VITE_LOCAL } = import.meta.env

import { toyService as local } from './toy.service.local'
import { toyService as remote } from './toy.service.remote'

function getEmptyToy() {
    return { _id: '', name: '', price: 0 }
}

function getDefaultFilter() {
    return { txt: '', sortField: '', sortDir: '' }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const toyService = { getEmptyToy, getDefaultFilter, ...service }

// Easy access from the dev-tools console
if (DEV) window.toyService = toyService
```

Rules:
- **Always import from the entity folder** (`'../services/toy'`), never from `toy.service.local` / `toy.service.remote` directly.
- Helpers that don't depend on storage (`getEmpty<Entity>`, `getDefaultFilter`) live in `index.js`.
- Local and remote files export the **same method names**. If you add a method to one, add it to the other.
- Standard API: `query(filterBy)`, `getById(<entity>Id)`, `save(<entity>)` (POST if there is no `_id`, PUT if there is one), `remove(<entity>Id)`. Extra domain methods are fine (`add<Entity>Msg`, ...).
- Declare the service object at the **top** of the file with shorthand methods, and put the function declarations below it:

```js
export const toyService = {
    query,
    getById,
    save,
    remove,
}
```

### 5.2 Local services — localStorage via `async-storage.service.js`

The local implementation simulates the backend over `localStorage`:

- `storageService.query(entityType, delay = 500)` — resolves after a fake delay
- `storageService.get(entityType, id)` — throws if not found
- `storageService.post(entityType, entity)` — assigns `_id`
- `storageService.put(entityType, entity)` — merges onto the existing entity, throws if not found
- `storageService.remove(entityType, id)` — throws if not found

```js
// services/toy/toy.service.local.js
import { storageService } from '../async-storage.service'
import { userService } from '../user'

const STORAGE_KEY = 'toy'

export const toyService = { query, getById, save, remove }

async function query(filterBy = { txt: '' }) {
    var toys = await storageService.query(STORAGE_KEY)
    const { txt, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(txt, 'i')
        toys = toys.filter(toy => regex.test(toy.name))
    }
    if (sortField === 'name') {
        toys.sort((toy1, toy2) => toy1.name.localeCompare(toy2.name) * +sortDir)
    }
    return toys
}

function getById(toyId) {
    return storageService.get(STORAGE_KEY, toyId)
}

async function remove(toyId) {
    await storageService.remove(STORAGE_KEY, toyId)
}

async function save(toy) {
    if (toy._id) return storageService.put(STORAGE_KEY, toy)
    // Later, owner is set by the backend
    return storageService.post(STORAGE_KEY, { ...toy, owner: userService.getLoggedinUser() })
}
```

Rules:
- One `STORAGE_KEY` constant per entity = **the singular entity name** (`'toy'`).
- Local services **imitate the backend**: filtering and sorting happen in `query`, `owner`/`byUser` come from `userService.getLoggedinUser()`, and they return only the fields the backend would return. Mark this with `// Later, … by the backend`.
- Seed demo data with a private `_create<Entities>()` that runs only when the key is empty.
- Never touch `localStorage` from components, actions or reducers. Use `storageService`, or `saveToStorage` / `loadFromStorage` from `util.service.js` for plain key/value data.

### 5.3 Remote services — `http.service.js`

```js
// services/toy/toy.service.remote.js
import { httpService } from '../http.service'

export const toyService = { query, getById, save, remove }

function query(filterBy) { return httpService.get('toy', filterBy) }
function getById(toyId) { return httpService.get(`toy/${toyId}`) }
function remove(toyId) { return httpService.delete(`toy/${toyId}`) }
function save(toy) {
    return toy._id ? httpService.put(`toy/${toy._id}`, toy) : httpService.post('toy', toy)
}
```

- Endpoints: **no leading slash**, **singular** entity name — `'toy'`, `` `toy/${toyId}` ``, `` `toy/${toyId}/msg` ``, `'auth/login'`.
- `GET` data goes as query params; other methods send it as the body.
- The base URL is `/api/` in production and `//localhost:3030/api/` in dev. Cookies are sent (`withCredentials: true`).
- `httpService` already handles 401 (it clears `sessionStorage` and redirects to `/`). Don't handle it again.

### 5.4 Logged-in user — sessionStorage

- The logged-in user is stored in **`sessionStorage`** under `'loggedinUser'`, not localStorage.
- Always go through `userService.getLoggedinUser()` / `userService.saveLoggedinUser(user)`. The saved object is trimmed to a minimal shape (`_id, fullname, imgUrl, isAdmin` + any small fields the app needs). **Never store passwords.**
- `userReducer`'s initial `user` comes from `userService.getLoggedinUser()`, so refreshing the page keeps the user logged in.

### 5.5 Other shared services

- **event-bus.service.js** — user feedback: `showSuccessMsg(txt)` / `showErrorMsg(txt)`. `<UserMsg />` (mounted once in `RootCmp`) shows them and auto-hides after 3s.
- **socket.service.js** — `socketService.on/off/emit/login/logout`. Declare all event names as exported constants in this file:
  - `SOCKET_EMIT_<NAME>` — sent by the client, value kebab-case (`'chat-send-msg'`)
  - `SOCKET_EVENT_<NAME>` — received by the client (`'<entity>-added'`, `'<entity>-removed'`)
  - In local mode, a dummy socket service with the same API is used.
- **upload.service.js** — `uploadService.uploadImg(ev)` → Cloudinary image data (`secure_url`, ...). Use it through `<ImgUploader onUploaded={…} />`.
- **util.service.js** — `makeId`, `makeLorem`, `getRandomIntInclusive`, `debounce`, `randomPastTime`, `saveToStorage`, `loadFromStorage`. Add new generic helpers here as named exports.

---

## 6. Redux store

### 6.1 Store setup (`store/store.js`)

```js
const rootReducer = combineReducers({
    userModule: userReducer,
    systemModule: systemReducer,
    toyModule: toyReducer,       // one <entity>Module per domain entity
})
export const store = createStore(rootReducer, middleware) // Redux DevTools enabled
```

- `userModule` — the logged-in `user`, the `users` list, and the `watchedUser`.
- `systemModule` — global UI state (`isLoading` via `LOADING_START` / `LOADING_DONE`). Put app-wide UI flags here (modals, etc.), not in entity modules.

### 6.2 Reducers

- Export action type constants at the **top** of the reducer file. Actions and components import them from there.
- Standard action types:

| Type | Payload | Effect |
|---|---|---|
| `SET_<ENTITIES>` | `<entities>` | replace the list |
| `SET_<ENTITY>` | `<entity>` | set the current item |
| `ADD_<ENTITY>` | `<entity>` | append to the list |
| `UPDATE_<ENTITY>` | `<entity>` | replace by `_id` |
| `REMOVE_<ENTITY>` | `<entity>Id` | filter out by `_id` |

  Domain-specific types follow `VERB_NOUN` (`ADD_TOY_MSG`, `SET_SCORE`).
- State shape: plural for the list, singular for the current item, `null` when empty.
- Reducers are **pure and immutable**: no service calls, no storage, no side effects. Use the `switch` + `return` style:

```js
export const SET_TOYS = 'SET_TOYS'
export const SET_TOY = 'SET_TOY'
export const ADD_TOY = 'ADD_TOY'
export const UPDATE_TOY = 'UPDATE_TOY'
export const REMOVE_TOY = 'REMOVE_TOY'

const initialState = {
    toys: [],
    toy: null,
}

export function toyReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_TOYS:
            return { ...state, toys: action.toys }
        case SET_TOY:
            return { ...state, toy: action.toy }
        case ADD_TOY:
            return { ...state, toys: [...state.toys, action.toy] }
        case UPDATE_TOY:
            return { ...state, toys: state.toys.map(toy => toy._id === action.toy._id ? action.toy : toy) }
        case REMOVE_TOY:
            return { ...state, toys: state.toys.filter(toy => toy._id !== action.toyId) }
        default:
            return state
    }
}
```

### 6.3 Actions (`store/actions/<entity>.actions.js`)

Actions are **plain exported async functions** (not thunks). Each one:
1. calls the service,
2. dispatches with the imported `store` (`store.dispatch(...)`),
3. on error, `console.log`s it and **re-throws** it so the component can show a message,
4. returns the saved entity when the caller needs it.

```js
import { toyService } from '../../services/toy'
import { store } from '../store'
import { SET_TOYS, ADD_TOY, UPDATE_TOY, REMOVE_TOY } from '../reducers/toy.reducer'
import { LOADING_START, LOADING_DONE } from '../reducers/system.reducer'

export async function loadToys(filterBy) {
    store.dispatch({ type: LOADING_START })
    try {
        const toys = await toyService.query(filterBy)
        store.dispatch(getCmdSetToys(toys))
    } catch (err) {
        console.log('Cannot load toys', err)
        throw err
    } finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function addToy(toy) {
    try {
        const savedToy = await toyService.save(toy)
        store.dispatch(getCmdAddToy(savedToy))
        return savedToy
    } catch (err) {
        console.log('Cannot add toy', err)
        throw err
    }
}

// Command Creators:
function getCmdSetToys(toys) {
    return { type: SET_TOYS, toys }
}
function getCmdAddToy(toy) {
    return { type: ADD_TOY, toy }
}
```

Rules:
- Names: `load<Entities>`, `load<Entity>`, `add<Entity>`, `update<Entity>`, `remove<Entity>`, plus domain verbs (`login`, `signup`, `logout`, `add<Entity>Msg`).
- Command creators go at the bottom of the file under `// Command Creators:`, named `getCmd<ActionName>`. Export one only when a component must dispatch it directly (e.g. from a socket listener).
- Auth actions also call `socketService.login(user._id)` / `socketService.logout()`.

### 6.4 Using the store in components

- Read state with a selector whose parameter is named `storeState`:
  ```js
  const toys = useSelector(storeState => storeState.toyModule.toys)
  const isLoading = useSelector(storeState => storeState.systemModule.isLoading)
  ```
- Change state by **calling action functions** (`await removeToy(toyId)`). Don't dispatch raw objects from components, and never use string-literal types.
- Don't call services from components to change shared data. Go through actions. Page-local, read-only data may call a service directly.

---

## 7. Component patterns

### Page + handler pattern

```jsx
export function ToyIndex() {
    const [filterBy, setFilterBy] = useState(toyService.getDefaultFilter())
    const toys = useSelector(storeState => storeState.toyModule.toys)

    useEffect(() => {
        loadToys(filterBy)
    }, [filterBy])

    async function onRemoveToy(toyId) {
        try {
            await removeToy(toyId)
            showSuccessMsg('Toy removed')
        } catch (err) {
            showErrorMsg('Cannot remove toy')
        }
    }

    return (
        <section className="toy-index">
            <header>...</header>
            <ToyFilter filterBy={filterBy} setFilterBy={setFilterBy} />
            <ToyList toys={toys} onRemoveToy={onRemoveToy} />
        </section>
    )
}
```

- **Pages** own data loading (`useEffect` → action), the `on…` handlers, and user messages (`showSuccessMsg` / `showErrorMsg` in `try/catch`).
- **cmps** are mostly presentational: data and callbacks come in through props. Small self-contained forms may call an action directly.
- Lists: `<ul className="<entity>-list">` → `<li key={<entity>._id}>` → `<<Entity>Preview />`, with an `.actions` div for the edit/remove buttons.
- Show action buttons only when the user is an admin **or** the owner (`<entity>.owner?._id === user._id`).
- Filters: the parent holds `filterBy` and passes `setFilterBy`. The filter component keeps a local `filterToEdit` and pushes it up from an effect (debounce text input with `debounce` from `util.service`).
- Forms: controlled inputs with a `name` attribute + a shared `handleChange`, or `useForm(initialState)` → `[fields, setFields, handleChange]` (it converts number, range and checkbox values).
- `useEffectUpdate(cb, deps)` — like `useEffect`, but skips the first render.
- Socket listeners: subscribe in `useEffect` and **always** unsubscribe in the cleanup (`socketService.off(EVENT, handler)`).
- Routing: all routes live in `RootCmp.jsx` with relative paths (`"<entity>"`, `"<entity>/:<entity>Id"`, `"<entity>/edit/:<entity>Id?"`). Nested routes use `<Outlet />`. Use `NavLink` for navigation (it adds `.active`), `Link` for in-content links, and `useNavigate` for redirects. Read params with `const { <entity>Id } = useParams()`.

---

## 8. CSS conventions

### 8.1 Files & imports
- One CSS file per component/page, **named exactly like the component**: `ToyPreview.jsx` → `assets/styles/cmps/toy/ToyPreview.css`. Group each entity's files in a sub-folder.
- **Never import CSS from a component.** Add an `@import` to `assets/styles/main.css` in its section, keeping this order: setup → basics → RootCmp → shared cmps → entity groups. Omit the `.css` extension: `@import "cmps/toy/ToyPreview";`.

### 8.2 Class naming
- **kebab-case**. The root class is the component name in kebab-case: `ToyPreview` → `.toy-preview`, `AppHeader` → `.app-header`, `ToyIndex` → `.toy-index`.
- **No BEM** (`__` / `--`). Child elements get short semantic class names (`.actions`, `.user-info`, `.price`, `.sort-field`) or are targeted by tag, and are **nested inside the root class**.
- **State/variant modifiers are separate single-word classes** combined with the root class: `.user-msg.visible`, `.user-msg.success`, `.user-msg.error`, `.active` (from `NavLink`), `.open`, `.selected`.
- Button variants use a `btn-` prefix: `.btn-clear`, `.btn-primary`.
- Form root classes end with `-form` (`.login-form`). Page wrappers end with `-index` / `-details` / `-page` (`.toy-index`, `.toy-details`, `.login-page`).

### 8.3 Writing styles
- Use **native CSS nesting**. Use `&` before element selectors (`& button`, `& h3`) and for compound selectors (`&.visible`, `&:hover`). Use `>` for direct children.
- **Scope every rule under the component's root class.** No global element selectors in component files.
- Group declarations with blank lines in this order: **layout** (display/grid/flex/position) → **box** (size/padding/margin/border/background) → **typography/color**.
- Prefer **logical properties**: `margin-inline-start`, `padding-block`, `border-block-end`.
- Use `em`/`rem` for sizes. Use component-local custom properties for tunables (`--min-column-size: 220px`).
- Responsive card grids: `grid-template-columns: repeat(auto-fit, minmax(var(--min-column-size), 1fr))`.

### 8.4 Design tokens (`setup/var.css`)
Change the **values** for your project's palette, but keep the **variable names** and **always use them**. Never put raw hex values in component CSS.
- Palette: `--clr1` (primary) … `--clr5`, `--clr1-light`
- Grays: `--gray1` (lightest) … `--gray4` (darkest)
- Status: `--success`, `--error`
- Syntax is `var(--clr1)`. **Not** `--var(clr1)`.
- To add tokens, follow the same pattern (`--clr6`, `--<name>-light`) in `var.css`.

### 8.5 Layout & helpers
- `.main-container` (in `RootCmp`) is a 3-column grid. Children sit in the center column by default. Add **`.full`** to make an element full-bleed (`app-header full`, `app-footer full`).
- Flex helpers (`basics/helpers.css`): `.flex`, `.flex.column`, `.flex.justify-center`, `.flex.align-center`, and `.full` inside `.flex` means `flex: 1`. Add new utility classes there.
- `.debug` on any element outlines all of its descendants, for layout debugging.
- Global base styles (buttons, links, lists, images, inputs) live in `basics/`. Change them there, not per component.

---

## 9. Adding a new entity — checklist

For an entity `<entity>`:

1. `services/<entity>/<entity>.service.local.js` — `STORAGE_KEY = '<entity>'`, uses `storageService`, exports `<entity>Service { query, getById, save, remove }`.
2. `services/<entity>/<entity>.service.remote.js` — the same API over `httpService` (`'<entity>'`, `` `<entity>/${id}` ``).
3. `services/<entity>/index.js` — `getEmpty<Entity>`, `getDefaultFilter`, the `VITE_LOCAL` switch, and `window.<entity>Service` in DEV.
4. `store/reducers/<entity>.reducer.js` — `SET_<ENTITIES>`, `SET_<ENTITY>`, `ADD_<ENTITY>`, `UPDATE_<ENTITY>`, `REMOVE_<ENTITY>`, and `{ <entities>: [], <entity>: null }`.
5. Register `<entity>Module: <entity>Reducer` in `store/store.js`.
6. `store/actions/<entity>.actions.js` — `load<Entities>`, `load<Entity>`, `add<Entity>`, `update<Entity>`, `remove<Entity>`, plus `getCmd…` creators.
7. `pages/<Entity>Index.jsx`, `pages/<Entity>Details.jsx`, `cmps/<Entity>List.jsx`, `cmps/<Entity>Preview.jsx`, `cmps/<Entity>Filter.jsx` (`<Entity>Edit.jsx` if needed).
8. Routes in `RootCmp.jsx` and a `NavLink` in `AppHeader`.
9. CSS in `assets/styles/cmps/<entity>/<Component>.css` with root classes `.<entity>-index`, `.<entity>-list`, `.<entity>-preview`, `.<entity>-filter`, all `@import`ed in `main.css`.
10. When replacing a template entity (e.g. `car`), delete all of its files: the service folder, reducer, actions, pages, cmps, CSS folder, `main.css` imports, routes, nav links, and its `<entity>Module` in `store.js`.

---

## Anti-patterns — do NOT copy

The template still contains a few of these. Don't copy them:

- `--var(clrX)` → use `var(--clrX)`.
- Mixed command-creator names (`getActionXxx`) → use `getCmdXxx`.
- Actions that swallow errors (catch without re-throw) → always re-throw.
- `store.dispatch({ type: 'SOME_TYPE' })` with a string literal → import the constant.
- Reading a field from the wrong module (e.g. `isLoading` from `userModule`) → `isLoading` lives in `systemModule`.
- Reducers that reassign a `newState` variable with `break` → use the `return` style.
- Side effects in reducers (e.g. saving to storage inside a `case`) → do that in the action.
- Tabs mixed with spaces → 4 spaces.
- Inline `style={{}}` → move to the component CSS file.
- `prompt()` / `alert()` for input or errors → real forms + `showErrorMsg`.
- File name ≠ component name (e.g. `Chat.jsx` exporting `ChatApp`) → keep them identical