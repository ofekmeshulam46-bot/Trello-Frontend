import { TaskPreview } from "./TaskPreview.jsx"

export function TaskList({ tasks, labels = [] ,boardId, groupId }) {

    return <section className="group-cards">
        <ul className="task-list">
            {tasks.map(task => 
                <li key={task.id}>
                    <TaskPreview 
                    task={task} 
                    labels={labels}
                    boardId={boardId}
                    groupId={groupId} />
                </li>
            )}
        </ul>
    </section>
}