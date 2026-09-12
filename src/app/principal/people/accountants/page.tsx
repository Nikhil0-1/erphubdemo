"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function PrincipalAccountantsPage() {
  const router = useRouter();
  const [accountants, setAccountants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qualification, setQualification] = useState("Chartered Accountant / M.Com");
  const [employeeId, setEmployeeId] = useState("GV-ACC-02");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadAccountants();
  }, []);

  function loadAccountants() {
    fetch("/api/accountants")
      .then((r) => r.json())
      .then((d) => setAccountants(d.data || []))
      .finally(() => setLoading(false));
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");

    try {
      const res = await fetch("/api/accountants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          qualification,
          employeeId,
          password: "password123",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to invite accountant");
      }

      setMsg("Accountant invited and account credentialed successfully!");
      setShowInviteModal(false);
      setName("");
      setEmail("");
      setPhone("");
      loadAccountants();
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Accountants & Finance Officers"
        subtitle="Manage designated accounts personnel with access to fee collection and receipts"
      >
        <button
          className="btn btn-primary"
          onClick={() => setShowInviteModal(true)}
        >
          <UserPlus size={16} />
          Invite Accountant
        </button>
      </PageHeader>

      {msg && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(16, 185, 129, 0.1)",
            color: "#10b981",
            borderRadius: "var(--radius-md)",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle2 size={16} />
          {msg}
        </div>
      )}

      {/* Accountants List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {accountants.map((acc) => (
          <div key={acc.id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                {acc.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {acc.name}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Emp ID: {acc.employeeId} · Joined {acc.joiningDate || "2023-04-01"}
                </p>
              </div>
            </div>

            <div style={{ background: "var(--surface-bg)", padding: "12px", borderRadius: "var(--radius-md)", marginBottom: "16px", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <Mail size={14} color="var(--text-tertiary)" />
                <span>{acc.email}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <Phone size={14} color="var(--text-tertiary)" />
                <span>{acc.phone || "+91 98765 43219"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Building size={14} color="var(--text-tertiary)" />
                <span style={{ color: "var(--text-secondary)" }}>{acc.department || "Finance & Accounts"}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                }}
              >
                {acc.status || "ACTIVE"}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                {acc.qualification}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to invite */}
      {showInviteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div className="card" style={{ width: "100%", maxWidth: "480px", padding: "28px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>
              Invite Accountant
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Provision an official institutional Accountant account with access to fee structures, invoices, and payments.
            </p>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  className="input"
                  style={{ width: "100%" }}
                  placeholder="e.g. Priya Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Institutional Email *
                </label>
                <input
                  type="email"
                  className="input"
                  style={{ width: "100%" }}
                  placeholder="e.g. priya.patel@greenvalley.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="input"
                    style={{ width: "100%" }}
                    placeholder="+91 98765..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                    Employee ID
                  </label>
                  <input
                    type="text"
                    className="input"
                    style={{ width: "100%" }}
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Qualifications / Certifications
                </label>
                <input
                  type="text"
                  className="input"
                  style={{ width: "100%" }}
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "12px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Inviting..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
