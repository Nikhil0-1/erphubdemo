"use client";

import { useEffect, useState } from "react";
import { Plus, Activity, Calendar, Award, Users, CheckCircle2 } from "lucide-react";
import { PageHeader, Modal } from "@/components/dashboard/shared";

const CATEGORIES = [
  "Robotics & STEM",
  "Debate & Public Speaking",
  "Sports & Athletics",
  "Visual Arts & Design",
  "Music & Performing Arts",
  "Coding & Algorithms",
  "Environmental & Sustainability",
  "Social Service & Ethics",
  "Literary & Creative Writing",
  "Science & Innovation Club",
  "Leadership & Student Council",
  "Drama & Theatre",
];

export default function TeacherActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [objective, setObjective] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [skills, setSkills] = useState("Problem Solving, Teamwork, Critical Thinking");
  const [evaluation, setEvaluation] = useState("Demonstrated high engagement and proactive leadership.");
  const [reflection, setReflection] = useState("Students collaborated effectively on system design.");
  const [classId, setClassId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resAct, resStud, resCls] = await Promise.all([
        fetch("/api/activities"),
        fetch("/api/students"),
        fetch("/api/classes"),
      ]);
      const jsonAct = await resAct.json();
      const jsonStud = await resStud.json();
      const jsonCls = await resCls.json();

      if (jsonAct.data) setActivities(jsonAct.data);
      if (jsonStud.data) setStudents(jsonStud.data);
      if (jsonCls.data?.classes) {
        setClasses(jsonCls.data.classes);
        if (jsonCls.data.classes.length > 0 && !classId) {
          setClassId(jsonCls.data.classes[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load activity data", err);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          objective,
          date,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          evaluation,
          reflection,
          classId,
          participantIds: students.map((s) => s.id),
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({ type: "success", text: `Activity "${name}" logged and linked to student portfolios!` });
        setIsModalOpen(false);
        setName("");
        setObjective("");
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to create activity" });
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
        title="Holistic Activities & Co-Curriculars"
        subtitle="Log co-curricular projects, tag developmental competencies, and feed digital portfolios"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={16} /> Log Co-Curricular Activity
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

      {activities.length === 0 ? (
        <div className="card" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          <Activity size={36} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>No activities recorded yet</h3>
          <p style={{ fontSize: "14px", marginTop: "4px" }}>
            Click &quot;Log Co-Curricular Activity&quot; to add projects, clubs, and sports records.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
          {activities.map((act) => (
            <div key={act.id} className="card" style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "#eff6ff",
                    color: "#2563eb",
                  }}
                >
                  {act.category}
                </span>
                <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={13} /> {act.date}
                </span>
              </div>

              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>{act.name}</h3>
              <p style={{ fontSize: "13px", color: "#475569", marginBottom: "14px", flex: 1, lineHeight: "1.5" }}>
                {act.objective || "Co-curricular activity for student holistic development."}
              </p>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", marginBottom: "6px" }}>
                  Skills Assessed
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(act.skills || []).map((sk: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "11px",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        background: "#f1f5f9",
                        color: "#334155",
                        fontWeight: 500,
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

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
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Users size={14} /> {act.participantIds?.length || students.length} Participants
                </span>
                <span style={{ color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={13} /> Linked to Portfolios
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE ACTIVITY MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Co-Curricular Activity">
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="form-label">Activity Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Annual Science Exhibition - Smart Microgrid"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="form-label">Category *</label>
              <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
          </div>

          <div>
            <label className="form-label">Class Target</label>
            <select className="form-input" value={classId} onChange={(e) => setClassId(e.target.value)}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.section ? `(${c.section})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Objective & Goals</label>
            <textarea
              rows={2}
              placeholder="Educational objective, problem statements tackled..."
              className="form-input"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Assessed Skills (comma separated)</label>
            <input
              type="text"
              placeholder="Robotics, Mathematical Modeling, Teamwork, Presentation"
              className="form-input"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Teacher Reflection / Evaluation</label>
            <textarea
              rows={2}
              placeholder="Cohort performance, breakthroughs, areas of growth..."
              className="form-input"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Saving..." : "Save Activity"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
