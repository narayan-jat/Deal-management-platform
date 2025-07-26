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
import Dashboard from "@/pages/dashboard/Dashboard";
import DealsPage from "@/pages/dealspage";
import ViewDealPage from "@/pages/deals/ViewDealPage";
import Profile from "@/pages/Profile";

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
          <Route path="analytics" element={<Landing />} />
          <Route path="contact" element={<Landing />} />
          <Route path="messages" element={<Landing />} />
          <Route path="notifications" element={<Landing />} />
          <Route path="settings" element={<Landing />} />
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
          <Route path=":dealId" element={<ViewDealPage />} />
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
