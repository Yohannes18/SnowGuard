import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AnalysisHistory from "./pages/analysis/AnalysisHistoryPage";
import NewAnalysis from "./pages/analysis/NewAnalysisPage";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
import ResultPage from "./pages/analysis/ResultPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes (with layout) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            <Route
              path="/analysis/history"
              element={
                <PrivateRoute>
                  <AnalysisHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/analysis/analyze"
              element={
                <PrivateRoute>
                  <NewAnalysis />
                </PrivateRoute>
              }
            />
            <Route path="/analysis/result" element={<ResultPage />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
