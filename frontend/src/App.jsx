import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/UserContext";
import PrivateRoute from "./routes/PrivateRoute";

// Auth Pages
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageTasks from "./pages/Admin/ManageTasks";

// User Pages
import UserDashboard from "./pages/User/Dashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/createTask" element={<CreateTask />} />
            <Route path="/admin/manageUsers" element={<ManageUsers />} />
            <Route path="/admin/manageTasks" element={<ManageTasks />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["member", "user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/myTasks" element={<MyTasks />} />
            <Route
              path="/user/task-details/:id"
              element={<ViewTaskDetails />}
            />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--slate-700)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            fontSize: "0.8375rem",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;
