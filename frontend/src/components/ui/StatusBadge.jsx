import React from "react";
import { getStatusStyles } from "../../utils/helper";

const StatusBadge = ({ status }) => {
  const styles = getStatusStyles(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: "99px",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        background: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
