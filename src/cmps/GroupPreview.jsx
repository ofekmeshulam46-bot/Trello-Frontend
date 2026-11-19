
export function GroupPreview({ group }) {
    console.log('group')

    return <article className="group-preview">
        <header>{group.title}</header>
        
        <div className="add-task">

        </div>
         <pre>{JSON.stringify(group, null, 2)}</pre>
    </article>
}