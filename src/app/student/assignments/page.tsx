"use client";

import { useEffect, useState } from "react";
import { FileText, Calendar, Clock, CheckCircle2, Upload, AlertCircle, Plus } from "lucide-react";
import { PageHeader, Modal } from "@/components/dashboard/shared";

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/assignments")
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setAssignments(res.data);
      })
      .catch(console.error);
  }, []);

  async function handleSubmitWork(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    // Simulate homework submission
    setTimeout(() => {
      setMsg({
        type: "success",
        text: `Homework for "${selectedAssignment?.title}" successfully submitted to Teacher Rahul Sharma!`,
      });
      setIsSubmitModalOpen(false);
      setSubmissionText("");
      setSubmitting(false);
    }, 600);
  }

  return (
    <div>
      <PageHeader
        title="Classroom Homework & Assignments"
        subtitle="Active homework tasks, teacher deadlines, and digital submission portal"
      />

      {msg && (
        <div
          style={{
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "20px",
            background: "#f0fdf4",
            color: "#16a34a",
            border: "1px solid #bbf7d0",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          ✓ {msg.text}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
        {assignments.map((a) => (
          <div key={a.id} className="card" style={{ padding: "22px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "12px",
                  background: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                {a.subjectName || "Mathematics"}
              </span>
              <span style={{ fontSize: "12px", color: "#ea580c", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={13} /> Due: {a.dueDate || "Tomorrow"}
              </span>
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>{a.title}</h3>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", flex: 1, marginBottom: "14px" }}>
              {a.description || "Complete chapter review exercises and submit workings."}
            </p>

            <div
              style={{
                borderTop: "1px solid #f1f5f9",
                paddingTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "12px", color: "#64748b" }}>Max Marks: {a.maxMarks || 20}</span>

              <button
                onClick={() => {
                  setSelectedAssignment(a);
                  setIsSubmitModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Upload size={14} /> Submit Work
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUBMISSION MODAL */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={`Submit: ${selectedAssignment?.title || "Assignment"}`}
      >
        <form onSubmit={handleSubmitWork} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="form-label">Written Solution / Submission Notes *</label>
            <textarea
              required
              rows={4}
              placeholder="Type your answers, step-by-step solution, or link to project code..."
              className="form-input"
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
            />
          </div>

          <div
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              background: "#f8fafc",
            }}
          >
            <Upload size={24} style={{ margin: "0 auto 8px", color: "#64748b" }} />
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
              Attach scanned notebook page or PDF
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>PDF, PNG, JPEG up to 10MB</div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Submitting..." : "Turn In Assignment"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
