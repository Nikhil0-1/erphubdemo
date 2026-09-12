"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardCheck,
  Activity,
  Bus,
  Sparkles,
  FolderOpen,
  Target,
  ChevronRight,
  Award,
  TrendingUp,
  GraduationCap,
  HeartHandshake,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import {
  MetricCard,
  SectionHeader,
  PageHeader,
  Avatar,
  SkeletonCard,
} from "@/components/dashboard/shared";
import { getGreeting } from "@/lib/utils";
import { SessionUser } from "@/types";

export default function ParentDashboard() {
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
        greeting={`${getGreeting()}, ${user?.firstName || "Raj"}`}
        title="How is Aarav Growing Today?"
        subtitle={user?.schoolName ? `${user.schoolName} · Green Valley School` : "Green Valley School · Class 7-A"}
      >
        <div className="responsive-wrap-row">
          <button className="btn btn-primary" onClick={() => router.push("/parent/growth-room")}>
            <HeartHandshake size={16} /> Open Student Growth Room
          </button>
        </div>
      </PageHeader>

      {/* PARENT HIGHLIGHT BANNER: MEANINGFUL POSITIVE UPDATES */}
      <div
        className="card"
        style={{
          padding: "24px",
          background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
          color: "white",
          borderRadius: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>
              Verified Child Growth Update
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "6px 0" }}>
              Aarav's Geometry performance improved from 51% to 68%!
            </h2>
            <p style={{ fontSize: "13px", opacity: 0.95, maxWidth: "600px", lineHeight: 1.5 }}>
              Following Teacher Rahul's targeted practice plan and Aarav's mistake review at home, Geometry topic accuracy showed a verified 17 percentage point increase.
            </p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => router.push("/parent/growth-room")}
            style={{ background: "white", color: "#0284c7", border: "none", fontWeight: 700 }}
          >
            View Growth Room <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* CORE HOME SUPPORT CARDS */}
      <div className="responsive-two-col">
        {/* What Aarav is Learning & Struggling With */}
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <BookOpen size={18} color="#0ea5e9" /> Current Learning Focus
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0ea5e9" }}>CURRENT FOCUS TOPIC</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>Mathematics: Geometry → Angles</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                Status: Practice set assigned by Teacher Rahul.
              </div>
            </div>

            <div style={{ padding: "12px", background: "#f0fdf4", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>HOW TO HELP AT HOME</div>
              <div style={{ fontSize: "13px", color: "#14532d", marginTop: "2px" }}>
                Encourage Aarav to explain how supplementary angles equal 180° for 10 minutes after dinner tonight.
              </div>
            </div>
          </div>
        </div>

        {/* Recent Teacher Guidance & Achievements */}
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={18} color="#f59e0b" /> Latest Recognitions & Updates
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "12px", background: "#fffbeb", borderRadius: "10px", border: "1px solid #fde68a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#92400e" }}>Award: Most Improved Learner</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#b45309" }}>Approved</span>
              </div>
              <p style={{ fontSize: "12px", color: "#78350f", marginTop: "4px" }}>
                Awarded by Teacher Rahul Sharma for verified growth in Geometry remediation.
              </p>
            </div>

            <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>TEACHER FEEDBACK</div>
              <div style={{ fontSize: "13px", color: "#334155", marginTop: "2px" }}>
                "Aarav shows great curiosity in practical STEM activities. Continued reinforcement in geometry will prepare him well."
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACCESS PARENT PORTAL LINKS */}
      <div>
        <SectionHeader title="Parent Portal Navigation" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[
            { title: "Growth Room", desc: "Collaborate with Teacher & Student", icon: <HeartHandshake size={20} />, href: "/parent/growth-room", color: "#0ea5e9", bg: "#e0f2fe" },
            { title: "Academics", desc: "Test scores & detailed subject reports", icon: <BookOpen size={20} />, href: "/parent/academics", color: "#3b82f6", bg: "#eff6ff" },
            { title: "Attendance", desc: "Daily attendance logs & gate RFID", icon: <ClipboardCheck size={20} />, href: "/parent/attendance", color: "#10b981", bg: "#ecfdf5" },
            { title: "Development", desc: "Skills & holistic observations", icon: <Target size={20} />, href: "/parent/development", color: "#f59e0b", bg: "#fef3c7" },
            { title: "Digital Portfolio", desc: "Certificates, projects & achievements", icon: <FolderOpen size={20} />, href: "/parent/portfolio", color: "#8b5cf6", bg: "#f5f3ff" },
            { title: "School Fees", desc: "Invoices, payment receipts & dues", icon: <Award size={20} />, href: "/parent/fees", color: "#ec4899", bg: "#fce7f3" },
            { title: "Bus Transport", desc: "Live driver GPS route tracking", icon: <Bus size={20} />, href: "/parent/transport", color: "#f97316", bg: "#ffedd5" },
            { title: "Growth Assistant", desc: "Ask questions about child progress", icon: <Sparkles size={20} />, href: "/parent/assistant", color: "#6366f1", bg: "#e0e7ff" },
          ].map((item, i) => (
            <div
              key={i}
              className="card card-interactive"
              style={{ padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              onClick={() => router.push(item.href)}
            >
              <div>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: item.bg, color: item.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                  {item.icon}
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{item.title}</h4>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 10px", lineHeight: 1.4 }}>{item.desc}</p>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: item.color, display: "flex", alignItems: "center", gap: "4px" }}>
                Open <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
