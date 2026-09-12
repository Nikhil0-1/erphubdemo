"use client";

import { Bell, Clock, BookOpen, Award, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function StudentNotificationsPage() {
  const notifications = [
    {
      id: "1",
      title: "New Homework Assigned",
      desc: "Teacher Rahul Sharma published 'Mathematics: Quadratic Equations Drill' due tomorrow.",
      time: "1 hour ago",
      type: "HOMEWORK",
      icon: BookOpen,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      id: "2",
      title: "Assessment Grade Released",
      desc: "Your score for Mathematics Unit Test 1 is 48/50 (96% • Grade A+). Excellent work!",
      time: "Yesterday",
      type: "ACADEMIC",
      icon: Award,
      color: "#16a34a",
      bg: "#dcfce7",
    },
    {
      id: "3",
      title: "Gate Check-In Confirmed",
      desc: "RFID-AARAV-001 scanned at Main Gate 1 (08:15 AM). Attendance marked PRESENT.",
      time: "Today, 08:15 AM",
      type: "ATTENDANCE",
      icon: CheckCircle2,
      color: "#0ea5e9",
      bg: "#e0f2fe",
    },
  ];

  return (
    <div style={{ maxWidth: "800px" }}>
      <PageHeader
        title="Student Notifications & Updates"
        subtitle="Homework alerts, score announcements, and school communications"
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
