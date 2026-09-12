"use client";

import { useEffect, useState } from "react";
import { BookOpen, Award, TrendingUp, CheckCircle, FileText, Download } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function ParentAcademicsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAcademics();
  }, []);

  async function loadAcademics() {
    try {
      const res = await fetch("/api/academics");
      const json = await res.json();
      if (json.data) {
        setAssessments(json.data.assessments || []);
        setMarks(json.data.marks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Academics & Examination Results"
        subtitle="Continuous term evaluations, subject mark sheets, and teacher academic remarks"
      >
        <button
          onClick={() => alert("Report Card PDF generated successfully.")}
          className="btn btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Download size={16} /> Download Term Report Card
        </button>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Cumulative Score
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#2563eb", marginTop: "4px" }}>
            91.4%
          </div>
          <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
            <TrendingUp size={14} /> +3.2% from previous term
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Class Rank
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#16a34a", marginTop: "4px" }}>
            #3 of 38
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Top 10th percentile</div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Highest Subject
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#8b5cf6", marginTop: "4px" }}>
            Mathematics
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>48 / 50 (96%)</div>
        </div>
      </div>

      {/* DETAILED MARKS TABLE */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
          Recent Unit Tests & Assessments
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left", color: "#64748b" }}>
                <th style={{ padding: "12px 8px" }}>Assessment Title</th>
                <th style={{ padding: "12px 8px" }}>Subject</th>
                <th style={{ padding: "12px 8px" }}>Score</th>
                <th style={{ padding: "12px 8px" }}>Percentage</th>
                <th style={{ padding: "12px 8px" }}>Grade</th>
                <th style={{ padding: "12px 8px" }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m) => {
                const pct = Math.round((m.score / (m.maxScore || 100)) * 100);
                const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : "C";
                return (
                  <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "14px 8px", fontWeight: 600, color: "#0f172a" }}>
                      {m.assessmentTitle || "Unit Test Evaluation"}
                    </td>
                    <td style={{ padding: "14px 8px", color: "#475569" }}>{m.subjectName || "Mathematics"}</td>
                    <td style={{ padding: "14px 8px", fontWeight: 700, color: "#0f172a" }}>
                      {m.score} / {m.maxScore || 100}
                    </td>
                    <td style={{ padding: "14px 8px", fontWeight: 700, color: "#2563eb" }}>{pct}%</td>
                    <td style={{ padding: "14px 8px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "10px",
                          background: grade.startsWith("A") ? "#dcfce7" : "#eff6ff",
                          color: grade.startsWith("A") ? "#15803d" : "#2563eb",
                        }}
                      >
                        {grade}
                      </span>
                    </td>
                    <td style={{ padding: "14px 8px", color: "#64748b", fontSize: "13px" }}>
                      {m.remarks || "Exemplary analytical reasoning."}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
