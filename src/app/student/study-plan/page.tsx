"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Plus,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function StudyPlanPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  function loadPlans() {
    fetch("/api/students/growth/study-plans")
      .then((r) => r.json())
      .then((d) => setPlans(d.data || []))
      .finally(() => setLoading(false));
  }

  async function handleToggle(id: string, currentStatus: string) {
    const newStatus = currentStatus === "COMPLETED" ? "SCHEDULED" : "COMPLETED";
    try {
      await fetch(`/api/students/growth/study-plans?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      loadPlans();
    } catch (err) {
      console.error(err);
    }
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6" style={{ maxWidth: "860px", margin: "0 auto" }}>
      <PageHeader
        title="Smart Study Planner"
        subtitle="AI-balanced daily timetable allocating optimal study blocks based on weak topics and upcoming tests"
      />

      <div className="space-y-4">
        {days.map((day) => {
          const dayPlans = plans.filter((p) => p.dayOfWeek.toLowerCase() === day.toLowerCase());
          if (dayPlans.length === 0) return null;

          return (
            <div key={day} className="card" style={{ padding: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px" }}>
                {day}
              </h3>
              <div className="space-y-3">
                {dayPlans.map((plan) => {
                  const isDone = plan.status === "COMPLETED";
                  return (
                    <div
                      key={plan.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        borderRadius: "var(--radius-md)",
                        background: isDone ? "rgba(16, 185, 129, 0.08)" : "var(--surface-bg)",
                        border: isDone ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid transparent",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button
                          type="button"
                          onClick={() => handleToggle(plan.id, plan.status)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            color: isDone ? "#10b981" : "var(--text-tertiary)",
                          }}
                        >
                          <CheckCircle2 size={22} />
                        </button>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", textDecoration: isDone ? "line-through" : "none" }}>
                              {plan.topic}
                            </span>
                            {plan.isAiGenerated && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  padding: "2px 6px",
                                  borderRadius: "8px",
                                  background: "rgba(139, 92, 246, 0.15)",
                                  color: "#8b5cf6",
                                  fontWeight: 700,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                }}
                              >
                                <Sparkles size={10} /> AI FOCUS
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                            {plan.subjectName} · {plan.startTime} - {plan.endTime} ({plan.durationMinutes} mins)
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: "11px",
                          padding: "3px 8px",
                          borderRadius: "10px",
                          fontWeight: 600,
                          background:
                            plan.priority === "HIGH"
                              ? "rgba(239, 68, 68, 0.15)"
                              : "rgba(59, 130, 246, 0.1)",
                          color: plan.priority === "HIGH" ? "#ef4444" : "#3b82f6",
                        }}
                      >
                        {plan.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
