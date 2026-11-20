import { GroupPreview } from './GroupPreview.jsx'
import { addGroup } from '../store/actions/board.actions.js'

export function GroupList({ groups, labels = [], boardId }) {

    async function onAddGroup() {
        const groupTitle = prompt('Enter group name')
        if (!groupTitle?.trim()) return

        await addGroup(boardId, groupTitle.trim())
    }


    return <section className="board-groups">
        <ul className="group-list">
            {groups.map(group =>
                <li key={group.id}>
                    <GroupPreview group={group} labels={labels} />
                </li>
            )}
            <li className="add-group">
                <button onClick={onAddGroup} type="button"><span>＋</span> Add another list</button>
            </li>
        </ul>
    </section>
} 