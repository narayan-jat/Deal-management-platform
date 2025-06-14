import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/landingpage";
import DealsPage from "./pages/DealsPage";
import LoginPage from "./pages/LoginPage";
import SignUpComponent from "@/components/auth/SignUpComponent";

// Dashboard-related pages
import Dashboard from "./pages/dashboard";
import AnalyticsPage from "./pages/dashboard/analytics";
import ContactPage from "./pages/dashboard/contact";
import MessagesPage from "./pages/dashboard/messages";
import NotificationsPage from "./pages/dashboard/notifications";

import AppLayout from "./components/layout/AppLayout";

const isLoggedIn = true; // 👈 Temporarily true to test dashboard experience

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<Dashboard />} />
          </Route>
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
