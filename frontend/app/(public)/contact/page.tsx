"use client";
import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ paddingTop: "64px" }}>
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="container-xl text-center">
          <span className="badge badge-primary mb-4">Get in Touch</span>
          <h1 className="section-title mb-3">Contact Us</h1>
          <p className="section-subtitle mx-auto text-center">
            Have a question or feedback? We would love to hear from you. Our team responds within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-xl">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Info cards */}
            <div className="space-y-5">
              {[
                { icon: Mail, title: "Email Us", value: "hello@skillnest.com", sub: "We reply within 24 hours" },
                { icon: Phone, title: "Call Us", value: "+1 (555) 234-5678", sub: "Mon–Fri, 9am–6pm PST" },
                { icon: MapPin, title: "Visit Us", value: "123 Tech Street", sub: "San Francisco, CA 94102" },
              ].map(({ icon: Icon, title, value, sub }) => (
                <div key={title} className="card p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] text-sm">{title}</h3>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">{value}</p>
                    <p className="text-[var(--text-subtle)] text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2 card p-8">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-[var(--secondary)] mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-[var(--text)] mb-2">Message sent!</h2>
                  <p className="text-[var(--text-muted)]">Thanks for reaching out. We will get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-primary mt-6">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-bold text-[var(--text)] text-xl mb-6">Send us a message</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">Full Name *</label>
                      <input required className="input-base" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">Email *</label>
                      <input required type="email" className="input-base" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">Subject *</label>
                    <input required className="input-base" placeholder="How can we help?" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">Message *</label>
                    <textarea required rows={5} className="input-base resize-none" placeholder="Tell us more about your question or feedback..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-primary w-full !justify-center !py-3">
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
