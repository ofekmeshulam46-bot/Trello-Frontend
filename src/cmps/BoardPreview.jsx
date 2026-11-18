export function BoardPreview({ board }) {
  return (
    <article className="board-preview">
      <p className="name">{board.name}</p>
      <p>
        Price: <span>${board.price.toLocaleString()}</span>
      </p>
      <p>
        inStock: <span>{JSON.stringify(board.inStock)}</span>
      </p>
    </article>
  )
}
