"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  GraduationCap,
  Users,
  ClipboardCheck,
  UserPlus,
  BookOpen,
  Bus,
  Cpu,
  Sparkles,
  FileText,
  AlertCircle,
  Plus,
  ArrowRight,
  UserCircle,
  Activity,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import {
  MetricCard,
  SectionHeader,
  PageHeader,
  QuickAction,
  SkeletonCard,
  Avatar,
} from "@/components/dashboard/shared";
import { getGreeting } from "@/lib/utils";
import { SessionUser } from "@/types";

export default function PrincipalDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 1,
    teachers: 1,
    presentToday: 1,
    absentToday: 0,
    activeBuses: 1,
    iotDevices: 2,
    pendingActions: 1,
  });

  const user = session?.user as unknown as SessionUser;

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/analytics/school");
      if (res.ok) {
        const data = await res.json();
        if (data.data) setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        greeting={`${getGreeting()}, ${user?.firstName || "Dr. Anjali Sharma"}`}
        title={user?.schoolName || "Green Valley International School"}
        subtitle="Institutional Leadership & Student Growth Dashboard · 2026–27"
      />

      {/* Metrics */}
      <div className="responsive-metric-grid">
        {loading ? (
          Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <MetricCard label="Students" value={stats.students} icon={<GraduationCap size={20} />} iconBg="#eff6ff" iconColor="#3b82f6" onClick={() => router.push("/principal/students")} />
            <MetricCard label="Teachers" value={stats.teachers} icon={<Users size={20} />} iconBg="#ecfdf5" iconColor="#10b981" onClick={() => router.push("/principal/people")} />
            <MetricCard label="Present Today" value={stats.presentToday} icon={<ClipboardCheck size={20} />} iconBg="#f0fdf4" iconColor="#22c55e" onClick={() => router.push("/principal/attendance")} />
            <MetricCard label="Absent Today" value={stats.absentToday} icon={<AlertCircle size={20} />} iconBg="#fef2f2" iconColor="#ef4444" onClick={() => router.push("/principal/attendance")} />
            <MetricCard label="Active Buses" value={stats.activeBuses} icon={<Bus size={20} />} iconBg="#fff7ed" iconColor="#f97316" onClick={() => router.push("/principal/transport")} />
            <MetricCard label="IoT Devices" value={stats.iotDevices} icon={<Cpu size={20} />} iconBg="#fdf2f8" iconColor="#ec4899" onClick={() => router.push("/principal/iot")} />
            <MetricCard label="Pending Actions" value={stats.pendingActions} icon={<Activity size={20} />} iconBg="#fef3c7" iconColor="#f59e0b" />
          </>
        )}
      </div>

      {/* SECTIONS 20 & 25: PRINCIPAL OVERSIGHT — TEACHER ACCOUNTABILITY & SUPPORT GAP ALERTS */}
      <div>
        <SectionHeader
          title="Academic Support & Teacher Accountability Oversight"
          subtitle="Monitors whether required student academic interventions and learning plans are recorded"
        />

        <div className="responsive-two-col">
          {/* Class-wise Academic Support Gap Alert */}
          <div className="card" style={{ padding: "24px", background: "#fef2f2", border: "1px solid #fecaca" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <ShieldAlert size={22} color="#dc2626" />
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#991b1b" }}>Academic Support Gap Alert</h3>
            </div>
            <p style={{ fontSize: "13px", color: "#7f1d1d", lineHeight: 1.5, marginBottom: "16px" }}>
              Class 7-A (Mathematics): 1 student diagnosed with repeated weakness in Geometry → Angles (51% accuracy). Targeted remediation assigned by Teacher Rahul Sharma and progress is active.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn btn-primary btn-sm"
                style={{ background: "#dc2626", borderColor: "#dc2626" }}
                onClick={() => router.push("/teacher/growth-room/student-01")}
              >
                Inspect Student 360°
              </button>
            </div>
          </div>

          {/* At-Risk Classes & Class-Wise Drilldown */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
              Class 7-A Growth Overview
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "8px" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Academic Avg</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#0ea5e9" }}>76%</div>
              </div>
              <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "8px" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Attendance</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#16a34a" }}>94%</div>
              </div>
              <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "8px" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Needing Attention</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#ef4444" }}>1 Student</div>
              </div>
              <div style={{ padding: "10px", background: "#f8fafc", borderRadius: "8px" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Improving Students</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#16a34a" }}>18 Students</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <SectionHeader title="Leadership Quick Actions" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "12px",
          }}
        >
          <QuickAction label="Add Teacher" icon={<UserPlus size={20} />} onClick={() => router.push("/principal/people?action=add-teacher")} color="#3b82f6" bg="#eff6ff" />
          <QuickAction label="Add Student" icon={<GraduationCap size={20} />} onClick={() => router.push("/principal/students?action=add")} color="#8b5cf6" bg="#f5f3ff" />
          <QuickAction label="Add Parent" icon={<UserCircle size={20} />} onClick={() => router.push("/principal/people?action=add-parent")} color="#f97316" bg="#fff7ed" />
          <QuickAction label="Attendance" icon={<ClipboardCheck size={20} />} onClick={() => router.push("/principal/attendance")} color="#22c55e" bg="#f0fdf4" />
          <QuickAction label="Transport" icon={<Bus size={20} />} onClick={() => router.push("/principal/transport")} color="#0ea5e9" bg="#f0f9ff" />
          <QuickAction label="AI Insights" icon={<Sparkles size={20} />} onClick={() => router.push("/principal/assistant")} color="#8b5cf6" bg="#f5f3ff" />
          <QuickAction label="Reports" icon={<FileText size={20} />} onClick={() => router.push("/principal/reports")} color="#64748b" bg="#f1f5f9" />
          <QuickAction label="IoT" icon={<Cpu size={20} />} onClick={() => router.push("/principal/iot")} color="#ec4899" bg="#fdf2f8" />
        </div>
      </div>
    </div>
  );
}
