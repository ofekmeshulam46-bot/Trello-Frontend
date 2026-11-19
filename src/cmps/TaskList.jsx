import { TaskPreview } from "./TaskPreview.jsx"

export function TaskList({ tasks }) {

    return <section>
        <ul className="task-list">
            {tasks.map(task => 
                <li key={task.id}>
                    <TaskPreview task={task} />
                </li>
            )}
        </ul>
    </section>
}