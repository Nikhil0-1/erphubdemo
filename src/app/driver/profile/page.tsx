"use client";

import { useSession } from "next-auth/react";
import { User, ShieldCheck, Phone, Mail, Award, Calendar, FileText } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";

export default function DriverProfilePage() {
  const { data: session } = useSession();

  return (
    <div>
      <PageHeader
        title="Driver Profile & Credentials"
        subtitle="Commercial driver license details, background clearance verification, and contact registry"
      />

      <div style={{ maxWidth: "800px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div className="card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "#fef3c7",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: 800,
              }}
            >
              RK
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a" }}>Rajesh Kumar</h2>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "#dcfce7",
                    color: "#15803d",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ShieldCheck size={14} /> Certified School Driver
                </span>
              </div>
              <div style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
                Green Valley High School • Fleet Team Member since 2021
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", marginBottom: "4px" }}>EMAIL</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={14} color="#64748b" /> rajesh.driver@greenvalley.edu
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", marginBottom: "4px" }}>PHONE CONTACT</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={14} color="#64748b" /> +91 98765 43214
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", marginBottom: "4px" }}>COMMERCIAL LICENSE</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                <FileText size={14} color="#64748b" /> DL-0420190038291 (Heavy)
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", marginBottom: "4px" }}>LICENSE VALIDITY</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#16a34a", display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={14} color="#16a34a" /> Valid until Oct 2028
              </div>
            </div>
          </div>
        </div>

        {/* POLICE VERIFICATION & MEDICAL CLEARANCE */}
        <div className="card" style={{ padding: "20px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
            Mandatory Safety Clearances
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", borderRadius: "6px" }}>
              <span style={{ fontSize: "13px", color: "#334155" }}>State Police Criminal Background Clearance</span>
              <span style={{ color: "#16a34a", fontWeight: 600, fontSize: "12px" }}>✓ Verified (Clear)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", borderRadius: "6px" }}>
              <span style={{ fontSize: "13px", color: "#334155" }}>Annual Medical & Vision Acuity Check</span>
              <span style={{ color: "#16a34a", fontWeight: 600, fontSize: "12px" }}>✓ Passed (20/20 with correction)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", borderRadius: "6px" }}>
              <span style={{ fontSize: "13px", color: "#334155" }}>Child Passenger Safety Protocol Certified</span>
              <span style={{ color: "#16a34a", fontWeight: 600, fontSize: "12px" }}>✓ Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
