import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

/* ─── Scroll-reveal hook ─────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Reusable Section wrapper ───────────────────────────────── */
const Section = ({ children, style = {} }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: "translateY(32px)",
        transition:
          "opacity 0.65s ease, transform 0.65s cubic-bezier(.22,.68,0,1.1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ─── Feature card ───────────────────────────────────────────── */
const FeatureCard = ({ icon, title, desc, delay = 0 }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: "translateY(28px)",
        transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s cubic-bezier(.22,.68,0,1.1)`,
        background: "var(--slate-800)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(45,212,191,0.35)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--border)")
      }
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "10px",
          background: "rgba(20,184,166,0.12)",
          border: "1px solid rgba(20,184,166,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.35rem",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          margin: 0,
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: "0.8375rem",
          color: "var(--text-faint)",
          lineHeight: 1.65,
        }}
      >
        {desc}
      </p>
    </div>
  );
};

/* ─── Step card (How it works) ───────────────────────────────── */
const StepCard = ({ num, title, desc, delay = 0 }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: "translateY(24px)",
        transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--teal-500), #0d9488)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.15rem",
          fontWeight: 800,
          color: "white",
          boxShadow: "0 4px 20px rgba(20,184,166,0.35)",
        }}
      >
        {num}
      </div>
      <h4
        style={{
          margin: 0,
          fontSize: "0.9375rem",
          fontWeight: 700,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h4>
      <p
        style={{
          margin: 0,
          fontSize: "0.8125rem",
          color: "var(--text-faint)",
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
    </div>
  );
};

/* ─── Tech badge ─────────────────────────────────────────────── */
const TechBadge = ({ label, emoji }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.45rem 1rem",
      borderRadius: "99px",
      background: "var(--slate-700)",
      border: "1px solid var(--border)",
      fontSize: "0.8rem",
      fontWeight: 600,
      color: "var(--text-secondary)",
      whiteSpace: "nowrap",
    }}
  >
    <span>{emoji}</span>
    {label}
  </div>
);

/* ─── Stat item ──────────────────────────────────────────────── */
const Stat = ({ value, label }) => (
  <div style={{ textAlign: "center" }}>
    <div
      style={{
        fontSize: "2.25rem",
        fontWeight: 800,
        color: "var(--teal-400)",
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: "0.8rem",
        color: "var(--text-faint)",
        marginTop: "0.35rem",
      }}
    >
      {label}
    </div>
  </div>
);

/* ─── Navbar ─────────────────────────────────────────────────── */
const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "64px",
        background: "rgba(10,12,20,0.82)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2.5rem",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(135deg, var(--teal-500), #0d9488)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
        <span
          style={{
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          TaskFlow
        </span>
      </div>

      {/* Anchor links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {["Features", "How it works", "Tech Stack"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            style={{
              color: "var(--text-faint)",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--teal-400)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-faint)")
            }
          >
            {item}
          </a>
        ))}
      </div>

      {/* Auth area — changes based on session */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        {user ? (
          /* ── Signed-in state ── */
          <>
            <span style={{ fontSize: "0.875rem", color: "var(--text-faint)" }}>
              Hi,{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                {user.name?.split(" ")[0]}
              </strong>
            </span>
            <button
              onClick={() => navigate(dashboardPath)}
              className="btn btn-primary"
              style={{ padding: "0.45rem 1.1rem", fontSize: "0.875rem" }}
            >
              Go to Dashboard
            </button>
            <button
              onClick={logout}
              className="btn btn-ghost"
              style={{ padding: "0.45rem 0.9rem", fontSize: "0.8rem" }}
            >
              Sign out
            </button>
          </>
        ) : (
          /* ── Signed-out state ── */
          <>
            <Link
              to="/login"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary"
              style={{ padding: "0.45rem 1.1rem", fontSize: "0.875rem" }}
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
═══════════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const features = [
    {
      icon: "👑",
      title: "Admin Control Panel",
      desc: "Full user management, multi-user task assignment, role-based access control, and system-wide analytics from a unified dashboard.",
    },
    {
      icon: "🎯",
      title: "Smart Task Priorities",
      desc: "Assign Low, Medium, or High priority to every task. Priority data feeds directly into charts and Excel reports.",
    },
    {
      icon: "✅",
      title: "Hierarchical Checklists",
      desc: "Break tasks into sub-tasks with todoChecklists. Overall progress and status auto-update as checklist items are completed.",
    },
    {
      icon: "📊",
      title: "Visualized Analytics",
      desc: "Aggregated charts for task distribution by status and priority. Admin dashboard shows total, pending, completed, and overdue tasks.",
    },
    {
      icon: "📄",
      title: "Excel Report Export",
      desc: "Download detailed .xlsx reports for all tasks or user summaries at any time. Built with ExcelJS for clean, structured data.",
    },
    {
      icon: "🔐",
      title: "Secure JWT Auth",
      desc: "Role-based JWT authentication. Admin registration is protected by an invite token. All private routes are fully secured.",
    },
    {
      icon: "🖼️",
      title: "Cloud Profile Images",
      desc: "Profile photos upload to Cloudinary and are stored as permanent URLs in MongoDB. Profile pics appear across all dashboards.",
    },
    {
      icon: "📎",
      title: "File Attachments",
      desc: "Attach images and PDFs to tasks. Files upload to the cloud and display inline in task detail views with filename badges.",
    },
  ];

  const steps = [
    {
      num: "1",
      title: "Create an account",
      desc: "Sign up as a member, or use an Admin Invite Token to register as an admin. Add your profile photo.",
    },
    {
      num: "2",
      title: "Set up your workspace",
      desc: "Admins create tasks, set priorities, add deadlines, and assign team members. Members see only their own tasks.",
    },
    {
      num: "3",
      title: "Track & collaborate",
      desc: "Members update task status and mark checklist items done. Progress bars and charts update in real time.",
    },
    {
      num: "4",
      title: "Export & review",
      desc: "Admins can download Excel reports of task progress and user summaries with a single click at any time.",
    },
  ];

  const techs = [
    { label: "React", emoji: "⚛️" },
    { label: "Node.js", emoji: "🟢" },
    { label: "Express.js", emoji: "🚂" },
    { label: "MongoDB", emoji: "🍃" },
    { label: "Mongoose", emoji: "🔗" },
    { label: "JWT", emoji: "🔐" },
    { label: "Cloudinary", emoji: "☁️" },
    { label: "ExcelJS", emoji: "📊" },
    { label: "Multer", emoji: "📁" },
    { label: "bcryptjs", emoji: "🔑" },
  ];

  return (
    <div
      style={{
        background: "var(--slate-950)",
        color: "var(--text-primary)",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6rem 2rem 4rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "500px",
            background:
              "radial-gradient(ellipse, rgba(20,184,166,0.13) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "20%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            borderRadius: "99px",
            background: "rgba(20,184,166,0.1)",
            border: "1px solid rgba(20,184,166,0.25)",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "var(--teal-400)",
            marginBottom: "1.75rem",
            animation: "fadeIn 0.6s ease",
          }}
        >
          Production-ready Task Management
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.035em",
            maxWidth: "820px",
            margin: "0 auto 1.25rem",
            animation: "fadeIn 0.7s 0.1s ease both",
          }}
        >
          Manage tasks that{" "}
          <span
            style={{
              background: "linear-gradient(90deg, var(--teal-400), #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            move your team forward
          </span>
        </h1>

        {/* Sub-heading */}
        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--text-faint)",
            maxWidth: "580px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
            animation: "fadeIn 0.7s 0.2s ease both",
          }}
        >
          TaskFlow is a robust, role-based task management platform for teams.
          Admins create and assign. Members execute and deliver. Everyone stays
          in sync.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            animation: "fadeIn 0.7s 0.3s ease both",
          }}
        >
          <Link
            to="/signup"
            className="btn btn-primary"
            style={{
              padding: "0.8rem 2rem",
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            Get started free
          </Link>
          <Link
            to="/login"
            className="btn btn-ghost"
            style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}
          >
            Sign in →
          </Link>
        </div>

        {/* Stats bar */}
        <Section
          style={{ marginTop: "4.5rem", width: "100%", maxWidth: "620px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
              background: "var(--slate-800)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "1.75rem 2rem",
            }}
          >
            <Stat value="10K+" label="Tasks completed daily" />
            <Stat value="500+" label="Teams worldwide" />
            <Stat value="98%" label="Satisfaction rate" />
            <Stat value="24/7" label="Always available" />
          </div>
        </Section>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section
        id="features"
        style={{ padding: "5rem 2rem", maxWidth: "1200px", margin: "0 auto" }}
      >
        <Section style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--teal-400)",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            Everything you need
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 800,
            }}
          >
            Powerful features for your entire team
          </h2>
          <p
            style={{
              marginTop: "0.75rem",
              color: "var(--text-faint)",
              fontSize: "1rem",
              maxWidth: "520px",
              margin: "0.75rem auto 0",
            }}
          >
            From admin dashboards to member task views — TaskFlow covers the
            full project lifecycle.
          </p>
        </Section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 0.05} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          background: "var(--slate-900)",
          padding: "5rem 2rem",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Section style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--teal-400)",
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              Simple workflow
            </span>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 800,
              }}
            >
              Up and running in minutes
            </h2>
          </Section>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2.5rem",
              position: "relative",
            }}
          >
            {/* Connector line */}
            <div
              style={{
                position: "absolute",
                top: "26px",
                left: "calc(12.5% + 26px)",
                right: "calc(12.5% + 26px)",
                height: "2px",
                background:
                  "linear-gradient(90deg, var(--teal-500), rgba(45,212,191,0.2))",
                zIndex: 0,
                display: "block",
              }}
            />
            {steps.map((s, i) => (
              <StepCard key={s.num} {...s} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ADMIN vs MEMBER ──────────────────────────────────── */}
      <section
        style={{ padding: "5rem 2rem", maxWidth: "1100px", margin: "0 auto" }}
      >
        <Section style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--teal-400)",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            Role-based experience
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 800,
            }}
          >
            Built for every member of your team
          </h2>
        </Section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Admin */}
          <Section>
            <div
              style={{
                background: "var(--slate-800)",
                border: "1px solid rgba(45,212,191,0.25)",
                borderRadius: "16px",
                padding: "2rem",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>👑</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>
                    Admin
                  </div>
                  <div
                    style={{ fontSize: "0.75rem", color: "var(--teal-400)" }}
                  >
                    Full control
                  </div>
                </div>
              </div>
              {[
                "Manage all users and team members",
                "Create, assign & delete tasks",
                "View system-wide analytics dashboard",
                "Export Excel task & user reports",
                "Secure admin registration with invite token",
                "Scoped workspace — your tasks, only yours",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      color: "var(--teal-400)",
                      fontSize: "1rem",
                      marginTop: "1px",
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontSize: "0.8375rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* Member */}
          <Section>
            <div
              style={{
                background: "var(--slate-800)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "2rem",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>👤</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>
                    Member
                  </div>
                  <div
                    style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}
                  >
                    Focused workspace
                  </div>
                </div>
              </div>
              {[
                "Personalized dashboard with own tasks",
                "Update task status (Pending → Completed)",
                "Mark sub-checklist items as done",
                "View task details, attachments & deadlines",
                "Progress auto-updates from checklist",
                "Clean, distraction-free task view",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-faint)",
                      fontSize: "1rem",
                      marginTop: "1px",
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontSize: "0.8375rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ── TECH STACK ───────────────────────────────────────── */}
      <section
        id="tech-stack"
        style={{
          background: "var(--slate-900)",
          padding: "4rem 2rem",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Section style={{ textAlign: "center" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--teal-400)",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            Under the hood
          </span>
          <h2
            style={{
              margin: "0 0 2rem",
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              fontWeight: 800,
            }}
          >
            Built on a modern, reliable stack
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              justifyContent: "center",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            {techs.map((t) => (
              <TechBadge key={t.label} {...t} />
            ))}
          </div>
        </Section>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ padding: "6rem 2rem", textAlign: "center" }}>
        <Section>
          <div
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              background: "var(--slate-800)",
              border: "1px solid rgba(45,212,191,0.2)",
              borderRadius: "20px",
              padding: "3.5rem 2.5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* glow */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: "500px",
                height: "300px",
                background:
                  "radial-gradient(ellipse, rgba(20,184,166,0.1) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 800,
                margin: "0 0 0.75rem",
              }}
            >
              Ready to supercharge your team?
            </h2>
            <p
              style={{
                color: "var(--text-faint)",
                fontSize: "1rem",
                margin: "0 0 2rem",
                lineHeight: 1.65,
              }}
            >
              Join TaskFlow today — free to start, scales with your team.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.875rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/signup"
                className="btn btn-primary"
                style={{
                  padding: "0.8rem 2.25rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                }}
              >
                Create free account
              </Link>
              <Link
                to="/login"
                className="btn btn-ghost"
                style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}
              >
                Sign in
              </Link>
            </div>
          </div>
        </Section>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "2rem",
          textAlign: "center",
          color: "var(--text-faint)",
          fontSize: "0.8rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              background: "linear-gradient(135deg, var(--teal-500), #0d9488)",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 11l3 3L22 4"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <strong
            style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}
          >
            TaskFlow
          </strong>
        </div>
        <p style={{ margin: "0 0 0.25rem" }}>
          Built by{" "}
          <a
            href="https://github.com/Yousuf-177"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--teal-400)", textDecoration: "none" }}
          >
            Yousuf Ansari
          </a>
        </p>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
