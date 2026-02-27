import React from "react";
import { useNavigate } from "react-router-dom";
import { LuCalendar, LuArrowRight } from "react-icons/lu";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import { formatDueDate, isOverdue } from "../../utils/helper";
import Avatar from "./Avatar";

const TaskCard = ({ task, onClick }) => {
  const navigate = useNavigate();
  const overdue = isOverdue(task.dueDate, task.status);

  const handleClick = () => {
    if (onClick) onClick(task);
  };

  return (
    <div
      className="card"
      onClick={handleClick}
      style={{
        padding: "1.125rem 1.25rem",
        cursor: "pointer",
        transition:
          "background var(--transition-fast), box-shadow var(--transition-fast)",
        borderLeft: overdue
          ? "3px solid var(--crimson-500)"
          : "3px solid transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--slate-700)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--slate-800)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      {/* Top row: title + arrow */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <h4
          style={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {task.title}
        </h4>
        <LuArrowRight
          size={15}
          style={{
            color: "var(--text-faint)",
            flexShrink: 0,
            marginTop: "2px",
          }}
        />
      </div>

      {/* Badges */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "0.875rem",
        }}
      >
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
      </div>

      {/* Footer: due date + assignees */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.775rem",
            color: overdue ? "var(--crimson-400)" : "var(--text-faint)",
          }}
        >
          <LuCalendar size={13} />
          {formatDueDate(task.dueDate)}
        </div>

        {/* Assigned avatars */}
        {task.assignedTo?.length > 0 && (
          <div style={{ display: "flex", marginLeft: "auto" }}>
            {task.assignedTo.slice(0, 3).map((u, i) => (
              <Avatar
                key={u._id || i}
                name={u.name || ""}
                profileImage={u.profileImage}
                size={26}
                style={{
                  marginLeft: i === 0 ? 0 : "-8px",
                  border: "2px solid var(--slate-800)",
                  zIndex: task.assignedTo.length - i,
                }}
              />
            ))}
            {task.assignedTo.length > 3 && (
              <div
                style={{
                  width: "26px",
                  height: "26px",
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
        )}
      </div>
    </div>
  );
};

export default TaskCard;
