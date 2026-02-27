import moment from "moment";

// ─── Priority Styling ─────────────────────────────────────────
export const getPriorityStyles = (priority) => {
  switch (priority) {
    case "High":
      return {
        bg: "rgba(239,68,68,0.12)",
        text: "#f87171",
        border: "rgba(239,68,68,0.25)",
        label: "High",
      };
    case "Medium":
      return {
        bg: "rgba(245,158,11,0.12)",
        text: "#fbbf24",
        border: "rgba(245,158,11,0.25)",
        label: "Medium",
      };
    case "Low":
    default:
      return {
        bg: "rgba(74,222,128,0.1)",
        text: "#4ade80",
        border: "rgba(74,222,128,0.2)",
        label: "Low",
      };
  }
};

// ─── Status Styling ───────────────────────────────────────────
export const getStatusStyles = (status) => {
  switch (status) {
    case "Completed":
      return {
        bg: "rgba(74,222,128,0.1)",
        text: "#4ade80",
        border: "rgba(74,222,128,0.2)",
      };
    case "In Progress":
      return {
        bg: "rgba(45,212,191,0.12)",
        text: "#2dd4bf",
        border: "rgba(45,212,191,0.25)",
      };
    case "Pending":
    default:
      return {
        bg: "rgba(100,116,139,0.15)",
        text: "#94a3b8",
        border: "rgba(100,116,139,0.25)",
      };
  }
};

// ─── Date Formatting ──────────────────────────────────────────
export const formatDueDate = (date) => {
  if (!date) return "—";
  const d = moment(date);
  const now = moment();

  if (d.isBefore(now, "day")) {
    const diff = now.diff(d, "days");
    return diff === 1 ? "Yesterday" : `${diff}d overdue`;
  }
  if (d.isSame(now, "day")) return "Today";
  if (d.isSame(now.clone().add(1, "day"), "day")) return "Tomorrow";
  return d.format("MMM D, YYYY");
};

// ─── Overdue Check ────────────────────────────────────────────
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === "Completed") return false;
  return moment(dueDate).isBefore(moment(), "day");
};

// ─── Name helpers ─────────────────────────────────────────────
export const getInitials = (name = "") => {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
};

// ─── Password Strength ────────────────────────────────────────
export const getPasswordStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0–4
};

export const getPasswordStrengthLabel = (score) => {
  return ["", "Weak", "Fair", "Good", "Strong"][score] || "";
};

export const getPasswordStrengthColor = (score) => {
  return [
    "transparent",
    "var(--crimson-500)",
    "var(--amber-500)",
    "var(--teal-500)",
    "var(--green-400)",
  ][score];
};

// ─── Avatar colour (deterministic) ───────────────────────────
const AVATAR_COLORS = [
  "#2dd4bf",
  "#14b8a6",
  "#f59e0b",
  "#fbbf24",
  "#818cf8",
  "#a78bfa",
  "#60a5fa",
  "#34d399",
];

export const getAvatarColor = (name = "") => {
  const index =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

// ─── Profile Image URL ────────────────────────────────────────
// Turns a relative /uploads/... path into a full backend URL.
// If the URL is already absolute, returns it as-is.
const BACKEND_URL = "http://localhost:8000";
export const getAvatarUrl = (profileImage) => {
  if (!profileImage) return null;
  if (profileImage.startsWith("http")) return profileImage;
  return `${BACKEND_URL}${profileImage}`;
};
