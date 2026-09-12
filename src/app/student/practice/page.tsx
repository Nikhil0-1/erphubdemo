"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  History,
  Lightbulb,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function StudentPracticePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    fetch("/api/students/growth/practice")
      .then((r) => r.json())
      .then((d) => {
        setQuestions(d.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentQ = questions[currentIndex];

  async function handleSubmitAnswer() {
    if (selectedOption === null || !currentQ) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/students/growth/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQ.id,
          selectedOptionIndex: selectedOption,
          timeSpentSeconds: 45,
        }),
      });
      const data = await res.json();
      setResult(data.data);
      setScore((prev) => ({
        correct: prev.correct + (data.data.isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    setSelectedOption(null);
    setResult(null);
    setShowHint(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  }

  return (
    <div className="space-y-6" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <PageHeader
        title="Student Practice Zone"
        subtitle="Adaptive practice questions with instant step-by-step reasoning and automated Mistake Book tracking"
      >
        <button
          className="btn btn-secondary"
          onClick={() => router.push("/student/mistakes")}
        >
          <History size={16} />
          View Mistake Book
        </button>
      </PageHeader>

      {/* Progress & Score bar */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "10px",
              background: "rgba(59, 130, 246, 0.1)",
              color: "#3b82f6",
              fontWeight: 600,
            }}
          >
            {currentQ?.subjectName || "Subject"}
          </span>
          <span
            style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "10px",
              background: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              fontWeight: 600,
            }}
          >
            {currentQ?.difficulty || "MEDIUM"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "13px" }}>
          <span>
            Score: <strong style={{ color: "#10b981" }}>{score.correct}</strong> / {score.total}
          </span>
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="card" style={{ padding: "28px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "8px" }}>
            Topic: {currentQ.topicName}
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: "24px" }}>
            {currentQ.questionText}
          </h2>

          {/* Options */}
          <div className="space-y-3" style={{ marginBottom: "24px" }}>
            {currentQ.options.map((opt: string, idx: number) => {
              const isSelected = selectedOption === idx;
              let bg = "var(--surface-bg)";
              let border = "1px solid var(--border-color)";
              let icon = null;

              if (result) {
                if (idx === result.correctOptionIndex) {
                  bg = "rgba(16, 185, 129, 0.15)";
                  border = "2px solid #10b981";
                  icon = <CheckCircle2 size={18} color="#10b981" />;
                } else if (isSelected && !result.isCorrect) {
                  bg = "rgba(239, 68, 68, 0.15)";
                  border = "2px solid #ef4444";
                  icon = <XCircle size={18} color="#ef4444" />;
                }
              } else if (isSelected) {
                bg = "rgba(59, 130, 246, 0.12)";
                border = "2px solid #3b82f6";
              }

              return (
                <div
                  key={idx}
                  onClick={() => !result && setSelectedOption(idx)}
                  style={{
                    padding: "14px 18px",
                    borderRadius: "var(--radius-md)",
                    background: bg,
                    border,
                    cursor: result ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: isSelected ? "#3b82f6" : "rgba(255, 255, 255, 0.08)",
                        color: isSelected ? "white" : "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>
                      {opt}
                    </span>
                  </div>
                  {icon}
                </div>
              );
            })}
          </div>

          {/* Hint disclosure */}
          {currentQ.hint && !result && (
            <div style={{ marginBottom: "20px" }}>
              {showHint ? (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <Lightbulb size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "#d97706" }}>Hint: </strong>
                    {currentQ.hint}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#f59e0b",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: 0,
                  }}
                >
                  <Lightbulb size={14} /> Need a hint?
                </button>
              )}
            </div>
          )}

          {/* Result Explanation */}
          {result && (
            <div
              style={{
                padding: "18px",
                borderRadius: "var(--radius-md)",
                background: result.isCorrect ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                border: result.isCorrect ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid rgba(239, 68, 68, 0.25)",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                {result.isCorrect ? (
                  <>
                    <CheckCircle2 size={18} color="#10b981" />
                    <strong style={{ color: "#10b981", fontSize: "14px" }}>Excellent! Correct Answer</strong>
                  </>
                ) : (
                  <>
                    <XCircle size={18} color="#ef4444" />
                    <strong style={{ color: "#ef4444", fontSize: "14px" }}>Incorrect</strong>
                    <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                      · Added automatically to your Mistake Book
                    </span>
                  </>
                )}
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                <strong>Explanation: </strong> {result.explanation}
              </p>
            </div>
          )}

          {/* Action button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {!result ? (
              <button
                className="btn btn-primary"
                disabled={selectedOption === null || submitting}
                onClick={handleSubmitAnswer}
              >
                {submitting ? "Checking..." : "Submit Answer"}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>
                Next Question <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
