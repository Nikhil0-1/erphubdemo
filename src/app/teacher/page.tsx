"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  FileText,
  Activity,
  Target,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Users,
  CheckCircle,
  Award,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
} from "lucide-react";
import {
  MetricCard,
  SectionHeader,
  PageHeader,
  SkeletonCard,
  Avatar,
} from "@/components/dashboard/shared";
import { getGreeting } from "@/lib/utils";
import { SessionUser } from "@/types";

interface ClassInfo {
  id: string;
  name: string;
  sectionName: string;
  subjectName: string;
  studentCount: number;
  attendanceRate: number;
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  const user = session?.user as unknown as SessionUser;

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/analytics/teacher");
      if (res.ok) {
        const data = await res.json();
        if (data.data?.classes) setClasses(data.data.classes);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  const priorityStudents = [
    {
      id: "student-01",
      name: "Aarav Kumar",
      class: "7-A",
      subject: "Mathematics",
      weakTopic: "Geometry → Angles",
      accuracy: 51,
      errors: 4,
      priority: "HIGH",
      reason: "Repeated error pattern in angle relationships. No targeted practice assigned yet.",
      actionLabel: "ASSIGN PRACTICE",
      growthRoomUrl: "/teacher/growth-room/student-01",
    },
    {
      id: "student-02",
      name: "Rohan Patel",
      class: "7-A",
      subject: "Mathematics",
      weakTopic: "Fractions & Decimals",
      accuracy: 62,
      errors: 2,
      priority: "MEDIUM",
      reason: "Missed 1 assignment deadline. Practice completion is pending.",
      actionLabel: "SEND REMINDER",
      growthRoomUrl: "/teacher/growth-room/student-01",
    },
    {
      id: "student-03",
      name: "Priya Singh",
      class: "7-A",
      subject: "Mathematics",
      weakTopic: "Algebraic Expressions",
      accuracy: 78,
      errors: 0,
      priority: "LOW",
      reason: "Demonstrated 12% improvement after targeted revision.",
      actionLabel: "VIEW GROWTH",
      growthRoomUrl: "/teacher/growth-room/student-01",
    },
  ];

  const tasks = [
    { label: "Mark Attendance", icon: <ClipboardCheck size={16} />, href: "/teacher/attendance", color: "#22c55e" },
    { label: "Review Assignments", icon: <FileText size={16} />, href: "/teacher/assignments", color: "#3b82f6" },
    { label: "Create Assessment", icon: <BookOpen size={16} />, href: "/teacher/academics", color: "#8b5cf6" },
    { label: "Record Development", icon: <Target size={16} />, href: "/teacher/development", color: "#f59e0b" },
    { label: "Student Concerns", icon: <AlertTriangle size={16} />, href: "/teacher/concerns", color: "#ef4444" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        greeting={`${getGreeting()}, ${user?.firstName || "Teacher"}`}
        title={`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Teacher Growth Dashboard"}
        subtitle={user?.schoolName ? `${user.schoolName} · Mathematics Teacher` : "Student Growth & Mentorship Dashboard"}
      >
        <div className="responsive-wrap-row">
          <button className="btn btn-primary" onClick={() => router.push("/teacher/growth-room/student-01")}>
            <HeartHandshake size={16} /> Open Growth Room
          </button>
          <button className="btn btn-secondary" onClick={() => router.push("/teacher/awards")}>
            <Award size={16} /> Evidence Awards
          </button>
        </div>
      </PageHeader>

      {/* SECTION 14: WHO NEEDS ME TODAY? (STUDENTS NEEDING MY ATTENTION) */}
      <div>
        <SectionHeader
          title="Who Needs Me Today?"
          subtitle="Priority feed of students requiring academic support, practice assignment, or intervention follow-up"
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {priorityStudents.map((st) => {
            const isHigh = st.priority === "HIGH";
            const isMed = st.priority === "MEDIUM";
            const borderCol = isHigh ? "#fecaca" : isMed ? "#fde68a" : "#bbf7d0";
            const bgCol = isHigh ? "#fef2f2" : isMed ? "#fffbeb" : "#f0fdf4";
            const badgeBg = isHigh ? "#ef4444" : isMed ? "#f59e0b" : "#10b981";

            return (
              <div
                key={st.id}
                className="card"
                style={{
                  padding: "20px",
                  background: bgCol,
                  border: `1px solid ${borderCol}`,
                  borderRadius: "14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Avatar name={st.name} size={36} />
                      <div>
                        <strong style={{ fontSize: "15px", color: "#0f172a" }}>{st.name}</strong>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>Class {st.class} · {st.subject}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 800, padding: "3px 8px", background: badgeBg, color: "white", borderRadius: "9999px" }}>
                      {st.priority} PRIORITY
                    </span>
                  </div>

                  <div style={{ padding: "10px 12px", background: "white", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                      <span>{st.weakTopic}</span>
                      <span style={{ color: isHigh ? "#ef4444" : "#10b981" }}>{st.accuracy}% accuracy</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#475569", marginTop: "4px", lineHeight: 1.4 }}>{st.reason}</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => router.push(st.growthRoomUrl)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, background: isHigh ? "#dc2626" : "#0ea5e9", borderColor: isHigh ? "#dc2626" : "#0ea5e9" }}
                  >
                    {st.actionLabel}
                  </button>
                  <button
                    onClick={() => router.push(st.growthRoomUrl)}
                    className="btn btn-secondary btn-sm"
                  >
                    Growth Room
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Classes */}
      <div>
        <SectionHeader
          title="My Assigned Classes"
          action={
            <button className="btn btn-secondary btn-sm" onClick={() => router.push("/teacher/classes")}>
              View All <ChevronRight size={14} />
            </button>
          }
        />
        <div className="responsive-card-grid" style={{ marginBottom: "32px" }}>
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : classes.length > 0 ? (
            classes.map((cls, idx) => (
              <div
                key={cls.id}
                className="card card-interactive animate-fade-in"
                style={{ padding: "20px", opacity: 1 }}
                onClick={() => router.push(`/teacher/classes/${cls.id}`)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: idx === 0 ? "rgba(59,130,246,0.12)" : "rgba(139,92,246,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: idx === 0 ? "#3b82f6" : "#8b5cf6",
                    }}
                  >
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {cls.name}-{cls.sectionName}
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{cls.subjectName}</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ padding: "10px", background: "var(--surface-bg)", borderRadius: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <Users size={14} color="var(--text-tertiary)" />
                      <span style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 500 }}>Students</span>
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700 }}>{cls.studentCount}</div>
                  </div>
                  <div style={{ padding: "10px", background: "var(--surface-bg)", borderRadius: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <ClipboardCheck size={14} color="var(--text-tertiary)" />
                      <span style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 500 }}>Attendance</span>
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700 }}>{cls.attendanceRate}%</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ padding: "40px 24px", textAlign: "center", gridColumn: "1 / -1" }}>
              <BookOpen size={36} color="var(--text-tertiary)" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>No Classes Assigned</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Contact your principal to get class assignments.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div>
        <SectionHeader title="Teacher Operations" />
        <div className="card" style={{ overflow: "hidden" }}>
          {tasks.map((task, idx) => (
            <button
              key={idx}
              onClick={() => router.push(task.href)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 20px",
                width: "100%",
                border: "none",
                borderBottom: idx < tasks.length - 1 ? "1px solid var(--border-default)" : "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ color: task.color }}>{task.icon}</div>
              <span style={{ fontSize: "14px", fontWeight: 500, flex: 1 }}>{task.label}</span>
              <ChevronRight size={16} color="var(--text-tertiary)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
