"use client";

import { useEffect, useState } from "react";
import { Award, Eye, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";
import AwardCertificateModal from "@/components/growth/AwardCertificateModal";

export default function StudentAwardsPage() {
  const [rewards, setRewards] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAward, setSelectedAward] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/growth/rewards?userId=user-student-01&recipientId=student-01")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setRewards(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const summary = rewards?.creditSummary || { totalPoints: 185, rankTitle: "Silver Growth Champion", level: 2, history: [] };
  const awardsList = rewards?.awards || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Credit Points & Evidence Awards"
        subtitle="Earn points for genuine academic improvement, mistake resolution, and learning plan consistency"
      />

      {/* REWARDS SUMMARY HEADER */}
      <div className="card" style={{ padding: "28px", background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", color: "white", borderRadius: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>
              NurtureKernel Growth Rank
            </span>
            <h2 style={{ fontSize: "28px", fontWeight: 900, marginTop: "4px" }}>
              {summary.rankTitle} (Level {summary.level})
            </h2>
            <p style={{ fontSize: "13px", opacity: 0.9, marginTop: "4px" }}>
              Points are awarded for verified learning milestones, non-gaming anti-fraud audit.
            </p>
          </div>

          <div style={{ padding: "16px 24px", background: "rgba(255,255,255,0.15)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: "36px", fontWeight: 900, color: "#fef08a" }}>{summary.totalPoints}</div>
            <div style={{ fontSize: "12px", opacity: 0.9 }}>Total Smart Credit Points</div>
          </div>
        </div>
      </div>

      {/* EARNED CERTIFICATES SECTION */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>My Verified Certificates</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {awardsList.map((aw: any) => (
            <div key={aw.id} style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Trophy size={18} color="#d97706" />
                  <strong style={{ fontSize: "15px", color: "#0f172a" }}>{aw.awardName}</strong>
                </div>
                <div style={{ fontSize: "13px", color: "#475569", marginTop: "4px" }}>{aw.reason}</div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSelectedAward(aw);
                  setIsModalOpen(true);
                }}
              >
                <Eye size={14} /> View Certificate
              </button>
            </div>
          ))}
        </div>
      </div>

      <AwardCertificateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} award={selectedAward} />
    </div>
  );
}
