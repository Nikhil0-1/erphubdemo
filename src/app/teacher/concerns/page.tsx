"use client";

import { useEffect, useState } from "react";
import { Plus, AlertTriangle, CheckCircle2, Clock, ShieldAlert, Check } from "lucide-react";
import { PageHeader, Modal } from "@/components/dashboard/shared";
import { createFirestoreConcern, updateFirestoreConcern } from "@/lib/firestore-service";

const CATEGORIES = ["ACADEMIC", "ATTENDANCE", "BEHAVIORAL", "EMOTIONAL", "HEALTH", "OTHER"];
const PRIORITIES = [
  { value: "LOW", color: "#64748b", bg: "#f1f5f9" },
  { value: "MEDIUM", color: "#d97706", bg: "#fef3c7" },
  { value: "HIGH", color: "#ea580c", bg: "#ffedd5" },
  { value: "URGENT", color: "#dc2626", bg: "#fee2e2" },
];

export default function TeacherConcernsPage() {
  const [concerns, setConcerns] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Create Form
  const [studentId, setStudentId] = useState("");
  const [category, setCategory] = useState("ACADEMIC");
  const [priority, setPriority] = useState("MEDIUM");
  const [description, setDescription] = useState("");

  // Resolve Form
  const [resolveNotes, setResolveNotes] = useState("");
  const [nextStatus, setNextStatus] = useState("RESOLVED");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resC, resS] = await Promise.all([fetch("/api/concerns"), fetch("/api/students")]);
      const jsonC = await resC.json();
      const jsonS = await resS.json();

      if (jsonC.data) setConcerns(jsonC.data);
      if (jsonS.data) {
        setStudents(jsonS.data);
        if (jsonS.data.length > 0 && !studentId) setStudentId(jsonS.data[0].id);
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
      const res = await fetch("/api/concerns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          category,
          priority,
          description,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        // Sync to Firebase Firestore
        const st = students.find((s) => s.id === studentId);
        await createFirestoreConcern({
          studentId,
          studentName: st ? `${st.firstName} ${st.lastName}` : "Student",
          category: category as any,
          priority: priority as any,
          description,
          status: "OPEN",
          teacherId: "teacher_1",
          teacherName: "Teacher",
          schoolId: "school_1",
        }).catch(() => {});

        setMsg({ type: "success", text: "Student concern logged and synchronized with Firebase Firestore!" });
        setIsModalOpen(false);
        setDescription("");
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to log concern" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedConcern) return;
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/concerns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-status",
          id: selectedConcern.id,
          status: nextStatus,
          notes: resolveNotes,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        // Sync status update to Firestore
        await updateFirestoreConcern(selectedConcern.id, nextStatus as any, resolveNotes).catch(() => {});

        setMsg({ type: "success", text: `Concern marked as ${nextStatus} and updated in Firebase!` });
        setIsResolveModalOpen(false);
        setSelectedConcern(null);
        setResolveNotes("");
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to update status" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  const filteredConcerns = concerns.filter((c) => {
    if (filterStatus === "ALL") return true;
    return c.status === filterStatus;
  });

  return (
    <div>
      <PageHeader
        title="Student Concerns & Early Intervention"
        subtitle="Confidential student support log, academic triage, and wellbeing tracking"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={16} /> Flag New Concern
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

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["ALL", "OPEN", "IN_REVIEW", "RESOLVED"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid",
              borderColor: filterStatus === st ? "#2563eb" : "#e2e8f0",
              background: filterStatus === st ? "#eff6ff" : "#ffffff",
              color: filterStatus === st ? "#2563eb" : "#64748b",
            }}
          >
            {st.replace("_", " ")} ({concerns.filter((c) => (st === "ALL" ? true : c.status === st)).length})
          </button>
        ))}
      </div>

      {filteredConcerns.length === 0 ? (
        <div className="card" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          <CheckCircle2 size={36} style={{ margin: "0 auto 12px", color: "#16a34a" }} />
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>No concerns in this category</h3>
          <p style={{ fontSize: "14px", marginTop: "4px" }}>All student wellness and academic flags are clear.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredConcerns.map((c) => {
            const prio = PRIORITIES.find((p) => p.value === c.priority) || PRIORITIES[0];
            return (
              <div
                key={c.id}
                className="card"
                style={{
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  borderLeft: `4px solid ${
                    c.status === "RESOLVED" ? "#10b981" : c.priority === "URGENT" ? "#dc2626" : "#f59e0b"
                  }`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{c.studentName}</h4>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: prio.bg,
                        color: prio.color,
                      }}
                    >
                      {c.priority} PRIORITY
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background: "#f1f5f9",
                        color: "#475569",
                      }}
                    >
                      {c.category}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        background:
                          c.status === "RESOLVED" ? "#d1fae5" : c.status === "IN_REVIEW" ? "#fef3c7" : "#fee2e2",
                        color:
                          c.status === "RESOLVED" ? "#065f46" : c.status === "IN_REVIEW" ? "#92400e" : "#991b1b",
                      }}
                    >
                      {c.status.replace("_", " ")}
                    </span>
                  </div>

                  <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.4" }}>{c.description}</p>

                  {c.notes && (
                    <div style={{ marginTop: "6px", fontSize: "12px", color: "#16a34a", fontWeight: 500 }}>
                      Resolution Notes: {c.notes}
                    </div>
                  )}

                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>
                    Logged by {c.teacherName} • {c.date}
                  </div>
                </div>

                {c.status !== "RESOLVED" && (
                  <button
                    onClick={() => {
                      setSelectedConcern(c);
                      setNextStatus(c.status === "OPEN" ? "IN_REVIEW" : "RESOLVED");
                      setIsResolveModalOpen(true);
                    }}
                    className="btn btn-secondary"
                    style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}
                  >
                    Update Status
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* NEW CONCERN MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Flag Student Support Concern">
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="form-label">Student *</label>
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
              <label className="form-label">Category *</label>
              <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Priority *</label>
              <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Observation Details & Context *</label>
            <textarea
              required
              rows={3}
              placeholder="Detail specific observations, changes in demeanor, recurring absences, or academic drop..."
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Saving..." : "Submit Concern"}
            </button>
          </div>
        </form>
      </Modal>

      {/* UPDATE STATUS MODAL */}
      <Modal isOpen={isResolveModalOpen} onClose={() => setIsResolveModalOpen(false)} title="Update Concern Status">
        <form onSubmit={handleUpdateStatus} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="form-label">Change Status To *</label>
            <select className="form-input" value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
              <option value="IN_REVIEW">IN REVIEW (Counselor / Principal Consulted)</option>
              <option value="RESOLVED">RESOLVED (Intervention Completed)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Action Taken / Resolution Notes</label>
            <textarea
              rows={3}
              placeholder="e.g., Conducted parent conference. Aarav was provided additional algebra review modules and mentorship..."
              className="form-input"
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button type="button" onClick={() => setIsResolveModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Updating..." : "Confirm Status Update"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
