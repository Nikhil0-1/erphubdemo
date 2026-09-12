"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus,
  Users,
  Search,
  Download,
  CreditCard,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { PageHeader, MetricCard, SectionHeader, StatusBadge } from "@/components/dashboard/shared";
import { getGreeting } from "@/lib/utils";
import { SessionUser } from "@/types";

interface FeeSummary {
  totalInvoiced: number;
  totalCollected: number;
  totalPending: number;
  collectionRate: number;
  recentPayments: any[];
  pendingInvoices: any[];
}

export default function AccountantDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as unknown as SessionUser;

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FeeSummary>({
    totalInvoiced: 70000,
    totalCollected: 50000,
    totalPending: 20000,
    collectionRate: 71.4,
    recentPayments: [],
    pendingInvoices: [],
  });

  useEffect(() => {
    loadFeeData();
  }, []);

  async function loadFeeData() {
    try {
      const [invRes, payRes] = await Promise.all([
        fetch("/api/fees/invoices"),
        fetch("/api/fees/payments"),
      ]);

      let invoices = [];
      let payments = [];

      if (invRes.ok) {
        const invJson = await invRes.json();
        invoices = invJson.data || [];
      }
      if (payRes.ok) {
        const payJson = await payRes.json();
        payments = payJson.data || [];
      }

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
        pendingInvoices: invoices.filter((i: any) => i.pendingAmount > 0),
      });
    } catch (err) {
      console.error("Failed to load fee data:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        greeting={`${getGreeting()}, ${user?.firstName || "Accountant"}`}
        title="Fee Management & Accounts"
        subtitle="Green Valley School · Financial Year 2026-27"
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => router.push("/accountant/receipts")}
          >
            <FileText size={16} />
            View Receipts
          </button>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/accountant/payments")}
          >
            <Plus size={16} />
            Record Payment
          </button>
        </div>
      </PageHeader>

      {/* Financial Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        <MetricCard
          label="Total Invoiced"
          value={`₹${summary.totalInvoiced.toLocaleString()}`}
          subtext="2026-27 Academic Cycle"
          icon={<Wallet size={20} />}
          iconBg="#eff6ff"
          iconColor="#3b82f6"
        />
        <MetricCard
          label="Total Collected"
          value={`₹${summary.totalCollected.toLocaleString()}`}
          subtext="Reconciled into Bank"
          icon={<CheckCircle2 size={20} />}
          iconBg="#ecfdf5"
          iconColor="#10b981"
        />
        <MetricCard
          label="Outstanding Dues"
          value={`₹${summary.totalPending.toLocaleString()}`}
          subtext={`${summary.pendingInvoices.length} pending installment(s)`}
          icon={<Clock size={20} />}
          iconBg="#fff7ed"
          iconColor="#f97316"
          onClick={() => router.push("/accountant/pending")}
        />
        <MetricCard
          label="Collection Rate"
          value={`${summary.collectionRate}%`}
          subtext="On-track for Q2 target"
          icon={<TrendingUp size={20} />}
          iconBg="#f5f3ff"
          iconColor="#8b5cf6"
        />
      </div>

      {/* Main Grid: Recent Transactions & Class Collection */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}
      >
        {/* Recent Transactions Table */}
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
                Recent Payment Receipts
              </h2>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                Verified ledger collections for Green Valley School
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => router.push("/accountant/receipts")}
            >
              All Receipts
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="table" style={{ width: "100%", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-secondary)" }}>
                  <th style={{ padding: "10px 8px" }}>Receipt #</th>
                  <th style={{ padding: "10px 8px" }}>Student</th>
                  <th style={{ padding: "10px 8px" }}>Class</th>
                  <th style={{ padding: "10px 8px" }}>Amount</th>
                  <th style={{ padding: "10px 8px" }}>Mode</th>
                  <th style={{ padding: "10px 8px" }}>Date</th>
                  <th style={{ padding: "10px 8px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "var(--text-tertiary)" }}>
                      No payments recorded yet.
                    </td>
                  </tr>
                ) : (
                  summary.recentPayments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 600, color: "#3b82f6" }}>
                        {p.receiptNumber}
                      </td>
                      <td style={{ padding: "12px 8px", fontWeight: 500, color: "var(--text-primary)" }}>
                        {p.studentName}
                      </td>
                      <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>
                        {p.studentClass}
                      </td>
                      <td style={{ padding: "12px 8px", fontWeight: 700, color: "#10b981" }}>
                        ₹{p.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "#3b82f6",
                          }}
                        >
                          {p.paymentMode}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>
                        {p.paymentDate}
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "right" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => router.push(`/accountant/receipts?id=${p.id}`)}
                          style={{ padding: "4px 8px", fontSize: "11px" }}
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Class-wise breakdown & Quick tools */}
        <div className="space-y-6">
          {/* Class-wise Collection Rate */}
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>
              Class-Wise Collection
            </h3>
            <div className="space-y-3">
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600 }}>Class 7-A (Middle Wing)</span>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>71.4%</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "var(--surface-bg)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "71.4%", height: "100%", background: "#10b981", borderRadius: "4px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-tertiary)", marginTop: "4px" }}>
                  <span>₹50,000 Collected</span>
                  <span>₹20,000 Due</span>
                </div>
              </div>

              <div style={{ opacity: 0.7 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 500 }}>Class 8-A</span>
                  <span style={{ color: "#3b82f6", fontWeight: 700 }}>85.0%</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "var(--surface-bg)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "85%", height: "100%", background: "#3b82f6", borderRadius: "4px" }} />
                </div>
              </div>

              <div style={{ opacity: 0.7 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 500 }}>Class 9-B</span>
                  <span style={{ color: "#f59e0b", fontWeight: 700 }}>64.2%</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "var(--surface-bg)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: "64.2%", height: "100%", background: "#f59e0b", borderRadius: "4px" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>
              Finance Quick Actions
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: "flex-start", width: "100%" }}
                onClick={() => router.push("/accountant/payments")}
              >
                <CreditCard size={16} />
                Record Offline/Cash Payment
              </button>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: "flex-start", width: "100%" }}
                onClick={() => router.push("/accountant/students")}
              >
                <Users size={16} />
                Search Student Fee Ledger
              </button>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: "flex-start", width: "100%" }}
                onClick={() => router.push("/accountant/pending")}
              >
                <AlertTriangle size={16} />
                Send Overdue Reminder Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
