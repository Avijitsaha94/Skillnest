"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "@/components/shared/ThemeProvider";
import {
  LayoutDashboard, BookOpen, Sparkles, User,
  Sun, Moon, BookOpenCheck, Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/ai-tools", label: "AI Tools", icon: Sparkles },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = () => (
    <aside className="w-64 flex-shrink-0 bg-[var(--surface)] border-r border-[var(--border)] h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <BookOpenCheck className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">SkillNest</span>
        </Link>
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-3 px-2">Student</p>
        <nav className="space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]"
              )}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-[var(--border)]">
        <Link href="/explore" className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          <BookOpen className="w-4 h-4" /> Browse more courses
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[var(--bg)] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block"><Sidebar /></div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full"><Sidebar /></div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <p className="text-sm text-[var(--text-muted)]">
              Welcome back, <span className="font-semibold text-[var(--text)]">{user?.firstName ?? "Learner"}</span> 👋
            </p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg)] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
