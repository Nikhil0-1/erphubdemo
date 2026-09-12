"use client";

import { ReactNode } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  X,
} from "lucide-react";

// ============================================================
// METRIC CARD
// ============================================================

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  change?: number;
  changeLabel?: string;
  subtext?: string;
  onClick?: () => void;
}

export function MetricCard({
  label,
  value,
  icon,
  iconBg = "#eff6ff",
  iconColor = "#3b82f6",
  change,
  changeLabel,
  subtext,
  onClick,
}: MetricCardProps) {
  return (
    <div
      className={`card metric-card ${onClick ? "card-interactive" : ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div
          className="metric-icon"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        {change !== undefined && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              fontSize: "12px",
              fontWeight: 500,
              color: change > 0 ? "#16a34a" : change < 0 ? "#dc2626" : "#64748b",
            }}
          >
            {change > 0 ? <TrendingUp size={14} /> : change < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">
        {label}
        {changeLabel && (
          <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}> · {changeLabel}</span>
        )}
      </div>
      {subtext && (
        <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "4px" }}>
          {subtext}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SECTION HEADER
// ============================================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div
      className="section-header-responsive"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "17px",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

// ============================================================
// QUICK ACTION CARD
// ============================================================

interface QuickActionProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  color?: string;
  bg?: string;
}

export function QuickAction({ label, icon, onClick, color = "#0ea5e9", bg = "#f0f9ff" }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="card card-interactive"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "16px 12px",
        border: "1px solid var(--border-default)",
        background: "var(--surface-card)",
        cursor: "pointer",
        textAlign: "center",
        width: "100%",
        fontFamily: "var(--font-sans)",
        transition: "all var(--transition-fast)",
      }}
    >
      <div
        className="quick-action-icon"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: bg,
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)", lineHeight: 1.3 }}>
        {label}
      </span>
    </button>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "var(--surface-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-tertiary)",
          marginBottom: "16px",
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
        {title}
      </h3>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", maxWidth: "320px", marginBottom: action ? "20px" : "0" }}>
        {description}
      </p>
      {action}
    </div>
  );
}

// ============================================================
// STATUS BADGE
// ============================================================

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "dot";
}

// Dark-mode aware status config
function getStatusConfig(status: string, isDarkMode: boolean): { bg: string; color: string; label: string } {
  const lightMap: Record<string, { bg: string; color: string; label: string }> = {
    ACTIVE:       { bg: "#dcfce7", color: "#166534", label: "Active" },
    INACTIVE:     { bg: "#f1f5f9", color: "#475569", label: "Inactive" },
    ONLINE:       { bg: "#dcfce7", color: "#166534", label: "Online" },
    OFFLINE:      { bg: "#fee2e2", color: "#991b1b", label: "Offline" },
    PRESENT:      { bg: "#dcfce7", color: "#166534", label: "Present" },
    ABSENT:       { bg: "#fee2e2", color: "#991b1b", label: "Absent" },
    LATE:         { bg: "#fef3c7", color: "#92400e", label: "Late" },
    HALF_DAY:     { bg: "#e0e7ff", color: "#3730a3", label: "Half Day" },
    OPEN:         { bg: "#fef3c7", color: "#92400e", label: "Open" },
    IN_REVIEW:    { bg: "#e0e7ff", color: "#3730a3", label: "In Review" },
    ACTION_TAKEN: { bg: "#f0f9ff", color: "#0369a1", label: "Action Taken" },
    RESOLVED:     { bg: "#dcfce7", color: "#166534", label: "Resolved" },
    INVITED:      { bg: "#f3e8ff", color: "#6b21a8", label: "Invited" },
    SUSPENDED:    { bg: "#fee2e2", color: "#991b1b", label: "Suspended" },
    NOT_STARTED:  { bg: "#f1f5f9", color: "#475569", label: "Not Started" },
    COMPLETED:    { bg: "#dcfce7", color: "#166534", label: "Completed" },
    CANCELLED:    { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" },
  };

  const darkMap: Record<string, { bg: string; color: string; label: string }> = {
    ACTIVE:       { bg: "rgba(34,197,94,0.15)",   color: "#4ade80", label: "Active" },
    INACTIVE:     { bg: "rgba(100,116,139,0.15)", color: "#94a3b8", label: "Inactive" },
    ONLINE:       { bg: "rgba(34,197,94,0.15)",   color: "#4ade80", label: "Online" },
    OFFLINE:      { bg: "rgba(239,68,68,0.15)",   color: "#f87171", label: "Offline" },
    PRESENT:      { bg: "rgba(34,197,94,0.15)",   color: "#4ade80", label: "Present" },
    ABSENT:       { bg: "rgba(239,68,68,0.15)",   color: "#f87171", label: "Absent" },
    LATE:         { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24", label: "Late" },
    HALF_DAY:     { bg: "rgba(99,102,241,0.2)",   color: "#a5b4fc", label: "Half Day" },
    OPEN:         { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24", label: "Open" },
    IN_REVIEW:    { bg: "rgba(99,102,241,0.2)",   color: "#a5b4fc", label: "In Review" },
    ACTION_TAKEN: { bg: "rgba(14,165,233,0.15)",  color: "#38bdf8", label: "Action Taken" },
    RESOLVED:     { bg: "rgba(34,197,94,0.15)",   color: "#4ade80", label: "Resolved" },
    INVITED:      { bg: "rgba(139,92,246,0.2)",   color: "#c4b5fd", label: "Invited" },
    SUSPENDED:    { bg: "rgba(239,68,68,0.15)",   color: "#f87171", label: "Suspended" },
    NOT_STARTED:  { bg: "rgba(100,116,139,0.15)", color: "#94a3b8", label: "Not Started" },
    COMPLETED:    { bg: "rgba(34,197,94,0.15)",   color: "#4ade80", label: "Completed" },
    CANCELLED:    { bg: "rgba(239,68,68,0.15)",   color: "#f87171", label: "Cancelled" },
  };

  const map = isDarkMode ? darkMap : lightMap;
  return map[status] || (isDarkMode
    ? { bg: "rgba(100,116,139,0.15)", color: "#94a3b8", label: status }
    : { bg: "#f1f5f9", color: "#475569", label: status }
  );
}

export function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  // Read dark mode from document — avoids adding theme context dependency
  const isDarkMode = typeof document !== "undefined"
    ? document.documentElement.classList.contains("dark")
    : false;

  const config = getStatusConfig(status, isDarkMode);

  if (variant === "dot") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: config.color }} />
        <span style={{ fontSize: "13px", color: config.color, fontWeight: 500 }}>{config.label}</span>
      </div>
    );
  }

  return (
    <span
      className="badge"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

// ============================================================
// LOADING SKELETON
// ============================================================

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: "20px" }}>
      <div className="skeleton" style={{ width: "40px", height: "40px", marginBottom: "12px" }} />
      <div className="skeleton" style={{ width: "60px", height: "24px", marginBottom: "8px" }} />
      <div className="skeleton" style={{ width: "100px", height: "12px" }} />
    </div>
  );
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ width: "100%", height: "48px" }} />
      ))}
    </div>
  );
}

// ============================================================
// AVATAR
// ============================================================

interface AvatarProps {
  name: string;
  size?: number;
  src?: string;
}

export function Avatar({ name, size = 36, src }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "var(--radius-full)",
          objectFit: "cover",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "var(--radius-full)",
        background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 600,
        color: "white",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// ============================================================
// PAGE HEADER
// ============================================================

interface PageHeaderProps {
  greeting?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHeader({ greeting, title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="page-header-container">
      <div className="page-header-content">
        {greeting && (
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: 500 }}>
            {greeting}
          </p>
        )}
        <h1
          className="page-header-title"
          style={{
            fontSize: "clamp(20px, 4.5vw, 28px)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.025em",
            lineHeight: 1.25,
            wordBreak: "normal",
            overflowWrap: "break-word",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px", lineHeight: 1.4, wordBreak: "normal", overflowWrap: "break-word" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="page-header-actions">{children}</div>}
    </div>
  );
}

// ============================================================
// MODAL
// ============================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = "560px" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--surface-card)",
          color: "var(--text-primary)",
          borderRadius: "16px",
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid var(--border-default)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>{title}</h3>
            {subtitle && <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--surface-hover)",
              border: "1px solid var(--border-default)",
              borderRadius: "8px",
              padding: "6px",
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}

