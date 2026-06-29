"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInView, useCountUp } from "@/hooks";
import { CourseCard, CourseCardSkeleton } from "../explore/CourseCard";
import { StarRating } from "../ui/StarRating";
import api from "@/lib/api";
import { Course, ApiResponse } from "@/types";
import {
  Zap, Shield, Brain, Trophy, Users, Clock, Globe,
  ChevronLeft, ChevronRight, CheckCircle, BookOpen,
  TrendingUp, MessageSquare, Lightbulb, Code2,
} from "lucide-react";

// ─── 1. Features ───────────────────────────────────────────
const FEATURES = [
  { icon: Brain, title: "AI-Powered Learning", desc: "Personalized recommendations and AI tools that adapt to your learning style and pace." },
  { icon: Users, title: "Expert Instructors", desc: "Learn from industry professionals with real-world experience at top tech companies." },
  { icon: Trophy, title: "Recognized Certificates", desc: "Earn certificates accepted by 500+ companies worldwide, including FAANG." },
  { icon: Code2, title: "Hands-On Projects", desc: "Every course includes real projects you can add to your portfolio immediately." },
  { icon: Globe, title: "Learn Anywhere", desc: "Access courses on any device, online or offline, at your own pace." },
  { icon: Shield, title: "30-Day Guarantee", desc: "Not satisfied? Get a full refund within 30 days, no questions asked." },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-[var(--bg-secondary)]">
      <div className="container-xl">
        <div className="text-center mb-14">
          <span className="badge badge-primary mb-3">Why SkillNest</span>
          <h2 className="section-title">Everything you need to succeed</h2>
          <p className="section-subtitle mx-auto text-center">
            We have combined the best of online education with AI to give you the fastest path to your goals.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 group">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] flex items-center justify-center mb-4 group-hover:bg-[var(--primary)] transition-colors">
                <Icon className="w-6 h-6 text-[var(--primary)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-[var(--text)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 2. Categories ─────────────────────────────────────────
const CATEGORIES = [
  { name: "Web Development", icon: "🌐", count: 120, color: "bg-blue-50 dark:bg-blue-950" },
  { name: "Data Science", icon: "📊", count: 85, color: "bg-emerald-50 dark:bg-emerald-950" },
  { name: "Machine Learning", icon: "🤖", count: 64, color: "bg-purple-50 dark:bg-purple-950" },
  { name: "Mobile Development", icon: "📱", count: 72, color: "bg-orange-50 dark:bg-orange-950" },
  { name: "DevOps", icon: "⚙️", count: 48, color: "bg-red-50 dark:bg-red-950" },
  { name: "Design", icon: "🎨", count: 55, color: "bg-pink-50 dark:bg-pink-950" },
  { name: "Business", icon: "💼", count: 38, color: "bg-yellow-50 dark:bg-yellow-950" },
  { name: "Marketing", icon: "📣", count: 43, color: "bg-cyan-50 dark:bg-cyan-950" },
];

export function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="container-xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="badge badge-secondary mb-3">Categories</span>
            <h2 className="section-title">Explore by topic</h2>
          </div>
          <Link href="/explore" className="btn-secondary !py-2 !px-4 !text-sm hidden sm:flex">
            All Categories
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              href={`/explore?category=${encodeURIComponent(c.name)}`}
              className={`${c.color} rounded-[var(--radius)] p-4 flex flex-col items-center gap-2 hover:ring-2 hover:ring-[var(--primary)] transition-all group`}
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-xs font-semibold text-[var(--text)] text-center leading-tight group-hover:text-[var(--primary)]">
                {c.name}
              </span>
              <span className="text-xs text-[var(--text-muted)]">{c.count} courses</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 3. Top Courses ────────────────────────────────────────
export function TopCoursesSection() {
  const { data, isLoading } = useQuery<ApiResponse<Course[]>>({
    queryKey: ["top-courses"],
    queryFn: () => api.get("/api/courses/top") as Promise<ApiResponse<Course[]>>,
  });
  const courses = data?.data ?? [];

  return (
    <section className="py-20 bg-[var(--bg-secondary)]">
      <div className="container-xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="badge badge-accent mb-3">Top Rated</span>
            <h2 className="section-title">Most popular courses</h2>
          </div>
          <Link href="/explore?sort=rating" className="btn-secondary !py-2 !px-4 !text-sm hidden sm:flex">
            View All
          </Link>
        </div>
        {/* 4 per row desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
            : courses.map((c) => <CourseCard key={c._id} course={c} />)}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Statistics ─────────────────────────────────────────
const STATS = [
  { value: 50000, suffix: "+", label: "Active Learners", icon: Users },
  { value: 500, suffix: "+", label: "Expert Courses", icon: BookOpen },
  { value: 95, suffix: "%", label: "Completion Rate", icon: TrendingUp },
  { value: 200, suffix: "+", label: "Countries Reached", icon: Globe },
];

export function StatsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-20" ref={ref}>
      <div className="container-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ value, suffix, label, icon: Icon }) => {
            const count = useCountUp(value, 1800, inView);
            return (
              <div key={label} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--primary-light)] flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-[var(--primary)]" />
                </div>
                <div className="text-4xl font-extrabold gradient-text mb-1">
                  {count.toLocaleString()}{suffix}
                </div>
                <div className="text-sm text-[var(--text-muted)] font-medium">{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 5. Testimonials ──────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Marcus Williams",
    role: "Full-Stack Developer at Stripe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
    rating: 5,
    text: "SkillNest's React course is the most practical I have found online. I went from struggling with hooks to building production apps in 6 weeks. Landed my dream job immediately after.",
  },
  {
    name: "Aisha Patel",
    role: "Data Scientist at Google",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aisha",
    rating: 5,
    text: "The AI recommendations helped me build a perfect learning path. Instead of wasting time on courses I didn't need, I went straight to what mattered for my data science transition.",
  },
  {
    name: "James Chen",
    role: "iOS Developer at Apple",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jameschen",
    rating: 5,
    text: "The Swift and iOS course quality here is unmatched. Real projects, up-to-date content, and an instructor who actually responds to questions. Worth every cent.",
  },
  {
    name: "Sofia Martinez",
    role: "UX Lead at Figma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia",
    rating: 5,
    text: "I used the AI chat assistant throughout the design course to get feedback on my work. It is like having a mentor available 24/7. My portfolio went from zero to hired in 3 months.",
  },
  {
    name: "Liam O'Brien",
    role: "DevOps Engineer at Netflix",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liam",
    rating: 5,
    text: "Kubernetes and AWS content is kept extremely current. The hands-on labs use real cloud environments. This is the only platform I recommend to my team for DevOps upskilling.",
  },
];

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const len = TESTIMONIALS.length;
  const prev = () => setIdx((i) => (i - 1 + len) % len);
  const next = () => setIdx((i) => (i + 1) % len);
  const t = TESTIMONIALS[idx];

  return (
    <section className="py-20 bg-[var(--bg-secondary)]">
      <div className="container-xl">
        <div className="text-center mb-14">
          <span className="badge badge-primary mb-3">Testimonials</span>
          <h2 className="section-title">What our learners say</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 text-center">
            <Image
              src={t.avatar}
              alt={t.name}
              width={72}
              height={72}
              className="rounded-full mx-auto mb-4 border-4 border-[var(--primary-light)]"
            />
            <StarRating rating={t.rating} size="md" />
            <p className="text-[var(--text-secondary)] text-base leading-relaxed mt-4 mb-6 italic">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="font-bold text-[var(--text)]">{t.name}</div>
            <div className="text-sm text-[var(--text-muted)]">{t.role}</div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === idx ? "w-6 bg-[var(--primary)]" : "bg-[var(--border-strong)]"}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 6. FAQ ────────────────────────────────────────────────
const FAQS = [
  { q: "Do I get lifetime access to purchased courses?", a: "Yes! Once you enroll in a course, you have lifetime access including all future updates to the course content." },
  { q: "Are the certificates recognized by employers?", a: "Our certificates are recognized by 500+ companies including Google, Stripe, Shopify, and many more. We partner with employers to ensure our curriculum meets industry standards." },
  { q: "What if I am not satisfied with a course?", a: "We offer a 30-day money-back guarantee with no questions asked. Simply contact our support team and we will process your refund within 2 business days." },
  { q: "How do the AI features work?", a: "Our AI analyzes your learning history, goals, and progress to generate personalized course recommendations, create AI-written course descriptions, and provide a real-time chat assistant for your learning questions." },
  { q: "Can I learn on mobile?", a: "Absolutely. SkillNest is fully responsive and we have dedicated iOS and Android apps so you can learn anywhere, with offline download support for videos." },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20">
      <div className="container-xl max-w-3xl">
        <div className="text-center mb-12">
          <span className="badge badge-secondary mb-3">FAQ</span>
          <h2 className="section-title">Frequently asked questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-[var(--text)] hover:text-[var(--primary)] transition-colors"
              >
                {faq.q}
                <span className={`ml-4 text-xl transition-transform ${open === i ? "rotate-45" : ""} text-[var(--primary)]`}>+</span>
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-[var(--text-muted)] text-sm leading-relaxed border-t border-[var(--border)] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 7. Newsletter ─────────────────────────────────────────
export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSent(true); setEmail(""); }
  };

  return (
    <section className="py-20 bg-[var(--primary)]">
      <div className="container-xl text-center">
        <MessageSquare className="w-12 h-12 text-white/60 mx-auto mb-4" />
        <h2 className="text-3xl font-extrabold text-white mb-3">Stay ahead of the curve</h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto">
          Get weekly curated resources, new course alerts, and career tips from our instructors.
        </p>
        {sent ? (
          <div className="flex items-center justify-center gap-2 text-white font-semibold text-lg">
            <CheckCircle className="w-6 h-6" /> You&apos;re on the list! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white"
            />
            <button type="submit" className="px-6 py-3 bg-white text-[var(--primary)] font-bold rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap">
              Subscribe Free
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── 8. CTA ────────────────────────────────────────────────
export function CTASection() {
  return (
    <section className="py-20">
      <div className="container-xl">
        <div className="rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[#8b5cf6] p-12 md:p-16 text-center">
          <Lightbulb className="w-14 h-14 text-white/60 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to level up your skills?
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto text-lg">
            Join 50,000+ learners building careers they love. Your first course is just one click away.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/explore" className="px-8 py-3 bg-white text-[var(--primary)] font-bold rounded-lg hover:bg-white/90 transition-colors">
              Start Learning Today
            </Link>
            <Link href="/sign-up" className="px-8 py-3 border-2 border-white/40 text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
