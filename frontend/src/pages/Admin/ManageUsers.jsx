import React, { useState, useEffect } from "react";
import { LuSearch, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import DeleteAlert from "../../components/ui/DeleteAlert";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { getInitials, getAvatarColor } from "../../utils/helper";
import moment from "moment";

const RoleBadge = ({ role }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 10px",
      borderRadius: "99px",
      fontSize: "0.7rem",
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      background:
        role === "admin" ? "var(--teal-dim)" : "rgba(100,116,139,0.15)",
      color: role === "admin" ? "var(--teal-400)" : "var(--slate-300)",
      border: `1px solid ${role === "admin" ? "rgba(45,212,191,0.3)" : "rgba(100,116,139,0.25)"}`,
    }}
  >
    {role}
  </span>
);

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USERS.BASE);
      const list = res.data?.users || res.data || [];
      setUsers(list);
      setFiltered(list);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      ),
    );
  }, [search, users]);

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(API_PATHS.USERS.BY_ID(userId));
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const CARD = {
    background: "var(--slate-800)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    overflow: "hidden",
  };

  const TH_STYLE = {
    padding: "0.75rem 1.25rem",
    textAlign: "left",
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "var(--text-faint)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    background: "var(--slate-750)",
    borderBottom: "1px solid var(--border)",
  };

  const TD_STYLE = {
    padding: "0.875rem 1.25rem",
    borderBottom: "1px solid var(--border)",
    fontSize: "0.8125rem",
    color: "var(--text-secondary)",
    verticalAlign: "middle",
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "1.75rem",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Manage Users</h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-faint)",
              margin: "0.25rem 0 0",
            }}
          >
            {users.length} member{users.length !== 1 ? "s" : ""} in workspace
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", width: "260px" }}>
          <LuSearch
            size={15}
            style={{
              position: "absolute",
              left: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-faint)",
            }}
          />
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={CARD}>
        {loading ? (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--text-faint)",
              fontSize: "0.875rem",
            }}
          >
            Loading users…
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={TH_STYLE}>Member</th>
                <th style={TH_STYLE}>Role</th>
                <th style={TH_STYLE}>Joined</th>
                <th style={{ ...TH_STYLE, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user._id}
                  style={{ transition: "background var(--transition-fast)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--slate-700)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Member info */}
                  <td style={TD_STYLE}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: getAvatarColor(user.name),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--slate-900)",
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            marginBottom: "1px",
                          }}
                        >
                          {user.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-faint)",
                          }}
                        >
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={TD_STYLE}>
                    <RoleBadge role={user.role} />
                  </td>
                  <td style={TD_STYLE}>
                    {moment(user.createdAt).format("MMM D, YYYY")}
                  </td>
                  <td style={{ ...TD_STYLE, textAlign: "right" }}>
                    <button
                      onClick={() => setDeleteTarget(user)}
                      style={{
                        background: "none",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        cursor: "pointer",
                        color: "var(--text-faint)",
                        padding: "6px 10px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        fontSize: "0.775rem",
                        transition: "all var(--transition-fast)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--crimson-dim)";
                        e.currentTarget.style.color = "var(--crimson-400)";
                        e.currentTarget.style.borderColor =
                          "rgba(239,68,68,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "none";
                        e.currentTarget.style.color = "var(--text-faint)";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                    >
                      <LuTrash2 size={13} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: "2.5rem",
                      textAlign: "center",
                      color: "var(--text-faint)",
                      fontSize: "0.875rem",
                    }}
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation */}
      <DeleteAlert
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget._id)}
        itemName={deleteTarget?.name}
      />
    </DashboardLayout>
  );
};

export default ManageUsers;
