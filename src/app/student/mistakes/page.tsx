"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  History,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Filter,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function MistakeBookPage() {
  const router = useRouter();
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadMistakes();
  }, []);

  function loadMistakes() {
    fetch("/api/students/growth/mistakes")
      .then((r) => r.json())
      .then((d) => setMistakes(d.data || []))
      .finally(() => setLoading(false));
  }

  async function handleToggleResolved(id: string, currentStatus: boolean) {
    try {
      await fetch(`/api/students/growth/mistakes?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved: !currentStatus, reviewed: true }),
      });
      loadMistakes();
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = mistakes.filter((m) => {
    if (filter === "RESOLVED") return m.resolved;
    if (filter === "UNRESOLVED") return !m.resolved;
    return true;
  });

  return (
    <div className="space-y-6" style={{ maxWidth: "860px", margin: "0 auto" }}>
      <PageHeader
        title="Student Mistake Book"
        subtitle="Review, analyze, and master errors logged across assessments and practice drills"
      >
        <button
          className="btn btn-primary"
          onClick={() => router.push("/student/practice")}
        >
          <RotateCcw size={16} />
          Practice Zone
        </button>
      </PageHeader>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px" }}>
        {["ALL", "UNRESOLVED", "RESOLVED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
          >
            {f === "ALL" ? "All Errors" : f === "UNRESOLVED" ? "Needs Review" : "Mastered"}
          </button>
        ))}
      </div>

      {/* Mistakes list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: "48px", textAlign: "center", color: "var(--text-tertiary)" }}>
            <CheckCircle2 size={40} color="#10b981" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
              Great Job! No Pending Mistakes
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Keep up the high accuracy in your practice sessions.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: "24px",
                borderLeft: item.resolved ? "4px solid #10b981" : "4px solid #ef4444",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: "rgba(59, 130, 246, 0.1)",
                      color: "#3b82f6",
                      fontWeight: 600,
                      marginRight: "8px",
                    }}
                  >
                    {item.subjectName}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>
                    {item.topicName}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => router.push("/student/practice")}
                    style={{ fontSize: "12px", padding: "4px 10px" }}
                  >
                    <RotateCcw size={14} /> Try Again
                  </button>
                  <button
                    className={`btn btn-sm ${item.resolved ? "btn-secondary" : "btn-primary"}`}
                    onClick={() => handleToggleResolved(item.id, item.resolved)}
                    style={{ fontSize: "12px", padding: "4px 10px" }}
                  >
                    {item.resolved ? "Mark Unresolved" : "Mark Mastered"}
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.4 }}>
                {item.questionText}
              </h3>

              {/* Answers comparison */}
              <div
                className="responsive-two-col"
                style={{
                  background: "var(--surface-bg)",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "16px",
                  fontSize: "13px",
                  gap: "12px",
                }}
              >
                <div>
                  <span style={{ color: "#ef4444", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    <XCircle size={14} /> Your Previous Answer:
                  </span>
                  <div style={{ marginTop: "2px", fontWeight: 500 }}>{item.studentAnswer}</div>
                </div>
                <div>
                  <span style={{ color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={14} /> Correct Answer:
                  </span>
                  <div style={{ marginTop: "2px", fontWeight: 500 }}>{item.correctAnswer}</div>
                </div>
              </div>

              {/* Step-by-step reasoning */}
              <div
                style={{
                  background: "rgba(59, 130, 246, 0.06)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                }}
              >
                <div style={{ fontWeight: 600, color: "#3b82f6", marginBottom: "4px" }}>
                  Step-by-Step Resolution:
                </div>
                <div>{item.explanation}</div>
                {item.notes && (
                  <div style={{ marginTop: "6px", fontSize: "12px", color: "var(--text-tertiary)" }}>
                    <strong>Key takeaway:</strong> {item.notes}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
