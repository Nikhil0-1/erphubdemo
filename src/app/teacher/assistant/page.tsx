"use client";

import { useState } from "react";
import { Sparkles, Send, Bot, CheckCircle2, ShieldCheck, Check } from "lucide-react";
import { PageHeader, Modal } from "@/components/dashboard/shared";

interface Message {
  role: "user" | "assistant";
  content: string;
  source?: string;
  proposedInsight?: any;
}

export default function TeacherAssistantPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approvedSuccess, setApprovedSuccess] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello Rahul Sir. I am your Smart Edu Teacher Assistant. I analyze only verified class data for Class 7-A (Mathematics). You can ask me how the class is performing, request student support recommendations, or generate developmental observations for your review and approval.",
      source: "Class 7-A Verified Gradebook & Telemetry",
    },
  ]);

  const quickPrompts = [
    "How is Class 7-A performing overall?",
    "Which students need academic support?",
    "How is attendance trending?",
    "Analyze Aarav Kumar's development progress",
  ];

  async function handleSend(text?: string) {
    const query = text || input;
    if (!query.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: query }]);
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
            proposedInsight: json.data.proposedInsight,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApproveInsight(insight: any) {
    setApproving(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve-insight",
          insightData: insight,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setApprovedSuccess(true);
        setTimeout(() => setApprovedSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(false);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <PageHeader
        title="Teacher AI Assistant"
        subtitle="Analytical teaching companion with human-in-the-loop development record approval"
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
          <ShieldCheck size={14} /> Teacher Oversight Required
        </span>
      </PageHeader>

      {approvedSuccess && (
        <div
          style={{
            padding: "14px 18px",
            background: "#f0fdf4",
            color: "#16a34a",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle2 size={18} />
          Insight officially approved and added to Student 360° Official Development Records!
        </div>
      )}

      <div
        className="card"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "620px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
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

              <div style={{ maxWidth: "80%" }}>
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
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                    ✓ Source: {m.source}
                  </div>
                )}

                {/* Human-in-the-loop Insight Approval Card */}
                {m.proposedInsight && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "14px 16px",
                      background: "#fdf4ff",
                      border: "1px solid #f0abfc",
                      borderRadius: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#86198f", fontSize: "13px", marginBottom: "4px" }}>
                      <Sparkles size={14} /> Proposed Developmental Record for Teacher Approval
                    </div>
                    <div style={{ fontSize: "13px", color: "#701a75", marginBottom: "8px" }}>
                      <strong>Area</strong>: {m.proposedInsight.area} · <strong>Level</strong>: {m.proposedInsight.level}
                      <br />
                      <strong>Observation</strong>: {m.proposedInsight.observation}
                    </div>
                    <button
                      onClick={() => handleApproveInsight(m.proposedInsight)}
                      disabled={approving}
                      className="btn btn-primary"
                      style={{
                        padding: "6px 14px",
                        fontSize: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#9333ea",
                      }}
                    >
                      <Check size={14} /> {approving ? "Approving..." : "Approve as Official Development Record"}
                    </button>
                  </div>
                )}
              </div>
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
                Querying verified Class 7-A data...
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

        {/* Input */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "12px" }}>
          <input
            type="text"
            placeholder="Ask about class performance, student struggles, or attendance..."
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
