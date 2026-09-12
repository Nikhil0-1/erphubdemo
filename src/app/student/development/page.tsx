"use client";

import { useEffect, useState } from "react";
import { Target, ShieldCheck, Calendar, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

const LEVELS: Record<string, { color: string; bg: string }> = {
  Emerging: { color: "#f59e0b", bg: "#fef3c7" },
  Developing: { color: "#0ea5e9", bg: "#e0f2fe" },
  Proficient: { color: "#10b981", bg: "#d1fae5" },
  Exemplary: { color: "#8b5cf6", bg: "#ede9fe" },
};

export default function StudentDevelopmentPage() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/development")
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setRecords(res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <PageHeader
        title="Holistic Growth & Milestones"
        subtitle="Tracking your progress across 8 developmental dimensions with constructive mentor coaching"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {records.map((r) => {
          const levelInfo = LEVELS[r.level] || LEVELS["Developing"];
          return (
            <div key={r.id} className="card" style={{ padding: "22px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#2563eb",
                    background: "#eff6ff",
                    padding: "4px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {r.area}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: levelInfo.bg,
                    color: levelInfo.color,
                  }}
                >
                  {r.level}
                </span>
              </div>

              <div style={{ marginBottom: "14px", flex: 1 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", marginBottom: "4px" }}>
                  Mentor Observation
                </div>
                <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.5" }}>{r.observation}</p>
              </div>

              {r.feedback && (
                <div style={{ marginBottom: "14px", background: "#f8fafc", padding: "10px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "2px" }}>
                    Actionable Advice for Growth
                  </div>
                  <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.4" }}>{r.feedback}</p>
                </div>
              )}

              <div
                style={{
                  borderTop: "1px solid #f1f5f9",
                  paddingTop: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={12} /> {r.date}
                </span>
                <span
                  style={{
                    color: "#059669",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ShieldCheck size={14} /> Certified by {r.teacherName || "Teacher"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
