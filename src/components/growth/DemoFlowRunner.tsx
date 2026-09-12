"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Sparkles,
  CheckCircle,
  ArrowRight,
  BookOpen,
  History,
  Award,
  ShieldAlert,
  X,
  RotateCcw,
  HeartHandshake,
} from "lucide-react";
import AwardCertificateModal from "@/components/growth/AwardCertificateModal";

export default function DemoFlowRunner() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const demoAward = {
    awardName: "Most Improved Learner",
    recipientName: "Aarav Kumar",
    reason: "Demonstrated measurable improvement after completing targeted learning activities in Geometry → Angles.",
    evidenceSummary: "Geometry score improved from 51% to 68% following 10 practice questions and targeted revision.",
    issuedByName: "Rahul Sharma (Teacher)",
    issuedAt: new Date().toISOString().split("T")[0],
    schoolName: "Green Valley School",
    certificateId: "CERT-GVS-2026-007",
  };

  const steps = [
    {
      step: 1,
      title: "Diagnostic Alert",
      role: "Teacher Rahul Sharma",
      desc: "Teacher views Aarav Kumar's Student 360° / Growth Center. Geometry → Angles accuracy is at 51%.",
      actionText: "Go to Teacher Growth Room",
      action: () => router.push("/teacher/growth-room/student-01"),
    },
    {
      step: 2,
      title: "Assign AI Action Plan",
      role: "Teacher Rahul Sharma",
      desc: "Teacher assigns AI-recommended plan: 10 targeted practice questions + 5 revision tasks.",
      actionText: "Trigger Plan Assignment",
      action: async () => {
        await fetch("/api/growth/action-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "ASSIGN", planId: "ap-demo", studentId: "student-01", weakTopic: "Geometry → Angles" }),
        }).catch(() => {});
        router.push("/teacher/growth-room/student-01");
      },
    },
    {
      step: 3,
      title: "Student Practice & Mistake Book",
      role: "Student Aarav Kumar",
      desc: "Aarav sees Today's Plan, solves practice questions, reviews 1 wrong answer in Mistake Book with AI explanations, and retries.",
      actionText: "Go to Student Mistake Book",
      action: () => router.push("/student/mistakes"),
    },
    {
      step: 4,
      title: "Reassessment Growth (51% → 68%)",
      role: "AI Growth Engine",
      desc: "Student completes reassessment. Accuracy improves from 51% to 68% (+17 percentage points).",
      actionText: "Record Reassessment Delta",
      action: async () => {
        await fetch("/api/growth-room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: "student-01", text: "🎉 Reassessment completed: Geometry accuracy improved from 51% to 68%!", category: "MILESTONE" }),
        }).catch(() => {});
        router.push("/student/growth-room");
      },
    },
    {
      step: 5,
      title: "Credit Points & Award Issuance",
      role: "Teacher & System",
      desc: "Credit points awarded (+50 Aarav, +30 Teacher, +20 Parent). Teacher approves 'Most Improved Learner' Award.",
      actionText: "Preview Certificate",
      action: () => setIsCertificateOpen(true),
    },
    {
      step: 6,
      title: "Parent Positive Update",
      role: "Parent Raj Kumar",
      desc: "Parent receives positive notification: 'Aarav's Geometry performance improved from 51% to 68%'.",
      actionText: "Go to Parent Dashboard",
      action: () => router.push("/parent"),
    },
    {
      step: 7,
      title: "3-Chance Miss & Support Audit Simulation",
      role: "System Escalation Engine",
      desc: "Simulate qualifying miss evaluation (Watch → Warning → Red) and Teacher Support Gap audit resolution.",
      actionText: "Simulate Miss Event",
      action: async () => {
        await fetch("/api/growth/escalation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "SIMULATE_MISS", studentId: "student-01", taskTitle: "Geometry Homework #3", isValidException: false }),
        }).catch(() => {});
        router.push("/principal");
      },
    },
  ];

  return (
    <>
      {/* DEMO RUNNER MODAL */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="card animate-fade-in"
            style={{
              width: "100%",
              maxWidth: "650px",
              background: "#ffffff",
              borderRadius: "18px",
              padding: "28px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
            >
              <X size={22} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0ea5e9", fontWeight: 700, fontSize: "12px", textTransform: "uppercase" }}>
              <Sparkles size={16} /> NurtureKernel Product Vision Demo Flow
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </h2>

            <div style={{ fontSize: "12px", fontWeight: 700, color: "#8b5cf6", margin: "4px 0 12px" }}>
              Perspective: {steps[currentStep - 1].role}
            </div>

            <p style={{ fontSize: "14px", color: "#334155", lineHeight: 1.5, marginBottom: "20px" }}>
              {steps[currentStep - 1].desc}
            </p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
              >
                Previous Step
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    steps[currentStep - 1].action();
                    if (currentStep < steps.length) {
                      setCurrentStep((prev) => prev + 1);
                    }
                  }}
                >
                  {steps[currentStep - 1].actionText} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AwardCertificateModal isOpen={isCertificateOpen} onClose={() => setIsCertificateOpen(false)} award={demoAward} />
    </>
  );
}
