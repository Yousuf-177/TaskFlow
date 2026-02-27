import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  LuCircleCheck,
  LuClock,
  LuCircleAlert,
  LuListTodo,
} from "react-icons/lu";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import PriorityBadge from "../../components/ui/PriorityBadge";
import StatusBadge from "../../components/ui/StatusBadge";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { formatDueDate } from "../../utils/helper";
import toast from "react-hot-toast";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--slate-700)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "0.625rem 0.875rem",
        fontSize: "0.8rem",
        color: "var(--text-primary)",
      }}
    >
      <div style={{ color: "var(--text-muted)", marginBottom: "2px" }}>
        {label}
      </div>
      <strong>{payload[0].value}</strong>
    </div>
  );
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.TASKS.DASHBOARD_DATA);
        setData(res.data);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const stats = data?.statistics;

  const statusChartData = data
    ? [
        { name: "Pending", value: data.charts.taskDistribution.Pending || 0 },
        {
          name: "In Progress",
          value: data.charts.taskDistribution.InProgress || 0,
        },
        {
          name: "Completed",
          value: data.charts.taskDistribution.Completed || 0,
        },
      ]
    : [];

  const priorityChartData = data
    ? [
        { name: "Low", value: data.charts.taskPriorityLevel.Low || 0 },
        { name: "Medium", value: data.charts.taskPriorityLevel.Medium || 0 },
        { name: "High", value: data.charts.taskPriorityLevel.High || 0 },
      ]
    : [];

  const STATUS_COLORS = ["#94a3b8", "#2dd4bf", "#4ade80"];
  const PRIORITY_COLORS = ["#4ade80", "#fbbf24", "#f87171"];

  const CHART_BASE = {
    background: "var(--slate-800)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "1.5rem",
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-faint)",
            margin: "0.25rem 0 0",
          }}
        >
          Overview of all tasks across the workspace
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          title="Total Tasks"
          value={loading ? "…" : stats?.totalTasks}
          icon={<LuListTodo />}
          accentColor="teal"
        />
        <StatCard
          title="Pending"
          value={loading ? "…" : stats?.PendingTasks}
          icon={<LuClock />}
          accentColor="amber"
        />
        <StatCard
          title="Completed"
          value={loading ? "…" : stats?.CompletedTasks}
          icon={<LuCircleCheck />}
          accentColor="green"
        />
        <StatCard
          title="Overdue"
          value={loading ? "…" : stats?.OverDueTasks}
          icon={<LuCircleAlert />}
          accentColor="crimson"
        />
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {/* Status Distribution */}
        <div style={CHART_BASE}>
          <h3 style={{ margin: "0 0 1.25rem", fontSize: "0.9375rem" }}>
            Task Status
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusChartData} barCategoryGap="35%">
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-faint)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-faint)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {statusChartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={STATUS_COLORS[i % STATUS_COLORS.length]}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div style={CHART_BASE}>
          <h3 style={{ margin: "0 0 1.25rem", fontSize: "0.9375rem" }}>
            Task Priority
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityChartData} barCategoryGap="35%">
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--text-faint)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--text-faint)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {priorityChartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PRIORITY_COLORS[i % PRIORITY_COLORS.length]}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div style={CHART_BASE}>
        <h3 style={{ margin: "0 0 1.25rem", fontSize: "0.9375rem" }}>
          Recent Tasks
        </h3>
        {loading ? (
          <p style={{ color: "var(--text-faint)", fontSize: "0.875rem" }}>
            Loading…
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Title", "Priority", "Status", "Due Date"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.625rem 1rem",
                        textAlign: "left",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "var(--text-faint)",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.recentTask || []).map((task) => (
                  <tr
                    key={task._id}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      transition: "background var(--transition-fast)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--slate-700)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "0.875rem 1rem",
                        fontSize: "0.875rem",
                        color: "var(--text-primary)",
                        fontWeight: 500,
                      }}
                    >
                      {task.title}
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <StatusBadge status={task.status} />
                    </td>
                    <td
                      style={{
                        padding: "0.875rem 1rem",
                        fontSize: "0.8125rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {formatDueDate(task.dueDate)}
                    </td>
                  </tr>
                ))}
                {!data?.recentTask?.length && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding: "2rem 1rem",
                        textAlign: "center",
                        color: "var(--text-faint)",
                        fontSize: "0.875rem",
                      }}
                    >
                      No tasks yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
