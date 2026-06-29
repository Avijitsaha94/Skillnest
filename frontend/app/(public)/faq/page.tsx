"use client";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  { cat: "Getting Started", q: "How do I create an account?", a: "Click 'Get Started' in the top navigation. You can sign up with your email or continue with Google or Facebook. The process takes less than 2 minutes." },
  { cat: "Getting Started", q: "Is SkillNest free to use?", a: "You can browse all courses for free. Individual courses are paid (one-time purchase). We also offer a monthly subscription for unlimited access to all courses." },
  { cat: "Courses", q: "Do I get lifetime access to purchased courses?", a: "Yes — once you purchase a course, you have lifetime access including all future updates. There are no recurring fees for purchased courses." },
  { cat: "Courses", q: "Can I download course videos?", a: "Yes, on mobile (iOS and Android apps) you can download individual videos for offline viewing. Desktop browsers support streaming only." },
  { cat: "Courses", q: "How long does it take to complete a course?", a: "Each course lists its total duration. Most learners complete courses in 2–6 weeks spending about 5–8 hours per week, but you go at your own pace." },
  { cat: "AI Features", q: "What can the AI chat assistant help with?", a: "The AI assistant can answer questions about course content, help you plan a learning path, explain technical concepts, suggest resources, and give feedback on your project ideas." },
  { cat: "AI Features", q: "How does AI course recommendation work?", a: "Based on what you have enrolled in and completed, our AI analyzes your learning history and suggests courses that build on your existing skills and align with your goals." },
  { cat: "Certificates", q: "Are SkillNest certificates recognized?", a: "Our certificates are recognized by 500+ companies. They include a unique verification URL so employers can confirm authenticity. Many of our graduates have used them to land jobs at Google, Stripe, and Shopify." },
  { cat: "Payments", q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, PayPal, and Apple Pay. All transactions are secured with 256-bit SSL encryption." },
  { cat: "Payments", q: "What is your refund policy?", a: "We offer a full 30-day money-back guarantee on all courses, no questions asked. Contact support@skillnest.com to initiate a refund." },
];

const categories = [...new Set(FAQS.map(f => f.cat))];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activecat, setActiveCat] = useState("All");

  const filtered = activecat === "All" ? FAQS : FAQS.filter(f => f.cat === activecat);

  return (
    <div style={{ paddingTop: "64px" }}>
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="container-xl text-center">
          <span className="badge badge-secondary mb-4">FAQ</span>
          <h1 className="section-title mb-3">Frequently Asked Questions</h1>
          <p className="section-subtitle mx-auto text-center">
            Everything you need to know about SkillNest. Can&apos;t find the answer? <Link href="/contact" className="text-[var(--primary)] hover:underline">Contact us</Link>.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-xl max-w-3xl">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {["All", ...categories].map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCat(cat); setOpenIndex(null); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activecat === cat
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div>
                    <span className="text-xs text-[var(--primary)] font-semibold uppercase block mb-0.5">{faq.cat}</span>
                    <span className="font-semibold text-[var(--text)]">{faq.q}</span>
                  </div>
                  <span className={`text-2xl text-[var(--primary)] ml-4 flex-shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-4 animate-slide-up">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12 card p-8">
            <h3 className="font-bold text-[var(--text)] text-lg mb-2">Still have questions?</h3>
            <p className="text-[var(--text-muted)] mb-5">Our support team is here to help you Monday through Friday.</p>
            <Link href="/contact" className="btn-primary !px-8">Contact Support</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
