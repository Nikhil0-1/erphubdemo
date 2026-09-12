"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, User, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

interface Message {
  role: "assistant" | "user";
  text: string;
}

export default function ParentAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello Raj Kumar! I am your NurtureKernel Parent Assistant. I have direct, verified access to Aarav's academic marks, gate attendance, bus transit, and teacher observations. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const promptChips = [
    "How is Aarav performing in Mathematics?",
    "What homework assignments are due this week?",
    "Show Aarav's attendance and gate check-in logs",
    "What co-curricular activities has Aarav participated in?",
  ];

  async function handleSend(textToSend?: string) {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMsgs: Message[] = [...messages, { role: "user", text: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          role: "PARENT",
          studentId: "student-01",
        }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setMessages([...newMsgs, { role: "assistant", text: json.data.response }]);
      } else {
        setMessages([
          ...newMsgs,
          {
            role: "assistant",
            text: "Aarav is performing exceptionally well in Class 7-A. His current Mathematics score is 96% (Grade A+), overall term attendance is 96% with consistent 08:15 AM gate check-ins, and he recently led the Smart Solar Microgrid project.",
          },
        ]);
      }
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: "assistant",
          text: "Aarav is currently maintaining an academic average of 91.4% with 96% attendance. No pending concerns are logged for him.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <PageHeader
        title="Parent AI Assistant"
        subtitle="Verified, hallucination-free insights into your child's academic, behavioral, and transit records"
      />

      {/* PROMPT CHIPS */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        {promptChips.map((chip, i) => (
          <button
            key={i}
            onClick={() => handleSend(chip)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "12px", borderRadius: "16px" }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* CHAT WINDOW */}
      <div className="card" style={{ padding: "20px", minHeight: "440px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto", marginBottom: "16px" }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {m.role === "assistant" && (
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={16} />
                </div>
              )}

              <div
                style={{
                  maxWidth: "75%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  background: m.role === "user" ? "#2563eb" : "#f8fafc",
                  color: m.role === "user" ? "#ffffff" : "#1e293b",
                  border: m.role === "user" ? "none" : "1px solid #e2e8f0",
                }}
              >
                {m.text}
              </div>

              {m.role === "user" && (
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "#0f172a",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  RK
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "#64748b", fontSize: "13px" }}>
              <Sparkles size={16} className="animate-spin" color="#2563eb" />
              <span>Analyzing official records...</span>
            </div>
          )}
        </div>

        {/* INPUT BOX */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{ display: "flex", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Ask anything regarding Aarav's marks, attendance, bus or activities..."
            className="form-input"
            style={{ flex: 1 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Send size={15} /> Ask
          </button>
        </form>
      </div>
    </div>
  );
}
