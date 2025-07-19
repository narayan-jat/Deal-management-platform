import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { ROUTES } from "@/config/routes";
import DotLoader from "@/components/ui/loader";
// Public pages
import Landing from "@/pages/Landing";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";

// Protected pages
import Dashboard from "@/pages/dashboard/index";
import DealsPage from "@/pages/dealspage";
import Profile from "@/pages/Profile";
import AnalyticsPage from "@/pages/dashboard/analytics";
import ContactPage from "@/pages/dashboard/contact";
import MessagesPage from "@/pages/dashboard/messages";
import NotificationsPage from "@/pages/dashboard/notifications";

// Layouts
import AppLayout from "@/components/layout/AppLayout";

// Route protection components
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <DotLoader />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to={ROUTES.SIGNIN} replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <DotLoader />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route 
          path={ROUTES.SIGNIN} 
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          } 
        />
        <Route 
          path={ROUTES.SIGNUP} 
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } 
        />
        
        {/* Protected Routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        <Route
          path={ROUTES.DEALS}
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DealsPage />} />
        </Route>
        
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
        </Route>
        
        {/* Fallback Routes */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
