"use client";

import { useEffect, useState } from "react";
import { Target, Award, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function PrincipalDevelopmentPage() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/development")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setRecords(json.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <PageHeader
        title="Student Holistic Development"
        subtitle="Holistic growth metrics beyond academic marks across 8 developmental dimensions"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginBottom: "28px" }}>
        {[
          { area: "Problem Solving", benchmark: "Developing", desc: "Multi-step logic & scientific inquiry" },
          { area: "Technical Skills", benchmark: "Strength", desc: "Robotics & microcontrollers" },
          { area: "Communication", benchmark: "Developing", desc: "Classroom presentations & dialogue" },
          { area: "Teamwork", benchmark: "Strength", desc: "Collaborative STEM project delivery" },
        ].map((item) => (
          <div key={item.area} className="card" style={{ padding: "20px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{item.area}</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 12px" }}>{item.desc}</p>
            <span style={{ padding: "3px 10px", borderRadius: "9999px", background: "#f0fdf4", color: "#16a34a", fontSize: "12px", fontWeight: 600 }}>
              Class Benchmark: {item.benchmark}
            </span>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#0f172a" }}>Recent Teacher Development Observations</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Area</th>
                <th>Observation Note</th>
                <th>Development Level</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: "#0ea5e9" }}>{r.area}</span>
                  </td>
                  <td style={{ fontSize: "13px" }}>{r.observation}</td>
                  <td>
                    <span style={{ padding: "2px 8px", borderRadius: "6px", background: "#f0fdf4", color: "#16a34a", fontWeight: 600, fontSize: "12px" }}>
                      {r.level}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      {r.source === "ASSISTANT_APPROVED" ? "✨ AI Insight (Approved)" : "Teacher Verified"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
