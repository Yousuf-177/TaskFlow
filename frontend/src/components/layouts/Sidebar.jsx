import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuSquareCheck,
  LuUsers,
  LuCirclePlus,
  LuClipboardList,
  LuLogOut,
  LuChevronRight,
} from "react-icons/lu";
import { useUser } from "../../context/UserContext";
import Avatar from "../ui/Avatar";

const Sidebar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 200);
  };

  const adminLinks = [
    {
      to: "/admin/dashboard",
      icon: <LuLayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      to: "/admin/createTask",
      icon: <LuCirclePlus size={18} />,
      label: "Create Task",
    },
    {
      to: "/admin/manageTasks",
      icon: <LuClipboardList size={18} />,
      label: "Manage Tasks",
    },
    {
      to: "/admin/manageUsers",
      icon: <LuUsers size={18} />,
      label: "Manage Users",
    },
  ];

  const userLinks = [
    {
      to: "/user/dashboard",
      icon: <LuLayoutDashboard size={18} />,
      label: "Dashboard",
    },
    {
      to: "/user/myTasks",
      icon: <LuSquareCheck size={18} />,
      label: "My Tasks",
    },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  const activeLinkStyle = {
    color: "var(--teal-400)",
    background: "var(--teal-dim)",
    borderLeft: "3px solid var(--teal-400)",
    paddingLeft: "calc(1.25rem - 3px)",
  };

  const baseLinkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.625rem 1.25rem",
    color: "var(--text-muted)",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: 500,
    borderLeft: "3px solid transparent",
    transition: "all var(--transition-fast)",
    borderRadius: "0 6px 6px 0",
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "240px",
        height: "100vh",
        background: "var(--slate-800)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.5rem 1.25rem 1.25rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          onClick={() => navigate("/")}
          style={{ cursor: "pointer",display: "flex", alignItems: "center", gap: "0.625rem" }}
        >
          <div
            style={{
              
              width: "32px",
              height: "32px",
              background: "var(--teal-500)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LuSquareCheck size={18} color="white" />
          </div>
          <span
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            TaskFlow
          </span>
        </div>
        {user?.role === "admin" && (
          <span
            style={{
              display: "inline-block",
              marginTop: "0.5rem",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--teal-400)",
              background: "var(--teal-dim)",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            Admin
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, paddingTop: "0.75rem", paddingBottom: "1rem" }}>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) =>
              isActive
                ? { ...baseLinkStyle, ...activeLinkStyle }
                : baseLinkStyle
            }
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains("active")) {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "var(--slate-700)";
              }
            }}
            onMouseLeave={(e) => {
              if (
                !e.currentTarget.style.borderLeftColor.includes("teal") &&
                e.currentTarget.style.color !== "var(--teal-400)"
              ) {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {icon}
            {label}
            <LuChevronRight
              size={14}
              style={{ marginLeft: "auto", opacity: 0.4 }}
            />
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "1rem 1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          <Avatar
            name={user?.name || ""}
            profileImage={user?.profileImage}
            size={36}
          />
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name}
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-faint)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{ width: "100%", opacity: loggingOut ? 0.5 : 1 }}
        >
          <LuLogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
