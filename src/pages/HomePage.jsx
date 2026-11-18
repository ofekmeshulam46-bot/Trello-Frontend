import { Link, NavLink } from "react-router-dom"

export function HomePage() {
  return (
    <section className="home">
      <h1>Home sweet Home</h1>
      <NavLink to="/boards">Boards</NavLink>
    </section>
  )
}
