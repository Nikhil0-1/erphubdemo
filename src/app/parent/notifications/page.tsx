"use client";

import { Bell, Clock, Bus, ClipboardCheck, BookOpen, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function ParentNotificationsPage() {
  const notifications = [
    {
      id: "1",
      title: "Bus Transit Approaching",
      desc: "BUS-07 on Route 3 is 6 minutes away from your stop (Greenwood Heights).",
      time: "5 mins ago",
      type: "TRANSPORT",
      icon: Bus,
      color: "#2563eb",
      bg: "#dbeafe",
    },
    {
      id: "2",
      title: "School Gate Check-In Confirmed",
      desc: "Aarav Kumar safely tapped into campus via Gate 1 RFID reader at 08:15 AM.",
      time: "Today, 08:16 AM",
      type: "ATTENDANCE",
      icon: ClipboardCheck,
      color: "#16a34a",
      bg: "#dcfce7",
    },
    {
      id: "3",
      title: "New Assessment Marks Published",
      desc: "Teacher Rahul Sharma recorded marks for Mathematics Unit Test 1: Aarav scored 48/50 (96%).",
      time: "Yesterday",
      type: "ACADEMIC",
      icon: BookOpen,
      color: "#8b5cf6",
      bg: "#ede9fe",
    },
    {
      id: "4",
      title: "Term Fee Receipt Generated",
      desc: "Official receipt TXN-2026-0811 for Term 2 has been generated and filed in your portal.",
      time: "3 days ago",
      type: "FEES",
      icon: Clock,
      color: "#f59e0b",
      bg: "#fef3c7",
    },
  ];

  return (
    <div style={{ maxWidth: "800px" }}>
      <PageHeader
        title="Parent Alerts & Campus Notifications"
        subtitle="Live transit arrivals, attendance confirmations, and academic publications"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
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
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: n.bg,
                  color: n.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{n.title}</h4>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{n.time}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569", marginTop: "3px" }}>{n.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
