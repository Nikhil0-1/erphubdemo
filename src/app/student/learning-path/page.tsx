"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Navigation,
  CheckCircle2,
  Clock,
  Lock,
  PlayCircle,
  FileText,
  UserCheck,
  Award,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function LearningPathPage() {
  const router = useRouter();
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students/growth/learning-paths")
      .then((r) => r.json())
      .then((d) => setPaths(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const activePath = paths[0];

  return (
    <div className="space-y-6" style={{ maxWidth: "860px", margin: "0 auto" }}>
      <PageHeader
        title="Personal Learning Pathway"
        subtitle="Individualized remedial curriculum curated by your teacher with staged milestone progression"
      />

      {activePath ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "10px",
                    background: "rgba(59, 130, 246, 0.1)",
                    color: "#3b82f6",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                  }}
                >
                  {activePath.subjectName} · CURATED PATHWAY
                </span>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginTop: "8px" }}>
                  {activePath.title}
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {activePath.description}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "24px", fontWeight: 800, color: "#10b981" }}>
                  {activePath.progressPercentage}%
                </span>
                <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Mastery Completed</div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ width: "100%", height: "10px", background: "var(--surface-bg)", borderRadius: "5px", overflow: "hidden", marginBottom: "16px" }}>
              <div
                style={{
                  width: `${activePath.progressPercentage}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #3b82f6, #10b981)",
                  borderRadius: "5px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-tertiary)" }}>
              <span>Curated by: <strong>{activePath.assignedByTeacherName}</strong></span>
              <span>Updated {new Date(activePath.updatedAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Staged Roadmap Nodes */}
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", color: "var(--text-primary)" }}>
              Milestone Sequence
            </h3>

            <div className="space-y-4">
              {activePath.nodes?.map((node: any, idx: number) => {
                const isCompleted = node.status === "COMPLETED";
                const isInProgress = node.status === "IN_PROGRESS";
                const isLocked = node.status === "LOCKED";

                let nodeColor = isCompleted ? "#10b981" : isInProgress ? "#3b82f6" : "var(--text-tertiary)";
                let icon = isCompleted ? (
                  <CheckCircle2 size={20} color="#10b981" />
                ) : isInProgress ? (
                  <Clock size={20} color="#3b82f6" />
                ) : (
                  <Lock size={18} color="var(--text-tertiary)" />
                );

                return (
                  <div
                    key={node.id}
                    style={{
                      display: "flex",
                      gap: "16px",
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      background: isInProgress ? "rgba(59, 130, 246, 0.08)" : "var(--surface-bg)",
                      border: isInProgress ? "1px solid #3b82f6" : "1px solid transparent",
                      opacity: isLocked ? 0.65 : 1,
                    }}
                  >
                    <div style={{ marginTop: "2px" }}>{icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                        <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                          Step {idx + 1}: {node.title}
                        </h4>
                        <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                          {node.estimatedMinutes} mins
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 10px 0" }}>
                        {node.description}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.06)",
                            color: "var(--text-secondary)",
                            fontWeight: 600,
                          }}
                        >
                          Type: {node.type}
                        </span>

                        {isInProgress && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => router.push("/student/practice")}
                          >
                            Continue Module <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: "48px", textAlign: "center", color: "var(--text-tertiary)" }}>
          No learning path assigned yet.
        </div>
      )}
    </div>
  );
}
