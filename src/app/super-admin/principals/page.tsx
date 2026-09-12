"use client";

import { useEffect, useState } from "react";
import { UserPlus, Search, UserCircle, CheckCircle, AlertCircle, Loader2, Mail, Phone } from "lucide-react";
import { PageHeader, StatusBadge, Modal, EmptyState, Avatar } from "@/components/dashboard/shared";

export default function PrincipalsPage() {
  const [principals, setPrincipals] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [schoolId, setSchoolId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [resP, resS] = await Promise.all([fetch("/api/principals"), fetch("/api/schools")]);
      const jsonP = await resP.json();
      const jsonS = await resS.json();
      if (jsonP.data) setPrincipals(jsonP.data);
      if (jsonS.data?.data) {
        setSchools(jsonS.data.data);
        if (jsonS.data.data.length > 0 && !schoolId) {
          setSchoolId(jsonS.data.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignPrincipal(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/principals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, schoolId }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMsg({ type: "success", text: `Principal ${firstName} ${lastName} assigned successfully!` });
        setIsModalOpen(false);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        loadData();
      } else {
        setMsg({ type: "error", text: json.error?.message || "Failed to assign principal" });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to assign principal" });
    } finally {
      setSubmitting(false);
    }
  }

  const filtered = principals.filter(
    (p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.schoolName && p.schoolName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        title="Principals & Administrators"
        subtitle="Manage school-level leadership and executive credentials"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <UserPlus size={18} /> Add Principal
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
          }}
        >
          {msg.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {msg.text}
        </div>
      )}

      {/* Search */}
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
          placeholder="Search principal by name, email, or school..."
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
          Loading principals...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<UserCircle size={24} />}
          title="No Principals Found"
          description="Add a principal and assign them to an authorized school."
          action={
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <UserPlus size={16} /> Add Principal
            </button>
          }
        />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Principal Name</th>
                <th>Assigned School</th>
                <th>Contact Details</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Avatar name={`${p.firstName} ${p.lastName}`} size={36} />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {p.firstName} {p.lastName}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#0ea5e9" }}>{p.schoolName || "Green Valley School"}</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "12px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Mail size={12} /> {p.email}
                      </span>
                      {p.phone && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#64748b" }}>
                          <Phone size={12} /> {p.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                      }}
                    >
                      PRINCIPAL
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={p.status || "ACTIVE"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Principal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add & Assign Principal"
        subtitle="Invite or assign an executive administrator to a school"
      >
        <form onSubmit={handleAssignPrincipal} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Official Email *
            </label>
            <input
              type="email"
              required
              placeholder="principal@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Phone</label>
            <input
              type="tel"
              placeholder="+91-98765-43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
              Assign to School *
            </label>
            <select
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save & Assign Principal"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
