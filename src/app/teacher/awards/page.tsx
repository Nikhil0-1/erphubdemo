"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, CheckCircle, Sparkles, ShieldCheck, Eye, Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shared";
import AwardCertificateModal from "@/components/growth/AwardCertificateModal";

export default function TeacherAwardsPage() {
  const router = useRouter();
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAward, setSelectedAward] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/growth/rewards?recipientId=student-01")
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.awards) setAwards(d.data.awards);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApproveRecommended = async () => {
    try {
      const res = await fetch("/api/growth/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE_AWARD",
          recipientId: "student-01",
          recipientName: "Aarav Kumar",
          recipientRole: "STUDENT",
          awardName: "Most Improved Learner",
          category: "STUDENT",
          reason: "Demonstrated verified improvement in Geometry → Angles following targeted practice & revision.",
          evidenceSummary: "Geometry test accuracy increased from 51% to 68% after completing assigned practice set.",
        }),
      });
      const data = await res.json();
      if (data.data) {
        setAwards((prev) => [data.data, ...prev]);
        setSelectedAward(data.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence-Based Student Awards"
        subtitle="AI candidates suggested from verified growth evidence. Authorized human approval required for certificate issuance."
      />

      {/* AI RECOMMENDATION CANDIDATE BANNER */}
      <div className="card" style={{ padding: "24px", background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", border: "1px solid #fde68a" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f59e0b", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={24} />
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#b45309", textTransform: "uppercase" }}>AI Award Candidate Suggestion</span>
              <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#78350f", margin: "2px 0" }}>Aarav Kumar — "Most Improved Learner"</h3>
              <p style={{ fontSize: "13px", color: "#92400e" }}>
                Evidence: Geometry performance improved by 17 percentage points (51% → 68%) following 10 practice questions.
              </p>
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleApproveRecommended} style={{ background: "#d97706", borderColor: "#d97706" }}>
            <CheckCircle size={16} /> Approve & Issue Certificate
          </button>
        </div>
      </div>

      {/* ISSUED AWARDS LIST */}
      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Issued Certificates Ledger</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {awards.map((aw) => (
            <div key={aw.id} style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Award size={18} color="#d97706" />
                  <strong style={{ fontSize: "15px", color: "#0f172a" }}>{aw.awardName}</strong>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 6px", background: "#f0fdf4", color: "#16a34a", borderRadius: "4px" }}>
                    {aw.status}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#475569", marginTop: "4px" }}>
                  Recipient: <strong>{aw.recipientName}</strong> · Reason: {aw.reason}
                </div>
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
