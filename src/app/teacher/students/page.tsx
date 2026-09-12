"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Search, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader, Avatar } from "@/components/dashboard/shared";

export default function TeacherStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setStudents(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    (s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Classroom Student Roster"
        subtitle="Students enrolled in Class 7-A (Mathematics) with direct access to Student 360° profile"
      />

      <div style={{ marginBottom: "20px", maxWidth: "400px", position: "relative" }}>
        <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
        <input
          type="text"
          placeholder="Search student by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px 12px 10px 38px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
        />
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student</th>
                <th>Student ID</th>
                <th>Class & Section</th>
                <th>Parent Guardian</th>
                <th>Signature Profile</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <span style={{ fontWeight: 700, fontSize: "14px" }}>{s.rollNumber || "07"}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Avatar name={`${s.firstName} ${s.lastName}`} size={32} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code>{s.studentId}</code>
                  </td>
                  <td>{s.className} - {s.sectionName || "A"}</td>
                  <td>{s.parentName || "Raj Kumar"}</td>
                  <td>
                    <button
                      onClick={() => router.push(`/teacher/students/${s.id}`)}
                      className="btn btn-primary"
                      style={{ padding: "6px 14px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      Open Student 360° <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
