"use client";

import { useState, useEffect } from "react";
import { Wallet, CheckCircle2, Clock, Download, CreditCard, Calendar } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function ParentFeesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/fees/invoices").then((r) => r.json()),
      fetch("/api/fees/payments").then((r) => r.json()),
    ])
      .then(([invD, payD]) => {
        setInvoices(invD.data || []);
        setPayments(payD.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalInvoiced = invoices.reduce((s, i) => s + i.totalAmount, 0) || 70000;
  const totalPaid = payments.reduce((s, p) => s + p.amount, 0) || 50000;
  const pendingDue = Math.max(0, totalInvoiced - totalPaid);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Management & Payment Receipts"
        subtitle="Tuition fee schedules, payment receipts, and real-time ledger accounting for Aarav Kumar"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>
            Current Outstanding Balance
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: pendingDue === 0 ? "#10b981" : "#f97316", marginTop: "4px" }}>
            ₹{pendingDue.toLocaleString()}
          </div>
          <div style={{ fontSize: "12px", color: pendingDue === 0 ? "#10b981" : "#f97316", fontWeight: 600, marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
            {pendingDue === 0 ? <><CheckCircle2 size={14} /> All dues settled</> : <><Clock size={14} /> Term 2 balance pending</>}
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>
            Total Paid (Session 2026-27)
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
            ₹{totalPaid.toLocaleString()}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Tuition, Science Lab, & Co-curricular funds
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>
            Next Due Date
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#3b82f6", marginTop: "4px" }}>
            30 Sep 2026
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Term 2 Installment Deadline
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>
          Official Verified Payment Receipts
        </h3>

        <div className="space-y-3">
          {payments.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-bg)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "#10b981",
                    }}
                  >
                    VERIFIED
                  </span>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                    {p.receiptNumber}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Mode: {p.paymentMode} · Ref: {p.transactionRef} · Recorded by {p.recordedBy}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "2px" }}>
                  Date: {p.paymentDate} · Remarks: {p.remarks}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#10b981" }}>
                  ₹{p.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
