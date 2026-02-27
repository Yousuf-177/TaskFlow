import React from "react";
import { getPriorityStyles } from "../../utils/helper";

const PriorityBadge = ({ priority }) => {
  const styles = getPriorityStyles(priority);
  return (
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
        background: styles.bg,
        color: styles.text,
        border: `1px solid ${styles.border}`,
      }}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
