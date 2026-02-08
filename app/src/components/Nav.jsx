import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <div className="nav">
      <div className="brand">WJ</div>
      <nav className="links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/writing">Writing</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <div className="spacer" />
      <a className="cta" href="mailto:wen.jian@cantab.net">Contact</a>
    </div>
  )
}
