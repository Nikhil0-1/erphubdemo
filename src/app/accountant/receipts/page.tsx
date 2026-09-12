"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  School,
  ArrowLeft,
  Calendar,
  CreditCard,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function AccountantReceiptsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetId = searchParams.get("id");
  const studentFilter = searchParams.get("studentId");

  const [payments, setPayments] = useState<any[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fees/payments")
      .then((r) => r.json())
      .then((d) => {
        const list = d.data || [];
        setPayments(list);
        if (targetId) {
          const match = list.find((p: any) => p.id === targetId || p.receiptNumber === targetId);
          if (match) setSelectedReceipt(match);
          else if (list.length > 0) setSelectedReceipt(list[0]);
        } else if (studentFilter) {
          const stuPayments = list.filter((p: any) => p.studentId === studentFilter);
          if (stuPayments.length > 0) setSelectedReceipt(stuPayments[0]);
          else if (list.length > 0) setSelectedReceipt(list[0]);
        } else if (list.length > 0) {
          setSelectedReceipt(list[0]);
        }
      })
      .finally(() => setLoading(false));
  }, [targetId, studentFilter]);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Official Fee Receipts"
        subtitle="Auditable payment slips, print archives, and digital verification"
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn btn-secondary"
            onClick={() => router.push("/accountant")}
          >
            <ArrowLeft size={16} />
            Back to Accounts
          </button>
          {selectedReceipt && (
            <button
              className="btn btn-primary"
              onClick={handlePrint}
            >
              <Printer size={16} />
              Print Receipt
            </button>
          )}
        </div>
      </PageHeader>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        {/* Left: Receipts List */}
        <div className="card" style={{ padding: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: "var(--text-secondary)" }}>
            Issued Receipts ({payments.length})
          </h3>
          <div className="space-y-2">
            {payments.map((p) => {
              const isSelected = selectedReceipt?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedReceipt(p)}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    background: isSelected ? "rgba(59, 130, 246, 0.1)" : "var(--surface-bg)",
                    border: isSelected ? "1px solid #3b82f6" : "1px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600, fontSize: "13px", color: isSelected ? "#3b82f6" : "var(--text-primary)" }}>
                      {p.receiptNumber}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: "13px", color: "#10b981" }}>
                      ₹{p.amount.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                    {p.studentName} · {p.studentClass}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "4px" }}>
                    {p.paymentDate} · {p.paymentMode}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Printable Receipt Document */}
        {selectedReceipt ? (
          <div
            id="printable-receipt"
            className="card"
            style={{
              padding: "40px",
              background: "#ffffff",
              color: "#1e293b",
              borderRadius: "var(--radius-md)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* School Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #0f172a",
                paddingBottom: "20px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "12px",
                    background: "#1e3a5f",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <School size={28} />
                </div>
                <div>
                  <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#1e3a5f", margin: 0 }}>
                    GREEN VALLEY SENIOR SECONDARY SCHOOL
                  </h1>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                    Affiliated to CBSE, New Delhi · Code: SE-GVS01 · Sector 15, New Delhi - 110001
                  </p>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
                    Phone: +91-11-2345-6789 · Email: accounts@greenvalleyschool.edu
                  </p>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    background: "#ecfdf5",
                    border: "1px solid #10b981",
                    color: "#047857",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  OFFICIAL RECEIPT
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                  {selectedReceipt.receiptNumber}
                </div>
              </div>
            </div>

            {/* Receipt Meta */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "24px",
                fontSize: "13px",
              }}
            >
              <div>
                <p style={{ margin: "3px 0", color: "#64748b" }}>
                  Student Name: <strong style={{ color: "#0f172a" }}>{selectedReceipt.studentName}</strong>
                </p>
                <p style={{ margin: "3px 0", color: "#64748b" }}>
                  Admission / Roll No: <strong style={{ color: "#0f172a" }}>{selectedReceipt.studentRollNo}</strong>
                </p>
                <p style={{ margin: "3px 0", color: "#64748b" }}>
                  Class & Section: <strong style={{ color: "#0f172a" }}>{selectedReceipt.studentClass}</strong>
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "3px 0", color: "#64748b" }}>
                  Receipt Date: <strong style={{ color: "#0f172a" }}>{selectedReceipt.paymentDate}</strong>
                </p>
                <p style={{ margin: "3px 0", color: "#64748b" }}>
                  Payment Mode: <strong style={{ color: "#0f172a" }}>{selectedReceipt.paymentMode}</strong>
                </p>
                <p style={{ margin: "3px 0", color: "#64748b" }}>
                  Txn Ref: <strong style={{ color: "#0f172a" }}>{selectedReceipt.transactionRef}</strong>
                </p>
              </div>
            </div>

            {/* Itemized Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #cbd5e1", textAlign: "left" }}>
                  <th style={{ padding: "10px", color: "#475569" }}>#</th>
                  <th style={{ padding: "10px", color: "#475569" }}>Description / Fee Particulars</th>
                  <th style={{ padding: "10px", color: "#475569" }}>Session</th>
                  <th style={{ padding: "10px", textAlign: "right", color: "#475569" }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 10px" }}>1</td>
                  <td style={{ padding: "12px 10px", fontWeight: 600 }}>
                    Academic Tuition & Activity Fee ({selectedReceipt.remarks || "Institutional Installment"})
                  </td>
                  <td style={{ padding: "12px 10px", color: "#64748b" }}>2026-27</td>
                  <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: 700 }}>
                    ₹{selectedReceipt.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid #0f172a" }}>
                  <td colSpan={3} style={{ padding: "12px 10px", fontWeight: 800, fontSize: "14px" }}>
                    TOTAL RECEIVED
                  </td>
                  <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: 800, fontSize: "16px", color: "#047857" }}>
                    ₹{selectedReceipt.amount.toLocaleString()}.00
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Verification Signatures */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "48px",
                paddingTop: "24px",
                borderTop: "1px dashed #cbd5e1",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    background: "#ecfdf5",
                    border: "1px solid #10b981",
                    borderRadius: "6px",
                    color: "#047857",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                >
                  <CheckCircle2 size={16} />
                  SMART EDU VERIFIED
                </div>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0" }}>
                  System-generated authentic document · No physical signature required
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                  {selectedReceipt.recordedBy || "Priya Patel"}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>
                  Accounts Officer / Cashier
                </div>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                  Green Valley School Accounts Branch
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: "48px", textAlign: "center", color: "var(--text-tertiary)" }}>
            No receipt selected.
          </div>
        )}
      </div>
    </div>
  );
}
