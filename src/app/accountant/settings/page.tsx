"use client";

import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/dashboard/shared";
import { SessionUser } from "@/types";
import { ShieldCheck, Mail, Phone, Building } from "lucide-react";

export default function AccountantSettingsPage() {
  const { data: session } = useSession();
  const user = session?.user as unknown as SessionUser;

  return (
    <div className="space-y-6" style={{ maxWidth: "680px" }}>
      <PageHeader
        title="Accounts Office Settings"
        subtitle="Financial authority credentials, receipt headers, and notification preferences"
      />

      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "var(--text-primary)" }}>
          Official Profile
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <label style={{ color: "var(--text-tertiary)", display: "block", fontSize: "12px" }}>Staff Member</label>
            <div style={{ fontWeight: 600, fontSize: "15px" }}>{user?.firstName} {user?.lastName}</div>
          </div>
          <div>
            <label style={{ color: "var(--text-tertiary)", display: "block", fontSize: "12px" }}>Institutional Email</label>
            <div style={{ fontWeight: 500 }}>{user?.email}</div>
          </div>
          <div>
            <label style={{ color: "var(--text-tertiary)", display: "block", fontSize: "12px" }}>Role Designation</label>
            <div style={{ fontWeight: 600, color: "#3b82f6" }}>Authorized Institutional Accountant</div>
          </div>
          <div>
            <label style={{ color: "var(--text-tertiary)", display: "block", fontSize: "12px" }}>Assigned Institution</label>
            <div style={{ fontWeight: 600 }}>{user?.schoolName || "Green Valley School"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
