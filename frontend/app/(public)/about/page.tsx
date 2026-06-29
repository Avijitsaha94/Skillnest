import Image from "next/image";
import Link from "next/link";
import { Users, BookOpen, Globe, Award, Target, Lightbulb, Heart } from "lucide-react";

const TEAM = [
  { name: "Sarah Mitchell", role: "CEO & Co-Founder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah", bio: "Former Google engineer with 12 years in EdTech." },
  { name: "Daniel Chen", role: "CTO & Co-Founder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=daniel", bio: "Full-stack architect. Built platforms serving 10M+ users." },
  { name: "Maya Rodriguez", role: "Head of AI", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya", bio: "ML researcher from MIT. Specializes in personalized learning." },
  { name: "James Park", role: "Head of Content", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james", bio: "Curriculum designer. Previously at Coursera and Udemy." },
];

const VALUES = [
  { icon: Target, title: "Outcome-Focused", desc: "We measure success by whether students get hired, promoted, or launch something new — not by course completions." },
  { icon: Lightbulb, title: "Continuously Learning", desc: "Our courses are updated every quarter. The web in 2025 is not the web of 2022, and our content reflects that." },
  { icon: Heart, title: "Learner-First", desc: "Every product decision starts with one question: does this help the learner grow faster?" },
  { icon: Globe, title: "Globally Accessible", desc: "We offer scholarships to learners in emerging markets. Great education should not depend on your zip code." },
];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "64px" }}>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[var(--primary-light)] to-[var(--secondary-light)]">
        <div className="container-xl text-center">
          <span className="badge badge-primary mb-4">Our Story</span>
          <h1 className="section-title mb-4">Building the future of learning</h1>
          <p className="section-subtitle mx-auto text-center text-lg">
            SkillNest was founded in 2022 by engineers who were tired of outdated tutorials and courses that taught the wrong things. We built the platform we wished existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-secondary mb-4">Our Mission</span>
              <h2 className="section-title mb-5">Make world-class skills accessible to everyone</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                We believe the gap between where you are and where you want to be is primarily a knowledge gap — and that gap is closeable. SkillNest exists to close it faster, more efficiently, and more enjoyably than anything else available.
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed mb-6">
                Our AI-powered platform adapts to how you learn, recommends what you should learn next, and gives you the tools to build real things. Not just watch videos. Build things.
              </p>
              <Link href="/explore" className="btn-primary">Start Learning Today</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "50,000+", label: "Active learners", icon: Users },
                { value: "500+", label: "Expert courses", icon: BookOpen },
                { value: "200+", label: "Countries", icon: Globe },
                { value: "95%", label: "Satisfaction rate", icon: Award },
              ].map(({ value, label, icon: Icon }) => (
                <div key={label} className="card p-5 text-center">
                  <Icon className="w-8 h-8 text-[var(--primary)] mx-auto mb-2" />
                  <div className="text-2xl font-extrabold gradient-text">{value}</div>
                  <div className="text-sm text-[var(--text-muted)]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container-xl">
          <div className="text-center mb-12">
            <span className="badge badge-accent mb-3">Our Values</span>
            <h2 className="section-title">What we stand for</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center group">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--primary)] transition-colors">
                  <Icon className="w-6 h-6 text-[var(--primary)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-[var(--text)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container-xl">
          <div className="text-center mb-12">
            <span className="badge badge-primary mb-3">The Team</span>
            <h2 className="section-title">Built by people who love learning</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="card p-6 text-center group">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4 border-4 border-[var(--primary-light)] group-hover:border-[var(--primary)] transition-colors"
                />
                <h3 className="font-bold text-[var(--text)]">{member.name}</h3>
                <p className="text-xs text-[var(--primary)] font-semibold mb-2">{member.role}</p>
                <p className="text-xs text-[var(--text-muted)]">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--primary)]">
        <div className="container-xl text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to join 50,000+ learners?</h2>
          <p className="text-white/70 mb-8">Start your journey today — no credit card required.</p>
          <Link href="/sign-up" className="px-8 py-3 bg-white text-[var(--primary)] font-bold rounded-lg hover:bg-white/90 transition-colors">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
