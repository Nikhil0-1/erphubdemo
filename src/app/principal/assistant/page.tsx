"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, User, CheckCircle, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

interface Message {
  role: "user" | "assistant";
  content: string;
  source?: string;
}

export default function PrincipalAssistantPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello Dr. Anjali Sharma. I am your NurtureKernel Administrative Assistant. I provide insights strictly grounded in verified institutional data across academics, attendance, bus transit, and faculty allocations. How can I assist you today?",
      source: "Verified School Records & Telemetry",
    },
  ]);

  const quickPrompts = [
    "How is Class 7-A performing overall?",
    "How is school-wide attendance trending?",
    "Which areas need academic support?",
    "What is the status of our smart bus routes?",
  ];

  async function handleSend(text?: string) {
    const query = text || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: json.data.reply,
            source: json.data.verifiedDataSource,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <PageHeader
        title="NurtureKernel Assistant"
        subtitle="Executive administrative intelligence grounded exclusively in verified institutional data"
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            background: "#f0fdf4",
            color: "#16a34a",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontWeight: 600,
          }}
        >
          <ShieldCheck size={14} /> AI Safety Active (Zero Hallucinations)
        </span>
      </PageHeader>

      <div
        className="card"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "600px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Messages Stream */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
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
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Bot size={18} />
                </div>
              )}

              <div style={{ maxWidth: "75%" }}>
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: m.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    background: m.role === "user" ? "#0ea5e9" : "#f8fafc",
                    color: m.role === "user" ? "white" : "#1e293b",
                    border: m.role === "user" ? "none" : "1px solid #e2e8f0",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {m.content}
                </div>
                {m.source && (
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle size={12} color="#16a34a" /> Source: {m.source}
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#0f172a",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#8b5cf6",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={18} />
              </div>
              <div style={{ fontSize: "13px", color: "#64748b", fontStyle: "italic" }}>
                Analyzing verified school telemetry...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Queries */}
        <div style={{ padding: "10px 20px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", gap: "8px", overflowX: "auto" }}>
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              style={{
                fontSize: "12px",
                padding: "6px 12px",
                background: "white",
                border: "1px solid #cbd5e1",
                borderRadius: "9999px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                color: "#334155",
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "12px" }}>
          <input
            type="text"
            placeholder="Ask anything about school attendance, academics, bus tracking..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={() => handleSend()}
            className="btn btn-primary"
            disabled={loading || !input.trim()}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "12px 20px" }}
          >
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
