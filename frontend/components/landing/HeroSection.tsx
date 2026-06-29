"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Play, Sparkles, Users, BookOpen, Star } from "lucide-react";

const ROTATING_WORDS = ["Developers", "Designers", "Data Scientists", "Creators"];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-[65vh] flex items-center overflow-hidden"
      style={{ paddingTop: "64px" }}
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--primary)] opacity-10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[var(--secondary)] opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)] opacity-5 blur-3xl" />
      </div>

      <div className="container-xl relative py-20">
        <div className="max-w-3xl">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Learning Platform
          </div>

          {/* Headline */}
          <h1 className="section-title mb-4">
            The Skills Platform for<br />
            <span
              className="gradient-text transition-opacity duration-300"
              style={{ opacity: visible ? 1 : 0 }}
            >
              {ROTATING_WORDS[wordIndex]}
            </span>
          </h1>

          {/* Sub */}
          <p className="text-lg text-[var(--text-muted)] mb-10 max-w-xl leading-relaxed">
            Learn from industry experts with AI-powered personalization. 500+ courses in web development, data science, design, and more — with real projects.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link href="/explore" className="btn-primary text-base !px-6 !py-3">
              Explore Courses <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--text)] font-semibold hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <Play className="w-4 h-4 fill-current text-[var(--primary)]" />
              Watch Demo
            </Link>
          </div>

          {/* Social proof stats */}
          <div className="flex flex-wrap gap-8">
            {[
              { icon: Users, value: "50,000+", label: "Active learners" },
              { icon: BookOpen, value: "500+", label: "Expert courses" },
              { icon: Star, value: "4.8/5", label: "Average rating" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <div className="font-bold text-[var(--text)] text-lg leading-none">{value}</div>
                  <div className="text-xs text-[var(--text-muted)]">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
