import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { saveTask } from "../store/actions/board.actions.js"

export function TaskDetails() {
    const [description, setDescription] = useState('')

    const navigate = useNavigate()
    const { boardId, taskId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    const group = board?.groups.find(group =>
        group.tasks.some(task => task.id === taskId)
    )

    const task = group?.tasks.find(task => task.id === taskId)

    useEffect(() => {
        setDescription(task?.description || '')
    }, [task?.description])


    function onClose() {
        navigate(`/board/${boardId}`)
    }

    function onSaveDescription(){
        const updatedTask = { ...task, description }
        saveTask(boardId, group.id, updatedTask)
    }

    return <div className="modal-overlay">
        <section className="task-details-modal">
            
            <h2>{task?.title}</h2>

            {task && <textarea
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                placeholder="Add a more detailed description..."
            />}

            <button onClick={onClose}>Close</button>
            <button onClick={onSaveDescription}>Save</button>
        </section>
    </div>

}