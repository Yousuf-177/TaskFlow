import React from "react";
import { getInitials, getAvatarColor, getAvatarUrl } from "../../utils/helper";

/**
 * Avatar — shows the user's profile image if available, otherwise initials.
 *
 * Props:
 *  name          string   — user's name (for initials + deterministic color)
 *  profileImage  string   — relative or absolute URL (/uploads/... or https://...)
 *  size          number   — diameter in px (default 36)
 *  fontSize      string   — initials font size (default auto-scaled)
 *  style         object   — extra inline styles on the container
 */
const Avatar = ({
  name = "",
  profileImage,
  size = 36,
  fontSize,
  style = {},
}) => {
  const imgUrl = getAvatarUrl(profileImage);
  const bg = getAvatarColor(name);
  const initials = getInitials(name);
  const fs = fontSize || `${Math.max(9, Math.round(size * 0.33))}px`;

  const base = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background: imgUrl ? "transparent" : bg,
    fontSize: fs,
    fontWeight: 700,
    color: "var(--slate-900)",
    ...style,
  };

  return (
    <div style={base}>
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.style.background = bg;
            e.currentTarget.insertAdjacentHTML(
              "afterend",
              `<span style="font-size:${fs};font-weight:700;color:var(--slate-900)">${initials}</span>`,
            );
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
