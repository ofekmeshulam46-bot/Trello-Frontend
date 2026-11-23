import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { saveTask } from "../store/actions/board.actions.js"

export function TaskDetails() {
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const [dueDate, setDueDate] = useState('')

    const navigate = useNavigate()
    const { boardId, taskId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    const group = board?.groups.find(group =>
        group.tasks.some(task => task.id === taskId)
    )

    const task = group?.tasks.find(task => task.id === taskId)
    const labels = board?.labels || []
    const members = board?.members || []

    useEffect(() => {
        setDescription(task?.description || '')
        setTitle(task?.title || '')
        setDueDate(task?.dueDate || '')
    }, [task?.description, task?.title, task?.dueDate])


    function onClose() {
        navigate(`/board/${boardId}`)
    }

    async function onSaveField(field, value) {
        const updatedTask = {
            ...task,
            [field]: value
        }
        await saveTask(boardId, group.id, updatedTask)
    }


    function onToggleItem(field, itemId) {
    const currentIds = task[field] || []

    const updatedIds = currentIds.includes(itemId)
        ? currentIds.filter(id => id !== itemId)
        : [...currentIds, itemId]

    onSaveField(field, updatedIds)
}

    return <div className="modal-overlay">
        <section className="task-details-modal">

            <input
                type="text"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />

            {labels.map(label => (
                <label key={label.id}>
                    <input
                        type="checkbox"
                        checked={task?.labelIds?.includes(label.id) || false}
                        onChange={() => onToggleItem('labelIds', label.id)}
                    />
                    {label.title}
                </label>
            ))}

            {members.map(member => (
                <label key={member._id}>
                    <input
                        type="checkbox"
                        checked={task?.memberIds?.includes(member._id) || false}
                        onChange={() => onToggleItem('memberIds', member._id)}
                    />
                    {member.fullname}
                </label>
            ))}

            {task && <textarea
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                placeholder="Add a more detailed description..."
            />}




            <button onClick={onClose}>Close</button>
            <button onClick={() => onSaveField('title', title)}>save title</button>
            <button onClick={() => onSaveField('description', description)}>save</button>

            <input
                type="date"
                value={dueDate}
                onChange={ev => setDueDate(ev.target.value)}
            />

            <button onClick={() => onSaveField('dueDate', dueDate)}>
                Save date
            </button>

        </section>
    </div>

}