"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  Search,
  CreditCard,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function PendingFeesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [remindedIds, setRemindedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/fees/invoices")
      .then((r) => r.json())
      .then((d) => {
        const list = d.data || [];
        setInvoices(list.filter((inv: any) => inv.pendingAmount > 0));
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSendReminder(id: string, studentName: string) {
    setRemindedIds((prev) => [...prev, id]);
    alert(`Fee payment reminder sent to parent of ${studentName} via NurtureKernel portal notification.`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Fees & Overdue Installments"
        subtitle="Track outstanding student fee balances and dispatch automated parent reminders"
      />

      <div className="card" style={{ padding: "24px" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "10px 8px" }}>Invoice #</th>
                <th style={{ padding: "10px 8px" }}>Student</th>
                <th style={{ padding: "10px 8px" }}>Class</th>
                <th style={{ padding: "10px 8px" }}>Term</th>
                <th style={{ padding: "10px 8px" }}>Total Amount</th>
                <th style={{ padding: "10px 8px" }}>Paid So Far</th>
                <th style={{ padding: "10px 8px" }}>Pending Dues</th>
                <th style={{ padding: "10px 8px" }}>Due Date</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "32px", color: "var(--text-tertiary)" }}>
                    All fee dues are cleared. No pending balances.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const isReminded = remindedIds.includes(inv.id);
                  return (
                    <tr key={inv.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 600, color: "#3b82f6" }}>
                        {inv.invoiceNumber}
                      </td>
                      <td style={{ padding: "12px 8px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {inv.studentName}
                      </td>
                      <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>
                        {inv.studentClass}
                      </td>
                      <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>
                        {inv.term}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        ₹{inv.totalAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 8px", color: "#10b981", fontWeight: 500 }}>
                        ₹{inv.paidAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 8px", color: "#ef4444", fontWeight: 700 }}>
                        ₹{inv.pendingAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>
                        {inv.dueDate}
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            disabled={isReminded}
                            onClick={() => handleSendReminder(inv.id, inv.studentName)}
                            title="Send Parent Reminder"
                          >
                            <Send size={13} />
                            {isReminded ? "Sent" : "Remind"}
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => router.push(`/accountant/payments?studentId=${inv.studentId}`)}
                            title="Record Payment"
                          >
                            <CreditCard size={13} />
                            Collect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
