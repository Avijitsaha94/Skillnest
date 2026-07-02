"use client";
import { SignIn, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { BookOpen, Zap, Loader2, User, Shield } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DEMO_ACCOUNTS = [
  {
    label: "Demo User",
    email: "user@skillnest.com",
    password: "54321user!",
    role: "Student account",
    icon: User,
    color: "#10b981",
  },
  {
    label: "Demo Admin",
    email: "admin@skillnest.com",
    password: "54321admin!",
    role: "Full admin access",
    icon: Shield,
    color: "#6366f1",
  },
];

export default function SignInPage() {
  const clerk = useClerk();
  const router = useRouter();
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);
  const [demoError, setDemoError] = useState("");
  const [showClerkForm, setShowClerkForm] = useState(false);
  // Auto-fill state for manual form
  const [autoFill, setAutoFill] = useState<{ email: string; password: string } | null>(null);

  const handleDemoLogin = async (
    email: string,
    password: string,
    label: string
  ) => {
    setLoadingDemo(label);
    setDemoError("");

    try {
      const signInAttempt = await clerk.client?.signIn?.create({
        identifier: email,
        password: password,
      });

      const status = signInAttempt?.status;
      const sessionId = signInAttempt?.createdSessionId;

      if (status === "complete" && sessionId) {
        // Perfect — direct login
        await clerk.setActive({ session: sessionId });
        router.push("/dashboard");
        router.refresh();
        return;
      }

      if (status === "needs_client_trust" || status === "needs_second_factor") {
        // Auto-fill the manual form and show it
        setAutoFill({ email, password });
        setDemoError(
          "⚡ Credentials auto-filled below — click Sign In to continue."
        );
        return;
      }

      // Fallback
      setAutoFill({ email, password });
      setDemoError("⚡ Credentials auto-filled below — click Sign In to continue.");

    } catch (err: unknown) {
      const clerkErr = err as {
        errors?: Array<{ longMessage?: string; message?: string }>;
        message?: string;
      };
      const msg =
        clerkErr?.errors?.[0]?.longMessage ??
        clerkErr?.errors?.[0]?.message ??
        clerkErr?.message ??
        "Demo login failed.";
      setDemoError(msg);
    } finally {
      setLoadingDemo(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">SkillNest</span>
          </Link>
          <p className="text-[var(--text-muted)] text-sm">
            Welcome back! Sign in to continue learning.
          </p>
        </div>

        {/* Demo Login */}
        <div className="card p-5 mb-5 border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              One-Click Demo Login
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            {DEMO_ACCOUNTS.map((acc) => {
              const IconComp = acc.icon;
              const isThisLoading = loadingDemo === acc.label;
              return (
                <button
                  key={acc.label}
                  onClick={() => handleDemoLogin(acc.email, acc.password, acc.label)}
                  disabled={loadingDemo !== null}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 bg-white dark:bg-gray-900 hover:border-indigo-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    borderColor: isThisLoading ? "#6366f1" : "transparent",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  {isThisLoading ? (
                    <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{ background: acc.color }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {acc.label}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {acc.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Credentials */}
          <div className="bg-white dark:bg-gray-900 rounded-lg p-3 text-xs space-y-1.5">
            <p className="text-gray-500 font-medium mb-1">Credentials:</p>
            {DEMO_ACCOUNTS.map((acc) => (
              <div key={acc.email} className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {acc.label}:
                </span>
                <span className="font-mono text-gray-500 dark:text-gray-400 text-[10px]">
                  {acc.email}
                </span>
              </div>
            ))}
          </div>

          {demoError && (
            <div className={`mt-3 p-2.5 rounded-lg border text-xs break-all ${
              demoError.startsWith("⚡")
                ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
            }`}>
              {demoError}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--text-muted)]">or sign in manually</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {!showClerkForm ? (
          <SimpleSignInForm
            onSwitchToClerk={() => setShowClerkForm(true)}
            autoFill={autoFill}
          />
        ) : (
          <div className="card overflow-hidden">
            <SignIn
              routing="hash"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 p-5",
                  headerTitle: "text-gray-900 dark:text-white font-bold",
                  headerSubtitle: "text-gray-500",
                  socialButtonsBlockButton: "border border-gray-200 dark:border-gray-700",
                  formFieldInput: "border-gray-200 dark:border-gray-700 rounded-lg",
                  formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 rounded-lg",
                  footerActionLink: "text-indigo-600",
                },
              }}
            />
          </div>
        )}

        <p className="text-center text-sm text-[var(--text-muted)] mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-indigo-600 font-semibold hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ── Simple email/password form with auto-fill support ── */
function SimpleSignInForm({
  onSwitchToClerk,
  autoFill,
}: {
  onSwitchToClerk: () => void;
  autoFill: { email: string; password: string } | null;
}) {
  const clerk = useClerk();
  const router = useRouter();
  const [form, setForm] = useState({
    email: autoFill?.email ?? "",
    password: autoFill?.password ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // autoFill আসলে form update করো
  useState(() => {
    if (autoFill) {
      setForm({ email: autoFill.email, password: autoFill.password });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await clerk.client?.signIn?.create({
        identifier: form.email,
        password: form.password,
      });

      if (result?.status === "complete" && result.createdSessionId) {
        await clerk.setActive({ session: result.createdSessionId });
        router.push("/dashboard");
        router.refresh();
      } else if (result?.status === "needs_client_trust") {
        setError("Session trust issue. Please try again or use Google login.");
      }
    } catch (err: unknown) {
      const e = err as { errors?: Array<{ message?: string }> };
      setError(e?.errors?.[0]?.message ?? "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="input-base"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
            Password
          </label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            className="input-base"
            placeholder="Your password"
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs p-2 bg-red-50 dark:bg-red-950 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full !justify-center !py-3 disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <button
        onClick={onSwitchToClerk}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors"
      >
        Continue with Google / Facebook →
      </button>
    </div>
  );
}