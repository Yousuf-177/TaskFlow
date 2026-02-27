import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUser } from "../../context/UserContext";
import loginImg from "../../assets/login_img.png";

const Login = () => {
  const { login, user } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard", {
        replace: true,
      });
    }
  }, [user, navigate]);

  // Trigger entrance animation after mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, form);
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
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--slate-950)",
        overflow: "hidden",
      }}
    >
      {/* ── LEFT: Form Panel ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2.5rem 3rem",
          background: "var(--slate-900)",
          position: "relative",
          zIndex: 2,

          /* entrance slide */
          transform: mounted ? "translateX(0)" : "translateX(-40px)",
          opacity: mounted ? 1 : 0,
          transition:
            "transform 0.55s cubic-bezier(.22,.68,0,1.2), opacity 0.45s ease",
        }}
      >
        {/* Brand mark */}
        <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              background: "linear-gradient(135deg, var(--teal-500), #0d9488)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 6px 20px rgba(20,184,166,0.4)",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 11l3 3L22 4"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>
            Welcome back
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-faint)",
              margin: 0,
            }}
          >
            Sign in to your TaskFlow workspace
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "380px",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
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
                placeholder="Your password"
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
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "0.8rem",
              fontSize: "0.9375rem",
              marginTop: "0.25rem",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p
          style={{
            marginTop: "1.75rem",
            fontSize: "0.875rem",
            color: "var(--text-faint)",
            textAlign: "center",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "var(--teal-400)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Create account →
          </Link>
        </p>
      </div>

      {/* ── RIGHT: Image Panel ── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          transform: mounted ? "translateX(0)" : "translateX(40px)",
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
              "linear-gradient(135deg, rgba(8, 108, 100, 0.43) 0%, rgba(17, 36, 80, 0.59) 100%)",
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

        {/* Floating quote card */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "2rem",
            right: "2rem",
            zIndex: 2,
            background: "rgba(15,17,23,0.72)",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            border: "1px solid rgba(255,255,255,0.07)",
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            opacity: mounted ? 1 : 0,
            transition: "transform 0.6s 0.2s ease, opacity 0.5s 0.2s ease",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            "Great things in business are never done by one person. They're done
            by a team of people."
          </p>
          <p
            style={{
              margin: "0.5rem 0 0",
              fontSize: "0.75rem",
              color: "var(--teal-400)",
              fontWeight: 600,
            }}
          >
            — Steve Jobs
          </p>
        </div>
      </div>

      {/* Responsive: hide image on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .auth-image-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
