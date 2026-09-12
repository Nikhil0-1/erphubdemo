"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HeartHandshake,
  Plus,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function TeacherInterventionsPage() {
  const router = useRouter();
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [studentId, setStudentId] = useState("student-01");
  const [type, setType] = useState("REMEDIAL_SESSION");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [actionItemsStr, setActionItemsStr] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInterventions();
  }, []);

  function loadInterventions() {
    fetch("/api/students/growth/interventions")
      .then((r) => r.json())
      .then((d) => setInterventions(d.data || []))
      .finally(() => setLoading(false));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/students/growth/interventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          type,
          title,
          notes,
          actionItems: actionItemsStr.split(",").map((s) => s.trim()).filter(Boolean),
          scheduledDate,
          status: "IN_PROGRESS",
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setTitle("");
        setNotes("");
        setActionItemsStr("");
        loadInterventions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Interventions & Remedial Clinic"
        subtitle="Log systematic 1-on-1 counseling, remedial sessions, and parent conferences linked to Student 360°"
      >
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          Log New Intervention
        </button>
      </PageHeader>

      <div className="space-y-4">
        {interventions.map((item) => (
          <div key={item.id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: "rgba(59, 130, 246, 0.15)",
                      color: "#3b82f6",
                      fontWeight: 700,
                    }}
                  >
                    {item.type.replace(/_/g, " ")}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#10b981",
                      fontWeight: 600,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Student: <strong>{item.studentName}</strong> · Teacher: {item.teacherName}
                </p>
              </div>

              <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                {item.scheduledDate}
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "14px" }}>
              {item.notes}
            </p>

            {item.actionItems && item.actionItems.length > 0 && (
              <div style={{ background: "var(--surface-bg)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
                  Action Items & Follow-up:
                </div>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "var(--text-secondary)" }}>
                  {item.actionItems.map((act: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: "2px" }}>{act}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div className="card" style={{ width: "100%", maxWidth: "520px", padding: "28px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)" }}>
              Record Student Intervention
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Student *
                </label>
                <select
                  className="input"
                  style={{ width: "100%" }}
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  <option value="student-01">Aarav Kumar (Class 7-A · GV-2026-0701)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Intervention Strategy *
                </label>
                <select
                  className="input"
                  style={{ width: "100%" }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="REMEDIAL_SESSION">1-on-1 Remedial Session</option>
                  <option value="STUDY_PLAN_ADJUSTMENT">Study Plan & Pace Adjustment</option>
                  <option value="COUNSELING">Academic Counseling</option>
                  <option value="PARENT_CONFERENCE">Parent-Teacher Conference</option>
                  <option value="PEER_TUTORING">Peer Tutoring Pairing</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Intervention Title *
                </label>
                <input
                  type="text"
                  className="input"
                  style={{ width: "100%" }}
                  placeholder="e.g. Algebra Word Problem Isolation Drill"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Observations & Remedial Notes *
                </label>
                <textarea
                  className="input"
                  rows={3}
                  style={{ width: "100%" }}
                  placeholder="Describe student's specific obstacle and steps reviewed..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Action Items (comma separated)
                </label>
                <input
                  type="text"
                  className="input"
                  style={{ width: "100%" }}
                  placeholder="e.g. Assigned 5 practice questions, Follow-up next Tuesday"
                  value={actionItemsStr}
                  onChange={(e) => setActionItemsStr(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "12px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Logging..." : "Log Intervention"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
