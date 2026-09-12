"use client";

import { FileText, Download, Printer, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function PrincipalReportsPage() {
  const reports = [
    { title: "Monthly Attendance Summary Report", type: "PDF / CSV", size: "124 KB", period: "September 2026" },
    { title: "CBSE Academic Progress & Unit Test 1 Roster", type: "PDF / Excel", size: "280 KB", period: "Term 1 (2026-27)" },
    { title: "Student Holistic Development Matrix (Class 7-A)", type: "PDF", size: "340 KB", period: "Term 1 (2026-27)" },
    { title: "Fleet GPS Transit & Route Compliance Log", type: "CSV", size: "86 KB", period: "Last 30 Days" },
    { title: "IoT Hardware Telemetry & Gate Scan Audit", type: "JSON / CSV", size: "110 KB", period: "Last 7 Days" },
  ];

  return (
    <div>
      <PageHeader
        title="Institutional Reports"
        subtitle="Generate and export verified executive reports for school management and inspection"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {reports.map((r) => (
          <div key={r.title} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "#eff6ff",
                  color: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{r.title}</h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{r.period}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>{r.type} · {r.size}</span>
              <button
                onClick={() => alert(`Report downloaded: ${r.title}`)}
                className="btn btn-secondary"
                style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", fontSize: "12px" }}
              >
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
