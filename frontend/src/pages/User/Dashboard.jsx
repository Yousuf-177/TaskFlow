import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { LuCircleCheck, LuClock, LuListTodo } from "react-icons/lu";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import TaskCard from "../../components/ui/TaskCard";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";
import moment from "moment";

const UserDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.TASKS.USER_DASHBOARD_DATA,
        );
        setData(res.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const stats = data?.statistics;
  const recentTasks = data?.recentTask || [];

  const total = stats?.totalTasks || 0;
  const completed = stats?.CompletedTasks || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const radialData = [
    { name: "Progress", value: progress, fill: "var(--teal-500)" },
  ];

  // Split today vs upcoming
  const today = recentTasks.filter((t) =>
    moment(t.dueDate).isSame(moment(), "day"),
  );
  const upcoming = recentTasks
    .filter((t) => moment(t.dueDate).isAfter(moment(), "day"))
    .slice(0, 5);

  const CARD_STYLE = {
    background: "var(--slate-800)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "1.5rem",
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ margin: 0 }}>
          Welcome, {user?.name?.split(" ")[0] || "there"}
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-faint)",
            margin: "0.25rem 0 0",
          }}
        >
          {moment().format("dddd, MMMM D")} — here's your task overview
        </p>
      </div>

      {/* Top row: Stats + Progress ring */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr auto",
          gap: "1.25rem",
          marginBottom: "2rem",
          alignItems: "stretch",
        }}
      >
        <StatCard
          title="My Tasks"
          value={loading ? "…" : stats?.totalTasks}
          icon={<LuListTodo />}
          accentColor="teal"
        />
        <StatCard
          title="Pending"
          value={loading ? "…" : stats?.pendingTasks}
          icon={<LuClock />}
          accentColor="amber"
        />
        <StatCard
          title="Completed"
          value={loading ? "…" : stats?.CompletedTasks}
          icon={<LuCircleCheck />}
          accentColor="green"
        />

        {/* Radial progress ring */}
        <div
          style={{
            ...CARD_STYLE,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "160px",
            gap: "0.5rem",
          }}
        >
          <div
            style={{ position: "relative", width: "110px", height: "110px" }}
          >
            <ResponsiveContainer width={110} height={110}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                data={radialData}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: "var(--slate-700)" }}
                  dataKey="value"
                  angleAxisId={0}
                  fill="var(--teal-500)"
                  cornerRadius={8}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "1.375rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1,
                }}
              >
                {progress}%
              </span>
            </div>
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-faint)",
              fontWeight: 500,
            }}
          >
            Done
          </span>
        </div>
      </div>

      {/* Today's Tasks + Upcoming */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Today */}
        <div>
          <h3 style={{ margin: "0 0 1rem", fontSize: "0.9375rem" }}>
            Today's Tasks
            <span
              style={{
                marginLeft: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-faint)",
                fontWeight: 400,
              }}
            >
              ({today.length})
            </span>
          </h3>
          {loading ? (
            <p style={{ color: "var(--text-faint)", fontSize: "0.875rem" }}>
              Loading…
            </p>
          ) : today.length === 0 ? (
            <div
              style={{
                ...CARD_STYLE,
                textAlign: "center",
                color: "var(--text-faint)",
                fontSize: "0.875rem",
                padding: "2rem",
              }}
            >
              No tasks due today
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {today.map((t) => (
                <TaskCard
                  key={t._id}
                  task={t}
                  onClick={() => navigate(`/user/task-details/${t._id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div>
          <h3 style={{ margin: "0 0 1rem", fontSize: "0.9375rem" }}>
            Upcoming
            <span
              style={{
                marginLeft: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-faint)",
                fontWeight: 400,
              }}
            >
              (next {upcoming.length})
            </span>
          </h3>
          {loading ? (
            <p style={{ color: "var(--text-faint)", fontSize: "0.875rem" }}>
              Loading…
            </p>
          ) : upcoming.length === 0 ? (
            <div
              style={{
                ...CARD_STYLE,
                textAlign: "center",
                color: "var(--text-faint)",
                fontSize: "0.875rem",
                padding: "2rem",
              }}
            >
              No upcoming tasks
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {upcoming.map((t) => (
                <TaskCard
                  key={t._id}
                  task={t}
                  onClick={() => navigate(`/user/task-details/${t._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
