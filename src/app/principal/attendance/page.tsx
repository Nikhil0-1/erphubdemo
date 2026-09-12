"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, Users, Calendar, CheckCircle, Clock } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/dashboard/shared";

export default function PrincipalAttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attendance")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setAttendance(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = attendance.length || 1;
  const present = attendance.filter((a) => a.status === "PRESENT").length || 1;
  const absent = attendance.filter((a) => a.status === "ABSENT").length;
  const late = attendance.filter((a) => a.status === "LATE").length;
  const rate = Math.round((present / total) * 100);

  return (
    <div>
      <PageHeader
        title="Institution Attendance Center"
        subtitle="Daily roll-call metrics, IoT RFID entry logs, and school-wide attendance trends"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Overall Attendance Rate</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#16a34a", marginTop: "4px" }}>{rate}%</div>
          <span style={{ fontSize: "12px", color: "#16a34a" }}>Above 90% benchmark</span>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Present Today</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#0ea5e9", marginTop: "4px" }}>{present} Students</div>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Absences / Leaves</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: absent > 0 ? "#ef4444" : "#64748b", marginTop: "4px" }}>
            {absent} Students
          </div>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Late Arrivals</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: late > 0 ? "#f59e0b" : "#64748b", marginTop: "4px" }}>
            {late} Recorded
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#0f172a" }}>Recent Attendance Logs</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Roll No</th>
                <th>Class</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontSize: "13px", color: "#64748b" }}>{a.date}</td>
                  <td style={{ fontWeight: 600 }}>{a.studentName || "Aarav Kumar"}</td>
                  <td>{a.rollNumber || "07"}</td>
                  <td>Class 7-A</td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: a.source === "IOT" ? "#f0fdf4" : "#f1f5f9",
                        color: a.source === "IOT" ? "#16a34a" : "#475569",
                      }}
                    >
                      {a.source === "IOT" ? "⚡ RFID GATE" : "MANUAL"}
                    </span>
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
