"use client";

import { Award, Trophy, Medal, Star, ShieldCheck, Calendar } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function StudentAchievementsPage() {
  const achievements = [
    {
      id: "ach-1",
      title: "Inter-School Science Fair Champion",
      category: "Innovation & Robotics",
      award: "1st Place Gold Trophy",
      date: "August 2026",
      desc: "Awarded top honor for developing the Smart Solar Microgrid with real-time ESP32 telemetry.",
      icon: Trophy,
      color: "#d97706",
      bg: "#fef3c7",
    },
    {
      id: "ach-2",
      title: "National Vedic Mathematics Olympiad",
      category: "Academics",
      award: "National Top 1% Gold Medalist",
      date: "November 2025",
      desc: "Demonstrated superlative computational speed in high-order mental mathematics.",
      icon: Medal,
      color: "#8b5cf6",
      bg: "#ede9fe",
    },
    {
      id: "ach-3",
      title: "Perfect Punctuality Citation",
      category: "Campus Discipline",
      award: "Semester Honor Badge",
      date: "May 2026",
      desc: "Zero unexcused tardiness records logged through the smart RFID gate scanners.",
      icon: Star,
      color: "#16a34a",
      bg: "#dcfce7",
    },
    {
      id: "ach-4",
      title: "State Football Championship Runner-Up",
      category: "Athletics",
      award: "Silver Medal",
      date: "February 2026",
      desc: "Represented Green Valley High School as starting central midfielder in the under-14 division.",
      icon: Award,
      color: "#0284c7",
      bg: "#e0f2fe",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Awards & Verified Achievements"
        subtitle="School honors, competition trophies, medals, and certified badges earned"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
        {achievements.map((ach) => {
          const Icon = ach.icon;
          return (
            <div key={ach.id} className="card" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "12px",
                    background: ach.bg,
                    color: ach.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={26} />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: ach.color,
                    }}
                  >
                    {ach.award}
                  </span>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                    {ach.title}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", flex: 1, marginBottom: "16px" }}>
                {ach.desc}
              </p>

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
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={13} /> {ach.date}
                </span>
                <span style={{ color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShieldCheck size={14} /> School Verified
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
