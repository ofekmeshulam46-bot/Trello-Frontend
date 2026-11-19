import { GroupPreview } from './GroupPreview.jsx'

export function GroupList({ groups }) {
   
    return <section>
        <ul className="group-list">
            {groups.map(group =>
                <li key={group.id}>
                    <GroupPreview group={group}/>
                </li>
            )}
        </ul>
    </section>
} 