"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ArrowUpRight, Award, Calendar, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function GrowthInsightsPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students/growth/insights")
      .then((r) => r.json())
      .then((d) => setInsights(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6" style={{ maxWidth: "860px", margin: "0 auto" }}>
      <PageHeader
        title="Student Growth Insights"
        subtitle="Empirical trajectory indicators tracking improvement, consistency, and skill acceleration over time"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
        {insights.map((item) => (
          <div key={item.id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-tertiary)", fontWeight: 600 }}>
                {item.period}
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "2px",
                  padding: "3px 8px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                <ArrowUpRight size={14} /> +{item.changePercentage}%
              </div>
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
              {item.metric}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
              {item.analysis}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
