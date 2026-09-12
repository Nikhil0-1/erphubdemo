"use client";

import { useEffect, useState } from "react";
import { Activity, Calendar, Award, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function ParentActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setActivities(res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <PageHeader
        title="Co-Curricular & Club Activities"
        subtitle="Holistic engagement, project participations, and life skill development"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
        {activities.map((act) => (
          <div key={act.id} className="card" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "12px",
                  background: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                {act.category}
              </span>
              <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={13} /> {act.date}
              </span>
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>{act.name}</h3>
            <p style={{ fontSize: "13px", color: "#475569", marginBottom: "14px", flex: 1, lineHeight: "1.5" }}>
              {act.objective || "Co-curricular skill building project."}
            </p>

            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", marginBottom: "6px" }}>
                Skills Built
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {(act.skills || []).map((sk: string, i: number) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: "#f1f5f9",
                      color: "#334155",
                      fontWeight: 500,
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {act.reflection && (
              <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "6px", fontSize: "12px", color: "#475569" }}>
                <strong>Teacher Evaluation:</strong> {act.reflection}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
