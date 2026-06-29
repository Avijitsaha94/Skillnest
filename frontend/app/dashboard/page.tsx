"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, CheckCircle, TrendingUp, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CourseCard, CourseCardSkeleton } from "@/components/explore/CourseCard";
import api from "@/lib/api";
import type { ApiResponse, UserStats, Course } from "@/types";
import { formatDuration } from "@/lib/utils";

// Mock weekly progress for demo
const weeklyData = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 90 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 120 },
  { day: "Fri", minutes: 75 },
  { day: "Sat", minutes: 180 },
  { day: "Sun", minutes: 60 },
];

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading } = useQuery<ApiResponse<UserStats>>({
    queryKey: ["user-stats"],
    queryFn: () => api.get("/api/dashboard/user") as Promise<ApiResponse<UserStats>>,
  });

  const { data: recData, isLoading: recLoading } = useQuery<ApiResponse<Course[]>>({
    queryKey: ["ai-recommendations"],
    queryFn: () => api.get("/api/ai/recommendations") as Promise<ApiResponse<Course[]>>,
    staleTime: 5 * 60 * 1000,
  });

  const stats = statsData?.data;
  const recommendations = recData?.data ?? [];
  const recentCourses = (stats?.recentCourses ?? []) as Course[];

  const overviewCards = [
    { label: "Enrolled Courses", value: stats?.enrolledCount ?? 0, icon: BookOpen, color: "text-[var(--primary)] bg-[var(--primary-light)]" },
    { label: "Completed", value: stats?.completedCount ?? 0, icon: CheckCircle, color: "text-[var(--secondary)] bg-[var(--secondary-light)]" },
    { label: "Progress", value: `${stats?.progressPercent ?? 0}%`, icon: TrendingUp, color: "text-[var(--accent)] bg-[var(--accent-light)]" },
    { label: "AI Assists Used", value: "12", icon: Sparkles, color: "text-purple-600 bg-purple-50 dark:bg-purple-950" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">My Dashboard</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Track your learning progress and discover new courses.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-[var(--text)]">{statsLoading ? "—" : value}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts + Recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Learning activity chart */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-bold text-[var(--text)] mb-4">Learning Activity This Week</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px" }}
                formatter={(v: number) => [`${v} min`, "Study time"]}
              />
              <Line type="monotone" dataKey="minutes" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: "var(--primary)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent courses */}
        <div className="card p-6">
          <h2 className="font-bold text-[var(--text)] mb-4">Continue Learning</h2>
          {recentCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-10 h-10 text-[var(--text-subtle)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-muted)]">No courses yet.</p>
              <Link href="/explore" className="btn-primary !text-sm !py-2 mt-3 inline-flex">Browse Courses</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCourses.slice(0, 3).map((c) => (
                <Link key={c._id} href={`/courses/${c._id}`} className="flex gap-3 group">
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={c.thumbnail} alt={c.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--primary)] line-clamp-2">{c.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDuration(c.duration)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="font-bold text-[var(--text)]">AI Recommended for You</h2>
          <span className="badge badge-primary text-[10px]">Personalized</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recLoading
            ? Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
            : recommendations.slice(0, 4).map((c) => (
                <CourseCard key={c._id} course={c} showAIBadge />
              ))}
        </div>
      </div>
    </div>
  );
}
