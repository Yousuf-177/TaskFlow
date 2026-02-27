import React from "react";

/**
 * StatCard — metric display card
 * Props: title, value, icon, accentColor ("teal"|"amber"|"crimson"|"green")
 */
const ACCENT_MAP = {
  teal: { bar: "var(--teal-500)", icon: "var(--teal-dim)" },
  amber: { bar: "var(--amber-500)", icon: "var(--amber-dim)" },
  crimson: { bar: "var(--crimson-500)", icon: "var(--crimson-dim)" },
  green: { bar: "var(--green-400)", icon: "var(--green-dim)" },
  slate: { bar: "var(--slate-500)", icon: "rgba(100,116,139,0.12)" },
};

const StatCard = ({ title, value, icon, accentColor = "teal" }) => {
  const accent = ACCENT_MAP[accentColor] || ACCENT_MAP.teal;

  return (
    <div
      className="card"
      style={{
        padding: "1.375rem 1.5rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        borderLeft: `3px solid ${accent.bar}`,
        transition: "box-shadow var(--transition-base)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "10px",
          background: accent.icon,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent.bar,
          flexShrink: 0,
          fontSize: "1.25rem",
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--text-faint)",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: "0.25rem",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "1.875rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {value ?? "—"}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
