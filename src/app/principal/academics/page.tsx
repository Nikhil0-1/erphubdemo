"use client";

import { useEffect, useState } from "react";
import { BookOpen, BarChart3, Award } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function PrincipalAcademicsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/academics")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setAssessments(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Academic Performance & Assessments"
        subtitle="School-wide examination outcomes, unit tests, and grade distributions"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginBottom: "28px" }}>
        {assessments.map((a) => (
          <div key={a.id} className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{a.name}</h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{a.subjectName} · {a.className}</span>
              </div>
              <span style={{ padding: "2px 8px", borderRadius: "6px", background: "#eff6ff", color: "#0ea5e9", fontSize: "11px", fontWeight: 700 }}>
                {a.type}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", background: "#f8fafc", padding: "12px", borderRadius: "8px" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Max Marks</div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>{a.maxMarks}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Evaluated</div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>{a.results?.length || 1} Students</div>
              </div>
            </div>

            <div style={{ marginTop: "12px", fontSize: "12px", color: "#64748b" }}>
              Instructor: <strong>{a.teacherName}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
