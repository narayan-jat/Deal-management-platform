import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { ROUTES } from "@/config/routes";
import DotLoader from "@/components/ui/loader";
import { Toaster } from "sonner";
// Public pages
import Landing from "@/pages/Landing";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ResetPassword from "@/pages/auth/ResetPassword";
import ChangePassword from "@/pages/auth/ChangePassword";
import AccountChangePasswordWrapper from "@/components/auth/AccountChangePasswordWrapper";  
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";

// Protected pages
import Dashboard from "@/pages/dashboard/Dashboard";
import ManageDeals from "@/pages/deals/ManageDeals";
import ViewDealPage from "@/pages/deals/ViewDealPage";
import { CreateDealPage } from "@/pages/deals/CreateDealPage";
import { EditDealPage } from "@/pages/deals/EditDealPage";
import Profile from "@/pages/Profile";
import Messages from "@/pages/messages/Messages";

// Layouts
import AppLayout from "@/components/layout/AppLayout";
import DealInvite from "@/components/builder-dashboard/DealInvite";
import NotificationsPage from "./pages/Notifications";  

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
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Landing />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
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
        <Route
          path={ROUTES.RESET_PASSWORD}
          element={<ResetPassword />}
        />
        <Route
          path={ROUTES.CHANGE_PASSWORD}
          element={<ChangePassword />}
        />
        <Route
          path={ROUTES.DEAL_LINK_INVITE}
          element={<DealInvite inviteType="link" />}
        />
        <Route
          path={ROUTES.DEAL_EMAIL_INVITE}
          element={<DealInvite inviteType="email" />}
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
        </Route>

        <Route
          path={ROUTES.CREATE_DEAL}
          element={
            <ProtectedRoute>
              <CreateDealPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.EDIT_DEAL}
          element={
            <ProtectedRoute>
              <EditDealPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.DEALS}
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManageDeals />} />
          <Route path=":dealId" element={<ViewDealPage />} />
        </Route>

        <Route
          path={ROUTES.NOTIFICATIONS}
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<NotificationsPage />} />
        </Route>

        <Route
          path={ROUTES.MESSAGES}
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Messages />} />
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

        <Route
          path={ROUTES.ACCOUNT_CHANGE_PASSWORD}
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AccountChangePasswordWrapper />} />
        </Route>

        {/* Fallback Routes */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
