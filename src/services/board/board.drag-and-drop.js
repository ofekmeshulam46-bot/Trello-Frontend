
export function reorderGroups(groups, draggedGroupId, targetGroupId, position = 'before') {
    const updatedGroups = [...groups]

    const fromIndex = updatedGroups.findIndex(
        group => group.id === draggedGroupId
    )

    if (fromIndex === -1) return groups

    // Don't move a list relative to itself
    if (draggedGroupId === targetGroupId) return groups

    // Remove the dragged group first
    const [draggedGroup] = updatedGroups.splice(fromIndex, 1)

    // Find the target after removal
    const targetIndex = updatedGroups.findIndex(
        group => group.id === targetGroupId
    )

    if (targetIndex === -1) return groups

    const insertIndex = position === 'after'
        ? targetIndex + 1
        : targetIndex

    updatedGroups.splice(insertIndex, 0, draggedGroup)

    return updatedGroups
}


export function reorderTasks(
    groups,
    groupId,
    draggedTaskId,
    targetTaskId,
    position = 'before'
) {
    return groups.map(group => {
        if (group.id !== groupId) return group

        const updatedTasks = [...group.tasks]

        const fromIndex = updatedTasks.findIndex(
            task => task.id === draggedTaskId
        )

        if (fromIndex === -1 || draggedTaskId === targetTaskId) {
            return group
        }

        // Remove the dragged card first
        const [draggedTask] = updatedTasks.splice(fromIndex, 1)

        // Find the target's position after removal
        const targetIndex = updatedTasks.findIndex(
            task => task.id === targetTaskId
        )

        if (targetIndex === -1) return group

        const insertIndex =
            position === 'after' ? targetIndex + 1 : targetIndex

        updatedTasks.splice(insertIndex, 0, draggedTask)

        return {
            ...group,
            tasks: updatedTasks
        }
    })
}



export function moveTaskBetweenGroups(
    groups,
    sourceGroupId,
    targetGroupId,
    taskId,
    targetTaskId = null
) {
    if (sourceGroupId === targetGroupId) return groups

    const sourceGroup = groups.find(
        group => group.id === sourceGroupId
    )

    const targetGroup = groups.find(
        group => group.id === targetGroupId
    )

    if (!sourceGroup || !targetGroup) return groups

    const draggedTask = sourceGroup.tasks.find(
        task => task.id === taskId
    )

    if (!draggedTask) return groups

    const updatedSourceTasks = sourceGroup.tasks.filter(
        task => task.id !== taskId
    )

    const updatedTargetTasks = [...targetGroup.tasks]

    // Find where to insert the dragged card
    const targetIndex = targetTaskId
        ? updatedTargetTasks.findIndex(task => task.id === targetTaskId)
        : updatedTargetTasks.length

    if (targetTaskId && targetIndex === -1) return groups

    // Insert before the target card, or at the end
    updatedTargetTasks.splice(targetIndex, 0, draggedTask)

    return groups.map(group => {
        if (group.id === sourceGroupId) {
            return {
                ...group,
                tasks: updatedSourceTasks
            }
        }

        if (group.id === targetGroupId) {
            return {
                ...group,
                tasks: updatedTargetTasks
            }
        }

        return group
    })
}
