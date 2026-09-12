"use client";

import { Bell, CheckCircle, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function PrincipalNotificationsPage() {
  const notifications = [
    {
      id: "1",
      title: "IoT RFID Scan Logged",
      desc: "Aarav Kumar checked into Class 7-A at 08:15 AM.",
      time: "10 mins ago",
      type: "ATTENDANCE",
    },
    {
      id: "2",
      title: "Assessment Marks Entered",
      desc: "Teacher Rahul Sharma recorded marks for Mathematics Unit Test 1.",
      time: "1 hour ago",
      type: "ACADEMIC",
    },
    {
      id: "3",
      title: "Bus Transit Started",
      desc: "Driver Rajesh Kumar initiated Route 3 on BUS-07.",
      time: "2 hours ago",
      type: "TRANSPORT",
    },
  ];

  return (
    <div style={{ maxWidth: "800px" }}>
      <PageHeader title="School Notifications" subtitle="Real-time alerts and campus announcements" />

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            className="card"
            style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#eff6ff",
                color: "#0ea5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bell size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{n.title}</h4>
                <span style={{ fontSize: "12px", color: "#64748b" }}>{n.time}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
