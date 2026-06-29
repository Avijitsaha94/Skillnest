"use client";
import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">SkillNest</span>
          </Link>
          <p className="text-[var(--text-muted)] text-sm">
            Create your free account and start learning today.
          </p>
        </div>

        <SignUp
          routing="hash"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-6",
              headerTitle: "text-gray-900 dark:text-white font-bold",
              headerSubtitle: "text-gray-500 dark:text-gray-400",
              socialButtonsBlockButton: "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
              formFieldInput: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold",
              footerActionLink: "text-indigo-600 dark:text-indigo-400 font-semibold",
              formFieldLabel: "text-gray-700 dark:text-gray-300 text-xs font-semibold uppercase",
              dividerLine: "bg-gray-200 dark:bg-gray-700",
              dividerText: "text-gray-400 text-xs",
            },
          }}
        />

        <p className="text-center text-sm text-[var(--text-muted)] mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}