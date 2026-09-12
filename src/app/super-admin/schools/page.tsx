"use client";

import { useEffect, useState } from "react";
import { Plus, Search, School, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { PageHeader, StatusBadge, Modal, EmptyState } from "@/components/dashboard/shared";

interface SchoolItem {
  id: string;
  name: string;
  code: string;
  city?: string;
  principalName?: string;
  studentCount?: number;
  teacherCount?: number;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  primaryColor: string;
  board?: string;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [city, setCity] = useState("New Delhi");
  const [board, setBoard] = useState("CBSE");
  const [principalFirstName, setPrincipalFirstName] = useState("");
  const [principalLastName, setPrincipalLastName] = useState("");
  const [principalEmail, setPrincipalEmail] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1e3a5f");

  useEffect(() => {
    loadSchools();
  }, []);

  async function loadSchools() {
    try {
      const res = await fetch("/api/schools");
      const json = await res.json();
      if (json.data?.data) {
        setSchools(json.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSchool(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code,
          city,
          board,
          principalFirstName,
          principalLastName,
          principalEmail,
          primaryColor,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({ type: "success", text: `School "${name}" created successfully with Principal assigned!` });
        setIsModalOpen(false);
        // Reset form
        setName("");
        setCode("");
        setPrincipalFirstName("");
        setPrincipalLastName("");
        setPrincipalEmail("");
        loadSchools();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to create school" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to create school" });
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      (s.city && s.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        title="Schools Management"
        subtitle="Manage registered educational institutions across the platform"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Plus size={18} /> Add New School
        </button>
      </PageHeader>

      {msg && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: msg.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: msg.type === "success" ? "#16a34a" : "#dc2626",
            border: `1px solid ${msg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {msg.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {msg.text}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: "20px", position: "relative", maxWidth: "400px" }}>
        <Search
          size={18}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
          }}
        />
        <input
          type="text"
          placeholder="Search by school name, code, or city..."
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

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
          Loading schools...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<School size={24} />}
          title="No Schools Found"
          description="Get started by creating your first school and assigning an administrator."
          action={
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Create School
            </button>
          }
        />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>School Name & Code</th>
                <th>Board & City</th>
                <th>Assigned Principal</th>
                <th>Students</th>
                <th>Teachers</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          background: s.primaryColor || "#1e3a5f",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        {s.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{s.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{s.code}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{s.board || "CBSE"}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{s.city || "New Delhi"}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{s.principalName || "Not assigned"}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{s.studentCount || 0}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{s.teacherCount || 0}</span>
                  </td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create School Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New School"
        subtitle="Provision a new institution with CBSE structure and assign its Principal"
      >
        <form onSubmit={handleCreateSchool} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              School Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. DPS International Academy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                School Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SE-DPS02"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "#0f172a" }}>
              Principal & Administrator Credentials
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 500, marginBottom: "4px" }}>
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh"
                  value={principalFirstName}
                  onChange={(e) => setPrincipalFirstName(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 500, marginBottom: "4px" }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gupta"
                  value={principalLastName}
                  onChange={(e) => setPrincipalLastName(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 500, marginBottom: "4px" }}>
                Principal Official Email *
              </label>
              <input
                type="email"
                required
                placeholder="principal@dps-academy.edu"
                value={principalEmail}
                onChange={(e) => setPrincipalEmail(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
              <span style={{ fontSize: "11px", color: "#64748b", marginTop: "4px", display: "block" }}>
                Default initial password will be set to: <code>password123</code>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create & Provision School"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
