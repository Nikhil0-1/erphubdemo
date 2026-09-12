"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  FileText,
  Activity,
  Target,
  FolderOpen,
  Sparkles,
  Award,
  ChevronRight,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  History,
  Navigation,
  ArrowRight,
  HeartHandshake,
  CheckCircle,
} from "lucide-react";
import {
  MetricCard,
  SectionHeader,
  PageHeader,
  SkeletonCard,
} from "@/components/dashboard/shared";
import { getGreeting } from "@/lib/utils";
import { SessionUser } from "@/types";

export default function StudentDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const user = session?.user as unknown as SessionUser;

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        greeting={`Hi ${user?.firstName || "Aarav"} 👋`}
        title="My Connected Growth Journey"
        subtitle={user?.schoolName ? `${user.schoolName} · Class 7-A` : "Green Valley School · Class 7-A"}
      >
        <div className="responsive-wrap-row">
          <button className="btn btn-primary" onClick={() => router.push("/student/growth-room")}>
            <HeartHandshake size={16} /> Open Growth Room
          </button>
          <button className="btn btn-secondary" onClick={() => router.push("/student/awards")}>
            <Award size={16} /> Credit Points & Awards
          </button>
        </div>
      </PageHeader>

      {/* CORE MOTIVATING GROWTH SUMMARY ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div
          className="card card-interactive"
          style={{ padding: "20px", background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)", color: "white" }}
          onClick={() => router.push("/student/growth-room")}
        >
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>Today's Learning Plan</div>
          <div style={{ fontSize: "24px", fontWeight: 800, margin: "4px 0" }}>3 Active Tasks</div>
          <div style={{ fontSize: "12px", opacity: 0.9, display: "flex", alignItems: "center", gap: "4px" }}>
            Geometry Revision + 10 Practice <ChevronRight size={14} />
          </div>
        </div>

        <div
          className="card card-interactive"
          style={{ padding: "20px", background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", color: "white" }}
          onClick={() => router.push("/student/weak-topics")}
        >
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>Needs Attention</div>
          <div style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0" }}>Geometry — Angles</div>
          <div style={{ fontSize: "12px", opacity: 0.9, display: "flex", alignItems: "center", gap: "4px" }}>
            Accuracy: 51% (4 repeated errors) <ChevronRight size={14} />
          </div>
        </div>

        <div
          className="card card-interactive"
          style={{ padding: "20px", background: "linear-gradient(135deg, #059669 0%, #047857 100%)", color: "white" }}
          onClick={() => router.push("/student/growth")}
        >
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>Verified Growth</div>
          <div style={{ fontSize: "24px", fontWeight: 800, margin: "4px 0" }}>51% → 68%</div>
          <div style={{ fontSize: "12px", opacity: 0.9, display: "flex", alignItems: "center", gap: "4px" }}>
            +17 Percentage Points Gained <ChevronRight size={14} />
          </div>
        </div>

        <div
          className="card card-interactive"
          style={{ padding: "20px", background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", color: "white" }}
          onClick={() => router.push("/student/awards")}
        >
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>Credit Points & Rank</div>
          <div style={{ fontSize: "24px", fontWeight: 800, margin: "4px 0" }}>185 Points</div>
          <div style={{ fontSize: "12px", opacity: 0.9, display: "flex", alignItems: "center", gap: "4px" }}>
            Silver Growth Champion <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* TODAY'S SCHEDULE & PRACTICE ZONE DIRECT ACCESS */}
      <div className="responsive-two-col">
        {/* Today's Schedule */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Today's Smart Study Plan</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => router.push("/student/study-plan")}>
              Full Planner <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { time: "4:00 PM", task: "Geometry Concept Revision (Angles)", duration: "20 mins", done: true },
              { time: "4:30 PM", task: "10 Adaptive Practice Questions", duration: "25 mins", done: true },
              { time: "5:00 PM", task: "Correct 1 Mistake in Mistake Book", duration: "15 mins", done: false },
              { time: "5:20 PM", task: "Short Equation Worksheet", duration: "20 mins", done: false },
            ].map((st, i) => (
              <div key={i} style={{ padding: "12px 14px", background: st.done ? "#f0fdf4" : "#f8fafc", borderRadius: "8px", border: `1px solid ${st.done ? "#bbf7d0" : "#e2e8f0"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle size={16} color={st.done ? "#16a34a" : "#94a3b8"} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "13px", color: "#0f172a" }}>{st.task}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{st.time} · {st.duration}</div>
                  </div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: st.done ? "#16a34a" : "#64748b" }}>
                  {st.done ? "COMPLETED" : "UPCOMING"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mistake Book & Practice Zone Quick Launcher */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Practice Zone & Mistake Book</h3>
              <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 700, background: "#fef2f2", padding: "2px 8px", borderRadius: "9999px" }}>
                3 Unresolved Mistakes
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, marginBottom: "16px" }}>
              Turn wrong answers into verified learning data. AI explains your mistakes step-by-step so you can try again with confidence.
            </p>
            <div style={{ padding: "14px", background: "#fef2f2", borderRadius: "10px", border: "1px solid #fecaca", marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626" }}>Recent Mistake in Geometry:</div>
              <div style={{ fontSize: "13px", color: "#450a0a", marginTop: "2px" }}>
                "In a linear pair, if angle A is 65°, what is angle B?" (Your answer: 25° · Correct: 115°)
              </div>
            </div>
          </div>

          <div className="responsive-wrap-row" style={{ marginTop: "16px" }}>
            <button className="btn btn-primary" style={{ flex: 1, minWidth: "140px" }} onClick={() => router.push("/student/mistakes")}>
              <History size={16} /> Open Mistake Book
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, minWidth: "140px" }} onClick={() => router.push("/student/practice")}>
              <BookOpen size={16} /> Start Practice
            </button>
          </div>
        </div>
      </div>

      {/* CORE LEARNING MODULES GRID */}
      <div>
        <SectionHeader title="My Connected Learning Modules" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {[
            { title: "Practice Zone", desc: "Adaptive questions & difficulty levels", icon: <BookOpen size={20} />, href: "/student/practice", color: "#0284c7", bg: "#e0f2fe" },
            { title: "Mistake Book", desc: "AI explanations & Try Again loop", icon: <History size={20} />, href: "/student/mistakes", color: "#dc2626", bg: "#fef2f2" },
            { title: "Weak Topics", desc: "Diagnosed areas & root cause analysis", icon: <AlertTriangle size={20} />, href: "/student/weak-topics", color: "#d97706", bg: "#fffbeb" },
            { title: "Learning Path", desc: "Personal roadmap & milestones", icon: <Navigation size={20} />, href: "/student/learning-path", color: "#16a34a", bg: "#f0fdf4" },
            { title: "Study Planner", desc: "Daily & weekly organized schedule", icon: <Calendar size={20} />, href: "/student/study-plan", color: "#9333ea", bg: "#faf5ff" },
            { title: "Skill Passport", desc: "Validated badges & STEM achievements", icon: <Award size={20} />, href: "/student/skills", color: "#ca8a04", bg: "#fefce8" },
          ].map((mod, i) => (
            <div
              key={i}
              className="card card-interactive"
              style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              onClick={() => router.push(mod.href)}
            >
              <div>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: mod.bg, color: mod.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  {mod.icon}
                </div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{mod.title}</h4>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 12px", lineHeight: 1.4 }}>{mod.desc}</p>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: mod.color, display: "flex", alignItems: "center", gap: "4px" }}>
                Open Module <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
