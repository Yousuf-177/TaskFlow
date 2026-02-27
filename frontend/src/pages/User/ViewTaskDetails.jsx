import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuCalendar,
  LuUser,
  LuPaperclip,
  LuExternalLink,
} from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import PriorityBadge from "../../components/ui/PriorityBadge";
import StatusBadge from "../../components/ui/StatusBadge";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  formatDueDate,
  isOverdue,
  getInitials,
  getAvatarColor,
} from "../../utils/helper";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.TASKS.BY_ID(id));
        setTask(res.data);
      } catch {
        toast.error("Failed to load task");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const toggleTodo = async (index) => {
    if (!task || updating) return;
    const updated = task.todoChecklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item,
    );
    setTask((prev) => ({ ...prev, todoChecklist: updated }));
    setUpdating(true);
    try {
      await axiosInstance.put(API_PATHS.TASKS.TODO(id), {
        todoChecklist: updated,
      });
    } catch {
      toast.error("Failed to save checklist");
    } finally {
      setUpdating(false);
    }
  };

  const completedCount =
    task?.todoChecklist?.filter((t) => t.completed).length || 0;
  const totalCount = task?.todoChecklist?.length || 0;
  const progressPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const CARD = {
    background: "var(--slate-800)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "1.5rem",
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div
          style={{
            color: "var(--text-faint)",
            fontSize: "0.875rem",
            padding: "3rem",
          }}
        >
          Loading task…
        </div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div
          style={{
            color: "var(--text-faint)",
            fontSize: "0.875rem",
            padding: "3rem",
          }}
        >
          Task not found.
        </div>
      </DashboardLayout>
    );
  }

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <DashboardLayout>
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-muted)",
          fontSize: "0.8125rem",
          marginBottom: "1.5rem",
          padding: 0,
          fontFamily: "Inter, sans-serif",
          transition: "color var(--transition-fast)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "var(--text-primary)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--text-muted)")
        }
      >
        <LuArrowLeft size={15} />
        Back
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* ── LEFT: Main Content ── */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Title */}
          <div style={CARD}>
            <h1
              style={{
                fontSize: "1.625rem",
                fontWeight: 700,
                margin: "0 0 1rem",
                letterSpacing: "-0.025em",
                lineHeight: 1.3,
              }}
            >
              {task.title}
            </h1>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
              {overdue && (
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
                    background: "var(--crimson-dim)",
                    color: "var(--crimson-400)",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  Overdue
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div style={CARD}>
              <h3
                style={{
                  margin: "0 0 1rem",
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                Description
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  fontSize: "0.9375rem",
                  margin: 0,
                }}
              >
                {task.description}
              </p>
            </div>
          )}

          {/* Checklist */}
          {task.todoChecklist && task.todoChecklist.length > 0 && (
            <div style={CARD}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 600,
                  }}
                >
                  Checklist
                </h3>
                <span
                  style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}
                >
                  {completedCount}/{totalCount}
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: "3px",
                  background: "var(--slate-600)",
                  borderRadius: "2px",
                  marginBottom: "1.125rem",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPct}%`,
                    background:
                      progressPct === 100
                        ? "var(--green-400)"
                        : "var(--teal-500)",
                    borderRadius: "2px",
                    transition: "width var(--transition-slow)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {task.todoChecklist.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => toggleTodo(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.625rem 0.875rem",
                      borderRadius: "7px",
                      cursor: "pointer",
                      transition: "background var(--transition-fast)",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--slate-700)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Checkbox */}
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "4px",
                        border: `1.5px solid ${item.completed ? "var(--teal-500)" : "var(--slate-500)"}`,
                        background: item.completed
                          ? "var(--teal-500)"
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all var(--transition-fast)",
                      }}
                    >
                      {item.completed && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            d="M1.5 5l2.5 2.5 4.5-4.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: item.completed
                          ? "var(--text-faint)"
                          : "var(--text-secondary)",
                        textDecoration: item.completed
                          ? "line-through"
                          : "none",
                        transition: "all var(--transition-fast)",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div style={CARD}>
              <h3
                style={{
                  margin: "0 0 1rem",
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                Attachments
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {task.attachments.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      padding: "0.625rem 0.875rem",
                      background: "var(--slate-700)",
                      border: "1px solid var(--border)",
                      borderRadius: "7px",
                      color: "var(--teal-400)",
                      textDecoration: "none",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      transition: "background var(--transition-fast)",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--slate-600)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "var(--slate-700)")
                    }
                  >
                    <LuPaperclip size={14} style={{ flexShrink: 0 }} />
                    <span
                      style={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {url.split("/").pop() || `Attachment ${i + 1}`}
                    </span>
                    <LuExternalLink
                      size={13}
                      style={{ flexShrink: 0, opacity: 0.6 }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Metadata Sidebar ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Status & Priority Info */}
          <div style={CARD}>
            <h3
              style={{
                margin: "0 0 1rem",
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
              }}
            >
              Details
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-faint)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: "0.375rem",
                    fontWeight: 600,
                  }}
                >
                  Status
                </div>
                <StatusBadge status={task.status} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-faint)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: "0.375rem",
                    fontWeight: 600,
                  }}
                >
                  Priority
                </div>
                <PriorityBadge priority={task.priority} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-faint)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: "0.375rem",
                    fontWeight: 600,
                  }}
                >
                  <LuCalendar
                    size={11}
                    style={{ display: "inline", marginRight: "4px" }}
                  />
                  Due Date
                </div>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: overdue
                      ? "var(--crimson-400)"
                      : "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {formatDueDate(task.dueDate)}
                </span>
              </div>

              {/* Progress */}
              {totalCount > 0 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.7rem",
                      color: "var(--text-faint)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                    }}
                  >
                    Progress
                    <span style={{ color: "var(--text-muted)" }}>
                      {progressPct}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "5px",
                      background: "var(--slate-600)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progressPct}%`,
                        background:
                          progressPct === 100
                            ? "var(--green-400)"
                            : "var(--teal-500)",
                        borderRadius: "3px",
                        transition: "width var(--transition-slow)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assigned To */}
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div style={CARD}>
              <h3
                style={{
                  margin: "0 0 1rem",
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                <LuUser
                  size={12}
                  style={{ display: "inline", marginRight: "4px" }}
                />
                Assigned To
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                {task.assignedTo.map((u, i) => (
                  <div
                    key={u._id || i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                    }}
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: getAvatarColor(u.name || ""),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: "var(--slate-900)",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {u.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-faint)",
                        }}
                      >
                        {u.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;
