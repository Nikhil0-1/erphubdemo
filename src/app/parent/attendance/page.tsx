"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function ParentAttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attendance")
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setAttendance(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = attendance.length || 20;
  const present = attendance.filter((a) => a.status === "PRESENT" || a.status === "LATE").length || 19;
  const rate = Math.round((present / total) * 100);

  return (
    <div>
      <PageHeader
        title="Student Attendance & Gate Entry"
        subtitle="Automated RFID gate checkpoints, daily roll-call, and punctual arrival logs"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Current Term Attendance
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#16a34a", marginTop: "4px" }}>
            {rate}%
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
            {present} of {total} instructional days attended
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Punctuality Score
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#2563eb", marginTop: "4px" }}>
            98.5%
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Consistent on-time campus arrival</div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            RFID Badge Status
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#8b5cf6", marginTop: "4px" }}>
            Active
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Badge: RFID-AARAV-001</div>
        </div>
      </div>

      {/* RECENT ATTENDANCE LOG */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
          Daily Attendance Records & Gate Check-Ins
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {attendance.map((att) => (
            <div
              key={att.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: att.status === "PRESENT" ? "#dcfce7" : att.status === "LATE" ? "#fef3c7" : "#fee2e2",
                    color: att.status === "PRESENT" ? "#15803d" : att.status === "LATE" ? "#b45309" : "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ClipboardCheck size={18} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                    {att.date || new Date().toISOString().split("T")[0]}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                    Campus Entry: {att.checkInTime || "08:15 AM"} • Gate 1 RFID Terminal
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: "14px",
                  background: att.status === "PRESENT" ? "#dcfce7" : att.status === "LATE" ? "#fef3c7" : "#fee2e2",
                  color: att.status === "PRESENT" ? "#15803d" : att.status === "LATE" ? "#b45309" : "#dc2626",
                }}
              >
                {att.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
