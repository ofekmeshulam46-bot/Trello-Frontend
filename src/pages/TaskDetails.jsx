import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { saveTask } from "../store/actions/board.actions.js"

export function TaskDetails() {
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')

    const navigate = useNavigate()
    const { boardId, taskId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    const group = board?.groups.find(group =>
        group.tasks.some(task => task.id === taskId)
    )

    const task = group?.tasks.find(task => task.id === taskId)

    useEffect(() => {
        setDescription(task?.description || '')
        setTitle(task?.title || '')
    }, [task?.description, task?.title])


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

    return <div className="modal-overlay">
        <section className="task-details-modal">

            <input
                type="text"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />

            {task && <textarea
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                placeholder="Add a more detailed description..."
            />}

           
            

            <button onClick={onClose}>Close</button>
            <button onClick={() => onSaveField('title', title)}>save title</button>
            <button onClick={() => onSaveField('description', description)}>save</button>

        </section>
    </div>

}