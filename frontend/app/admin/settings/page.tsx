"use client";
import { Settings, Bell, Shield, Globe, Palette } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]">Settings</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Platform configuration and preferences.</p>
      </div>
      {[
        { icon: Bell, title: "Notifications", desc: "Configure email and push notification preferences." },
        { icon: Shield, title: "Security", desc: "Manage authentication and access control settings." },
        { icon: Globe, title: "Localization", desc: "Language, timezone, and regional settings." },
        { icon: Palette, title: "Appearance", desc: "Branding colors, logo, and platform look & feel." },
      ].map(({ icon: Icon, title, desc }) => (
        <div key={title} className="card p-6 flex items-start gap-4 hover:border-[var(--primary)] transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text)]">{title}</h3>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
