"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserPlus,
  FileText,
  PieChart,
} from "lucide-react";
import { PageHeader, MetricCard, SectionHeader } from "@/components/dashboard/shared";

export default function PrincipalFeesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalInvoiced: 70000,
    totalCollected: 50000,
    totalPending: 20000,
    collectionRate: 71.4,
    recentPayments: [] as any[],
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/fees/invoices").then((r) => r.json()),
      fetch("/api/fees/payments").then((r) => r.json()),
    ])
      .then(([invData, payData]) => {
        const invoices = invData.data || [];
        const payments = payData.data || [];
        const totalInvoiced = invoices.reduce((s: number, i: any) => s + i.totalAmount, 0) || 70000;
        const totalCollected = payments.reduce((s: number, p: any) => s + p.amount, 0) || 50000;
        const totalPending = Math.max(0, totalInvoiced - totalCollected);
        const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 1000) / 10 : 71.4;

        setSummary({
          totalInvoiced,
          totalCollected,
          totalPending,
          collectionRate,
          recentPayments: payments,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Financial & Fee Overview"
        subtitle="School-wide fee collection tracking, class performance, and financial compliance"
      >
        <button
          className="btn btn-primary"
          onClick={() => router.push("/principal/people/accountants")}
        >
          <UserPlus size={16} />
          Manage Accounts Staff
        </button>
      </PageHeader>

      {/* High-level metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        <MetricCard
          label="Total Institutional Billing"
          value={`₹${summary.totalInvoiced.toLocaleString()}`}
          subtext="Session 2026-27"
          icon={<Wallet size={20} />}
          iconBg="#eff6ff"
          iconColor="#3b82f6"
        />
        <MetricCard
          label="Total Collected"
          value={`₹${summary.totalCollected.toLocaleString()}`}
          subtext="Verified Bank Inflows"
          icon={<CheckCircle2 size={20} />}
          iconBg="#ecfdf5"
          iconColor="#10b981"
        />
        <MetricCard
          label="Outstanding Dues"
          value={`₹${summary.totalPending.toLocaleString()}`}
          subtext="Term 2 installments"
          icon={<Clock size={20} />}
          iconBg="#fff7ed"
          iconColor="#f97316"
        />
        <MetricCard
          label="Collection Efficiency"
          value={`${summary.collectionRate}%`}
          subtext="Middle Wing Leading"
          icon={<TrendingUp size={20} />}
          iconBg="#f5f3ff"
          iconColor="#8b5cf6"
        />
      </div>

      {/* Class-wise Breakdown */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "var(--text-primary)" }}>
          Class-Wise Fee Collection Performance
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "10px 8px" }}>Class / Wing</th>
                <th style={{ padding: "10px 8px" }}>Total Billed</th>
                <th style={{ padding: "10px 8px" }}>Collected</th>
                <th style={{ padding: "10px 8px" }}>Outstanding</th>
                <th style={{ padding: "10px 8px" }}>Collection %</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Progress</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                <td style={{ padding: "14px 8px", fontWeight: 600, color: "var(--text-primary)" }}>
                  Class 7-A (Middle Wing)
                </td>
                <td style={{ padding: "14px 8px" }}>₹70,000</td>
                <td style={{ padding: "14px 8px", color: "#10b981", fontWeight: 600 }}>₹50,000</td>
                <td style={{ padding: "14px 8px", color: "#f97316", fontWeight: 600 }}>₹20,000</td>
                <td style={{ padding: "14px 8px", fontWeight: 700, color: "#10b981" }}>71.4%</td>
                <td style={{ padding: "14px 8px", textAlign: "right" }}>
                  <div style={{ width: "120px", height: "8px", background: "var(--surface-bg)", borderRadius: "4px", display: "inline-block", overflow: "hidden" }}>
                    <div style={{ width: "71.4%", height: "100%", background: "#10b981", borderRadius: "4px" }} />
                  </div>
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--border-color)", opacity: 0.85 }}>
                <td style={{ padding: "14px 8px", fontWeight: 500 }}>
                  Class 8-A (Middle Wing)
                </td>
                <td style={{ padding: "14px 8px" }}>₹80,000</td>
                <td style={{ padding: "14px 8px", color: "#10b981", fontWeight: 600 }}>₹68,000</td>
                <td style={{ padding: "14px 8px", color: "#f97316", fontWeight: 600 }}>₹12,000</td>
                <td style={{ padding: "14px 8px", fontWeight: 700, color: "#3b82f6" }}>85.0%</td>
                <td style={{ padding: "14px 8px", textAlign: "right" }}>
                  <div style={{ width: "120px", height: "8px", background: "var(--surface-bg)", borderRadius: "4px", display: "inline-block", overflow: "hidden" }}>
                    <div style={{ width: "85%", height: "100%", background: "#3b82f6", borderRadius: "4px" }} />
                  </div>
                </td>
              </tr>
              <tr style={{ opacity: 0.85 }}>
                <td style={{ padding: "14px 8px", fontWeight: 500 }}>
                  Class 9-A (Secondary Wing)
                </td>
                <td style={{ padding: "14px 8px" }}>₹95,000</td>
                <td style={{ padding: "14px 8px", color: "#10b981", fontWeight: 600 }}>₹61,000</td>
                <td style={{ padding: "14px 8px", color: "#f97316", fontWeight: 600 }}>₹34,000</td>
                <td style={{ padding: "14px 8px", fontWeight: 700, color: "#f59e0b" }}>64.2%</td>
                <td style={{ padding: "14px 8px", textAlign: "right" }}>
                  <div style={{ width: "120px", height: "8px", background: "var(--surface-bg)", borderRadius: "4px", display: "inline-block", overflow: "hidden" }}>
                    <div style={{ width: "64.2%", height: "100%", background: "#f59e0b", borderRadius: "4px" }} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
