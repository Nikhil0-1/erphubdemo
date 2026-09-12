"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, CheckCircle2, Shield, Calendar } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function FeeStructuresPage() {
  const [structures, setStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fees/structures")
      .then((r) => r.json())
      .then((d) => setStructures(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Structures & Categories"
        subtitle="Annual tuition slabs, lab fees, co-curricular funds, and installment frequencies"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" }}>
        {structures.map((fs) => (
          <div key={fs.id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {fs.name}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Session: {fs.academicYear} · Due: {fs.dueDate}
                </p>
              </div>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                }}
              >
                {fs.status}
              </span>
            </div>

            {/* Fee Components Table */}
            <div style={{ background: "var(--surface-bg)", borderRadius: "var(--radius-md)", padding: "12px", marginBottom: "16px" }}>
              <table style={{ width: "100%", fontSize: "13px" }}>
                <thead>
                  <tr style={{ color: "var(--text-tertiary)", textAlign: "left", borderBottom: "1px solid var(--border-color)" }}>
                    <th style={{ paddingBottom: "6px" }}>Particulars</th>
                    <th style={{ paddingBottom: "6px" }}>Frequency</th>
                    <th style={{ paddingBottom: "6px", textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {fs.categories?.map((cat: any) => (
                    <tr key={cat.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "8px 0", fontWeight: 500 }}>{cat.name}</td>
                      <td style={{ padding: "8px 0", color: "var(--text-secondary)", fontSize: "12px" }}>{cat.frequency}</td>
                      <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 600 }}>₹{cat.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Late Fee Rule</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#f97316" }}>₹{fs.lateFeePerDay || 50} / day after due date</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
