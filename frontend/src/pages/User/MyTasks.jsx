import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TaskCard from "../../components/ui/TaskCard";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const TABS = ["All", "Pending", "In Progress", "Completed"];

const MyTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.TASKS.BASE);
        setTasks(res.data?.tasks || []);
      } catch {
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    let list = tasks;
    if (activeTab !== "All") list = list.filter((t) => t.status === activeTab);
    if (search)
      list = list.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()),
      );
    setFiltered(list);
  }, [tasks, activeTab, search]);

  const TAB_COUNT = (tab) =>
    tab === "All" ? tasks.length : tasks.filter((t) => t.status === tab).length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h2 style={{ margin: 0 }}>My Tasks</h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-faint)",
            margin: "0.25rem 0 0",
          }}
        >
          All tasks assigned to you
        </p>
      </div>

      {/* Status Tabs + Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          gap: "1rem",
          flexWrap: "wrap",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Tabs */}
        <div style={{ display: "flex", gap: "0" }}>
          {TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: active
                    ? "2px solid var(--teal-400)"
                    : "2px solid transparent",
                  color: active ? "var(--teal-400)" : "var(--text-muted)",
                  padding: "0.625rem 1.125rem",
                  cursor: "pointer",
                  fontSize: "0.8375rem",
                  fontWeight: active ? 600 : 500,
                  transition: "all var(--transition-fast)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginBottom: "-1px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {tab}
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "1px 6px",
                    borderRadius: "99px",
                    background: active ? "var(--teal-dim)" : "var(--slate-700)",
                    color: active ? "var(--teal-400)" : "var(--text-faint)",
                    fontWeight: 600,
                    minWidth: "20px",
                    textAlign: "center",
                  }}
                >
                  {TAB_COUNT(tab)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div
          style={{ position: "relative", width: "240px", marginBottom: "4px" }}
        >
          <LuSearch
            size={14}
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-faint)",
            }}
          />
          <input
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              paddingLeft: "2.125rem",
              fontSize: "0.8125rem",
              padding: "0.5rem 0.75rem 0.5rem 2.125rem",
            }}
          />
        </div>
      </div>

      {/* Task Grid */}
      {loading ? (
        <p style={{ color: "var(--text-faint)", fontSize: "0.875rem" }}>
          Loading tasks…
        </p>
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: "var(--slate-800)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "3rem",
            textAlign: "center",
            color: "var(--text-faint)",
            fontSize: "0.875rem",
          }}
        >
          {activeTab === "All"
            ? "No tasks assigned to you"
            : `No ${activeTab.toLowerCase()} tasks`}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
            animation: "fadeIn 150ms ease",
          }}
        >
          {filtered.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => navigate(`/user/task-details/${task._id}`)}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyTasks;
