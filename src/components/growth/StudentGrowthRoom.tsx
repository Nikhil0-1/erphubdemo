"use client";

import { useState } from "react";
import {
  Target,
  Sparkles,
  Award,
  Send,
  CheckCircle,
  AlertTriangle,
  User,
  GraduationCap,
  HeartHandshake,
  TrendingUp,
  Clock,
  Check,
  ShieldAlert,
  FileText,
  BookOpen,
} from "lucide-react";
import { Avatar, StatusBadge } from "@/components/dashboard/shared";

interface Props {
  studentId: string;
  userRole: "TEACHER" | "STUDENT" | "PARENT" | "PRINCIPAL" | string;
  initialRoomData?: any;
}

export default function StudentGrowthRoomComponent({ studentId, userRole, initialRoomData }: Props) {
  const [room, setRoom] = useState(initialRoomData || {
    id: `gr-${studentId}`,
    studentName: "Aarav Kumar",
    className: "Class 7-A",
    teacherName: "Rahul Sharma",
    parentName: "Raj Kumar",
    currentFocusTopic: "Geometry → Angles & Relationships",
    currentAccuracy: 51,
    growthDelta: 17,
    status: "ACTIVE",
    messages: [
      {
        id: "msg-01",
        senderName: "Rahul Sharma (Teacher)",
        senderRole: "TEACHER",
        text: "Aarav needs targeted practice in Geometry → Angles. I have assigned 10 adaptive practice questions and a revision task.",
        category: "INTERVENTION",
        timestamp: "Yesterday, 4:30 PM",
      },
      {
        id: "msg-02",
        senderName: "Raj Kumar (Parent)",
        senderRole: "PARENT",
        text: "Thank you Mr. Sharma. I have reviewed the plan and will ensure Aarav completes his practice schedule at home today.",
        category: "UPDATE",
        timestamp: "Yesterday, 6:00 PM",
      },
      {
        id: "msg-03",
        senderName: "Aarav Kumar (Student)",
        senderRole: "STUDENT",
        text: "Completed practice set! Reviewed my angle sum mistakes in the Mistake Book and scored 80% on reattempt.",
        category: "MILESTONE",
        timestamp: "Today, 5:15 PM",
      },
    ],
    milestones: [
      {
        id: "ms-01",
        title: "Geometry Remediation Completed",
        description: "Accuracy improved from 51% to 68% following targeted practice & teacher explanation",
        date: "2026-09-12",
        pointsEarned: 50,
      },
    ],
  });

  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/growth-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          text: newMsg,
          category: userRole === "TEACHER" ? "INTERVENTION" : userRole === "PARENT" ? "UPDATE" : "MILESTONE",
        }),
      });

      const data = await res.json();
      if (data.data) {
        setRoom((prev: any) => ({
          ...prev,
          messages: [...prev.messages, data.data],
        }));
        setNewMsg("");
      }
    } catch {
      // Local fallback
      setRoom((prev: any) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `msg-${Date.now()}`,
            senderName: `${userRole === "TEACHER" ? "Rahul Sharma (Teacher)" : userRole === "PARENT" ? "Raj Kumar (Parent)" : "Aarav Kumar (Student)"}`,
            senderRole: userRole,
            text: newMsg,
            category: "UPDATE",
            timestamp: "Just now",
          },
        ],
      }));
      setNewMsg("");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignActionPlan = async () => {
    setLoading(true);
    try {
      await fetch("/api/growth/action-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ASSIGN",
          planId: "ap-demo",
          studentId,
          weakTopic: "Geometry → Angles",
        }),
      });
      setAssignedSuccess(true);
      setTimeout(() => setAssignedSuccess(false), 3000);
    } catch {
      setAssignedSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* GROWTH ROOM HERO HEADER */}
      <div
        className="card"
        style={{
          padding: "24px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, padding: "3px 10px", background: "rgba(14,165,233,0.2)", color: "#38bdf8", borderRadius: "9999px", border: "1px solid rgba(56,189,248,0.3)" }}>
                STUDENT GROWTH ROOM
              </span>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                Connected Mentorship Hub
              </span>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, marginTop: "8px", color: "#f8fafc" }}>
              {room.studentName}'s Development Journey
            </h1>
            <p style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px" }}>
              Class: <strong>{room.className}</strong> · Focus: <strong style={{ color: "#38bdf8" }}>{room.currentFocusTopic}</strong>
            </p>
          </div>

          {/* Core Growth Metric Pills */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center", flex: "1", minWidth: "120px" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#f59e0b" }}>{room.currentAccuracy}%</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Current Diagnostic</div>
            </div>
            <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center", flex: "1", minWidth: "120px" }}>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#4ade80" }}>+{room.growthDelta}%</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Verified Improvement</div>
            </div>
          </div>
        </div>

        {/* Connected Trio Badges */}
        <div style={{ display: "flex", gap: "16px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            <GraduationCap size={16} color="#38bdf8" />
            <span>Student: <strong>{room.studentName}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            <User size={16} color="#a855f7" />
            <span>Teacher Mentor: <strong>{room.teacherName}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            <HeartHandshake size={16} color="#4ade80" />
            <span>Parent Partner: <strong>{room.parentName}</strong></span>
          </div>
        </div>
      </div>

      {/* AI DIAGNOSTIC & RECOMMENDED ACTION PLAN BANNER */}
      <div
        className="card"
        style={{
          padding: "20px",
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          border: "1px solid #bbf7d0",
          borderRadius: "12px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#16a34a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#15803d", textTransform: "uppercase" }}>
                AI Student Growth Copilot Diagnosis
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#14532d", margin: "2px 0 4px" }}>
                Targeted Remediation Required: Geometry → Angles
              </h3>
              <p style={{ fontSize: "13px", color: "#166534", lineHeight: 1.5 }}>
                Multi-signal evidence (3 test papers, 8 practice attempts) indicates repeated calculation errors in alternate interior angles.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {userRole === "TEACHER" && (
              <button
                className="btn btn-primary"
                onClick={handleAssignActionPlan}
                disabled={loading}
                style={{ background: "#16a34a", borderColor: "#16a34a", color: "white" }}
              >
                {assignedSuccess ? <Check size={16} /> : <BookOpen size={16} />}
                {assignedSuccess ? "Plan Assigned!" : "Assign Recommended Plan"}
              </button>
            )}
          </div>
        </div>

        {/* Action Plan Component Checklist */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #a7f3d0" }}>
          {[
            { label: "10 Adaptive Practice Questions", done: true },
            { label: "5 Concept Revision Tasks", done: true },
            { label: "1 Short Equation Worksheet", done: false },
            { label: "1 Mini Mastery Reassessment", done: false },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#14532d" }}>
              <CheckCircle size={14} color={item.done ? "#16a34a" : "#94a3b8"} />
              <span style={{ fontWeight: item.done ? 600 : 400 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: DISCUSSION FEED + GROWTH MILESTONES */}
      <div className="responsive-card-grid" style={{ gap: "24px" }}>
        {/* LEFT: CONTINUOUS GROWTH DISCUSSION THREAD */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <HeartHandshake size={18} color="#0ea5e9" /> Growth Collaboration Feed
          </h3>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
            {room.messages.map((msg: any) => {
              const isTeacher = msg.senderRole === "TEACHER";
              const isParent = msg.senderRole === "PARENT";
              const isStudent = msg.senderRole === "STUDENT";

              const badgeColor = isTeacher ? "#8b5cf6" : isParent ? "#10b981" : "#0ea5e9";
              const bgTint = isTeacher ? "#f5f3ff" : isParent ? "#ecfdf5" : "#f0f9ff";

              return (
                <div key={msg.id} style={{ padding: "14px 16px", background: bgTint, borderRadius: "12px", border: `1px solid ${badgeColor}30` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", background: badgeColor, color: "white", borderRadius: "4px" }}>
                        {msg.senderRole}
                      </span>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>{msg.senderName}</strong>
                    </div>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>{msg.timestamp}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#334155", lineHeight: 1.5 }}>{msg.text}</p>
                </div>
              );
            })}
          </div>

          {/* Post Message Input Form */}
          <form onSubmit={handleSendMessage} className="responsive-wrap-row">
            <input
              type="text"
              placeholder={`Post update or feedback as ${userRole}...`}
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              style={{ flex: 1, minWidth: "200px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
            />
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ whiteSpace: "nowrap" }}>
              <Send size={16} /> Send Update
            </button>
          </form>
        </div>

        {/* RIGHT: MILESTONES & RESPONSIBILITY STATUS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Growth Milestones */}
          <div className="card" style={{ padding: "20px" }}>
            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Award size={18} color="#f59e0b" /> Growth Milestones
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {room.milestones.map((ms: any) => (
                <div key={ms.id} style={{ padding: "12px", background: "#fffbeb", borderRadius: "8px", border: "1px solid #fde68a" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#92400e" }}>{ms.title}</div>
                  <p style={{ fontSize: "12px", color: "#78350f", margin: "4px 0" }}>{ms.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#b45309", fontWeight: 600 }}>
                    <span>{ms.date}</span>
                    <span>+{ms.pointsEarned} Credit Points</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Responsibility Status */}
          <div className="card" style={{ padding: "20px" }}>
            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={18} color="#16a34a" /> Responsibility State
            </h4>
            <div style={{ padding: "12px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", color: "#166534", fontWeight: 700 }}>3-Chance Escalation</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a", padding: "2px 6px", background: "white", borderRadius: "4px" }}>
                  NORMAL (0 Misses)
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#15803d" }}>
                All required learning tasks completed on schedule. No active alerts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
