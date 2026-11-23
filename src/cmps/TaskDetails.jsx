import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

export function TaskDetails() {

    const navigate = useNavigate()
    const { boardId } = useParams()

    function onClose() {
        navigate(`/board/${boardId}`)
    }

    return <div className="modal-overlay">
        <section className="task-details-modal">
            <h1>task details</h1>
            <button onClick={onClose}>Close</button>
        </section>
    </div>

}