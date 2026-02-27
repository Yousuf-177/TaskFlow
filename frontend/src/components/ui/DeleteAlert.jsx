import React from "react";
import { LuTriangleAlert } from "react-icons/lu";
import Modal from "./Modal";

const DeleteAlert = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this item",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="400px">
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "var(--crimson-dim)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            color: "var(--crimson-400)",
          }}
        >
          <LuTriangleAlert size={24} />
        </div>
        <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
          Confirm Deletion
        </h3>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          Are you sure you want to delete{" "}
          <strong style={{ color: "var(--text-secondary)" }}>{itemName}</strong>
          ?
          <br />
          This action cannot be undone.
        </p>
        <div
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}
        >
          <button
            className="btn btn-ghost"
            onClick={onClose}
            style={{ minWidth: "100px" }}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ minWidth: "100px" }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAlert;
