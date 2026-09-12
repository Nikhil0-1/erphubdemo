"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Target,
  AlertTriangle,
  Navigation,
  Award,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartHandshake,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function TeacherGrowthPage() {
  const router = useRouter();
  const [weakTopics, setWeakTopics] = useState<any[]>([]);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/students/growth/weak-topics").then((r) => r.json()),
      fetch("/api/students/growth/learning-paths").then((r) => r.json()),
      fetch("/api/students/growth/skills").then((r) => r.json()),
    ])
      .then(([wtD, lpD, skD]) => {
        setWeakTopics(wtD.data || []);
        setLearningPaths(lpD.data || []);
        setSkills(skD.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Growth & Remediation Center"
        subtitle="Empower Class 7-A students with personalized learning pathways, diagnostic interventions, and skill milestones"
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => router.push("/teacher/interventions")}
          >
            <HeartHandshake size={16} />
            Interventions Log
          </button>
        </div>
      </PageHeader>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Left Column: Weak Topics Diagnosed */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              Diagnosed Weak Topics (Class 7-A)
            </h3>
            <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
              {weakTopics.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {weakTopics.map((wt) => (
              <div
                key={wt.id}
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface-bg)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
                    {wt.topicName}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontWeight: 700,
                      background: wt.severity === "HIGH" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                      color: wt.severity === "HIGH" ? "#ef4444" : "#f59e0b",
                    }}
                  >
                    {wt.severity}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Student: <strong>Aarav Kumar</strong> · Accuracy: {wt.accuracyRate}%
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                  Remediation: {wt.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Learning Paths & Teacher Control */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              Personal Learning Pathways
            </h3>
            <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
              Teacher Curated
            </span>
          </div>

          <div className="space-y-4">
            {learningPaths.map((lp) => (
              <div
                key={lp.id}
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface-bg)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 600, margin: 0 }}>{lp.title}</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                      Target: Aarav Kumar ({lp.subjectName})
                    </p>
                  </div>
                  <span style={{ fontWeight: 700, color: "#10b981", fontSize: "14px" }}>
                    {lp.progressPercentage}%
                  </span>
                </div>

                <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden", marginBottom: "12px" }}>
                  <div style={{ width: `${lp.progressPercentage}%`, height: "100%", background: "#10b981" }} />
                </div>

                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Milestones: {lp.nodes?.length} steps configured (Video, Reading, Practice Quiz, 1-on-1 Check-in, Mastery Challenge)
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => router.push("/teacher/students/student-01")}
                  >
                    View in Student 360° <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
