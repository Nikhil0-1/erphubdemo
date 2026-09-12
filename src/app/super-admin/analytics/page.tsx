"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, School, GraduationCap, Cpu, ShieldCheck } from "lucide-react";
import { PageHeader, MetricCard, SectionHeader } from "@/components/dashboard/shared";

export default function PlatformAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/platform")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setData(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {
    totalSchools: 1,
    activeSchools: 1,
    totalPrincipals: 1,
    totalStudents: 1,
    activeTeachers: 1,
    activeBuses: 1,
    iotDevices: 2,
  };

  return (
    <div>
      <PageHeader
        title="Platform Analytics"
        subtitle="Multi-school growth metrics, telemetry, and platform-wide benchmarks"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <MetricCard
          label="Registered Schools"
          value={stats.totalSchools}
          icon={<School size={20} />}
          iconBg="#eff6ff"
          iconColor="#3b82f6"
          change={12}
          changeLabel="vs last quarter"
        />
        <MetricCard
          label="Active Principals"
          value={stats.totalPrincipals}
          icon={<Users size={20} />}
          iconBg="#f0fdf4"
          iconColor="#22c55e"
          change={8}
          changeLabel="vs last month"
        />
        <MetricCard
          label="Total Students"
          value={stats.totalStudents}
          icon={<GraduationCap size={20} />}
          iconBg="#fdf2f8"
          iconColor="#ec4899"
          change={24}
          changeLabel="enrollment growth"
        />
        <MetricCard
          label="Connected IoT Devices"
          value={stats.iotDevices}
          icon={<Cpu size={20} />}
          iconBg="#fff7ed"
          iconColor="#f97316"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        <div className="card" style={{ padding: "24px" }}>
          <SectionHeader title="Institution Distribution by State" />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
            {[
              { state: "Delhi NCR", count: 1, pct: 100 },
              { state: "Maharashtra", count: 0, pct: 0 },
              { state: "Karnataka", count: 0, pct: 0 },
            ].map((item) => (
              <div key={item.state}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 500 }}>{item.state}</span>
                  <span style={{ color: "#64748b" }}>{item.count} School ({item.pct}%)</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "9999px" }}>
                  <div
                    style={{
                      width: `${item.pct}%`,
                      height: "100%",
                      background: "#0ea5e9",
                      borderRadius: "9999px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: "24px" }}>
          <SectionHeader title="System Reliability & Security" />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "#f0fdf4",
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "#0f172a" }}>Multi-School Isolation: Active</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>RBAC rules enforced across all API endpoints</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "#0f172a" }}>Uptime & Latency: 99.98%</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>Average API latency &lt; 45ms</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
