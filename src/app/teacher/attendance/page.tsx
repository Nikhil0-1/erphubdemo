"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, CheckCircle2, XCircle, Clock, AlertCircle, Save, Check } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/dashboard/shared";

interface StudentRoll {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY";
}

export default function TeacherAttendancePage() {
  const [students, setStudents] = useState<StudentRoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dateStr, setDateStr] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    loadStudents();
  }, [dateStr]);

  async function loadStudents() {
    try {
      const [resS, resA] = await Promise.all([
        fetch("/api/students"),
        fetch(`/api/attendance?date=${dateStr}`),
      ]);
      const jsonS = await resS.json();
      const jsonA = await resA.json();

      const attendanceMap = new Map<string, "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY">();
      if (jsonA.data) {
        jsonA.data.forEach((att: any) => attendanceMap.set(att.studentId, att.status));
      }

      if (jsonS.data) {
        const mapped = jsonS.data.map((s: any) => ({
          id: s.id,
          studentId: s.studentId,
          firstName: s.firstName,
          lastName: s.lastName,
          rollNumber: s.rollNumber || "07",
          status: attendanceMap.get(s.id) || "PRESENT",
        }));
        setStudents(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function setStatus(studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY") {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  }

  function markAllPresent() {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "PRESENT" })));
  }

  async function handleSaveAttendance() {
    setSaving(true);
    setMsg(null);

    try {
      const records = students.map((s) => ({
        studentId: s.id,
        status: s.status,
      }));

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          records,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({
          type: "success",
          text: `✓ Attendance for ${students.length} students saved to database for ${dateStr}! Student 360° and parent dashboards updated.`,
        });
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to save attendance" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;

  return (
    <div>
      <PageHeader
        title="Class 7-A Attendance Sheet"
        subtitle="Subject: Mathematics · Academic Session 2026-27"
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
          />
          <button onClick={markAllPresent} className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Check size={16} /> Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            className="btn btn-primary"
            disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
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

      {/* Summary Chips */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <div style={{ padding: "10px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", color: "#16a34a", fontSize: "13px", fontWeight: 600 }}>
          Present: {presentCount}
        </div>
        <div style={{ padding: "10px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#dc2626", fontSize: "13px", fontWeight: 600 }}>
          Absent: {absentCount}
        </div>
        <div style={{ padding: "10px 16px", background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: "8px", color: "#d97706", fontSize: "13px", fontWeight: 600 }}>
          Late: {lateCount}
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Mark Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
                <tr key={st.id}>
                  <td>
                    <span style={{ fontWeight: 700, fontSize: "14px" }}>{st.rollNumber}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {st.firstName} {st.lastName}
                  </td>
                  <td>
                    <code>{st.studentId}</code>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {(["PRESENT", "ABSENT", "LATE", "HALF_DAY"] as const).map((stat) => (
                        <button
                          key={stat}
                          onClick={() => setStatus(st.id, stat)}
                          type="button"
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: st.status === stat ? "2px solid" : "1px solid #e2e8f0",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            background:
                              st.status === stat
                                ? stat === "PRESENT"
                                  ? "#dcfce7"
                                  : stat === "ABSENT"
                                  ? "#fee2e2"
                                  : "#fef3c7"
                                : "white",
                            borderColor:
                              st.status === stat
                                ? stat === "PRESENT"
                                  ? "#16a34a"
                                  : stat === "ABSENT"
                                  ? "#dc2626"
                                  : "#d97706"
                                : "#cbd5e1",
                            color:
                              st.status === stat
                                ? stat === "PRESENT"
                                  ? "#15803d"
                                  : stat === "ABSENT"
                                  ? "#b91c1c"
                                  : "#b45309"
                                : "#64748b",
                          }}
                        >
                          {stat}
                        </button>
                      ))}
                    </div>
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
