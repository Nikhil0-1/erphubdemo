"use client";

import { Award, CheckCircle, Download, Printer, X, Sparkles, ShieldCheck } from "lucide-react";

interface CertificateProps {
  isOpen: boolean;
  onClose: () => void;
  award: {
    awardName: string;
    recipientName: string;
    reason: string;
    evidenceSummary: string;
    issuedByName: string;
    issuedAt: string;
    schoolName: string;
    certificateId: string;
  } | null;
}

export default function AwardCertificateModal({ isOpen, onClose, award }: CertificateProps) {
  if (!isOpen || !award) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "750px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          borderRadius: "20px",
          border: "4px solid #f59e0b",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          padding: "24px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          <X size={24} />
        </button>

        {/* CERTIFICATE HEADER */}
        <div style={{ textAlign: "center", borderBottom: "2px double #cbd5e1", paddingBottom: "16px", marginBottom: "20px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#d97706", fontWeight: 800, fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>
            <Sparkles size={16} /> {award.schoolName || "Green Valley School"}
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", marginTop: "4px", fontFamily: "serif" }}>
            CERTIFICATE OF EXCELLENCE & GROWTH
          </h1>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
            Certificate ID: <code>{award.certificateId}</code> · Verified Evidence Ledger
          </div>
        </div>

        {/* CERTIFICATE BODY */}
        <div style={{ textAlign: "center", padding: "0 10px" }}>
          <p style={{ fontSize: "13px", color: "#475569", fontStyle: "italic" }}>This official certificate is proudly awarded to</p>
          <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0284c7", margin: "8px 0" }}>
            {award.recipientName}
          </h2>

          <div style={{ display: "inline-block", padding: "6px 16px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "9999px", margin: "6px 0 14px" }}>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#b45309" }}>{award.awardName}</span>
          </div>

          <p style={{ fontSize: "14px", color: "#334155", lineHeight: 1.5, maxWidth: "580px", margin: "0 auto 16px" }}>
            "{award.reason}"
          </p>

          {/* VERIFIED EVIDENCE BOX */}
          <div
            style={{
              padding: "12px 14px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "10px",
              textAlign: "left",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#16a34a" }}>
              <ShieldCheck size={16} /> VERIFIED ACADEMIC EVIDENCE
            </div>
            <div style={{ fontSize: "12px", color: "#14532d", marginTop: "4px" }}>
              {award.evidenceSummary}
            </div>
          </div>

          {/* SIGNATURE FOOTER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Date Issued</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{award.issuedAt}</div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "cursive", fontSize: "20px", color: "#0284c7" }}>Dr. Anjali Sharma</div>
              <div style={{ fontSize: "12px", color: "#64748b", borderTop: "1px solid #cbd5e1", paddingTop: "2px", width: "160px" }}>
                Principal Signature
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Authorized Issuer</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{award.issuedByName}</div>
            </div>
          </div>
        </div>

        {/* BUTTON ACTIONS */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print Certificate
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            <CheckCircle size={16} /> Close & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
