import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LuPlus, LuTrash2, LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { getInitials, getAvatarColor } from "../../utils/helper";

const PRIORITIES = ["Low", "Medium", "High"];
const PRIORITY_COLORS = { Low: "#4ade80", Medium: "#fbbf24", High: "#f87171" };

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "Medium",
  dueDate: "",
  assignedTo: [],
  todoChecklist: [],
  attachments: [],
};

const CreateTask = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If navigated with { state: { editTask } }, enter edit mode
  const editTask = location.state?.editTask || null;
  const isEditMode = !!editTask;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState(() => {
    if (editTask) {
      return {
        title: editTask.title || "",
        description: editTask.description || "",
        priority: editTask.priority || "Medium",
        dueDate: editTask.dueDate ? editTask.dueDate.slice(0, 10) : "",
        // assignedTo may be objects (populated) or just IDs
        assignedTo: (editTask.assignedTo || []).map((u) =>
          typeof u === "object" ? u._id : u,
        ),
        todoChecklist: editTask.todoChecklist || [],
        attachments: editTask.attachments || [],
      };
    }
    return EMPTY_FORM;
  });

  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    axiosInstance
      .get(API_PATHS.USERS.BASE)
      .then((r) => setUsers(r.data?.users || r.data || []))
      .catch(() => toast.error("Could not load users"));
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggleUser = (userId) =>
    setForm((p) => ({
      ...p,
      assignedTo: p.assignedTo.includes(userId)
        ? p.assignedTo.filter((id) => id !== userId)
        : [...p.assignedTo, userId],
    }));

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setForm((p) => ({
      ...p,
      todoChecklist: [
        ...p.todoChecklist,
        { text: newTodo.trim(), completed: false },
      ],
    }));
    setNewTodo("");
  };

  const removeTodo = (i) =>
    setForm((p) => ({
      ...p,
      todoChecklist: p.todoChecklist.filter((_, idx) => idx !== i),
    }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    setUploading(true);
    try {
      const { data } = await axiosInstance.post(
        API_PATHS.AUTH.UPLOAD_IMAGE,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setForm((p) => ({
        ...p,
        attachments: [...p.attachments, data.ImageURL],
      }));
      toast.success("File attached");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.dueDate) {
      toast.error("Title and due date are required");
      return;
    }
    setLoading(true);
    try {
      if (isEditMode) {
        await axiosInstance.put(API_PATHS.TASKS.BY_ID(editTask._id), form);
        toast.success("Task updated successfully");
      } else {
        await axiosInstance.post(API_PATHS.TASKS.BASE, form);
        toast.success("Task created successfully");
      }
      navigate("/admin/manageTasks");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} task`,
      );
    } finally {
      setLoading(false);
    }
  };

  const CARD = {
    background: "var(--slate-800)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "1.5rem",
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ margin: 0 }}>
          {isEditMode ? "Edit Task" : "Create Task"}
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-faint)",
            margin: "0.25rem 0 0",
          }}
        >
          {isEditMode
            ? "Update task details and assignments"
            : "Define the task details and assign it to team members"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* ── LEFT COLUMN: Task Details ── */}
          <div style={CARD}>
            <h3 style={{ margin: "0 0 1.25rem", fontSize: "0.9375rem" }}>
              Task Details
            </h3>

            <div style={{ marginBottom: "1.25rem" }}>
              <label>Title *</label>
              <input
                name="title"
                placeholder="Enter task title"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Describe the task…"
                value={form.description}
                onChange={handleChange}
                rows={5}
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Priority */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label>Priority</label>
              <div style={{ display: "flex", gap: "0.625rem" }}>
                {PRIORITIES.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, priority: p }))
                    }
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: "6px",
                      border: `1px solid ${
                        form.priority === p
                          ? PRIORITY_COLORS[p]
                          : "var(--border)"
                      }`,
                      background:
                        form.priority === p
                          ? `${PRIORITY_COLORS[p]}20`
                          : "var(--slate-700)",
                      color:
                        form.priority === p
                          ? PRIORITY_COLORS[p]
                          : "var(--text-muted)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label>Due Date *</label>
              <input
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          {/* ── RIGHT COLUMN: Assignment & Metadata ── */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {/* Assign Users */}
            <div style={CARD}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "0.9375rem" }}>
                Assign To
              </h3>
              {users.length === 0 ? (
                <p style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>
                  No users found
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    maxHeight: "220px",
                    overflowY: "auto",
                  }}
                >
                  {users.map((u) => {
                    const selected = form.assignedTo.includes(u._id);
                    return (
                      <div
                        key={u._id}
                        onClick={() => toggleUser(u._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          cursor: "pointer",
                          background: selected
                            ? "var(--teal-dim)"
                            : "transparent",
                          border: `1px solid ${
                            selected ? "rgba(45,212,191,0.3)" : "transparent"
                          }`,
                          transition: "all var(--transition-fast)",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: getAvatarColor(u.name),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
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
                        {selected && (
                          <div
                            style={{
                              marginLeft: "auto",
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              background: "var(--teal-500)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                            >
                              <path
                                d="M2 5l2 2 4-4"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Todo Checklist */}
            <div style={CARD}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "0.9375rem" }}>
                Checklist
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: "0.625rem",
                  marginBottom: "0.875rem",
                }}
              >
                <input
                  placeholder="Add checklist item…"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTodo())
                  }
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addTodo}
                  style={{ flexShrink: 0, padding: "0.5rem 0.875rem" }}
                >
                  <LuPlus size={16} />
                </button>
              </div>
              {form.todoChecklist.length === 0 ? (
                <p style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>
                  No items added yet
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.375rem",
                  }}
                >
                  {form.todoChecklist.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        padding: "0.5rem 0.75rem",
                        background: "var(--slate-700)",
                        borderRadius: "6px",
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          fontSize: "0.8125rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTodo(i)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-faint)",
                          padding: 0,
                          display: "flex",
                        }}
                      >
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attachments */}
            <div style={CARD}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "0.9375rem" }}>
                Attachments
              </h3>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.625rem 1rem",
                  borderRadius: "8px",
                  border: "1px dashed var(--border)",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                <LuUpload size={15} />
                {uploading ? "Uploading…" : "Click to upload (image or PDF)"}
                <input
                  type="file"
                  hidden
                  onChange={handleImageUpload}
                  accept="image/*,application/pdf"
                />
              </label>
              {form.attachments.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginTop: "0.75rem",
                  }}
                >
                  {form.attachments.map((url, i) => {
                    const filename = url.split("/").pop() || `File ${i + 1}`;
                    const isPDF =
                      filename.toLowerCase().endsWith(".pdf") ||
                      url.includes("application/pdf");
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.625rem",
                          padding: "0.5rem 0.75rem",
                          background: "var(--slate-700)",
                          borderRadius: "6px",
                        }}
                      >
                        {/* File type badge */}
                        <span
                          style={{
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            padding: "2px 5px",
                            borderRadius: "3px",
                            background: isPDF
                              ? "rgba(239,68,68,0.15)"
                              : "rgba(45,212,191,0.15)",
                            color: isPDF ? "#f87171" : "var(--teal-400)",
                            flexShrink: 0,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {isPDF ? "PDF" : "IMG"}
                        </span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "0.775rem",
                            color: "var(--text-secondary)",
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textDecoration: "none",
                          }}
                          title={filename}
                        >
                          {filename}
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              attachments: p.attachments.filter(
                                (_, idx) => idx !== i,
                              ),
                            }))
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--text-faint)",
                            padding: 0,
                            display: "flex",
                            flexShrink: 0,
                          }}
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit / Cancel */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1.5rem",
            gap: "0.75rem",
          }}
        >
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: "0.625rem 1.5rem", opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? isEditMode
                ? "Saving…"
                : "Creating…"
              : isEditMode
                ? "Save Changes"
                : "Create Task"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateTask;
