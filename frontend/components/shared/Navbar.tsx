
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { useTheme } from "./ThemeProvider";
import {
  Sun, Moon, Menu, X, BookOpen, Sparkles, ChevronDown,
  LayoutDashboard, Users, BarChart2, Settings, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

const AUTH_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/my-courses", label: "My Courses" },
  { href: "/dashboard/ai-tools", label: "AI Tools" },
];

const ADMIN_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const { isSignedIn, user } = useUser();
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const role = (user?.publicMetadata?.role as string) ?? "user";
  const isAdmin = role === "admin" || role === "manager";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-xl">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="gradient-text">SkillNest</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {PUBLIC_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === l.href
                      ? "text-[var(--primary)] bg-[var(--primary-light)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}

            {isSignedIn &&
              AUTH_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname.startsWith(l.href)
                        ? "text-[var(--primary)] bg-[var(--primary-light)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]"
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}

            {/* Admin Dropdown */}
            {isSignedIn && isAdmin && (
              <li className="relative">
                <button
                  onClick={() => setAdminOpen((p) => !p)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname.startsWith("/admin")
                      ? "text-[var(--primary)] bg-[var(--primary-light)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]"
                  )}
                >
                  Admin <ChevronDown className={cn("w-3 h-3 transition-transform", adminOpen && "rotate-180")} />
                </button>
                {adminOpen && (
                  <div className="absolute top-full mt-1 right-0 w-52 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-lg)] py-1 z-50">
                    {ADMIN_LINKS.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setAdminOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary)] transition-colors"
                      >
                        <l.icon className="w-4 h-4" />
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle — mounted check avoids hydration mismatch */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors"
              suppressHydrationWarning
            >
              {mounted
                ? theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
                : <Moon className="w-4 h-4" />
              }
            </button>

            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/ai-tools"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--primary)] bg-[var(--primary-light)] rounded-md hover:bg-[var(--primary)] hover:text-white transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Tools
                </Link>
                <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                {/* FIX: Link to our custom /sign-in page — NOT SignInButton modal */}
                <Link href="/sign-in" className="btn-secondary !py-2 !px-4 !text-sm">
                  Log in
                </Link>
                <Link href="/sign-up" className="btn-primary !py-2 !px-4 !text-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle menu"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--bg)] border-t border-[var(--border)] px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-3">
            {[...PUBLIC_LINKS, ...(isSignedIn ? AUTH_LINKS : [])].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    pathname === l.href
                      ? "text-[var(--primary)] bg-[var(--primary-light)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {isSignedIn && isAdmin && (
              <>
                <li className="pt-2 pb-1">
                  <span className="text-xs font-semibold text-[var(--text-subtle)] uppercase px-3">Admin</span>
                </li>
                {ADMIN_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]">
                      <l.icon className="w-4 h-4" /> {l.label}
                    </Link>
                  </li>
                ))}
              </>
            )}
            {!isSignedIn && (
              <li className="pt-2 flex gap-2">
                <Link href="/sign-in" className="flex-1 btn-secondary !py-2 !text-sm text-center">Log in</Link>
                <Link href="/sign-up" className="flex-1 btn-primary !py-2 !text-sm text-center">Get Started</Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
