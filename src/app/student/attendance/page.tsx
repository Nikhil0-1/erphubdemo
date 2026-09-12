"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, Calendar, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/attendance")
      .then((r) => r.json())
      .then((res) => {
        if (res.data) setAttendance(res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <PageHeader
        title="My Attendance & Punctuality Record"
        subtitle="RFID campus gate checkpoints, morning roll-call verification, and attendance percentage"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Term Attendance
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#16a34a", marginTop: "4px" }}>
            96.0%
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Minimum requirement: 75%</div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Consecutive Days Present
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#2563eb", marginTop: "4px" }}>
            24 Days
          </div>
          <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "4px" }}>Perfect streak this month! 🔥</div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Smart ID Badge
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#8b5cf6", marginTop: "4px" }}>
            RFID Active
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Badge ID: RFID-AARAV-001</div>
        </div>
      </div>

      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
          Campus Arrival Timings
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
                    background: att.status === "PRESENT" ? "#dcfce7" : "#fef3c7",
                    color: att.status === "PRESENT" ? "#15803d" : "#b45309",
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
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Check-In: {att.checkInTime || "08:15 AM"} • Gate 1 RFID Terminal
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "12px",
                  background: att.status === "PRESENT" ? "#dcfce7" : "#fef3c7",
                  color: att.status === "PRESENT" ? "#15803d" : "#b45309",
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
