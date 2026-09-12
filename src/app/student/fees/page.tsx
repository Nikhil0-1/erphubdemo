"use client";

import { useState, useEffect } from "react";
import { Wallet, CheckCircle2, Clock, FileText, Printer } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function StudentFeesPage() {
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

  return (
    <div className="space-y-6" style={{ maxWidth: "860px", margin: "0 auto" }}>
      <PageHeader
        title="My Fee Account & Official Receipts"
        subtitle="Transparent accounting of your institutional fee installments, cleared payments, and receipts"
      />

      {/* Invoices List */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)" }}>
          Academic Term Invoices
        </h3>
        <div className="space-y-3">
          {invoices.map((inv) => {
            const isPaid = inv.pendingAmount === 0;
            return (
              <div
                key={inv.id}
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--surface-bg)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>{inv.term}</span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: isPaid ? "rgba(16, 185, 129, 0.15)" : "rgba(249, 115, 22, 0.15)",
                        color: isPaid ? "#10b981" : "#f97316",
                      }}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Invoice No: {inv.invoiceNumber} · Due: {inv.dueDate}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                    ₹{inv.totalAmount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "12px", color: isPaid ? "#10b981" : "#f97316" }}>
                    {isPaid ? "Fully Paid" : `₹${inv.pendingAmount.toLocaleString()} Pending`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Receipts Table */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)" }}>
          Cleared Payment Receipts
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "8px" }}>Receipt #</th>
                <th style={{ padding: "8px" }}>Date</th>
                <th style={{ padding: "8px" }}>Amount Paid</th>
                <th style={{ padding: "8px" }}>Mode</th>
                <th style={{ padding: "8px" }}>Txn Reference</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 600, color: "#3b82f6" }}>
                    {p.receiptNumber}
                  </td>
                  <td style={{ padding: "12px 8px" }}>{p.paymentDate}</td>
                  <td style={{ padding: "12px 8px", fontWeight: 700, color: "#10b981" }}>
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 8px" }}>{p.paymentMode}</td>
                  <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>{p.transactionRef}</td>
                  <td style={{ padding: "12px 8px", textAlign: "right" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "#10b981",
                      }}
                    >
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
