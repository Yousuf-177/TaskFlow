import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff, LuCamera } from "react-icons/lu";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUser } from "../../context/UserContext";
import loginImg from "../../assets/login_img.png";
import {
  getPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  getInitials,
  getAvatarColor,
} from "../../utils/helper";

const SignUp = () => {
  const { login, user } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard", {
        replace: true,
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

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
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
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
      toast.error("Photo upload failed");
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
        display: "flex",
        background: "var(--slate-950)",
        overflow: "hidden",
      }}
    >
      {/* ── LEFT: Image Panel ── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          transform: mounted ? "translateX(0)" : "translateX(-40px)",
          opacity: mounted ? 1 : 0,
          transition:
            "transform 0.55s cubic-bezier(.22,.68,0,1.2), opacity 0.45s ease",
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(225deg, rgba(13,148,136,0.25) 0%, rgba(8,11,18,0.6) 100%)",
            zIndex: 1,
          }}
        />
        <img
          src={loginImg}
          alt="TaskFlow illustration"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: mounted ? "scale(1)" : "scale(1.06)",
            transition: "transform 0.7s cubic-bezier(.22,.68,0,1.1)",
          }}
        />

        {/* Stats card */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: mounted
              ? "translate(-50%, -50%)"
              : "translate(-50%, calc(-50% + 20px))",
            zIndex: 2,
            background: "rgba(15,17,23,0.75)",
            backdropFilter: "blur(14px)",
            borderRadius: "16px",
            padding: "1.75rem 2rem",
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "center",
            minWidth: "220px",
            opacity: mounted ? 1 : 0,
            transition: "transform 0.65s 0.15s ease, opacity 0.5s 0.15s ease",
          }}
        >
          <div
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "var(--teal-400)",
              lineHeight: 1,
            }}
          >
            10K+
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-faint)",
              marginTop: "0.4rem",
            }}
          >
            Tasks completed daily
          </div>
          <div
            style={{
              height: "1px",
              background: "rgba(255,255,255,0.08)",
              margin: "1rem 0",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {[
              ["98%", "Satisfaction"],
              ["500+", "Teams"],
              ["24/7", "Support"],
            ].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {val}
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-faint)",
                    marginTop: "2px",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem 3rem",
          background: "var(--slate-900)",
          overflowY: "auto",
          transform: mounted ? "translateX(0)" : "translateX(40px)",
          opacity: mounted ? 1 : 0,
          transition:
            "transform 0.55s cubic-bezier(.22,.68,0,1.2), opacity 0.45s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            width: "100%",
            maxWidth: "380px",
          }}
        >
          <h1 style={{ fontSize: "1.65rem", marginBottom: "0.2rem" }}>
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

        {/* Avatar picker */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => fileInputRef.current?.click()}
          >
            <div
              style={{
                width: "76px",
                height: "76px",
                borderRadius: "50%",
                background: imagePreview ? "transparent" : avatarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "2px solid var(--border)",
                transition: "border-color 0.2s",
                flexShrink: 0,
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "var(--slate-900)",
                  }}
                >
                  {initials}
                </span>
              )}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: uploading ? "var(--slate-600)" : "var(--teal-500)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--slate-900)",
                transition: "background 0.2s",
              }}
            >
              {uploading ? (
                <div
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    border: "1.5px solid transparent",
                    borderTopColor: "white",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              ) : (
                <LuCamera size={12} color="white" />
              )}
            </div>
          </div>
          <span
            style={{
              marginTop: "0.375rem",
              fontSize: "0.72rem",
              color: "var(--text-faint)",
            }}
          >
            {uploading ? "Uploading…" : "Add photo (optional)"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "380px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
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
            {form.password && (
              <div style={{ marginTop: "0.4rem" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    marginBottom: "0.2rem",
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
                        transition: "background 0.2s",
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: strengthColor,
                    fontWeight: 500,
                  }}
                >
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

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
              padding: "0.8rem",
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
            marginTop: "1.25rem",
            fontSize: "0.875rem",
            color: "var(--text-faint)",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--teal-400)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
