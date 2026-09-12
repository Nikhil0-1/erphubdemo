"use client";

import { useEffect, useState } from "react";
import { Plus, Target, User, Calendar, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageHeader, Modal } from "@/components/dashboard/shared";

const DIMENSIONS = [
  "Cognitive & Analytical Thinking",
  "Social & Emotional Learning (SEL)",
  "Physical & Kinesthetic Growth",
  "Language & Communication",
  "Creative & Artistic Expression",
  "Digital & Computational Literacy",
  "Ethics, Civic Responsibility & Empathy",
  "Executive Function & Self-Regulation",
];

const LEVELS = [
  { value: "Emerging", color: "#f59e0b", bg: "#fef3c7" },
  { value: "Developing", color: "#0ea5e9", bg: "#e0f2fe" },
  { value: "Proficient", color: "#10b981", bg: "#d1fae5" },
  { value: "Exemplary", color: "#8b5cf6", bg: "#ede9fe" },
];

export default function TeacherDevelopmentPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [studentId, setStudentId] = useState("");
  const [area, setArea] = useState(DIMENSIONS[0]);
  const [level, setLevel] = useState("Developing");
  const [observation, setObservation] = useState("");
  const [feedback, setFeedback] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resDev, resStud] = await Promise.all([
        fetch("/api/development"),
        fetch("/api/students"),
      ]);
      const jsonDev = await resDev.json();
      const jsonStud = await resStud.json();

      if (jsonDev.data) setRecords(jsonDev.data);
      if (jsonStud.data) {
        setStudents(jsonStud.data);
        if (jsonStud.data.length > 0 && !studentId) {
          setStudentId(jsonStud.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/development", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          area,
          level,
          observation,
          feedback,
          date,
          source: "TEACHER",
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({ type: "success", text: "Holistic development entry committed to official student record!" });
        setIsModalOpen(false);
        setObservation("");
        setFeedback("");
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to record development entry" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Holistic Child Development Records"
        subtitle="Track continuous growth across 8 developmental dimensions with respectful evaluation criteria"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={16} /> Record Growth Observation
        </button>
      </PageHeader>

      {msg && (
        <div
          style={{
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "20px",
            background: msg.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: msg.type === "success" ? "#16a34a" : "#dc2626",
            border: `1px solid ${msg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {msg.type === "success" ? "✓ " : "⚠ "}
          {msg.text}
        </div>
      )}

      {records.length === 0 ? (
        <div className="card" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          <Target size={36} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>No development records yet</h3>
          <p style={{ fontSize: "14px", marginTop: "4px" }}>
            Click &quot;Record Growth Observation&quot; to log holistic student development.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
          {records.map((r) => {
            const levelInfo = LEVELS.find((l) => l.value === r.level) || LEVELS[1];
            return (
              <div key={r.id} className="card" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8" }}>
                      Student
                    </span>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{r.studentName}</h4>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: "12px",
                      background: levelInfo.bg,
                      color: levelInfo.color,
                    }}
                  >
                    {r.level}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#2563eb",
                    background: "#eff6ff",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    alignSelf: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  {r.area}
                </div>

                <div style={{ marginBottom: "12px", flex: 1 }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", marginBottom: "4px" }}>
                    Observation
                  </div>
                  <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.5" }}>{r.observation}</p>
                </div>

                {r.feedback && (
                  <div style={{ marginBottom: "12px", background: "#f8fafc", padding: "10px", borderRadius: "6px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "3px" }}>
                      Growth Feedback
                    </div>
                    <p style={{ fontSize: "12px", color: "#475569", lineHeight: "1.4" }}>{r.feedback}</p>
                  </div>
                )}

                <div
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={12} /> {r.date}
                  </span>
                  <span
                    style={{
                      color: r.source === "ASSISTANT_APPROVED" ? "#8b5cf6" : "#059669",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <ShieldCheck size={13} />
                    {r.source === "ASSISTANT_APPROVED" ? "AI Verified Record" : "Teacher Certified"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE RECORD MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Holistic Growth Observation">
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="form-label">Select Student *</label>
            <select className="form-input" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} (Roll #{s.rollNumber || "N/A"})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="form-label">Development Dimension *</label>
              <select className="form-input" value={area} onChange={(e) => setArea(e.target.value)}>
                {DIMENSIONS.map((dim) => (
                  <option key={dim} value={dim}>
                    {dim}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Level *</label>
              <select className="form-input" value={level} onChange={(e) => setLevel(e.target.value)}>
                {LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Date *</label>
            <input
              type="date"
              required
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Specific Behavioral Observation *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g., During today's group robotics session, Aarav demonstrated remarkable empathy by mentoring peers struggling with circuit debugging..."
              className="form-input"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Actionable Teacher Feedback / Coaching Point</label>
            <textarea
              rows={2}
              placeholder="e.g., Encourage leading future multi-disciplinary initiatives to further hone collaborative leadership."
              className="form-input"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Saving..." : "Commit Official Entry"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
