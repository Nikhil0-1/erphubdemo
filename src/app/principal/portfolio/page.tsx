"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Award, ExternalLink, Calendar } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function PrincipalPortfolioPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // Collect student portfolio items
    fetch("/api/students/student-01")
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.portfolioItems) setItems(json.data.portfolioItems);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <PageHeader
        title="Student Digital Portfolios"
        subtitle="CBSE holistic progress records, STEM projects, and extracurricular milestones from Class 1 to Class 12"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {items.map((item) => (
          <div key={item.id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background: "#eff6ff",
                  color: "#0284c7",
                }}
              >
                {item.type}
              </span>
              <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={12} /> {item.grade || "Class 7"}
              </span>
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>{item.title}</h3>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, marginBottom: "16px" }}>{item.description}</p>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {item.skills?.map((sk: string) => (
                <span
                  key={sk}
                  style={{
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    background: "#f1f5f9",
                    color: "#334155",
                  }}
                >
                  #{sk}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
