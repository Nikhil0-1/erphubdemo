"use client";

import { useState, useEffect } from "react";
import { Award, CheckCircle2, Shield, Star, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function SkillPassportPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students/growth/skills")
      .then((r) => r.json())
      .then((d) => setSkills(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6" style={{ maxWidth: "860px", margin: "0 auto" }}>
      <PageHeader
        title="Student Skill Passport"
        subtitle="11 Core 21st-century cognitive, leadership, and technical competencies validated with teacher evidence"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {skills.map((sk) => (
          <div key={sk.id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(139, 92, 246, 0.12)",
                  color: "#8b5cf6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Award size={22} />
              </div>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                }}
              >
                {sk.level}
              </span>
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
              {sk.skillName}
            </h3>
            <div style={{ fontSize: "12px", color: "#8b5cf6", fontWeight: 600, marginBottom: "12px" }}>
              Badge: {sk.badge}
            </div>

            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px" }}>
              {sk.evidence}
            </p>

            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px", fontSize: "11px", color: "var(--text-tertiary)", display: "flex", justifyContent: "space-between" }}>
              <span>Verified by: <strong>{sk.verifiedByTeacherName}</strong></span>
              <span>{sk.dateAwarded}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
