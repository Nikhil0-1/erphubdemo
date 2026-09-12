"use client";

import { useState } from "react";
import { School, Save, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function PrincipalSettingsPage() {
  const [schoolName, setSchoolName] = useState("Green Valley School");
  const [board, setBoard] = useState("CBSE");
  const [session, setSession] = useState("2026-27");
  const [contact, setContact] = useState("+91-11-2345-6789");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <PageHeader title="School Settings" subtitle="Institutional profile, contact info, and board affiliations" />

      {saved && (
        <div style={{ padding: "12px 16px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: "8px", marginBottom: "20px" }}>
          ✓ School settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>School Name</label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Affiliation Board</label>
            <input
              type="text"
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Academic Session</label>
            <input
              type="text"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Contact Telephone</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
          <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
