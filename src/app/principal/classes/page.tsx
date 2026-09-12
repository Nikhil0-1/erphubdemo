"use client";

import { useEffect, useState } from "react";
import { Plus, BookOpen, Users, CheckCircle, AlertCircle, Loader2, BarChart3 } from "lucide-react";
import { PageHeader, Modal, EmptyState } from "@/components/dashboard/shared";

export default function PrincipalClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsClass, setAnalyticsClass] = useState<any | null>(null);

  // Modals
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Create Class form
  const [className, setClassName] = useState("");
  const [grade, setGrade] = useState("8");
  const [sectionsStr, setSectionsStr] = useState("A, B");

  // Assign Teacher form
  const [assignTeacherId, setAssignTeacherId] = useState("");
  const [assignClassId, setAssignClassId] = useState("");
  const [assignSubjectId, setAssignSubjectId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resC, resT] = await Promise.all([fetch("/api/classes"), fetch("/api/teachers")]);
      const jsonC = await resC.json();
      const jsonT = await resT.json();

      if (jsonC.data) {
        setClasses(jsonC.data.classes || []);
        setSubjects(jsonC.data.subjects || []);
        setAssignments(jsonC.data.assignments || []);
        if (jsonC.data.classes?.length > 0) setAssignClassId(jsonC.data.classes[0].id);
        if (jsonC.data.subjects?.length > 0) setAssignSubjectId(jsonC.data.subjects[0].id);
      }
      if (jsonT.data) {
        setTeachers(jsonT.data);
        if (jsonT.data.length > 0) setAssignTeacherId(jsonT.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-class",
          name: className,
          grade: parseInt(grade),
          sections: sectionsStr.split(",").map((s) => s.trim()),
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({ type: "success", text: `Class ${className} created successfully!` });
        setIsClassModalOpen(false);
        setClassName("");
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to create class" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAssignTeacher(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assign-teacher",
          teacherId: assignTeacherId,
          classId: assignClassId,
          subjectId: assignSubjectId,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({ type: "success", text: "Teacher assigned to class successfully!" });
        setIsAssignModalOpen(false);
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to assign teacher" });
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
        title="Class & Curriculum Structure"
        subtitle="Manage academic classes, sections, subjects, and teacher allocations"
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setIsClassModalOpen(true)}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={16} /> Create Class / Section
          </button>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="btn btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Users size={16} /> Assign Teacher
          </button>
        </div>
      </PageHeader>

      {msg && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: msg.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: msg.type === "success" ? "#16a34a" : "#dc2626",
            border: `1px solid ${msg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            fontSize: "14px",
          }}
        >
          {msg.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {msg.text}
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
          Loading curriculum...
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {classes.map((cls) => {
            const classAssigns = assignments.filter((a) => a.classId === cls.id);
            return (
              <div key={cls.id} className="card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>{cls.name}</h3>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>CBSE Grade {cls.grade || 7}</span>
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {cls.sections?.map((sec: any) => (
                      <span
                        key={sec.id}
                        style={{
                          padding: "2px 8px",
                          borderRadius: "6px",
                          background: "#eff6ff",
                          color: "#0ea5e9",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      >
                        Sec {sec.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px", marginTop: "12px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>
                    Assigned Faculty:
                  </div>
                  {classAssigns.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {classAssigns.map((a) => (
                        <div
                          key={a.id}
                          style={{
                            fontSize: "13px",
                            display: "flex",
                            justifyContent: "space-between",
                            background: "#f8fafc",
                            padding: "6px 10px",
                            borderRadius: "6px",
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>{a.teacherName}</span>
                          <span style={{ color: "#0ea5e9", fontWeight: 600 }}>{a.subjectName}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: "13px",
                        display: "flex",
                        justifyContent: "space-between",
                        background: "#f8fafc",
                        padding: "6px 10px",
                        borderRadius: "6px",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>Rahul Sharma</span>
                      <span style={{ color: "#0ea5e9", fontWeight: 600 }}>Mathematics</span>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
                  <button
                    onClick={() => setAnalyticsClass(cls)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: "100%", justifyContent: "center", gap: "6px" }}
                  >
                    <BarChart3 size={14} /> Class 360° Drill-Down
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Class 360 Drill-Down Modal */}
      {analyticsClass && (
        <Modal
          isOpen={!!analyticsClass}
          onClose={() => setAnalyticsClass(null)}
          title={`${analyticsClass.name} — Class 360° Analytics`}
          subtitle="Integrated performance metrics across attendance, academics, development, and fees"
        >
          <div className="space-y-4">
            {/* KPI grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              <div style={{ background: "var(--surface-bg)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 600 }}>ATTENDANCE RATE</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#10b981" }}>94%</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>RFID & Manual Sync</div>
              </div>
              <div style={{ background: "var(--surface-bg)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 600 }}>ACADEMIC AVERAGE</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#3b82f6" }}>83%</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Across 3 Assessments</div>
              </div>
              <div style={{ background: "var(--surface-bg)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 600 }}>FEE RECOVERY</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#8b5cf6" }}>71.4%</div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>₹50k / ₹70k Collected</div>
              </div>
            </div>

            {/* Academic Breakdown */}
            <div style={{ background: "var(--surface-bg)", padding: "14px", borderRadius: "8px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Subject Performance Breakdown</h4>
              <div className="space-y-2" style={{ fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Mathematics (Teacher: Rahul Sharma)</span>
                  <strong style={{ color: "#3b82f6" }}>82% Avg</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Science (Teacher: Rahul Sharma)</span>
                  <strong style={{ color: "#10b981" }}>86% Avg</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>English (Teacher: Rahul Sharma)</span>
                  <strong style={{ color: "#f59e0b" }}>80% Avg</strong>
                </div>
              </div>
            </div>

            {/* Attention List */}
            <div style={{ background: "rgba(249, 115, 22, 0.08)", border: "1px solid rgba(249, 115, 22, 0.2)", padding: "14px", borderRadius: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ea580c", fontWeight: 600, fontSize: "13px", marginBottom: "6px" }}>
                <AlertCircle size={15} /> Student Requiring Support / Intervention
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>
                <strong>Aarav Kumar (GV-2026-0701):</strong> Detected weakness in Linear Equations word problems. Teacher intervention roadmap in progress.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setAnalyticsClass(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setAnalyticsClass(null);
                  window.location.href = "/principal/students/student-01";
                }}
              >
                View Aarav 360° Profile
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Class Modal */}
      <Modal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        title="Create Class & Sections"
        subtitle="Provision a new classroom grade and configure section letters"
      >
        <form onSubmit={handleCreateClass} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
              Class Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Class 8"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Grade Level</label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                Sections (comma separated)
              </label>
              <input
                type="text"
                value={sectionsStr}
                onChange={(e) => setSectionsStr(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={() => setIsClassModalOpen(false)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Teacher Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Teacher to Class"
        subtitle="Allocate subject instructor to a specific grade and section"
      >
        <form onSubmit={handleAssignTeacher} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Select Teacher</label>
            <select
              value={assignTeacherId}
              onChange={(e) => setAssignTeacherId(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName} ({t.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Select Class</label>
            <select
              value={assignClassId}
              onChange={(e) => setAssignClassId(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Select Subject</label>
            <select
              value={assignSubjectId}
              onChange={(e) => setAssignSubjectId(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Assigning..." : "Confirm Assignment"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
