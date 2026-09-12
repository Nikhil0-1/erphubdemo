"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  ShieldCheck,
  BellRing,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function RecordPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedStudentId = searchParams.get("studentId");

  const [students, setStudents] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState(preselectedStudentId || "student-01");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("inv-2026-002");
  const [amount, setAmount] = useState("20000");
  const [paymentMode, setPaymentMode] = useState("ONLINE");
  const [transactionRef, setTransactionRef] = useState("UPI-HDFC-998241");
  const [remarks, setRemarks] = useState("Term 2 Balance Settlement");
  const [notifyParent, setNotifyParent] = useState(true);
  const [isManualEntry, setIsManualEntry] = useState(true);

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((d) => setStudents(d.data || []));

    fetch("/api/fees/invoices")
      .then((r) => r.json())
      .then((d) => {
        const invs = d.data || [];
        setInvoices(invs);
        if (invs.length > 0) {
          const pending = invs.find((i: any) => i.pendingAmount > 0);
          if (pending) {
            setSelectedInvoiceId(pending.id);
            setAmount(String(pending.pendingAmount));
          }
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/fees/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          invoiceId: selectedInvoiceId,
          amount: Number(amount),
          paymentMode,
          transactionRef,
          remarks: `${remarks} ${isManualEntry ? "(Manual Entry by Accounts)" : ""}`,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to record payment");
      }

      setSuccessData(json.data);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6" style={{ maxWidth: "760px", margin: "0 auto" }}>
      <PageHeader
        title="Record Fee Payment"
        subtitle="Collect and reconcile institutional fee payments with immediate official receipting"
      />

      {successData ? (
        <div className="card" style={{ padding: "32px", textAlign: "center" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircle2 size={32} />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>
            Payment Recorded Successfully!
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
            Receipt <strong>{successData.payment?.receiptNumber}</strong> generated for ₹{Number(amount).toLocaleString()}.
            {notifyParent && " Automated notification sent to parent portal."}
          </p>

          <div
            style={{
              background: "var(--surface-bg)",
              padding: "16px",
              borderRadius: "var(--radius-md)",
              marginBottom: "24px",
              textAlign: "left",
              fontSize: "13px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <span style={{ color: "var(--text-tertiary)" }}>Student:</span>
              <div style={{ fontWeight: 600 }}>{successData.payment?.studentName} ({successData.payment?.studentRollNo})</div>
            </div>
            <div>
              <span style={{ color: "var(--text-tertiary)" }}>Payment Mode:</span>
              <div style={{ fontWeight: 600 }}>{successData.payment?.paymentMode}</div>
            </div>
            <div>
              <span style={{ color: "var(--text-tertiary)" }}>Txn Reference:</span>
              <div style={{ fontWeight: 600 }}>{successData.payment?.transactionRef}</div>
            </div>
            <div>
              <span style={{ color: "var(--text-tertiary)" }}>Recorded By:</span>
              <div style={{ fontWeight: 600 }}>{successData.payment?.recordedBy}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSuccessData(null);
                setAmount("");
                setTransactionRef("");
              }}
            >
              Record Another Payment
            </button>
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/accountant/receipts?id=${successData.payment?.id}`)}
            >
              <FileText size={16} />
              View & Print Receipt
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card" style={{ padding: "28px" }}>
          {errorMsg && (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                borderRadius: "var(--radius-md)",
                marginBottom: "20px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Select Student *
              </label>
              <select
                className="input"
                style={{ width: "100%" }}
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.admissionNumber || s.studentId}) · {s.className || "Class 7-A"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Target Invoice / Academic Term *
              </label>
              <select
                className="input"
                style={{ width: "100%" }}
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
                required
              >
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} - {inv.term} (Pending: ₹{inv.pendingAmount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  className="input"
                  style={{ width: "100%", fontSize: "16px", fontWeight: 600 }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 20000"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Payment Mode *
                </label>
                <select
                  className="input"
                  style={{ width: "100%" }}
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  required
                >
                  <option value="ONLINE">UPI / Online QR</option>
                  <option value="BANK_TRANSFER">NEFT / RTGS / Net Banking</option>
                  <option value="CASH">Cash (School Counter)</option>
                  <option value="CHEQUE">Cheque / Demand Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Transaction Ref / Cheque No. / Receipt Folio
              </label>
              <input
                type="text"
                className="input"
                style={{ width: "100%" }}
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. UPI-992384 or CHQ-001242"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Remarks / Notes
              </label>
              <input
                type="text"
                className="input"
                style={{ width: "100%" }}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Term 2 tuition fee partial installment"
              />
            </div>

            <div
              style={{
                background: "var(--surface-bg)",
                padding: "14px",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={notifyParent}
                  onChange={(e) => setNotifyParent(e.target.checked)}
                />
                <span>
                  <strong>Notify Parent:</strong> Send instant digital notification to parent portal upon recording.
                </span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isManualEntry}
                  onChange={(e) => setIsManualEntry(e.target.checked)}
                />
                <span>
                  <strong>Manual Entry by Accounts Office:</strong> Flag transaction with official verification stamp.
                </span>
              </label>
            </div>

            <div style={{ paddingTop: "12px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <CreditCard size={16} />
                {loading ? "Recording..." : "Record Payment & Generate Receipt"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
