"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, BookOpen, Lightbulb, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

interface Message {
  role: "assistant" | "user";
  text: string;
}

export default function StudentAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hey Aarav! 👋 I'm your Smart Edu Study Companion. Need help understanding a tricky concept, preparing for a test, or practicing math problems? Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chips = [
    "Explain quadratic factoring simply",
    "Give me 3 practice problems on linear equations",
    "Summarize Newton's Three Laws with examples",
    "How can I improve my essay thesis statement?",
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
          role: "STUDENT",
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
            text: "Quadratic factoring means breaking an expression like x² + 5x + 6 into two simpler binomials: (x + 2)(x + 3). The rule: find two numbers that multiply to the constant (6) and add up to the middle coefficient (5). 2 × 3 = 6, and 2 + 3 = 5!",
          },
        ]);
      }
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: "assistant",
          text: "Here is a quick concept breakdown: Keep practicing consistent problem solving! Review your teacher's class notes on factoring techniques.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <PageHeader
        title="AI Study Tutor & Homework Coach"
        subtitle="Interactive concept explanations, practice problem generation, and test preparation"
      />

      {/* CHIPS */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        {chips.map((chip, i) => (
          <button
            key={i}
            onClick={() => handleSend(chip)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: "12px", borderRadius: "16px" }}
          >
            <Lightbulb size={13} color="#f59e0b" /> {chip}
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
                  AK
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "#64748b", fontSize: "13px" }}>
              <Sparkles size={16} className="animate-spin" color="#2563eb" />
              <span>Generating tailored explanation...</span>
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
            placeholder="Type your question or homework topic here..."
            className="form-input"
            style={{ flex: 1 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Send size={15} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
