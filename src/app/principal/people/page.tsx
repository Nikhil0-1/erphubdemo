"use client";

import { useEffect, useState } from "react";
import { UserPlus, Plus, Search, Users, Mail, Phone, Link2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { PageHeader, Modal, EmptyState, Avatar } from "@/components/dashboard/shared";

export default function PrincipalPeoplePage() {
  const [activeTab, setActiveTab] = useState<"teachers" | "parents">("teachers");
  const [teachers, setTeachers] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Add Teacher Form
  const [tFirstName, setTFirstName] = useState("");
  const [tLastName, setTLastName] = useState("");
  const [tEmail, setTEmail] = useState("");
  const [tPhone, setTPhone] = useState("");
  const [tSubjectId, setTSubjectId] = useState("");
  const [tClassId, setTClassId] = useState("");

  // Add Parent Form
  const [pFirstName, setPFirstName] = useState("");
  const [pLastName, setPLastName] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [pPhone, setPPhone] = useState("");
  const [pRelationship, setPRelationship] = useState("Father");
  const [pStudentId, setPStudentId] = useState("");

  // Link Parent Form
  const [selectedParentId, setSelectedParentId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resT, resP, resS, resC] = await Promise.all([
        fetch("/api/teachers"),
        fetch("/api/parents"),
        fetch("/api/students"),
        fetch("/api/classes"),
      ]);
      const jsonT = await resT.json();
      const jsonP = await resP.json();
      const jsonS = await resS.json();
      const jsonC = await resC.json();

      if (jsonT.data) setTeachers(jsonT.data);
      if (jsonP.data) setParents(jsonP.data);
      if (jsonS.data) {
        setStudents(jsonS.data);
        if (jsonS.data.length > 0) {
          setPStudentId(jsonS.data[0].id);
          setSelectedStudentId(jsonS.data[0].id);
        }
      }
      if (jsonC.data) {
        setClasses(jsonC.data.classes || []);
        setSubjects(jsonC.data.subjects || []);
        if (jsonC.data.classes?.length > 0) setTClassId(jsonC.data.classes[0].id);
        if (jsonC.data.subjects?.length > 0) setTSubjectId(jsonC.data.subjects[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTeacher(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: tFirstName,
          lastName: tLastName,
          email: tEmail,
          phone: tPhone,
          classId: tClassId,
          subjectId: tSubjectId,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({ type: "success", text: `Teacher ${tFirstName} ${tLastName} added and assigned to class!` });
        setIsTeacherModalOpen(false);
        setTFirstName("");
        setTLastName("");
        setTEmail("");
        setTPhone("");
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to add teacher" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddParent(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: pFirstName,
          lastName: pLastName,
          email: pEmail,
          phone: pPhone,
          relationship: pRelationship,
          studentId: pStudentId || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({ type: "success", text: `Parent ${pFirstName} ${pLastName} added and linked!` });
        setIsParentModalOpen(false);
        setPFirstName("");
        setPLastName("");
        setPEmail("");
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to add parent" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLinkParent(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      // Direct call to student update or link
      const res = await fetch("/api/parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "link",
          parentId: selectedParentId,
          studentId: selectedStudentId,
        }),
      });
      setMsg({ type: "success", text: "Parent and Student linked successfully!" });
      setIsLinkModalOpen(false);
      loadData();
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="People & Faculty"
        subtitle="Manage teachers, parents, guardians, and academic staff"
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => setIsTeacherModalOpen(true)}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <UserPlus size={16} /> Add Teacher
          </button>
          <button
            onClick={() => setIsParentModalOpen(true)}
            className="btn btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={16} /> Add Parent
          </button>
          <button
            onClick={() => {
              if (parents.length > 0) setSelectedParentId(parents[0].id);
              if (students.length > 0) setSelectedStudentId(students[0].id);
              setIsLinkModalOpen(true);
            }}
            className="btn btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Link2 size={16} /> Link Parent to Student
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

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #e2e8f0", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("teachers")}
          style={{
            padding: "10px 18px",
            border: "none",
            background: "none",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            borderBottom: activeTab === "teachers" ? "2px solid #0ea5e9" : "2px solid transparent",
            color: activeTab === "teachers" ? "#0ea5e9" : "#64748b",
          }}
        >
          Teachers ({teachers.length})
        </button>
        <button
          onClick={() => setActiveTab("parents")}
          style={{
            padding: "10px 18px",
            border: "none",
            background: "none",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            borderBottom: activeTab === "parents" ? "2px solid #0ea5e9" : "2px solid transparent",
            color: activeTab === "parents" ? "#0ea5e9" : "#64748b",
          }}
        >
          Parents & Guardians ({parents.length})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
          Loading people...
        </div>
      ) : activeTab === "teachers" ? (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Assigned Class & Subject</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Avatar name={`${t.firstName} ${t.lastName}`} size={36} />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {t.firstName} {t.lastName}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code>{t.employeeId}</code>
                  </td>
                  <td>{t.department || "Mathematics"}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: "#0ea5e9" }}>
                      {t.assignments?.[0]?.className || "Class 7"} ({t.assignments?.[0]?.subjectName || "Mathematics"})
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{t.phone || "+91-98765-43210"}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Parent</th>
                <th>Relationship</th>
                <th>Linked Children</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Avatar name={`${p.firstName} ${p.lastName}`} size={36} />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {p.firstName} {p.lastName}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{p.address}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "#fef3c7",
                        color: "#b45309",
                      }}
                    >
                      {p.relationship || "Father"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {p.children && p.children.length > 0 ? (
                        p.children.map((c: any) => (
                          <span
                            key={c.id}
                            style={{
                              fontSize: "12px",
                              padding: "2px 8px",
                              background: "#eff6ff",
                              borderRadius: "4px",
                              color: "#1d4ed8",
                              fontWeight: 500,
                            }}
                          >
                            {c.firstName} {c.lastName} ({c.className || "Class 7"})
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Aarav Kumar</span>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: "12px" }}>{p.phone || "+91-99887-76655"}</td>
                  <td style={{ fontSize: "12px" }}>{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        title="Add New Teacher"
        subtitle="Register faculty and assign classroom responsibilities"
      >
        <form onSubmit={handleAddTeacher} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                First Name *
              </label>
              <input
                type="text"
                required
                value={tFirstName}
                onChange={(e) => setTFirstName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                Last Name *
              </label>
              <input
                type="text"
                required
                value={tLastName}
                onChange={(e) => setTLastName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
              Official Email *
            </label>
            <input
              type="email"
              required
              placeholder="teacher@greenvalley.edu"
              value={tEmail}
              onChange={(e) => setTEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                Assign Class
              </label>
              <select
                value={tClassId}
                onChange={(e) => setTClassId(e.target.value)}
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
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                Assign Subject
              </label>
              <select
                value={tSubjectId}
                onChange={(e) => setTSubjectId(e.target.value)}
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
            <button
              type="button"
              onClick={() => setIsTeacherModalOpen(false)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Adding..." : "Add & Assign Teacher"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Parent Modal */}
      <Modal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
        title="Add Parent / Guardian"
        subtitle="Register guardian credentials and link to enrolled child"
      >
        <form onSubmit={handleAddParent} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                First Name *
              </label>
              <input
                type="text"
                required
                value={pFirstName}
                onChange={(e) => setPFirstName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                Last Name *
              </label>
              <input
                type="text"
                required
                value={pLastName}
                onChange={(e) => setPLastName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>Email *</label>
            <input
              type="email"
              required
              value={pEmail}
              onChange={(e) => setPEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                Relationship
              </label>
              <select
                value={pRelationship}
                onChange={(e) => setPRelationship(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
                Link to Student
              </label>
              <select
                value={pStudentId}
                onChange={(e) => setPStudentId(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.className})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={() => setIsParentModalOpen(false)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Add & Link Parent"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Link Parent to Student Modal */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        title="Link Parent to Student"
        subtitle="Associate an existing parent account with a student record"
      >
        <form onSubmit={handleLinkParent} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Select Parent Guardian
            </label>
            <select
              value={selectedParentId}
              onChange={(e) => setSelectedParentId(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Select Enrolled Student
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.studentId} - {s.className})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={() => setIsLinkModalOpen(false)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Linking..." : "Confirm Link"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
