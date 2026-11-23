import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

export function TaskDetails() {

    const navigate = useNavigate()
    const { boardId, taskId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)

    const group = board?.groups.find(group =>
        group.tasks.some(task => task.id === taskId)
    )

    const task = group?.tasks.find(task => task.id === taskId)

    function onClose() {
        navigate(`/board/${boardId}`)
    }

    return <div className="modal-overlay">
        <section className="task-details-modal">
            <h1>task details</h1>
            <h2>{task?.title}</h2>
            <button onClick={onClose}>Close</button>
        </section>
    </div>

}