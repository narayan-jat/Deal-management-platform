import LandingPage from "./pages/landingpage";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DealsPage from "./pages/DealsPage";
import LoginPage from "./pages/LoginPage";
import SignUpComponent from "@/components/auth/SignUpComponent"; // adjust path if needed

const isLoggedIn = false; // replace with real auth check later

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LandingPage />} /> {/* 👈 Public homepage */}
        
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Navigate to="/deals" />} />
            <Route element={<AppLayout />}>
              <Route path="/deals" element={<DealsPage />} />
              {/* Add more nested routes here */}
            </Route>
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpComponent />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
