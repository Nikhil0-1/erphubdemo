"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function WeakTopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students/growth/weak-topics")
      .then((r) => r.json())
      .then((d) => setTopics(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6" style={{ maxWidth: "860px", margin: "0 auto" }}>
      <PageHeader
        title="Weak Topic Detector"
        subtitle="Intelligent diagnostic analysis pinpoints foundational concept gaps for rapid targeted mastery"
      >
        <button
          className="btn btn-primary"
          onClick={() => router.push("/student/practice")}
        >
          <BookOpen size={16} />
          Practice Weak Areas
        </button>
      </PageHeader>

      <div className="space-y-4">
        {topics.map((item) => {
          const isHigh = item.severity === "HIGH";
          const isMed = item.severity === "MEDIUM";
          const sevColor = isHigh ? "#ef4444" : isMed ? "#f59e0b" : "#10b981";

          return (
            <div key={item.id} className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: "rgba(59, 130, 246, 0.1)",
                        color: "#3b82f6",
                        fontWeight: 600,
                      }}
                    >
                      {item.subjectName}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: `${sevColor}15`,
                        color: sevColor,
                        fontWeight: 700,
                      }}
                    >
                      {item.severity} PRIORITY
                    </span>
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {item.topicName}
                  </h3>
                  {item.subTopic && (
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      Sub-topic: {item.subTopic}
                    </p>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: sevColor }}>
                    {item.accuracyRate}%
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Accuracy Rate</div>
                </div>
              </div>

              {/* Action recommendation */}
              <div
                style={{
                  background: "var(--surface-bg)",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "13px",
                  marginBottom: "16px",
                  color: "var(--text-secondary)",
                }}
              >
                <strong style={{ color: "var(--text-primary)" }}>Recommended Action: </strong>
                {item.recommendedAction}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-tertiary)" }}>
                <span>Detected from: {item.detectedFrom} ({item.detectedDate})</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => router.push("/student/learning-path")}
                >
                  View Learning Path <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
