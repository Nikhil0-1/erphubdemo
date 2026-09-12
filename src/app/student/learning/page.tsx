"use client";

import { useState } from "react";
import { BookOpen, Clock, Calendar, CheckCircle2, ChevronRight, FileText, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";
import { useRouter } from "next/navigation";

export default function StudentLearningPage() {
  const router = useRouter();

  const schedule = [
    { period: "Period 1", time: "08:30 - 09:25 AM", subject: "Mathematics", room: "Room 204", teacher: "Rahul Sharma", topic: "Quadratic Expressions & Factoring" },
    { period: "Period 2", time: "09:30 - 10:25 AM", subject: "Physics & Robotics", room: "STEM Lab 1", teacher: "Pooja Verma", topic: "Kinematics & Microcontrollers" },
    { period: "Period 3", time: "10:45 - 11:40 AM", subject: "English Literature", room: "Room 108", teacher: "Sunita Kapoor", topic: "Analytical Essay Writing" },
    { period: "Period 4", time: "11:45 - 12:40 PM", subject: "Social Sciences", room: "Room 202", teacher: "Amit Patel", topic: "Civic Governance & Constitution" },
  ];

  const subjects = [
    { name: "Mathematics", progress: 85, teacher: "Rahul Sharma", grade: "A+" },
    { name: "Science & Robotics", progress: 90, teacher: "Pooja Verma", grade: "A+" },
    { name: "English Literature", progress: 80, teacher: "Sunita Kapoor", grade: "A" },
    { name: "Social Sciences", progress: 75, teacher: "Amit Patel", grade: "B+" },
  ];

  return (
    <div>
      <PageHeader
        title="My Learning Schedule & Courses"
        subtitle="Today's timetable, syllabus milestones, and learning modules for Class 7-A"
      >
        <button
          onClick={() => router.push("/student/assistant")}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Sparkles size={16} /> AI Study Tutor
        </button>
      </PageHeader>

      {/* TODAY'S TIMETABLE */}
      <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Clock size={18} color="#2563eb" /> Today&apos;s Class Schedule
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {schedule.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: "8px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    background: "#eff6ff",
                    color: "#2563eb",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {item.period}
                </div>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{item.subject}</h4>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                    Topic: {item.topic} • {item.room}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{item.time}</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{item.teacher}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ENROLLED SUBJECTS PROGRESS */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <BookOpen size={18} color="#2563eb" /> Subject Mastery & Syllabus Completion
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {subjects.map((sub, idx) => (
            <div key={idx} style={{ padding: "16px", borderRadius: "8px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{sub.name}</h4>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "10px",
                    background: "#dcfce7",
                    color: "#15803d",
                  }}
                >
                  {sub.grade}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>Instructor: {sub.teacher}</div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                  <span>Syllabus Covered</span>
                  <span>{sub.progress}%</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${sub.progress}%`, height: "100%", background: "#2563eb", borderRadius: "4px" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
