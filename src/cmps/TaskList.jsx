import { TaskPreview } from "./TaskPreview.jsx"

export function TaskList({ tasks, labels = [] }) {

    return <section className="group-cards">
        <ul className="task-list">
            {tasks.map(task => 
                <li key={task.id}>
                    <TaskPreview task={task} labels={labels} />
                </li>
            )}
        </ul>
    </section>
}