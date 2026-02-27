import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, token, loading } = useUser();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--slate-900)",
          color: "var(--text-muted)",
          fontSize: "0.875rem",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Loading…
      </div>
    );
  }

  // No token → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to correct dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
