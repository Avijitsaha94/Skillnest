"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "@/components/shared/ThemeProvider";
import {
  LayoutDashboard, BookOpen, Users, BarChart2,
  Star, Settings, Sun, Moon, Menu, Shield,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 flex-shrink-0 bg-[var(--surface)] border-r border-[var(--border)] h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-[var(--text)] text-sm">SkillNest Admin</p>
            <p className="text-xs text-[var(--text-muted)]">Management Portal</p>
          </div>
        </div>
      </div>
      <div className="p-4 flex-1">
        <p className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-3 px-2">Management</p>
        <nav className="space-y-1">
          {ADMIN_NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
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
      <div className="p-4 border-t border-[var(--border)]">
        <Link href="/dashboard" className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
          ← Back to Student Dashboard
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--bg)] overflow-hidden">
      <div className="hidden md:block"><Sidebar /></div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <p className="text-sm text-[var(--text-muted)]">
              Admin: <span className="font-semibold text-[var(--text)]">{user?.firstName}</span>
              <span className="ml-2 badge badge-primary text-[10px]">ADMIN</span>
            </p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-[var(--bg)] p-6">{children}</main>
      </div>
    </div>
  );
}
