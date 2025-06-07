import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import DealsPage from "./pages/DealsPage"
import LoginPage from "./pages/LoginPage"

const isLoggedIn = true

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Navigate to="/deals" />} />
            <Route element={<AppLayout />}>
              <Route path="/deals" element={<DealsPage />} />
              {/* Add more nested routes here */}
            </Route>
          </>
        ) : (
          <Route path="*" element={<LoginPage />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}
