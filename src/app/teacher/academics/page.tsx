"use client";

import { useEffect, useState } from "react";
import { Plus, BookOpen, Edit3, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { PageHeader, Modal } from "@/components/dashboard/shared";

export default function TeacherAcademicsPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMarksModalOpen, setIsMarksModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [marksState, setMarksState] = useState<{ [studentId: string]: { marks: string; remarks: string } }>({});
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form: Create assessment
  const [name, setName] = useState("");
  const [type, setType] = useState("UNIT_TEST");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resA, resS, resC] = await Promise.all([
        fetch("/api/academics"),
        fetch("/api/students"),
        fetch("/api/classes"),
      ]);
      const jsonA = await resA.json();
      const jsonS = await resS.json();
      const jsonC = await resC.json();

      if (jsonA.data) setAssessments(jsonA.data);
      if (jsonS.data) setStudents(jsonS.data);
      if (jsonC.data) {
        setClasses(jsonC.data.classes || []);
        setSubjects(jsonC.data.subjects || []);
        if (jsonC.data.classes?.length > 0 && !classId) setClassId(jsonC.data.classes[0].id);
        if (jsonC.data.subjects?.length > 0 && !subjectId) setSubjectId(jsonC.data.subjects[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAssessment(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/academics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          classId,
          subjectId,
          maxMarks: parseFloat(maxMarks),
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({ type: "success", text: `Assessment "${name}" created successfully!` });
        setIsCreateModalOpen(false);
        setName("");
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to create assessment" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  function openMarksModal(a: any) {
    setSelectedAssessment(a);
    const initialMarks: any = {};
    students.forEach((s) => {
      const existing = a.results?.find((r: any) => r.studentId === s.id);
      initialMarks[s.id] = {
        marks: existing ? String(existing.marks) : "78",
        remarks: existing?.remarks || "Good improvement in problem solving.",
      };
    });
    setMarksState(initialMarks);
    setIsMarksModalOpen(true);
  }

  async function handleSaveMarks(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const results = students.map((s) => ({
        studentId: s.id,
        studentName: `${s.firstName} ${s.lastName}`,
        marks: parseFloat(marksState[s.id]?.marks || "0"),
        remarks: marksState[s.id]?.remarks,
      }));

      const res = await fetch("/api/academics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enter-marks",
          assessmentId: selectedAssessment.id,
          results,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({
          type: "success",
          text: `✓ Marks updated for ${selectedAssessment.name}! Scores immediately updated across Student 360° and parent dashboards.`,
        });
        setIsMarksModalOpen(false);
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to enter marks" });
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
        title="Classroom Academics & Marks"
        subtitle="Manage examinations, enter/edit marks, and record teacher remarks"
      >
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={16} /> Create Assessment
        </button>
      </PageHeader>

      {msg && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: msg.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: msg.type === "success" ? "#16a34a" : "#dc2626",
            border: `1px solid ${msg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          {msg.text}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {assessments.map((a) => (
          <div key={a.id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a" }}>{a.name}</h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{a.subjectName} · {a.className}</span>
              </div>
              <span style={{ padding: "2px 8px", borderRadius: "4px", background: "#eff6ff", color: "#0ea5e9", fontSize: "11px", fontWeight: 700 }}>
                {a.type}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#f8fafc", borderRadius: "8px", margin: "14px 0" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Max Marks</div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>{a.maxMarks}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Recorded Scores</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#16a34a" }}>
                  {a.results?.length || 0} Students
                </div>
              </div>
            </div>

            <button
              onClick={() => openMarksModal(a)}
              className="btn btn-secondary"
              style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}
            >
              <Edit3 size={15} /> Enter / Edit Student Marks
            </button>
          </div>
        ))}
      </div>

      {/* Create Assessment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Assessment"
        subtitle="Schedule a Unit Test, Class Test, or Project Evaluation"
      >
        <form onSubmit={handleCreateAssessment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
              Assessment Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mathematics Unit Test 2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                Assessment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              >
                <option value="UNIT_TEST">Unit Test</option>
                <option value="CLASS_TEST">Class Test</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="PROJECT">Project</option>
                <option value="PRACTICAL">Practical</option>
                <option value="INTERNAL_ASSESSMENT">Internal Assessment</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                Maximum Marks
              </label>
              <input
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Class</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
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
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create Assessment"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Enter Marks Modal */}
      <Modal
        isOpen={isMarksModalOpen}
        onClose={() => setIsMarksModalOpen(false)}
        title={`Enter Marks: ${selectedAssessment?.name || ""}`}
        subtitle={`Maximum Marks: ${selectedAssessment?.maxMarks || 100} · Subject: ${selectedAssessment?.subjectName || "Mathematics"}`}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveMarks} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ maxHeight: "380px", overflowY: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Student Name</th>
                  <th>Score (/{selectedAssessment?.maxMarks})</th>
                  <th>Teacher Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.id}>
                    <td style={{ fontWeight: 700 }}>{st.rollNumber || "07"}</td>
                    <td style={{ fontWeight: 600 }}>{st.firstName} {st.lastName}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max={selectedAssessment?.maxMarks || 100}
                        value={marksState[st.id]?.marks || ""}
                        onChange={(e) =>
                          setMarksState({
                            ...marksState,
                            [st.id]: { ...marksState[st.id], marks: e.target.value },
                          })
                        }
                        style={{ width: "80px", padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="e.g. Good problem solving"
                        value={marksState[st.id]?.remarks || ""}
                        onChange={(e) =>
                          setMarksState({
                            ...marksState,
                            [st.id]: { ...marksState[st.id], remarks: e.target.value },
                          })
                        }
                        style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button type="button" onClick={() => setIsMarksModalOpen(false)} className="btn btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save Marks & Remarks"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
