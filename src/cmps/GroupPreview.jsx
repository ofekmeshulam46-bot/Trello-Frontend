import { TaskList } from "./TaskList.jsx"

export function GroupPreview({ group }) {

    const tasks = group.tasks

    return <article className="group-preview">
        <header>{group.title}</header>
        <TaskList tasks={tasks}/>
        <div className="add-task">

        </div>
         {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
    </article>
}