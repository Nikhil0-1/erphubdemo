"use client";

import { useEffect, useState } from "react";
import { Plus, Search, GraduationCap, ChevronRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader, StatusBadge, Modal, EmptyState, Avatar } from "@/components/dashboard/shared";

export default function PrincipalStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resS, resC, resP] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/classes"),
        fetch("/api/parents"),
      ]);
      const jsonS = await resS.json();
      const jsonC = await resC.json();
      const jsonP = await resP.json();

      if (jsonS.data) setStudents(jsonS.data);
      if (jsonC.data?.classes) {
        setClasses(jsonC.data.classes);
        if (jsonC.data.classes.length > 0 && !classId) {
          setClassId(jsonC.data.classes[0].id);
        }
      }
      if (jsonP.data) setParents(jsonP.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          classId,
          rollNumber,
          admissionNumber,
          parentId: parentId || undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({ type: "success", text: `Student ${firstName} ${lastName} enrolled successfully!` });
        setIsModalOpen(false);
        setFirstName("");
        setLastName("");
        setEmail("");
        setRollNumber("");
        setAdmissionNumber("");
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to enroll student" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to enroll student" });
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = students.filter((s) => {
    const matchSearch =
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchClass = !selectedClass || s.classId === selectedClass;
    return matchSearch && matchClass;
  });

  return (
    <div>
      <PageHeader
        title="Student Directory"
        subtitle="Manage student enrollments, class distributions, and holistic profiles"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={18} /> Enroll New Student
        </button>
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

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
          <input
            type="text"
            placeholder="Search by student name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 38px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
            }}
          />
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
          Loading students...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<GraduationCap size={24} />}
          title="No Students Found"
          description="Enroll your first student into a classroom."
          action={
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Enroll Student
            </button>
          }
        />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class & Section</th>
                <th>Roll No</th>
                <th>Student ID</th>
                <th>Linked Parent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Avatar name={`${s.firstName} ${s.lastName}`} size={36} />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {s.firstName} {s.lastName}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>
                      {s.className} - {s.sectionName || "A"}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{s.rollNumber || "07"}</span>
                  </td>
                  <td>
                    <code>{s.studentId}</code>
                  </td>
                  <td>
                    <div style={{ fontSize: "13px" }}>{s.parentName || "Raj Kumar"}</div>
                  </td>
                  <td>
                    <button
                      onClick={() => router.push(`/teacher/students/${s.id}`)}
                      className="btn btn-secondary"
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Student 360° <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Enroll Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enroll New Student"
        subtitle="Register a student and assign to class, section, and parent guardian"
      >
        <form onSubmit={handleAddStudent} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Student Email (Optional)
            </label>
            <input
              type="email"
              placeholder="auto-generated if blank"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Class *
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
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
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Roll Number
              </label>
              <input
                type="text"
                placeholder="e.g. 08"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Link Parent / Guardian
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              <option value="">Select Parent Guardian...</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.relationship || "Parent"} - {p.email})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Enrolling..." : "Enroll Student"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
