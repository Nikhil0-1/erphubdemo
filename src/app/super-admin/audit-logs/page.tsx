"use client";

import { useEffect, useState } from "react";
import { Shield, Search, RefreshCw, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/audit-logs");
      const json = await res.json();
      if (json.data) setLogs(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Audit & Compliance Logs"
        subtitle="Immutable security trail of administrative actions, enrollments, and access events"
      >
        <button
          onClick={loadLogs}
          className="btn btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <RefreshCw size={16} /> Refresh Trail
        </button>
      </PageHeader>

      <div style={{ marginBottom: "20px", maxWidth: "400px", position: "relative" }}>
        <Search
          size={18}
          style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
        />
        <input
          type="text"
          placeholder="Filter audit logs by action or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px 10px 38px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "14px",
          }}
        />
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Role</th>
                <th>Action</th>
                <th>Target Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={13} />
                      {new Date(l.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{l.userName}</td>
                  <td>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "#f1f5f9",
                        color: "#475569",
                      }}
                    >
                      {l.role}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color:
                          l.action.includes("CREATE") || l.action.includes("ADD")
                            ? "#16a34a"
                            : l.action.includes("START")
                            ? "#0ea5e9"
                            : "#64748b",
                      }}
                    >
                      {l.action}
                    </span>
                  </td>
                  <td style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{l.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
