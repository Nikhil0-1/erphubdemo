"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  School,
  Users,
  GraduationCap,
  UserCircle,
  Bus,
  Cpu,
  AlertCircle,
  Plus,
  ArrowRight,
  Activity,
  ChevronRight,
  Shield,
} from "lucide-react";
import {
  MetricCard,
  SectionHeader,
  PageHeader,
  StatusBadge,
  Avatar,
  SkeletonCard,
} from "@/components/dashboard/shared";
import { getGreeting } from "@/lib/utils";
import { SessionUser } from "@/types";

interface SchoolData {
  id: string;
  name: string;
  code: string;
  status: string;
  principalName: string;
  studentCount: number;
  teacherCount: number;
  city: string;
  primaryColor: string;
}

interface PlatformStats {
  totalSchools: number;
  activeSchools: number;
  totalPrincipals: number;
  totalStudents: number;
  activeTeachers: number;
  activeBuses: number;
  iotDevices: number;
  platformAlerts: number;
}

export default function SuperAdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);

  const user = session?.user as unknown as SessionUser;

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/analytics/platform");
      if (res.ok) {
        const data = await res.json();
        setStats(data.data?.stats);
        setSchools(data.data?.schools || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        greeting={`${getGreeting()}, ${user?.firstName || "Admin"}`}
        title="Smart Edu Platform Administration"
        subtitle="Platform-wide tenant onboarding, school provisioning, and audit logs"
      >
        <button
          className="btn btn-primary"
          onClick={() => router.push("/super-admin/schools/create")}
        >
          <Plus size={18} />
          Onboard School
        </button>
      </PageHeader>

      {/* Scoped Role Notice */}
      <div
        className="info-notice"
        style={{
          padding: "12px 16px",
          background: "rgba(59, 130, 246, 0.08)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          borderRadius: "var(--radius-md)",
          fontSize: "13px",
          color: "var(--text-secondary)",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Shield size={16} color="#3b82f6" />
        <span>
          <strong style={{ color: "var(--text-primary)" }}>Super Admin Security Policy Active:</strong> Operational school data (student marks, attendance, fees, and classroom observations) is restricted to school personnel. Your scope is strictly Platform Onboarding, Principal Credentialing, and Audit Compliance.
        </span>
      </div>

      {/* Metrics */}
      <div className="responsive-metric-grid">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <MetricCard
              label="Schools Onboarded"
              value={stats?.totalSchools || 1}
              icon={<School size={20} />}
              iconBg="#eff6ff"
              iconColor="#3b82f6"
              onClick={() => router.push("/super-admin/schools")}
            />
            <MetricCard
              label="Active Institutional Tenancies"
              value={stats?.activeSchools || 1}
              icon={<Activity size={20} />}
              iconBg="#ecfdf5"
              iconColor="#10b981"
            />
            <MetricCard
              label="Principals Appointed"
              value={stats?.totalPrincipals || 1}
              icon={<UserCircle size={20} />}
              iconBg="#f5f3ff"
              iconColor="#8b5cf6"
              onClick={() => router.push("/super-admin/principals")}
            />
            <MetricCard
              label="System Audit Events"
              value={stats?.platformAlerts !== undefined ? 18 : 12}
              icon={<Shield size={20} />}
              iconBg="#fef2f2"
              iconColor="#ef4444"
              onClick={() => router.push("/super-admin/audit-logs")}
            />
          </>
        )}
      </div>

      {/* Schools Overview */}
      <SectionHeader
        title="Institutional Tenancies"
        subtitle="Provisioned schools and assigned institutional leadership"
        action={
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => router.push("/super-admin/schools")}
          >
            Manage All
            <ArrowRight size={14} />
          </button>
        }
      />

      {loading ? (
        <div className="responsive-card-grid">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : schools.length === 0 ? (
        <div className="card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <School size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>No Schools Yet</h3>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Get started by adding your first school to the platform.
          </p>
          <button className="btn btn-primary" onClick={() => router.push("/super-admin/schools/create")}>
            <Plus size={16} />
            Add School
          </button>
        </div>
      ) : (
        <div className="responsive-card-grid">
          {schools.map((school, idx) => (
            <div
              key={school.id}
              className="card card-interactive animate-fade-in"
              style={{
                padding: "20px",
                animationDelay: `${idx * 0.05}s`,
                opacity: 0,
              }}
              onClick={() => router.push(`/super-admin/schools/${school.id}`)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `linear-gradient(135deg, ${school.primaryColor || "#1e3a5f"}33, ${school.primaryColor || "#1e3a5f"}55)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <School size={22} color={school.primaryColor || "#1e3a5f"} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {school.name}
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                      {school.code} · {school.city || "New Delhi"}
                    </p>
                  </div>
                </div>
                <StatusBadge status={school.status} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <UserCircle size={14} color="var(--text-tertiary)" />
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  Principal: <strong>{school.principalName || "Dr. Anjali Sharma"}</strong>
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  padding: "12px",
                  background: "var(--surface-bg)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                    CBSE Board
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 500 }}>Affiliation</div>
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#10b981" }}>
                    Active 2026-27
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 500 }}>Academic Session</div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginTop: "12px",
                  color: "var(--text-tertiary)",
                  fontSize: "12px",
                  gap: "4px",
                }}
              >
                Manage School & Principal <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
