"use client";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Send, Copy, Check, Bot, User, Loader2, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import type { GeneratedContent, ChatMessage } from "@/types";
import { toast } from "sonner";

/* ─── AI Content Generator ──────────────────────────────── */
function ContentGenerator() {
  const [form, setForm] = useState({ title: "", audience: "", level: "Beginner" as const });
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: typeof form) =>
      api.post("/api/ai/generate", data) as Promise<{ success: boolean; data: GeneratedContent }>,
    onSuccess: (res) => { setResult(res.data); },
    onError: () => toast.error("AI generation failed. Please try again."),
  });

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <div>
          <h2 className="font-bold text-[var(--text)]">AI Course Content Generator</h2>
          <p className="text-xs text-[var(--text-muted)]">Generate professional course descriptions, outcomes & tags instantly</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">Course Title *</label>
          <input
            className="input-base"
            placeholder="e.g. Complete React & Next.js Bootcamp"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">Target Audience *</label>
          <input
            className="input-base"
            placeholder="e.g. Junior developers with JavaScript basics"
            value={form.audience}
            onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}
          />
        </div>
      </div>
      <div className="mb-5">
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">Difficulty Level</label>
        <div className="flex gap-2">
          {(["Beginner", "Intermediate", "Advanced"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setForm((p) => ({ ...p, level: l }))}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                form.level === l
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => mutate(form)}
        disabled={!form.title || !form.audience || isPending}
        className="btn-primary w-full !justify-center !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Generate with AI</>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-5 animate-slide-up">
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[var(--text)]">Generated Description</h3>
              <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--primary)]">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-sm text-[var(--text-secondary)] leading-relaxed border border-[var(--border)]">
              {result.description}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--text)] mb-2">Learning Outcomes</h3>
            <ul className="space-y-2">
              {result.outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-[var(--secondary)] font-bold mt-0.5">✓</span> {o}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--text)] mb-2">Suggested Tags</h3>
            <div className="flex flex-wrap gap-2">
              {result.tags.map((t) => (
                <span key={t} className="badge badge-primary">{t}</span>
              ))}
            </div>
          </div>

          <button onClick={() => mutate(form)} className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--primary)]">
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── AI Chat Assistant ──────────────────────────────────── */
function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I am SkillNest AI. Ask me anything about courses, learning paths, or tech topics — I am here to help! 🎓" },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setStreaming(true);

    // Add empty assistant message to stream into
    setMessages((p) => [...p, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Clerk token would be added via interceptor in real flow
        },
        body: JSON.stringify({
          messages: [...messages.filter((m) => m.role !== "assistant" || m.content), userMsg].slice(-10),
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const payload = line.slice(6);
            if (payload === "[DONE]") break;
            try {
              const { delta, done: isDone } = JSON.parse(payload);
              if (isDone) break;
              if (delta) {
                setMessages((p) => {
                  const updated = [...p];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: updated[updated.length - 1].content + delta,
                  };
                  return updated;
                });
              }
            } catch {/* skip malformed */ }
          }
        }
      }
    } catch {
      setMessages((p) => {
        const updated = [...p];
        updated[updated.length - 1] = { role: "assistant", content: "Sorry, I encountered an error. Please try again." };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="card flex flex-col h-[520px]">
      <div className="flex items-center gap-3 p-5 border-b border-[var(--border)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--secondary-light)] flex items-center justify-center">
          <Bot className="w-5 h-5 text-[var(--secondary)]" />
        </div>
        <div>
          <h2 className="font-bold text-[var(--text)]">SkillNest AI Chat</h2>
          <p className="text-xs text-[var(--text-muted)]">Your personal learning assistant</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--secondary)]" />
          <span className="text-xs text-[var(--secondary)]">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              m.role === "assistant" ? "bg-[var(--secondary-light)]" : "bg-[var(--primary)]"
            }`}>
              {m.role === "assistant"
                ? <Bot className="w-4 h-4 text-[var(--secondary)]" />
                : <User className="w-4 h-4 text-white" />
              }
            </div>
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              m.role === "assistant"
                ? "bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-tl-sm"
                : "bg-[var(--primary)] text-white rounded-tr-sm"
            }`}>
              {m.content || (streaming && i === messages.length - 1 ? (
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              ) : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex gap-2">
          <input
            className="input-base flex-1"
            placeholder="Ask about courses, skills, or learning paths…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            disabled={streaming}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            className="w-10 h-10 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center hover:bg-[var(--primary-hover)] disabled:opacity-40 transition-colors flex-shrink-0"
          >
            {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-[var(--text-subtle)] mt-2 text-center">
          AI may make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function AIToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)] flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[var(--primary)]" /> AI Tools
        </h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Powered by GPT-4o-mini — generate course content and chat with your AI learning assistant.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <ContentGenerator />
        <ChatAssistant />
      </div>
    </div>
  );
}
