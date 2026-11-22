import { TaskList } from "./TaskList.jsx"
import { removeGroup } from "../store/actions/board.actions.js"

export function GroupPreview({ group, labels = [], boardId}) {

    const tasks = group.tasks

    function onRemoveGroup() {
    removeGroup(boardId, group.id)
    }

    return <article className="group-preview">
        <header className="group-header">
            <h2>{group.title}</h2>
            <span className="group-task-count">{tasks.length}</span>
            <button onClick={onRemoveGroup}>Delete</button>
            <button type="button" aria-label={`More options for ${group.title}`}>•••</button>
        </header>
        <TaskList tasks={tasks} labels={labels}/>
        <div className="add-task"><span>＋</span> Add a card</div>
         {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
    </article>
}