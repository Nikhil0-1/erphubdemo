"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Award, Sparkles, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function ParentPortfolioPage() {
  const [activeGrade, setActiveGrade] = useState("Class 7");

  const artifacts = [
    {
      id: "art-1",
      title: "Smart Solar Microgrid with IoT Telemetry",
      grade: "Class 7",
      category: "STEM & Robotics",
      date: "August 2026",
      desc: "Designed and programmed an automated solar tracker with dual-axis servo motors and ESP32 telemetry broadcast.",
      awards: ["1st Place - Inter-School Science Fair", "Best Innovation Trophy"],
      verifiedBy: "Rahul Sharma (STEM Lead)",
    },
    {
      id: "art-2",
      title: "Clean Water Access: A Comparative Policy Analysis",
      grade: "Class 7",
      category: "Social Studies & Ethics",
      date: "July 2026",
      desc: "Comprehensive research paper on municipal rainwater harvesting regulations in suburban school districts.",
      awards: ["Excellence in Research Citation"],
      verifiedBy: "Pooja Verma (Humanities)",
    },
    {
      id: "art-3",
      title: "State Level Under-14 Football Championship",
      grade: "Class 6",
      category: "Sports & Athletics",
      date: "February 2026",
      desc: "Midfielder representing Green Valley School in the state finals tournament.",
      awards: ["Runners-up Silver Medal"],
      verifiedBy: "Coach Vikram Singh",
    },
    {
      id: "art-4",
      title: "National Vedic Mathematics Olympiad",
      grade: "Class 5",
      category: "Mathematics",
      date: "November 2025",
      desc: "Ranked in top 1% nationwide for mental arithmetic and geometric problem-solving.",
      awards: ["Gold Medal of Excellence (National Top 1%)"],
      verifiedBy: "Academic Council",
    },
  ];

  const filtered = artifacts.filter((a) => (activeGrade === "All" ? true : a.grade === activeGrade));

  return (
    <div>
      <PageHeader
        title="Student Digital Portfolio"
        subtitle="Cumulative academic, creative, and extracurricular artifact archive from Class 1 through Class 12"
      />

      {/* Grade Selector Tabs */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "20px" }}>
        {["All", "Class 7", "Class 6", "Class 5", "Class 4"].map((gr) => (
          <button
            key={gr}
            onClick={() => setActiveGrade(gr)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid",
              borderColor: activeGrade === gr ? "#2563eb" : "#e2e8f0",
              background: activeGrade === gr ? "#2563eb" : "#ffffff",
              color: activeGrade === gr ? "#ffffff" : "#64748b",
              whiteSpace: "nowrap",
            }}
          >
            {gr}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {filtered.map((art) => (
          <div key={art.id} className="card" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "12px",
                  background: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                {art.category}
              </span>
              <span style={{ fontSize: "12px", color: "#64748b" }}>{art.date}</span>
            </div>

            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>{art.title}</h3>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", flex: 1, marginBottom: "14px" }}>
              {art.desc}
            </p>

            {art.awards && art.awards.length > 0 && (
              <div style={{ marginBottom: "14px", background: "#fef3c7", padding: "10px", borderRadius: "8px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#b45309", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Award size={13} /> Honors & Accolades
                </div>
                {art.awards.map((aw, i) => (
                  <div key={i} style={{ fontSize: "12px", fontWeight: 600, color: "#92400e" }}>
                    • {aw}
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                borderTop: "1px solid #f1f5f9",
                paddingTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              <span>Grade: <strong>{art.grade}</strong></span>
              <span style={{ color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={14} /> Verified: {art.verifiedBy}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
