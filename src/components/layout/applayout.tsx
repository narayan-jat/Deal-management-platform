import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
