"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  CreditCard,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/dashboard/shared";

export default function AccountantStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [stuRes, invRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/fees/invoices"),
      ]);
      if (stuRes.ok) {
        const data = await stuRes.json();
        setStudents(data.data || []);
      }
      if (invRes.ok) {
        const data = await invRes.json();
        setInvoices(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      `${s.firstName} ${s.lastName} ${s.admissionNumber || s.studentId}`.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Fee Ledgers"
        subtitle="Individual student balance tracking, invoices, and billing history"
      >
        <button
          className="btn btn-primary"
          onClick={() => router.push("/accountant/payments")}
        >
          <CreditCard size={16} />
          Record Payment
        </button>
      </PageHeader>

      {/* Filters bar */}
      <div className="card" style={{ padding: "16px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
          <input
            type="text"
            className="input"
            style={{ paddingLeft: "36px", width: "100%" }}
            placeholder="Search by student name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input"
          style={{ width: "180px" }}
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="all">All Classes</option>
          <option value="class-7a">Class 7-A</option>
        </select>
      </div>

      {/* Student List */}
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "10px 8px" }}>Roll / ID</th>
                <th style={{ padding: "10px 8px" }}>Student Name</th>
                <th style={{ padding: "10px 8px" }}>Class</th>
                <th style={{ padding: "10px 8px" }}>Total Billed</th>
                <th style={{ padding: "10px 8px" }}>Total Paid</th>
                <th style={{ padding: "10px 8px" }}>Outstanding Due</th>
                <th style={{ padding: "10px 8px" }}>Status</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "var(--text-tertiary)" }}>
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const stuInvoices = invoices.filter((inv) => inv.studentId === stu.id);
                  const totalBilled = stuInvoices.reduce((s, i) => s + i.totalAmount, 0) || 70000;
                  const totalPaid = stuInvoices.reduce((s, i) => s + i.paidAmount, 0) || 50000;
                  const pending = Math.max(0, totalBilled - totalPaid);
                  const isPaid = pending === 0;

                  return (
                    <tr key={stu.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                      <td style={{ padding: "12px 8px", fontWeight: 600, color: "var(--text-secondary)" }}>
                        {stu.admissionNumber || stu.studentId}
                      </td>
                      <td style={{ padding: "12px 8px", fontWeight: 600, color: "var(--text-primary)" }}>
                        {stu.firstName} {stu.lastName}
                      </td>
                      <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>
                        {stu.className || "Class 7-A"}
                      </td>
                      <td style={{ padding: "12px 8px", fontWeight: 600 }}>
                        ₹{totalBilled.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 8px", fontWeight: 600, color: "#10b981" }}>
                        ₹{totalPaid.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 8px", fontWeight: 700, color: isPaid ? "#10b981" : "#f97316" }}>
                        ₹{pending.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background: isPaid ? "rgba(16, 185, 129, 0.1)" : "rgba(249, 115, 22, 0.1)",
                            color: isPaid ? "#10b981" : "#f97316",
                          }}
                        >
                          {isPaid ? "PAID" : "PARTIAL DUE"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => router.push(`/accountant/receipts?studentId=${stu.id}`)}
                            title="View Receipts"
                          >
                            <FileText size={14} />
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => router.push(`/accountant/payments?studentId=${stu.id}`)}
                            title="Record Payment"
                          >
                            <CreditCard size={14} />
                            Pay
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
