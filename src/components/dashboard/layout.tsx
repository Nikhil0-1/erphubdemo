"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  School,
  Users,
  UserCircle,
  BookOpen,
  ClipboardCheck,
  Activity,
  Bus,
  Cpu,
  Sparkles,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Search,
  FileText,
  BarChart3,
  Shield,
  Target,
  Calendar,
  MessageSquare,
  Award,
  FolderOpen,
  AlertTriangle,
  Wallet,
  Map,
  Navigation,
  History,
  User,
  Home,
  Sun,
  Moon,
  Check,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";
import { SessionUser } from "@/types";
import { useTheme } from "@/components/ThemeProvider";
import DemoFlowRunner from "@/components/growth/DemoFlowRunner";

// Navigation configuration per role
const NAV_CONFIG: Record<
  string,
  { label: string; href: string; icon: React.ElementType; children?: { label: string; href: string }[] }[]
> = {
  SUPER_ADMIN: [
    { label: "Platform Overview", href: "/super-admin", icon: LayoutDashboard },
    { label: "Schools Onboarding", href: "/super-admin/schools", icon: School },
    { label: "Principals Assigned", href: "/super-admin/principals", icon: UserCircle },
    { label: "Platform Audit Logs", href: "/super-admin/audit-logs", icon: Shield },
    { label: "Settings", href: "/super-admin/settings", icon: Settings },
  ],
  PRINCIPAL: [
    { label: "Dashboard", href: "/principal", icon: LayoutDashboard },
    { label: "People & Staff", href: "/principal/people", icon: Users },
    { label: "Students", href: "/principal/students", icon: GraduationCap },
    { label: "Academics", href: "/principal/academics", icon: BookOpen },
    { label: "Fees & Finance", href: "/principal/fees", icon: Wallet },
    { label: "Attendance", href: "/principal/attendance", icon: ClipboardCheck },
    { label: "Development", href: "/principal/development", icon: Target },
    { label: "Portfolio", href: "/principal/portfolio", icon: FolderOpen },
    { label: "Transport", href: "/principal/transport", icon: Bus },
    { label: "IoT", href: "/principal/iot", icon: Cpu },
    { label: "Assistant", href: "/principal/assistant", icon: Sparkles },
    { label: "Reports", href: "/principal/reports", icon: FileText },
    { label: "Notifications", href: "/principal/notifications", icon: Bell },
    { label: "Settings", href: "/principal/settings", icon: Settings },
  ],
  ACCOUNTANT: [
    { label: "Overview", href: "/accountant", icon: LayoutDashboard },
    { label: "Student Fees", href: "/accountant/students", icon: Users },
    { label: "Fee Structures", href: "/accountant/structures", icon: FileText },
    { label: "Record Payment", href: "/accountant/payments", icon: Wallet },
    { label: "Receipts", href: "/accountant/receipts", icon: Award },
    { label: "Defaulters & Pending", href: "/accountant/pending", icon: AlertTriangle },
    { label: "Settings", href: "/accountant/settings", icon: Settings },
  ],
  TEACHER: [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "Growth Room", href: "/teacher/growth-room/student-01", icon: HeartHandshake },
    { label: "My Classes", href: "/teacher/classes", icon: BookOpen },
    { label: "Students", href: "/teacher/students", icon: GraduationCap },
    { label: "Student Growth", href: "/teacher/growth", icon: Target },
    { label: "Evidence Awards", href: "/teacher/awards", icon: Award },
    { label: "Interventions", href: "/teacher/interventions", icon: HeartHandshake },
    { label: "Attendance", href: "/teacher/attendance", icon: ClipboardCheck },
    { label: "Academics", href: "/teacher/academics", icon: BarChart3 },
    { label: "Assignments", href: "/teacher/assignments", icon: FileText },
    { label: "Activities", href: "/teacher/activities", icon: Activity },
    { label: "Development", href: "/teacher/development", icon: Target },
    { label: "Concerns", href: "/teacher/concerns", icon: AlertTriangle },
    { label: "Assistant", href: "/teacher/assistant", icon: Sparkles },
    { label: "Notifications", href: "/teacher/notifications", icon: Bell },
  ],
  PARENT: [
    { label: "Home", href: "/parent", icon: Home },
    { label: "Growth Room", href: "/parent/growth-room", icon: HeartHandshake },
    { label: "My Children", href: "/parent/children", icon: Users },
    { label: "Academics", href: "/parent/academics", icon: BookOpen },
    { label: "Attendance", href: "/parent/attendance", icon: ClipboardCheck },
    { label: "Activities", href: "/parent/activities", icon: Activity },
    { label: "Development", href: "/parent/development", icon: Target },
    { label: "Portfolio", href: "/parent/portfolio", icon: FolderOpen },
    { label: "Fees & Dues", href: "/parent/fees", icon: Wallet },
    { label: "Transport", href: "/parent/transport", icon: Bus },
    { label: "Assistant", href: "/parent/assistant", icon: Sparkles },
    { label: "Notifications", href: "/parent/notifications", icon: Bell },
  ],
  STUDENT: [
    { label: "Home", href: "/student", icon: Home },
    { label: "Growth Room", href: "/student/growth-room", icon: HeartHandshake },
    { label: "Practice Zone", href: "/student/practice", icon: BookOpen },
    { label: "Mistake Book", href: "/student/mistakes", icon: History },
    { label: "Weak Topics", href: "/student/weak-topics", icon: AlertTriangle },
    { label: "Learning Path", href: "/student/learning-path", icon: Navigation },
    { label: "Study Planner", href: "/student/study-plan", icon: Calendar },
    { label: "Growth Insights", href: "/student/growth", icon: BarChart3 },
    { label: "Credit Points & Awards", href: "/student/awards", icon: Award },
    { label: "Skill Passport", href: "/student/skills", icon: Target },
    { label: "Assignments", href: "/student/assignments", icon: FileText },
    { label: "Attendance", href: "/student/attendance", icon: ClipboardCheck },
    { label: "Portfolio", href: "/student/portfolio", icon: FolderOpen },
    { label: "My Fee Receipts", href: "/student/fees", icon: Wallet },
    { label: "Assistant", href: "/student/assistant", icon: Sparkles },
    { label: "Notifications", href: "/student/notifications", icon: Bell },
  ],
  DRIVER: [
    { label: "Dashboard", href: "/driver", icon: LayoutDashboard },
    { label: "My Bus", href: "/driver/bus", icon: Bus },
    { label: "Current Route", href: "/driver/route", icon: Map },
    { label: "GPS", href: "/driver/gps", icon: Navigation },
    { label: "Trip History", href: "/driver/history", icon: History },
    { label: "Profile", href: "/driver/profile", icon: User },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Global keyboard shortcut for Command Palette (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--surface-bg)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <GraduationCap size={28} color="white" />
          </div>
          <div className="skeleton" style={{ width: "120px", height: "12px", margin: "0 auto" }} />
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user as unknown as SessionUser;
  const navItems = NAV_CONFIG[user.role] || [];
  const displayName = `${user.firstName} ${user.lastName}`;

  const isActive = (href: string) => {
    if (href === pathname) return true;
    // For dashboard root pages, match exact
    const rolePaths = ["/super-admin", "/principal", "/teacher", "/student", "/parent", "/driver"];
    if (rolePaths.includes(href) && href === pathname) return true;
    // For sub-pages, match prefix (but not the root)
    if (!rolePaths.includes(href) && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--surface-bg)" }}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 40,
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "var(--sidebar-width)",
          background: "var(--navy-950)",
          color: "white",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transition: "transform var(--transition-slow)",
          transform: sidebarOpen ? "translateX(0)" : undefined,
          overflowY: "auto",
        }}
        className="hide-mobile"
        id="sidebar-desktop"
      >
        <SidebarContent
          navItems={navItems}
          user={user}
          displayName={displayName}
          isActive={isActive}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className="hide-desktop"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "280px",
          background: "var(--navy-950)",
          color: "white",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transition: "transform var(--transition-slow)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          overflowY: "auto",
        }}
        id="sidebar-mobile"
      >
        <SidebarContent
          navItems={navItems}
          user={user}
          displayName={displayName}
          isActive={isActive}
          onClose={() => setSidebarOpen(false)}
          showClose
        />
      </aside>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          /* Desktop: sidebar offset handled here; mobile: CSS class overrides to 0 */
          marginLeft: "var(--sidebar-width)",
        }}
        className="main-content-area"
      >
        <DemoFlowRunner />
        {/* Top Header */}
        <header
          className="dashboard-header"
          style={{
            height: "var(--header-height)",
            background: "var(--surface-card)",
            borderBottom: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: "8px",
            position: "sticky",
            top: 0,
            zIndex: 30,
            /* Prevent any child from widening the header */
            overflow: "hidden",
          }}
        >
          {/* Mobile menu button */}
          <button
            className="btn btn-ghost btn-icon hide-desktop"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            style={{ flexShrink: 0 }}
          >
            <Menu size={20} />
          </button>

          {/* Desktop Search Bar — hidden on mobile */}
          <div className="header-search-wrapper">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0 12px",
                height: "38px",
                background: "var(--surface-bg)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                overflow: "hidden",
              }}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={16} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--text-tertiary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                Search students, classes, teachers...
              </span>
              <span
                style={{
                  flexShrink: 0,
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                  background: "var(--surface-card)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  border: "1px solid var(--border-default)",
                }}
              >
                ⌘K
              </span>
            </div>
          </div>

          {/* Mobile compact search icon — shown only on mobile */}
          <button
            className="btn btn-ghost btn-icon show-mobile-only"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
            style={{ flexShrink: 0 }}
          >
            <Search size={18} />
          </button>

          {/* Right Controls — flex-shrink:0 so they never get pushed off screen */}
          <div className="header-actions">
            {/* Dark / Light Mode Toggle */}
            <button
              className="btn btn-ghost btn-icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{ flexShrink: 0 }}
            >
              {isDark ? (
                <Sun size={18} style={{ color: "#fbbf24" }} />
              ) : (
                <Moon size={18} style={{ color: "var(--text-tertiary)" }} />
              )}
            </button>

            {/* Notifications */}
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => router.push(`/${user.role.toLowerCase().replace("_", "-")}/notifications`)}
              aria-label="Notifications"
              style={{ position: "relative", flexShrink: 0 }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  border: "2px solid var(--surface-card)",
                }}
              />
            </button>

            {/* Profile Avatar — always visible; name+logout only on desktop */}
            <button
              className="btn btn-ghost"
              onClick={() => signOut({ callbackUrl: "/login" })}
              style={{ gap: "6px", flexShrink: 0, paddingLeft: "4px", paddingRight: "4px" }}
              title="Sign Out"
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "var(--radius-full)",
                  background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <span className="hide-mobile" style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
                {displayName}
              </span>
              <LogOut size={14} className="hide-mobile" style={{ color: "var(--text-tertiary)" }} />
            </button>
          </div>
        </header>

        {/* Spotlight Command Palette (⌘K) */}
        {searchOpen && (
          <div
            onClick={() => setSearchOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(6px)",
              zIndex: 100,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: "12vh",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "90%",
                maxWidth: "560px",
                background: "var(--surface-card)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--border-default)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
                overflow: "hidden",
              }}
              className="animate-fade-in-scale"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border-default)",
                  gap: "12px",
                }}
              >
                <Search size={20} color="var(--sky-500)" />
                <input
                  type="text"
                  placeholder="Quick search or jump to section... (Type to filter)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "15px",
                    color: "var(--text-primary)",
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  style={{
                    background: "var(--surface-hover)",
                    border: "none",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    cursor: "pointer",
                    color: "var(--text-tertiary)",
                  }}
                >
                  ESC
                </button>
              </div>

              <div style={{ maxHeight: "360px", overflowY: "auto", padding: "8px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-tertiary)", padding: "6px 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Navigation Shortcuts
                </div>
                {navItems
                  .filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => {
                          router.push(item.href);
                          setSearchOpen(false);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          color: "var(--text-primary)",
                          textAlign: "left",
                          transition: "background 150ms",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <Icon size={18} color="var(--sky-500)" />
                          <span style={{ fontSize: "14px", fontWeight: 500 }}>{item.label}</span>
                        </div>
                        <ArrowRight size={15} color="var(--text-tertiary)" />
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            padding: "24px",
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto",
            /* Mobile padding overridden by globals.css breakpoints */
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomBar role={user.role} pathname={pathname} onOpenSidebar={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
}

// Sidebar Content Component
function SidebarContent({
  navItems,
  user,
  displayName,
  isActive,
  onClose,
  showClose,
}: {
  navItems: { label: string; href: string; icon: React.ElementType }[];
  user: SessionUser;
  displayName: string;
  isActive: (href: string) => boolean;
  onClose: () => void;
  showClose?: boolean;
}) {
  const router = useRouter();

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "#f59e0b",
    PRINCIPAL: "#3b82f6",
    TEACHER: "#22c55e",
    STUDENT: "#8b5cf6",
    PARENT: "#f97316",
    DRIVER: "#ef4444",
  };

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    PRINCIPAL: "Principal",
    TEACHER: "Teacher",
    STUDENT: "Student",
    PARENT: "Parent",
    DRIVER: "Driver",
  };

  return (
    <>
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap size={22} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}>Smart Edu</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Education Platform
            </div>
          </div>
        </div>
        {showClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* User info */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-full)",
              background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>{displayName}</div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: roleColors[user.role] || "#94a3b8",
              }}
            >
              {roleLabels[user.role] || user.role}
            </div>
          </div>
        </div>
        {user.schoolName && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <School size={12} />
            {user.schoolName}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: active ? "rgba(14, 165, 233, 0.15)" : "transparent",
                  color: active ? "#38bdf8" : "rgba(255,255,255,0.6)",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 150ms",
                  width: "100%",
                  textAlign: "left",
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                  }
                }}
              >
                <Icon size={18} />
                {item.label}
                {active && (
                  <div
                    style={{
                      marginLeft: "auto",
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "#38bdf8",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar footer */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 12px",
            borderRadius: "8px",
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.5)",
            fontSize: "13px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            fontFamily: "var(--font-sans)",
            transition: "all 150ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
            (e.currentTarget as HTMLElement).style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );
}

// Mobile Bottom Navigation Component
function MobileBottomBar({
  role,
  pathname,
  onOpenSidebar,
}: {
  role: string;
  pathname: string;
  onOpenSidebar: () => void;
}) {
  const router = useRouter();

  const getMobileItems = () => {
    switch (role) {
      case "TEACHER":
        return [
          { label: "Home", href: "/teacher", icon: Home },
          { label: "Growth", href: "/teacher/growth-room/student-01", icon: HeartHandshake },
          { label: "Attendance", href: "/teacher/attendance", icon: ClipboardCheck },
          { label: "Assistant", href: "/teacher/assistant", icon: Sparkles },
        ];
      case "STUDENT":
        return [
          { label: "Home", href: "/student", icon: Home },
          { label: "Growth", href: "/student/growth-room", icon: HeartHandshake },
          { label: "Practice", href: "/student/practice", icon: BookOpen },
          { label: "Assistant", href: "/student/assistant", icon: Sparkles },
        ];
      case "PARENT":
        return [
          { label: "Home", href: "/parent", icon: Home },
          { label: "Growth", href: "/parent/growth-room", icon: HeartHandshake },
          { label: "Children", href: "/parent/children", icon: Users },
          { label: "Assistant", href: "/parent/assistant", icon: Sparkles },
        ];
      case "PRINCIPAL":
        return [
          { label: "Home", href: "/principal", icon: LayoutDashboard },
          { label: "Students", href: "/principal/students", icon: GraduationCap },
          { label: "Academics", href: "/principal/academics", icon: BookOpen },
          { label: "Assistant", href: "/principal/assistant", icon: Sparkles },
        ];
      case "DRIVER":
        return [
          { label: "Home", href: "/driver", icon: LayoutDashboard },
          { label: "Bus", href: "/driver/bus", icon: Bus },
          { label: "Route", href: "/driver/route", icon: Map },
          { label: "GPS", href: "/driver/gps", icon: Navigation },
        ];
      default:
        return [
          { label: "Home", href: "/dashboard", icon: Home },
          { label: "Assistant", href: "/dashboard", icon: Sparkles },
        ];
    }
  };

  const items = getMobileItems();

  return (
    <div className="mobile-bottom-bar">
      {items.map((item, idx) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <button
            key={idx}
            className={`mobile-bottom-item ${active ? "active" : ""}`}
            onClick={() => router.push(item.href)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
      <button className="mobile-bottom-item" onClick={onOpenSidebar}>
        <Menu size={18} />
        <span>Menu</span>
      </button>
    </div>
  );
}

