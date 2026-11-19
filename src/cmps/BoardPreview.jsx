export function BoardPreview({ board }) {
  return (
    <article className="board-preview">
      <div className="board-cover" />
      <p className="board-name">{board.title}</p>
    </article>
  )
}
