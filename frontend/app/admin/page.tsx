"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { BookOpen, Users, Star, DollarSign, TrendingUp, FileText } from "lucide-react";
import api from "@/lib/api";
import { formatNumber, formatDate } from "@/lib/utils";
import type { ApiResponse, AdminStats } from "@/types";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"];

export default function AdminPage() {
  const { data, isLoading } = useQuery<ApiResponse<AdminStats>>({
    queryKey: ["admin-stats"],
    queryFn: () => api.get("/api/dashboard/admin") as Promise<ApiResponse<AdminStats>>,
  });

  const stats = data?.data;
  const overview = stats?.overview;

  const overviewCards = [
    { label: "Total Courses", value: overview?.totalCourses, icon: BookOpen, color: "text-[var(--primary)] bg-[var(--primary-light)]", change: "+12%" },
    { label: "Total Users", value: overview?.totalUsers, icon: Users, color: "text-[var(--secondary)] bg-[var(--secondary-light)]", change: "+8%" },
    { label: "Total Enrollments", value: overview?.totalEnrollments, icon: TrendingUp, color: "text-[var(--accent)] bg-[var(--accent-light)]", change: "+24%" },
    { label: "Total Revenue", value: `$${formatNumber(overview?.totalRevenue ?? 0)}`, icon: DollarSign, color: "text-purple-600 bg-purple-50 dark:bg-purple-950", change: "+18%" },
    { label: "Total Reviews", value: overview?.totalReviews, icon: Star, color: "text-rose-600 bg-rose-50 dark:bg-rose-950", change: "+5%" },
    { label: "Blog Posts", value: overview?.totalBlogs, icon: FileText, color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950", change: "+2" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-[var(--radius)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">Admin Overview</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Platform-wide metrics and analytics.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewCards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[var(--secondary)]">{change}</span>
            </div>
            <div className="text-2xl font-extrabold text-[var(--text)]">
              {value !== undefined ? (typeof value === "number" ? formatNumber(value) : value) : "—"}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Category bar chart */}
        <div className="card p-6">
          <h2 className="font-bold text-[var(--text)] mb-5">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats?.revenueByCategory ?? []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="category" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: number) => [`$${formatNumber(v)}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Level distribution pie chart */}
        <div className="card p-6">
          <h2 className="font-bold text-[var(--text)] mb-5">Course Level Distribution</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={stats?.levelDistribution ?? []}
                  dataKey="count"
                  nameKey="level"
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={80}
                  paddingAngle={3}
                >
                  {(stats?.levelDistribution ?? []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {(stats?.levelDistribution ?? []).map((item, i) => (
                <div key={item.level} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-sm text-[var(--text-secondary)]">{item.level}</span>
                  <span className="text-sm font-bold text-[var(--text)] ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Courses by category line chart */}
      <div className="card p-6">
        <h2 className="font-bold text-[var(--text)] mb-5">Courses by Category</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats?.coursesByCategory ?? []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="category" tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
            />
            <Bar dataKey="count" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent users */}
      <div className="card p-6">
        <h2 className="font-bold text-[var(--text)] mb-5">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["User", "Email", "Role", "Joined"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-[var(--text-muted)] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {(stats?.recentUsers ?? []).map((u) => (
                <tr key={u._id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {u.avatar ? (
                        <Image src={u.avatar} alt={u.name} width={32} height={32} className="rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-[var(--text)]">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[var(--text-muted)]">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className={`badge text-[10px] ${
                      u.role === "admin" ? "badge-primary" :
                      u.role === "manager" ? "badge-accent" : "badge-secondary"
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-3 text-[var(--text-muted)]">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
