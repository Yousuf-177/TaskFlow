import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuSearch,
  LuTrash2,
  LuPencil,
  LuPlus,
  LuDownload,
} from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import PriorityBadge from "../../components/ui/PriorityBadge";
import StatusBadge from "../../components/ui/StatusBadge";
import DeleteAlert from "../../components/ui/DeleteAlert";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatDueDate, isOverdue } from "../../utils/helper";
import Avatar from "../../components/ui/Avatar";

const REPORT_PATH = "/report/export/tasks";

const STATUSES = ["All", "Pending", "In Progress", "Completed"];
const PRIORITIES = ["All", "Low", "Medium", "High"];

const ManageTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const res = await axiosInstance.get(REPORT_PATH, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `tasks_report_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch {
      toast.error("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.BASE);
      setTasks(res.data?.tasks || []);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let list = tasks;
    if (search)
      list = list.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()),
      );
    if (statusFilter !== "All")
      list = list.filter((t) => t.status === statusFilter);
    if (priorityFilter !== "All")
      list = list.filter((t) => t.priority === priorityFilter);
    setFiltered(list);
  }, [tasks, search, statusFilter, priorityFilter]);

  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE(taskId));
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const SELECT_STYLE = {
    background: "var(--slate-700)",
    border: "1px solid var(--border)",
    borderRadius: "7px",
    color: "var(--text-secondary)",
    fontSize: "0.825rem",
    padding: "0.5rem 0.875rem",
    outline: "none",
    cursor: "pointer",
    width: "auto",
  };

  const CARD = {
    background: "var(--slate-800)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    overflow: "hidden",
  };

  const TH = {
    padding: "0.75rem 1.125rem",
    textAlign: "left",
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "var(--text-faint)",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    background: "rgba(37,43,59,0.8)",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap",
  };

  const TD = {
    padding: "0.875rem 1.125rem",
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
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Manage Tasks</h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-faint)",
              margin: "0.25rem 0 0",
            }}
          >
            {filtered.length} task{filtered.length !== 1 ? "s" : ""} shown
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className="btn btn-ghost"
            onClick={handleDownloadReport}
            disabled={downloading}
            style={{ opacity: downloading ? 0.7 : 1 }}
          >
            <LuDownload size={16} />
            {downloading ? "Generating…" : "Download Report"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/createTask")}
          >
            <LuPlus size={16} />
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div
          style={{
            position: "relative",
            flex: "1",
            minWidth: "200px",
            maxWidth: "340px",
          }}
        >
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
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={SELECT_STYLE}
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={SELECT_STYLE}
        >
          {PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
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
            Loading tasks…
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "700px",
              }}
            >
              <thead>
                <tr>
                  <th style={TH}>Title</th>
                  <th style={TH}>Assignees</th>
                  <th style={TH}>Priority</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Progress</th>
                  <th style={TH}>Due Date</th>
                  <th style={{ ...TH, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((task) => {
                  const overdue = isOverdue(task.dueDate, task.status);
                  return (
                    <tr
                      key={task._id}
                      style={{
                        transition: "background var(--transition-fast)",
                        background: overdue
                          ? "rgba(239,68,68,0.04)"
                          : "transparent",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = overdue
                          ? "rgba(239,68,68,0.08)"
                          : "var(--slate-700)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = overdue
                          ? "rgba(239,68,68,0.04)"
                          : "transparent")
                      }
                    >
                      {/* Title */}
                      <td
                        style={{
                          ...TD,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          maxWidth: "240px",
                        }}
                      >
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {task.title}
                        </div>
                        {task.description && (
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-faint)",
                              marginTop: "2px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {task.description}
                          </div>
                        )}
                      </td>

                      {/* Assignees */}
                      <td style={TD}>
                        <div style={{ display: "flex" }}>
                          {(task.assignedTo || []).slice(0, 3).map((u, i) => (
                            <Avatar
                              key={u._id || i}
                              name={u.name || ""}
                              profileImage={u.profileImage}
                              size={28}
                              style={{
                                marginLeft: i === 0 ? 0 : "-8px",
                                border: "2px solid var(--slate-800)",
                              }}
                            />
                          ))}
                          {task.assignedTo?.length > 3 && (
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "var(--slate-600)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                color: "var(--text-muted)",
                                marginLeft: "-8px",
                                border: "2px solid var(--slate-800)",
                              }}
                            >
                              +{task.assignedTo.length - 3}
                            </div>
                          )}
                        </div>
                      </td>

                      <td style={TD}>
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td style={TD}>
                        <StatusBadge status={task.status} />
                      </td>
                      {/* Progress bar */}
                      <td style={{ ...TD, minWidth: "110px" }}>
                        {(() => {
                          const total = task.todoChecklist?.length || 0;
                          const done =
                            task.todoChecklist?.filter((t) => t.completed)
                              .length || 0;
                          const pct =
                            total > 0
                              ? Math.round((done / total) * 100)
                              : task.status === "Completed"
                                ? 100
                                : 0;
                          return (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <div
                                style={{
                                  flex: 1,
                                  height: "5px",
                                  background: "var(--slate-600)",
                                  borderRadius: "3px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${pct}%`,
                                    background:
                                      pct === 100
                                        ? "#4ade80"
                                        : "var(--teal-500)",
                                    borderRadius: "3px",
                                    transition: "width 0.3s",
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  color: "var(--text-faint)",
                                  minWidth: "28px",
                                }}
                              >
                                {pct}%
                              </span>
                            </div>
                          );
                        })()}
                      </td>
                      <td
                        style={{
                          ...TD,
                          color: overdue
                            ? "var(--crimson-400)"
                            : "var(--text-muted)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDueDate(task.dueDate)}
                      </td>

                      {/* Actions */}
                      <td style={{ ...TD, textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            onClick={() =>
                              navigate("/admin/createTask", {
                                state: { editTask: task },
                              })
                            }
                            style={{
                              background: "none",
                              border: "1px solid var(--border)",
                              borderRadius: "6px",
                              cursor: "pointer",
                              color: "var(--text-faint)",
                              padding: "5px 9px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.375rem",
                              fontSize: "0.775rem",
                              transition: "all var(--transition-fast)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "var(--teal-dim)";
                              e.currentTarget.style.color = "var(--teal-400)";
                              e.currentTarget.style.borderColor =
                                "rgba(45,212,191,0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "none";
                              e.currentTarget.style.color = "var(--text-faint)";
                              e.currentTarget.style.borderColor =
                                "var(--border)";
                            }}
                          >
                            <LuPencil size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(task)}
                            style={{
                              background: "none",
                              border: "1px solid var(--border)",
                              borderRadius: "6px",
                              cursor: "pointer",
                              color: "var(--text-faint)",
                              padding: "5px 9px",
                              display: "inline-flex",
                              alignItems: "center",
                              fontSize: "0.775rem",
                              transition: "all var(--transition-fast)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "var(--crimson-dim)";
                              e.currentTarget.style.color =
                                "var(--crimson-400)";
                              e.currentTarget.style.borderColor =
                                "rgba(239,68,68,0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "none";
                              e.currentTarget.style.color = "var(--text-faint)";
                              e.currentTarget.style.borderColor =
                                "var(--border)";
                            }}
                          >
                            <LuTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "2.5rem",
                        textAlign: "center",
                        color: "var(--text-faint)",
                        fontSize: "0.875rem",
                      }}
                    >
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteAlert
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget._id)}
        itemName={`"${deleteTarget?.title}"`}
      />
    </DashboardLayout>
  );
};

export default ManageTasks;
