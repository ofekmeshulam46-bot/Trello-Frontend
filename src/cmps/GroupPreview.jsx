import { TaskList } from "./TaskList.jsx"

export function GroupPreview({ group, labels = [] }) {

    const tasks = group.tasks

    return <article className="group-preview">
        <header className="group-header">
            <h2>{group.title}</h2>
            <span className="group-task-count">{tasks.length}</span>
            <button type="button" aria-label={`More options for ${group.title}`}>•••</button>
        </header>
        <TaskList tasks={tasks} labels={labels}/>
        <div className="add-task"><span>＋</span> Add a card</div>
         {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
    </article>
}