import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/employee-dashboard"
        element={
          <PrivateRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen bg-surface">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-slate-300 dark:text-slate-600">404</h1>
              <p className="text-slate-500 mt-4 text-lg">Page Not Found</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;