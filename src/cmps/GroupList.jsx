import { GroupPreview } from './GroupPreview.jsx'

export function GroupList({ groups, labels = [] }) {
   
    return <section className="board-groups">
        <ul className="group-list">
            {groups.map(group =>
                <li key={group.id}>
                    <GroupPreview group={group} labels={labels}/>
                </li>
            )}
            <li className="add-group">
                <button type="button"><span>＋</span> Add another list</button>
            </li>
        </ul>
    </section>
} 