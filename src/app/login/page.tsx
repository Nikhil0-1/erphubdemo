"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import {
  GraduationCap,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  Globe,
  Loader2,
  Lock,
  Mail,
  User,
  CheckCircle2,
} from "lucide-react";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  resetPassword,
} from "@/lib/firebase-auth";
import { UserRole } from "@/types";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Mode: "login" | "register" | "forgot"
  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("STUDENT");
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const roleRedirectMap: Record<string, string> = {
    SUPER_ADMIN: "/super-admin",
    PRINCIPAL: "/principal",
    ACCOUNTANT: "/accountant",
    TEACHER: "/teacher",
    STUDENT: "/student",
    PARENT: "/parent",
    DRIVER: "/driver",
  };

  // Handle Firebase Sign In
  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await loginWithEmail(email, password);
      if (res.success && res.redirectUrl) {
        // Also sync with NextAuth session for hybrid compatibility
        await signIn("credentials", {
          email: email.toLowerCase().trim(),
          password: "password123", // fallback demo pass for next-auth session bridge
          redirect: false,
        }).catch(() => {});

        router.push(res.redirectUrl);
        router.refresh();
      } else {
        // If Firebase failed, attempt standard credentials login
        const credRes = await signIn("credentials", {
          email: email.toLowerCase().trim(),
          password,
          redirect: false,
        });

        if (credRes?.error) {
          setError(res.error || credRes.error || "Authentication failed.");
        } else {
          const sessionRes = await fetch("/api/auth/session");
          const session = await sessionRes.json();
          const role = session?.user?.role;
          router.push(roleRedirectMap[role] || callbackUrl);
          router.refresh();
        }
      }
    } catch {
      setError("Something went wrong. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Firebase Registration
  const handleFirebaseRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email || !password || !firstName) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerWithEmail(email, password, selectedRole, {
        firstName,
        lastName,
        schoolId: "school_1",
        schoolName: "Green Valley International School",
      });

      if (res.success && res.redirectUrl) {
        setSuccessMsg("Account successfully created! Redirecting...");
        setTimeout(() => {
          router.push(res.redirectUrl || "/");
          router.refresh();
        }, 1200);
      } else {
        setError(res.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Failed to create account. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await loginWithGoogle();
      if (res.success && res.redirectUrl) {
        router.push(res.redirectUrl);
        router.refresh();
      } else if (res.error) {
        setError(res.error);
      }
    } catch {
      setError("Google sign-in was cancelled or encountered an error.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await resetPassword(email);
      if (res.success) {
        setSuccessMsg(res.message || "Reset email sent successfully.");
      } else {
        setError(res.error || "Could not send reset email.");
      }
    } catch {
      setError("Error sending password reset link.");
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login
  const quickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: demoEmail,
        password: "password123",
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        const role = session?.user?.role;
        router.push(roleRedirectMap[role] || "/");
        router.refresh();
      }
    } catch {
      setError("Quick login failed. Please try manual login.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #0a1929 0%, #102a43 50%, #1a365d 100%)",
      }}
    >
      {/* Left - Branding */}
      <div
        className="hide-mobile"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "-5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "10%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "520px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.4)",
              }}
            >
              <GraduationCap size={28} color="white" />
            </div>
            <div>
              <span style={{ fontSize: "28px", fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>
                Smart Edu
              </span>
              <span style={{ marginLeft: "8px", fontSize: "11px", background: "rgba(14, 165, 233, 0.2)", color: "#38bdf8", padding: "3px 8px", borderRadius: "12px", fontWeight: 600 }}>
                Firebase Enabled
              </span>
            </div>
          </div>

          <h1
            style={{
              fontSize: "44px",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "white",
              letterSpacing: "-0.03em",
              marginBottom: "20px",
            }}
          >
            One Platform.
            <br />
            <span style={{ color: "#38bdf8" }}>Smarter Schools.</span>
            <br />
            Better Student Journeys.
          </h1>

          <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#94a3b8", marginBottom: "48px", maxWidth: "440px" }}>
            Connected digital operating system with secure Firebase Authentication, Firestore cloud sync,
            and role-based access for school ecosystems.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: Globe, text: "Firebase Authentication & Multi-Tenant Data Isolation" },
              { icon: Sparkles, text: "Automated Role Profile Sync & Realtime Security Rules" },
              { icon: Shield, text: "Enterprise RBAC for Super Admin, Teachers, Parents & Drivers" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "rgba(14, 165, 233, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <item.icon size={18} color="#38bdf8" />
                </div>
                <span style={{ fontSize: "14px", color: "#cbd5e1" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px",
          background: "white",
          overflowY: "auto",
        }}
      >
        {/* Mobile Header */}
        <div className="hide-desktop" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap size={24} color="white" />
          </div>
          <span style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a" }}>Smart Edu</span>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            background: "#f1f5f9",
            padding: "4px",
            borderRadius: "10px",
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setError("");
              setSuccessMsg("");
            }}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "none",
              borderRadius: "8px",
              background: authMode === "login" ? "white" : "transparent",
              color: authMode === "login" ? "#0f172a" : "#64748b",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: authMode === "login" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 150ms",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setError("");
              setSuccessMsg("");
            }}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "none",
              borderRadius: "8px",
              background: authMode === "register" ? "white" : "transparent",
              color: authMode === "register" ? "#0f172a" : "#64748b",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: authMode === "register" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 150ms",
            }}
          >
            Create Account
          </button>
        </div>

        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "4px",
              letterSpacing: "-0.02em",
            }}
          >
            {authMode === "login" && "Welcome back"}
            {authMode === "register" && "Create your account"}
            {authMode === "forgot" && "Reset your password"}
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
            {authMode === "login" && "Sign in with your Firebase credentials or select demo role"}
            {authMode === "register" && "Register with Firebase Auth & link your school role"}
            {authMode === "forgot" && "Enter your email to receive a password reset link"}
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#065f46",
              marginBottom: "16px",
            }}
          >
            <CheckCircle2 size={16} color="#059669" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              fontSize: "13px",
              color: "#dc2626",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {/* GOOGLE SIGN IN BUTTON */}
        {authMode !== "forgot" && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "10px 16px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                background: "white",
                color: "#1e293b",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 150ms",
                marginBottom: "18px",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "white";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.97 0 12s.45 3.85 1.24 5.42l4.04-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              Continue with Google
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>
                Or with email
              </span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            </div>
          </>
        )}

        {/* LOGIN FORM */}
        {authMode === "login" && (
          <form onSubmit={handleFirebaseLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="input-label" htmlFor="login-email">
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="login-email"
                  type="email"
                  className="input"
                  placeholder="you@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{ paddingLeft: "36px" }}
                />
                <Mail size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="input-label" htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("forgot");
                    setError("");
                    setSuccessMsg("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#0ea5e9",
                    fontSize: "12px",
                    cursor: "pointer",
                    padding: 0,
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingLeft: "36px", paddingRight: "44px" }}
                />
                <Lock size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "#94a3b8",
                    display: "flex",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: "100%", marginTop: "4px" }}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <>
                  Sign In with Firebase
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {authMode === "register" && (
          <form onSubmit={handleFirebaseRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label className="input-label" htmlFor="reg-first">First Name</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="reg-first"
                    type="text"
                    className="input"
                    placeholder="Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={{ paddingLeft: "34px" }}
                  />
                  <User size={15} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>
              <div>
                <label className="input-label" htmlFor="reg-last">Last Name</label>
                <input
                  id="reg-last"
                  type="text"
                  className="input"
                  placeholder="Sharma"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="reg-role">Account Role</label>
              <select
                id="reg-role"
                className="input"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                style={{ cursor: "pointer" }}
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
                <option value="PARENT">Parent</option>
                <option value="PRINCIPAL">Principal</option>
                <option value="ACCOUNTANT">Accountant</option>
                <option value="DRIVER">Driver</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="input-label" htmlFor="reg-email">Email Address</label>
              <div style={{ position: "relative" }}>
                <input
                  id="reg-email"
                  type="email"
                  className="input"
                  placeholder="name@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: "34px" }}
                />
                <Mail size={15} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="reg-password">Password (min 6 characters)</label>
              <div style={{ position: "relative" }}>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: "34px", paddingRight: "40px" }}
                />
                <Lock size={15} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "#94a3b8",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: "100%", marginTop: "6px" }}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <>
                  Register with Firebase
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {authMode === "forgot" && (
          <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="input-label" htmlFor="forgot-email">
                Registered Email Address
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="forgot-email"
                  type="email"
                  className="input"
                  placeholder="you@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: "36px" }}
                />
                <Mail size={16} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                "Send Password Reset Link"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setError("");
                setSuccessMsg("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: "13px",
                cursor: "pointer",
                marginTop: "4px",
              }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* Demo Quick Login */}
        <div style={{ marginTop: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Quick Demo Access (1-Click)
            </span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {[
              { label: "Super Admin", email: "admin@smartedu.com", color: "#0f172a" },
              { label: "Principal", email: "anjali.sharma@greenvalley.edu", color: "#1e40af" },
              { label: "Accountant", email: "priya.patel@greenvalley.edu", color: "#0891b2" },
              { label: "Teacher", email: "rahul.sharma@greenvalley.edu", color: "#047857" },
              { label: "Parent", email: "raj.kumar@gmail.com", color: "#b45309" },
              { label: "Student", email: "aarav.kumar@student.greenvalley.edu", color: "#7c3aed" },
              { label: "Driver", email: "rajesh.driver@greenvalley.edu", color: "#be123c" },
            ].map((item) => (
              <button
                key={item.email}
                type="button"
                onClick={() => quickLogin(item.email)}
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "8px 10px",
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: item.color,
                  transition: "all 150ms",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = "#cbd5e1";
                  (e.target as HTMLElement).style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = "#e2e8f0";
                  (e.target as HTMLElement).style.background = "white";
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", marginTop: "24px" }}>
          Firebase Project: <span style={{ fontFamily: "monospace", color: "#64748b" }}>erpeduhub0o</span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#0ea5e9" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
