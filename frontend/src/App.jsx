import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import SalesPage from "./pages/SalesPage";
import ExpensesPage from "./pages/ExpensesPage";
import StaffPage from "./pages/StaffPage";
import ReportsPage from "./pages/ReportsPage";
import LandingPage from "./pages/LandingPage";
import ContactUsPage from "./pages/ContuctUsPage";
import RequestsPage from "./pages/RequestsPage";
/* LOADER */
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-zinc-950">
    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

/* GUARD (FIXED + CLEAN) */
const Guard = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};

const ROUTES = {
  dashboard: "/app/dashboard",
};

/* APP ROUTES */
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/contact" element={<ContactUsPage />} />

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={ROUTES.dashboard} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* PROTECTED AREA */}
      <Route
        path="/app"
        element={
          <Guard>
            <MainLayout />
          </Guard>
        }
      >
        {/* DEFAULT REDIRECT */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="requests" element={<RequestsPage />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

/* APP */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}