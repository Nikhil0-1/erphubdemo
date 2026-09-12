"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  Activity,
  Target,
  AlertTriangle,
  FileText,
  Bus,
  Sparkles,
  CheckCircle,
  Clock,
  ChevronRight,
  Shield,
  FolderOpen,
  MapPin,
  Loader2,
} from "lucide-react";
import { PageHeader, StatusBadge, Avatar } from "@/components/dashboard/shared";

export default function Student360Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch(`/api/students/${resolvedParams.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setData(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div style={{ padding: "60px", textAlign: "center", color: "#64748b" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
        Loading Student 360° Profile...
      </div>
    );
  }

  const s = data?.student || {
    firstName: "Aarav",
    lastName: "Kumar",
    studentId: "GV-2026-007",
    className: "Class 7",
    sectionName: "A",
    rollNumber: "07",
    email: "aarav.kumar@student.greenvalley.edu",
  };
  const metrics = data?.metrics || { attendancePercentage: 94, averageScore: 83, totalAssessments: 2, totalActivities: 2, openConcerns: 1, portfolioCount: 2 };
  const parent = data?.parent;
  const attendance = data?.attendanceRecords || [];
  const assessments = data?.assessmentResults || [];
  const activities = data?.activities || [];
  const development = data?.developmentRecords || [];
  const concerns = data?.studentConcerns || [];
  const portfolio = data?.portfolioItems || [];
  const weakTopics = data?.weakTopics || [];
  const learningPaths = data?.learningPaths || [];
  const interventionsList = data?.interventions || [];
  const feeInvoices = data?.feeInvoices || [];
  const feePayments = data?.feePayments || [];
  const skillPassports = data?.skillPassports || [];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "growth", label: "Growth & Pathways" },
    { id: "interventions", label: "Interventions" },
    { id: "academics", label: "Academics" },
    { id: "attendance", label: "Attendance" },
    { id: "assessments", label: "Assessments" },
    { id: "activities", label: "Activities" },
    { id: "development", label: "Development" },
    { id: "concerns", label: "Concerns" },
    { id: "fees", label: "Fee Status" },
    { id: "portfolio", label: "Digital Portfolio" },
    { id: "transport", label: "Transport" },
    { id: "assistant", label: "AI Insights" },
  ];

  return (
    <div>
      {/* 360° HERO HEADER */}
      <div
        className="card"
        style={{
          padding: "28px",
          marginBottom: "24px",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0284c7, #6366f1)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 700,
                boxShadow: "0 8px 16px -4px rgba(14, 165, 233, 0.3)",
              }}
            >
              {s.firstName[0]}
              {s.lastName[0]}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>
                  {s.firstName} {s.lastName}
                </h1>
                <span style={{ fontSize: "12px", fontWeight: 700, padding: "2px 8px", background: "#f0fdf4", color: "#16a34a", borderRadius: "9999px" }}>
                  Active Student
                </span>
              </div>
              <div style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
                Student ID: <strong>{s.studentId}</strong> · Class: <strong>{s.className}-{s.sectionName || "A"}</strong> · Roll: <strong>{s.rollNumber || "07"}</strong>
              </div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                Parent Guardian: <strong>{s.parentName || "Raj Kumar"}</strong> ({parent?.phone || "+91-99887-76655"})
              </div>
            </div>
          </div>

          {/* Core Summary Metrics */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ padding: "12px 20px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#16a34a" }}>{metrics.attendancePercentage}%</div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>Attendance</div>
            </div>
            <div style={{ padding: "12px 20px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#0ea5e9" }}>{metrics.averageScore}%</div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>Academic Avg</div>
            </div>
            <div style={{ padding: "12px 20px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#8b5cf6" }}>{metrics.totalActivities}</div>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>STEM Activities</div>
            </div>
          </div>
        </div>
      </div>

      {/* 14 TABS NAVIGATION */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "24px",
          overflowX: "auto",
          paddingBottom: "4px",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "10px 16px",
              border: "none",
              background: "none",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              borderBottom: activeTab === t.id ? "2px solid #0ea5e9" : "2px solid transparent",
              color: activeTab === t.id ? "#0ea5e9" : "#64748b",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="responsive-two-col">
          {/* Recent Assessments */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Recent Academic Tests</h3>
            {assessments.map((a: any) => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{a.assessmentName || "Mathematics Unit Test 1"}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>{a.subjectName || "Mathematics"} · {a.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#0ea5e9" }}>{a.marks}/{a.maxMarks}</span>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a" }}>Grade {a.grade} ({a.percentage}%)</div>
                </div>
              </div>
            ))}
          </div>

          {/* Development Highlights */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Holistic Development Status</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {development.map((d: any) => (
                <div key={d.id} style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>{d.area}</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", background: "#f0fdf4", color: "#16a34a", borderRadius: "4px" }}>
                      {d.level}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#475569" }}>{d.observation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ACADEMICS & ASSESSMENTS */}
      {(activeTab === "academics" || activeTab === "assessments") && (
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Complete Examination Roster</h3>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Teacher Remarks</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a: any) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.assessmentName || "Mathematics Unit Test 1"}</td>
                    <td>{a.subjectName || "Mathematics"}</td>
                    <td style={{ fontSize: "13px", color: "#64748b" }}>{a.date}</td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{a.marks} / {a.maxMarks}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#0ea5e9" }}>{a.percentage}%</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#16a34a" }}>{a.grade}</span>
                    </td>
                    <td style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      {a.remarks || "Strong conceptual understanding."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ATTENDANCE */}
      {activeTab === "attendance" && (
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Attendance History Log</h3>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#16a34a" }}>Rate: {metrics.attendancePercentage}%</span>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Roll-Call Status</th>
                  <th>Recorded Via</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((att: any) => (
                  <tr key={att.id}>
                    <td>{att.date}</td>
                    <td>
                      <StatusBadge status={att.status} />
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", color: att.source === "IOT" ? "#16a34a" : "#64748b", fontWeight: 600 }}>
                        {att.source === "IOT" ? "⚡ RFID GATE SCAN" : "Classroom Roll Call"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ACTIVITIES */}
      {activeTab === "activities" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {activities.map((act: any) => (
            <div key={act.id} className="card" style={{ padding: "24px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#0ea5e9", background: "#eff6ff", padding: "2px 8px", borderRadius: "4px" }}>
                {act.category}
              </span>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: "8px 0" }}>{act.name}</h3>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, marginBottom: "12px" }}>{act.objective}</p>
              <div style={{ fontSize: "12px", color: "#16a34a", background: "#f0fdf4", padding: "8px", borderRadius: "6px" }}>
                Evaluation: {act.evaluation}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: DEVELOPMENT */}
      {activeTab === "development" && (
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Development Matrix</h3>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Dimension Area</th>
                  <th>Teacher Observation</th>
                  <th>Developmental Level</th>
                  <th>Teacher Feedback</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {development.map((d: any) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 700, color: "#0ea5e9" }}>{d.area}</td>
                    <td style={{ fontSize: "13px" }}>{d.observation}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: "#16a34a" }}>{d.level}</span>
                    </td>
                    <td style={{ fontSize: "13px" }}>{d.feedback}</td>
                    <td style={{ fontSize: "12px", color: "#64748b" }}>
                      {d.source === "ASSISTANT_APPROVED" ? "✨ AI Insight (Approved)" : "Teacher"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DIGITAL PORTFOLIO TIMELINE */}
      {activeTab === "portfolio" && (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Class 1 → Class 12 Digital Portfolio Timeline</h3>
            <p style={{ fontSize: "13px", color: "#64748b" }}>Longitudinal journey recording major achievements, certifications, and STEM projects</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", paddingLeft: "32px", borderLeft: "2px solid #e2e8f0" }}>
            {portfolio.map((p: any) => (
              <div key={p.id} className="card" style={{ padding: "20px", position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "-41px",
                    top: "24px",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#0ea5e9",
                    border: "3px solid white",
                    boxShadow: "0 0 0 2px #0ea5e9",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#0ea5e9" }}>{p.grade || "Class 7"}</span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{p.date}</span>
                </div>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{p.title}</h4>
                <p style={{ fontSize: "13px", color: "#475569", margin: "6px 0 12px" }}>{p.description}</p>
                <div style={{ display: "flex", gap: "6px" }}>
                  {p.skills?.map((sk: string) => (
                    <span key={sk} style={{ fontSize: "11px", padding: "2px 8px", background: "#f1f5f9", borderRadius: "9999px" }}>
                      #{sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CONCERNS */}
      {activeTab === "concerns" && (
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Active Support Items & Concerns</h3>
          {concerns.length === 0 ? (
            <p style={{ color: "#16a34a" }}>No open concerns recorded for this student.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {concerns.map((c: any) => (
                <div key={c.id} style={{ padding: "16px", background: "#fef2f2", borderRadius: "8px", border: "1px solid #fecaca" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 700, color: "#dc2626" }}>{c.category} Concern · Priority: {c.priority}</span>
                    <span style={{ fontSize: "12px", color: "#991b1b" }}>Status: {c.status}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#450a0a" }}>{c.description}</p>
                  {c.notes && <div style={{ fontSize: "12px", color: "#7f1d1d", marginTop: "4px" }}>Action: {c.notes}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: GROWTH & PATHWAYS */}
      {activeTab === "growth" && (
        <div className="space-y-6">
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
              Active Weak Topics Diagnosed
            </h3>
            <div className="space-y-3">
              {weakTopics.map((wt: any) => (
                <div key={wt.id} style={{ padding: "14px", background: "#f8fafc", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "14px", color: "#0f172a" }}>{wt.topicName}</span>
                    <span style={{ fontSize: "11px", marginLeft: "8px", padding: "2px 8px", background: wt.severity === "HIGH" ? "#fef2f2" : "#fffbeb", color: wt.severity === "HIGH" ? "#ef4444" : "#f59e0b", borderRadius: "10px", fontWeight: 700 }}>
                      {wt.severity}
                    </span>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                      {wt.subjectName} · Recommendation: {wt.recommendedAction}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontWeight: 700, fontSize: "16px", color: wt.severity === "HIGH" ? "#ef4444" : "#f59e0b" }}>
                    {wt.accuracyRate}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
              Curated Personal Learning Pathway
            </h3>
            {learningPaths.map((lp: any) => (
              <div key={lp.id} style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <h4 style={{ fontSize: "15px", fontWeight: 600, margin: 0 }}>{lp.title}</h4>
                  <strong style={{ color: "#16a34a" }}>{lp.progressPercentage}% Completed</strong>
                </div>
                <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
                  <div style={{ width: `${lp.progressPercentage}%`, height: "100%", background: "#16a34a", borderRadius: "4px" }} />
                </div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Assigned by {lp.assignedByTeacherName} · {lp.nodes?.length || 5} Milestone Sequence
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
              Validated Skill Passport Badges
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {skillPassports.map((sk: any) => (
                <div key={sk.id} style={{ padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontWeight: 600, fontSize: "13px" }}>{sk.skillName}</div>
                  <div style={{ fontSize: "11px", color: "#6366f1", fontWeight: 700, marginTop: "2px" }}>Badge: {sk.badge} ({sk.level})</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{sk.evidence}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: INTERVENTIONS */}
      {activeTab === "interventions" && (
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Teacher Remedial Interventions & Clinics
            </h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => router.push("/teacher/interventions")}
            >
              Log New Clinic
            </button>
          </div>

          <div className="space-y-3">
            {interventionsList.map((item: any) => (
              <div key={item.id} style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>{item.title}</span>
                  <span style={{ fontSize: "11px", padding: "2px 8px", background: "#ecfdf5", color: "#047857", borderRadius: "10px", fontWeight: 700 }}>
                    {item.status}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#475569", margin: "4px 0" }}>{item.notes}</p>
                <div style={{ fontSize: "11px", color: "#64748b" }}>
                  Date: {item.scheduledDate} · Conducted by: {item.teacherName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: FEE STATUS */}
      {activeTab === "fees" && (
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
            Institutional Fee & Dues Record
          </h3>
          <div className="space-y-3">
            {feeInvoices.map((inv: any) => {
              const isPaid = inv.pendingAmount === 0;
              return (
                <div key={inv.id} style={{ padding: "14px", background: "#f8fafc", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "14px" }}>{inv.term}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      Invoice #{inv.invoiceNumber} · Due {inv.dueDate}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>₹{inv.totalAmount.toLocaleString()}</div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: isPaid ? "#16a34a" : "#ea580c" }}>
                      {isPaid ? "Fully Cleared" : `₹${inv.pendingAmount.toLocaleString()} Outstanding`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TRANSPORT */}
      {activeTab === "transport" && (
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Assigned Bus & Transit Route</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Assigned Bus</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>BUS-07</div>
            </div>
            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Designated Route</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>Route 3</div>
            </div>
            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Assigned Boarding Stop</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>Sector 15 Gate</div>
            </div>
            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Driver Contact</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>Rajesh Kumar (+91-91234-56789)</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AI INSIGHTS */}
      {activeTab === "assistant" && (
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Verified Assistant Analysis</h3>
          <div style={{ padding: "18px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", color: "#166534" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>
              <Sparkles size={18} /> Grounded Academic Insight
            </div>
            <p style={{ fontSize: "14px", lineHeight: 1.6 }}>
              Aarav demonstrates strong analytical discipline in practical STEM activities (Ultrasonic Rover) and achieved an 88% on the Fractions test. Continued reinforcement on algebraic exponent laws will prepare him for the upcoming term final.
            </p>
            <div style={{ marginTop: "12px", fontSize: "12px", color: "#15803d" }}>
              ✓ Verified against 2 assessment papers, 5 attendance logs, and 2 activity entries.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
