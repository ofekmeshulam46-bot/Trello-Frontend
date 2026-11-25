import { useEffect, useRef, useState } from "react"
import { CloseIcon, MembersIcon, PlusIcon } from "../../assets/icons/task-icons.jsx"

export function TaskMembers({ members = [], memberIds = [], onChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchText, setSearchText] = useState('')
    const pickerRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return
        function onPointerDown(ev) {
            if (!pickerRef.current?.contains(ev.target)) setIsOpen(false)
        }
        document.addEventListener('pointerdown', onPointerDown)
        return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) setSearchText('')
    }, [isOpen])

    const selectedMembers = members.filter(member => memberIds.includes(member._id))
    const searchTerm = searchText.trim().toLowerCase()
    const filteredMembers = members.filter(member =>
        (member.fullname || '').toLowerCase().includes(searchTerm)
    )
    const cardMembers = filteredMembers.filter(member => memberIds.includes(member._id))
    const boardMembers = filteredMembers.filter(member => !memberIds.includes(member._id))

    function onToggleMember(memberId) {
        const nextMemberIds = memberIds.includes(memberId)
            ? memberIds.filter(id => id !== memberId)
            : [...memberIds, memberId]
        onChange(nextMemberIds)
    }

    return <div className="task-detail-field task-attribute-picker task-members-field" ref={pickerRef}>
        <span className="task-detail-label">Members</span>
        <div className="task-detail-options">
            {selectedMembers.map(member => (
                <span
                    className="task-member-avatar"
                    key={member._id}
                    title={member.fullname}
                >
                    {member.fullname?.charAt(0).toUpperCase() || '?'}
                </span>
            ))}
            <button
                className="task-add-option"
                type="button"
                aria-label={isOpen ? 'Close member picker' : 'Choose members'}
                aria-expanded={isOpen}
                onClick={() => setIsOpen(open => !open)}
            >{PlusIcon}</button>
        </div>
        {isOpen && (
            <section className="task-toolbar-popover task-member-picker" role="dialog" aria-label="Members">
                <header className="task-picker-header">
                    <h3>Members</h3>
                    <button type="button" aria-label="Close member picker" onClick={() => setIsOpen(false)}>{CloseIcon}</button>
                </header>
                <input
                    className="task-picker-search"
                    type="search"
                    placeholder="Search members"
                    aria-label="Search members"
                    value={searchText}
                    onChange={ev => setSearchText(ev.target.value)}
                />
                {cardMembers.length > 0 && (
                    <div className="task-picker-section">
                        <h4>Card members</h4>
                        {cardMembers.map(member => (
                            <button
                                className="task-card-member-row"
                                type="button"
                                key={member._id}
                                aria-label={`Remove ${member.fullname}`}
                                aria-pressed={memberIds.includes(member._id)}
                                onClick={() => onToggleMember(member._id)}
                            >
                                <span className="task-member-avatar">
                                    {member.fullname?.charAt(0).toUpperCase() || '?'}
                                </span>
                                <span className="task-picker-member-name">{member.fullname}</span>
                                <span className="task-card-member-remove-mark" aria-hidden="true">×</span>
                            </button>
                        ))}
                    </div>
                )}
                {boardMembers.length > 0 && (
                    <div className="task-picker-section">
                        <h4>Board members</h4>
                        {boardMembers.map(member => (
                            <button
                                className="task-board-member-row"
                                type="button"
                                key={member._id}
                                aria-label={`Add ${member.fullname}`}
                                aria-pressed={memberIds.includes(member._id)}
                                onClick={() => onToggleMember(member._id)}
                            >
                                <span className="task-member-avatar">
                                    {member.fullname?.charAt(0).toUpperCase() || '?'}
                                </span>
                                <span className="task-picker-member-name">{member.fullname}</span>
                            </button>
                        ))}
                    </div>
                )}
                {filteredMembers.length === 0 && (
                    <p className="task-picker-empty">No members found.</p>
                )}
            </section>
        )}
    </div>
}
