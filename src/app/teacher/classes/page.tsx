"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users, ClipboardCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/shared";

export default function TeacherClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/teacher")
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.classes) setClasses(json.data.classes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="My Assigned Classes"
        subtitle="Grades, sections, and subjects assigned for Academic Session 2026-27"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {classes.map((c) => (
          <div key={c.id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
                  {c.name} - Section {c.sectionName}
                </h3>
                <span style={{ fontSize: "13px", color: "#0ea5e9", fontWeight: 600 }}>{c.subjectName}</span>
              </div>
              <span style={{ padding: "2px 8px", background: "#f0fdf4", color: "#16a34a", fontSize: "12px", fontWeight: 600, borderRadius: "6px" }}>
                Active
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#f8fafc", padding: "12px", borderRadius: "8px", margin: "16px 0" }}>
              <div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Enrolled Students</div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>{c.studentCount}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>Attendance Rate</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#16a34a" }}>{c.attendanceRate}%</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => router.push("/teacher/attendance")}
                className="btn btn-primary"
                style={{ flex: 1, padding: "8px", fontSize: "13px" }}
              >
                Mark Attendance
              </button>
              <button
                onClick={() => router.push("/teacher/academics")}
                className="btn btn-secondary"
                style={{ flex: 1, padding: "8px", fontSize: "13px" }}
              >
                Enter Marks
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
