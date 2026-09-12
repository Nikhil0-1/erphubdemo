"use client";

import { useEffect, useState } from "react";
import { User, GraduationCap, Bus, Calendar, Phone, Mail, Award, HeartHandshake } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function ParentChildrenPage() {
  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/analytics/parent")
      .then((r) => r.json())
      .then((res) => {
        if (res.data?.children) setChildren(res.data.children);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <PageHeader
        title="My Children Profiles"
        subtitle="Enrolled student details, class assignments, transport mapping, and emergency contacts"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
        {children.map((child) => (
          <div key={child.id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  fontWeight: 800,
                }}
              >
                {child.firstName?.[0] || "A"}
                {child.lastName?.[0] || "K"}
              </div>
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#16a34a",
                    background: "#dcfce7",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  Active Student
                </span>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginTop: "2px" }}>
                  {child.name}
                </h2>
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  {child.className} • Roll #{child.rollNumber || "12"}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px" }}>
                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>ATTENDANCE</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#16a34a" }}>{child.attendanceRate}%</div>
              </div>
              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px" }}>
                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>ACADEMIC AVERAGE</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#2563eb" }}>{child.academicAvg}%</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#475569" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <GraduationCap size={16} color="#64748b" />
                <span>Class Teacher: <strong>Rahul Sharma</strong> (Mathematics)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Bus size={16} color="#64748b" />
                <span>Assigned Transport: <strong>BUS-07</strong> (Route 3 - Greenwood Heights)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <HeartHandshake size={16} color="#64748b" />
                <span>Medical: No known allergies • Blood Group: O+</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
