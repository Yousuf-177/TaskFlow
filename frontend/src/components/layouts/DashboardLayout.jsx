import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--slate-900)",
      }}
    >
      <Sidebar />
      <main
        style={{
          flex: 1,
          marginLeft: "240px",
          padding: "2rem",
          overflowY: "auto",
          minHeight: "100vh",
        }}
        className="page-enter"
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
