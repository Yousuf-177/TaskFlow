import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff, LuSquareCheck, LuCamera } from "react-icons/lu";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUser } from "../../context/UserContext";
import {
  getPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  getInitials,
  getAvatarColor,
} from "../../utils/helper";

const SignUp = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminInviteToken: "",
    profileImage: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const strength = getPasswordStrength(form.password);
  const strengthLabel = getPasswordStrengthLabel(strength);
  const strengthColor = getPasswordStrengthColor(strength);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload to server
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
      setForm((prev) => ({ ...prev, profileImage: data.ImageURL }));
      toast.success("Profile photo uploaded");
    } catch {
      toast.error("Photo upload failed — you can still register without one");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, form);
      login(
        {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          profileImage: data.profileImage,
        },
        data.token,
      );
      if (data.role === "admin") navigate("/admin/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const avatarBg = getAvatarColor(form.name || "?");
  const initials = getInitials(form.name || "?");

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, var(--slate-950) 0%, var(--slate-800) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "var(--slate-800)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          padding: "2.5rem 2rem",
          animation: "fadeIn 250ms ease",
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "var(--teal-500)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 4px 14px rgba(20,184,166,0.35)",
            }}
          >
            <LuSquareCheck size={24} color="white" />
          </div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
            Create account
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-faint)",
              margin: 0,
            }}
          >
            Join your team's TaskFlow workspace
          </p>
        </div>

        {/* ── Profile Photo Picker ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => fileInputRef.current?.click()}
            title="Click to upload profile photo"
          >
            {/* Avatar circle */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: imagePreview ? "transparent" : avatarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "2px solid var(--border)",
                transition: "border-color var(--transition-fast)",
                flexShrink: 0,
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--slate-900)",
                  }}
                >
                  {initials}
                </span>
              )}
            </div>

            {/* Camera overlay badge */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: uploading ? "var(--slate-600)" : "var(--teal-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--slate-800)",
                transition: "background var(--transition-fast)",
              }}
            >
              {uploading ? (
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    border: "1.5px solid transparent",
                    borderTopColor: "white",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              ) : (
                <LuCamera size={13} color="white" />
              )}
            </div>
          </div>

          <span
            style={{
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--text-faint)",
            }}
          >
            {uploading ? "Uploading…" : "Click to add photo (optional)"}
          </span>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}
        >
          {/* Full Name */}
          <div>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                style={{ paddingRight: "2.75rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-faint)",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
              </button>
            </div>

            {/* Password strength bar */}
            {form.password && (
              <div style={{ marginTop: "0.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    marginBottom: "0.25rem",
                  }}
                >
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      style={{
                        flex: 1,
                        height: "3px",
                        borderRadius: "2px",
                        background:
                          strength >= seg ? strengthColor : "var(--slate-600)",
                        transition: "background var(--transition-base)",
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: strengthColor,
                    fontWeight: 500,
                  }}
                >
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

          {/* Admin Token */}
          <div>
            <label htmlFor="adminInviteToken">
              Admin Invite Token{" "}
              <span
                style={{
                  color: "var(--text-faint)",
                  fontWeight: 400,
                  textTransform: "none",
                  letterSpacing: 0,
                }}
              >
                (optional)
              </span>
            </label>
            <input
              id="adminInviteToken"
              name="adminInviteToken"
              type="text"
              placeholder="Leave blank to register as member"
              value={form.adminInviteToken}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || uploading}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "0.75rem",
              fontSize: "0.9375rem",
              marginTop: "0.25rem",
              opacity: loading || uploading ? 0.7 : 1,
              cursor: loading || uploading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.875rem",
            color: "var(--text-faint)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--teal-400)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
