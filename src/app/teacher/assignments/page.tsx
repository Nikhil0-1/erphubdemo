"use client";

import { useEffect, useState } from "react";
import { Plus, FileText, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader, Modal } from "@/components/dashboard/shared";

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("20");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resA, resC] = await Promise.all([fetch("/api/assignments"), fetch("/api/classes")]);
      const jsonA = await resA.json();
      const jsonC = await resC.json();

      if (jsonA.data) setAssignments(jsonA.data);
      if (jsonC.data) {
        setClasses(jsonC.data.classes || []);
        setSubjects(jsonC.data.subjects || []);
        if (jsonC.data.classes?.length > 0 && !classId) setClassId(jsonC.data.classes[0].id);
        if (jsonC.data.subjects?.length > 0 && !subjectId) setSubjectId(jsonC.data.subjects[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          dueDate,
          maxMarks: parseFloat(maxMarks),
          classId,
          subjectId,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({ type: "success", text: `Assignment "${title}" created and published to students!` });
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to create assignment" });
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
        title="Classroom Homework & Assignments"
        subtitle="Publish exercises, review student submissions, and grade work"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={16} /> Create Assignment
        </button>
      </PageHeader>

      {msg && (
        <div style={{ padding: "14px", borderRadius: "8px", marginBottom: "20px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", fontSize: "14px", fontWeight: 600 }}>
          ✓ {msg.text}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {assignments.map((a) => (
          <div key={a.id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "#0ea5e9", fontWeight: 600 }}>{a.subjectName} · {a.className}</span>
              <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={13} /> Due: {a.dueDate}
              </span>
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>{a.title}</h3>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, marginBottom: "16px" }}>{a.description}</p>

            <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Submissions</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#16a34a" }}>
                  {a.submissions?.length || 0} Submitted
                </div>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>Max: {a.maxMarks || 20} pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Assignment"
        subtitle="Publish homework or term project with submission deadline"
      >
        <form onSubmit={handleCreateAssignment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Linear Equations Practice Worksheet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Description</label>
            <textarea
              rows={3}
              placeholder="Instructions for students..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Max Score</label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Publishing..." : "Publish Assignment"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
