import { NavLink } from "react-router-dom"

export default function Sidebar() {
  const base = "block py-2 px-4 rounded hover:bg-gray-700"
  const active = "bg-gray-700 font-semibold"

  return (
    <aside className="w-64 bg-gray-800 text-white hidden md:block">
      <nav className="p-4 space-y-2">
        <NavLink to="/deals" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Deals
        </NavLink>
        <NavLink to="/documents" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Documents
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Admin
        </NavLink>
      </nav>
    </aside>
  )
}
