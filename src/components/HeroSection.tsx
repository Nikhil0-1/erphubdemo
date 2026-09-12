"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Menu,
  X,
  Users,
  ShieldCheck,
  CreditCard,
  Bus,
  Award,
  BookOpen,
  UserCheck,
  BarChart3,
  Star,
  ChevronRight,
  BrainCircuit,
  FileText,
  Clock,
  ArrowUpRight,
  Layers,
} from "lucide-react";

interface HeroSectionProps {
  loggedIn: boolean;
  homeRoute: string;
}

export default function HeroSection({ loggedIn, homeRoute }: HeroSectionProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<
    "principal" | "teacher" | "student" | "parent" | "accountant" | "driver"
  >("teacher");

  const roleDetails = {
    principal: {
      title: "Principal & Admin Hub",
      badge: "School Leadership",
      description:
        "Complete institutional oversight: monitor overall school performance, attendance trends, staff efficiency, fee collection health, and IoT campus security in real time.",
      highlights: [
        "Campus-wide live analytics & reports",
        "Staff & student directory oversight",
        "RFID smart gate & security monitoring",
        "Automated CBSE/State compliant report cards",
      ],
      route: "/principal",
      color: "from-indigo-600 to-violet-600",
      accent: "text-indigo-600 bg-indigo-50 border-indigo-200",
      mockupData: {
        stat1: "99.1% Staff Presence",
        stat2: "₹28.4L Fees Settled",
        metric: "School Health: 96/100",
      },
    },
    teacher: {
      title: "Teacher Mentor Dashboard",
      badge: "Classroom & Growth",
      description:
        "Automate administrative overhead so teachers can focus on mentoring. One-click attendance, AI-identified student weak areas, assignment management, and 1-click growth room interventions.",
      highlights: [
        "'Who Needs Me Today?' priority intervention queue",
        "10-second fast roll call attendance",
        "AI diagnostic analysis for every assessment",
        "Connected Growth Room collaboration with parents",
      ],
      route: "/teacher",
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-600 bg-blue-50 border-blue-200",
      mockupData: {
        stat1: "3 Students Flagged for Math",
        stat2: "94% Assignment Turn-in",
        metric: "Class Growth Delta: +14%",
      },
    },
    student: {
      title: "Student Growth & Practice Portal",
      badge: "Personalized Learning",
      description:
        "An engaging, non-gaming student environment focused on genuine growth. Adaptive practice drills, smart Mistake Book reattempts, verified score gains, and digital achievement awards.",
      highlights: [
        "Interactive Mistake Book with step-by-step reasoning",
        "Adaptive subject practice with instant AI feedback",
        "Growth credit ledger & printable milestone certificates",
        "Clear goal progression without stressful leaderboards",
      ],
      route: "/student",
      color: "from-emerald-600 to-teal-600",
      accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
      mockupData: {
        stat1: "Geometry Mastered (68%)",
        stat2: "320 Growth Credits",
        metric: "Weekly Streak: 5 Days",
      },
    },
    parent: {
      title: "Parent Partner Portal",
      badge: "Transparency & Peace of Mind",
      description:
        "Stay genuinely connected with your child's daily school life. Real-time smart gate arrival notifications, live GPS school bus tracking, transparent fee receipts, and direct mentor chats.",
      highlights: [
        "Instant RFID gate entry/exit push alerts",
        "Live bus GPS tracking with real-time ETA",
        "Hassle-free 1-click digital fee payments & receipts",
        "Direct participation in Growth Room milestones",
      ],
      route: "/parent",
      color: "from-amber-600 to-orange-600",
      accent: "text-amber-600 bg-amber-50 border-amber-200",
      mockupData: {
        stat1: "Bus #4 Reaching in 6 mins",
        stat2: "Gate In: 08:14 AM Verified",
        metric: "Term 2 Fee: Paid (Rec #8902)",
      },
    },
    accountant: {
      title: "Finance & Fee Accounting",
      badge: "Financial Control",
      description:
        "Say goodbye to manual fee ledgers and reconciliation headaches. Auto-generate fee structures, track pending dues, issue instant GST-ready digital receipts, and export audited financial reports.",
      highlights: [
        "Automated term fee schedule generation",
        "Instant digital receipt generation & SMS alerts",
        "Live dues vs collected reconciliation ledger",
        "Exportable reports for auditor compliance",
      ],
      route: "/accountant",
      color: "from-purple-600 to-pink-600",
      accent: "text-purple-600 bg-purple-50 border-purple-200",
      mockupData: {
        stat1: "92% Term Fees Collected",
        stat2: "0 Reconciliation Errors",
        metric: "Today's Inflow: ₹1,45,000",
      },
    },
    driver: {
      title: "Smart Bus & Fleet Portal",
      badge: "Campus Logistics",
      description:
        "Dedicated mobile portal for transport staff. Turn-by-turn route guidance, student boarding checklist, live GPS broadcast, and immediate emergency alerts to school admin.",
      highlights: [
        "Live GPS location broadcast to parents & school",
        "Student pickup and drop boarding confirmation",
        "Optimized morning and evening route maps",
        "1-touch breakdown & emergency alert",
      ],
      route: "/driver",
      color: "from-cyan-600 to-blue-600",
      accent: "text-cyan-600 bg-cyan-50 border-cyan-200",
      mockupData: {
        stat1: "Route B: 24/24 Boarded",
        stat2: "On-Time Index: 98%",
        metric: "Live GPS: Active 32 km/h",
      },
    },
  };

  const currentRole = roleDetails[activeRoleTab];

  return (
    <div className="min-h-screen w-full bg-[#f8f7ff] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white relative overflow-x-hidden">
      {/* Soft ambient background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-indigo-100/60 via-purple-50/40 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[450px] right-0 w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. FLOATING PILL HEADER */}
      <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 mb-4">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-indigo-100/80 shadow-lg shadow-indigo-900/5 rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                NurtureKernel
              </span>
              <span className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase mt-0.5">
                School OS & Growth
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600">
            <a
              href="#features"
              className="px-3.5 py-1.5 rounded-full hover:text-indigo-600 hover:bg-indigo-50/80 transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#portals"
              className="px-3.5 py-1.5 rounded-full hover:text-indigo-600 hover:bg-indigo-50/80 transition-colors"
            >
              Role Portals
            </a>
            <a
              href="#highlights"
              className="px-3.5 py-1.5 rounded-full hover:text-indigo-600 hover:bg-indigo-50/80 transition-colors"
            >
              Why NurtureKernel
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={loggedIn ? homeRoute : "/teacher"}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-full shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all active:scale-95"
            >
              <span>{loggedIn ? "Go to Portal" : "Enter Platform"}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-indigo-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 max-w-6xl mx-auto bg-white border border-indigo-100 rounded-2xl p-4 shadow-xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:bg-indigo-50 rounded-lg"
            >
              Capabilities
            </a>
            <a
              href="#portals"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:bg-indigo-50 rounded-lg"
            >
              Role Portals
            </a>
            <a
              href="#highlights"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:bg-indigo-50 rounded-lg"
            >
              Why NurtureKernel
            </a>
            <hr className="border-slate-100 my-1" />
            <div className="flex gap-2 pt-1">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href={loggedIn ? homeRoute : "/teacher"}
                className="flex-1 text-center py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/20"
              >
                Enter Platform
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs sm:text-sm font-bold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>COMPLETE SCHOOL OPERATING & GROWTH SYSTEM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12] mb-5">
              Run Your Entire School <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                From One Simple Platform
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg max-w-xl mb-8 leading-relaxed font-medium">
              Seamlessly unify academics, AI student growth diagnostics, automated
              attendance, online fee management, and live GPS bus tracking in one
              connected ecosystem.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-8">
              <Link
                href={loggedIn ? homeRoute : "/teacher"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-base shadow-xl shadow-indigo-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Launch NurtureKernel</span>
                <ArrowRight size={18} />
              </Link>
              <a
                href="#portals"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-bold rounded-xl text-base shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-600"
              >
                <span>Explore 6 Portals</span>
                <ChevronRight size={16} />
              </a>
            </div>

            {/* Trust Proof Bar */}
            <div className="flex items-center gap-3.5 pt-2 border-t border-slate-200/60 w-full sm:w-auto justify-center lg:justify-start">
              <div className="flex -space-x-2">
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  RS
                </span>
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  AK
                </span>
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  PK
                </span>
                <span className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-700 shadow-sm">
                  +1.2k
                </span>
              </div>
              <div className="text-left">
                <div className="flex items-center text-amber-400 text-xs">
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                  <Star size={13} fill="currentColor" />
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Trusted by 500+ schools & educators
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive UI Showcase with Floating Badges */}
          <div className="lg:col-span-6 relative w-full">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 rounded-3xl blur-2xl -z-10" />

            {/* Main Mockup Container */}
            <div className="relative bg-white rounded-3xl border border-indigo-100/80 p-5 sm:p-6 shadow-2xl shadow-indigo-900/10">
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-slate-400 ml-2">
                    SmartEdu · Live Dashboard
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  System Operational
                </span>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                    <span>Active Students</span>
                    <Users size={14} className="text-indigo-600" />
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">1,480</p>
                  <span className="text-[11px] text-emerald-600 font-bold">
                    +99.2% Attendance today
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
                    <span>Fees Reconciliation</span>
                    <CreditCard size={14} className="text-emerald-600" />
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">₹24.8 Lakh</p>
                  <span className="text-[11px] text-indigo-600 font-bold">
                    91% On-time collected
                  </span>
                </div>
              </div>

              {/* Live Student Growth Preview Row */}
              <div className="bg-gradient-to-r from-indigo-50/60 to-purple-50/60 border border-indigo-100/90 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      AK
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        Aarav Kumar (Class 7-A)
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Geometry & Proofs Diagnostic
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      +17% Score Gain
                    </span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden flex">
                  <div className="bg-slate-400 h-full w-[51%]" title="Baseline"></div>
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[17%]"
                    title="Verified Growth"
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1">
                  <span>Baseline: 51%</span>
                  <span className="text-emerald-700 font-bold">Current: 68%</span>
                </div>
              </div>

              {/* Connected Modules Strip */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    RFID GATE
                  </span>
                  <span className="font-bold text-slate-800">08:14 AM Logged</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    BUS FLEET
                  </span>
                  <span className="font-bold text-indigo-600">Route 4 Live GPS</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">
                    GROWTH ROOM
                  </span>
                  <span className="font-bold text-emerald-600">Active Review</span>
                </div>
              </div>

              {/* Floating Glass Badges (SchoolOS style) */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md border border-indigo-100 rounded-2xl p-3 shadow-xl shadow-indigo-900/10 items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    Fee Collection
                  </p>
                  <p className="text-sm font-extrabold text-slate-900">
                    +85% Faster Settlement
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex absolute -top-4 -right-4 bg-white/95 backdrop-blur-md border border-indigo-100 rounded-2xl p-3 shadow-xl shadow-indigo-900/10 items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    Student Growth
                  </p>
                  <p className="text-sm font-extrabold text-slate-900">
                    17%+ Avg Gain
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IMPACT STATS RIBBON (Clean, high-credibility metric bar) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-white border border-indigo-100/90 rounded-2xl p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r border-slate-100 last:border-0 pr-4">
            <p className="text-3xl sm:text-4xl font-black text-indigo-600">99.2%</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Attendance Accuracy
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              RFID & Mobile Gate Check-in
            </span>
          </div>
          <div className="border-r border-slate-100 last:border-0 pr-4">
            <p className="text-3xl sm:text-4xl font-black text-emerald-600">+17%</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Average Score Gain
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              Verified Mistake Book Retries
            </span>
          </div>
          <div className="border-r border-slate-100 last:border-0 pr-4">
            <p className="text-3xl sm:text-4xl font-black text-violet-600">3x</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Faster Fee Clearance
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              Instant Receipts & Dues Alerts
            </span>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-slate-900">6 Portals</p>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Unified Ecosystem
            </p>
            <span className="text-[10px] text-slate-400 font-medium">
              Principal, Teacher, Parent & More
            </span>
          </div>
        </div>
      </section>

      {/* 4. PLATFORM CAPABILITIES / HIGHLIGHTS (Focused & High Impact) */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Everything Your School Needs to Flourish
          </h2>
          <p className="text-slate-600 text-base font-normal">
            Eliminate fragmented spreadsheets and disconnected tools. NurtureKernel
            brings administrative power, smart hardware, and student learning
            under one roof.
          </p>
        </div>

        {/* 6 Core Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Weakness Detection */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <BrainCircuit size={24} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                AI Weakness Diagnostic
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                ACADEMICS
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Multi-signal analysis tracks assessment trends, repeated errors, and
              topic accuracy to pinpoint exactly where students get stuck before
              exams.
            </p>
            <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
              <span>Deep-dive root cause reasoning</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 2: Practice & Mistake Book */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <BookOpen size={24} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                Practice & Mistake Book
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                STUDENT
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Wrong answers automatically enter the personal Mistake Book with AI
              reasoning hints and an active &apos;Try Again&apos; retry loop for verified gains.
            </p>
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span>51% → 68% verified score gains</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 3: Smart Attendance & RFID */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <UserCheck size={24} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                Smart Gate & Roll Call
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                CAMPUS IOT
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Automated RFID gate tapping logs campus arrivals instantly and sends
              immediate arrival SMS alerts to parents, while teachers mark
              classroom roll calls in seconds.
            </p>
            <div className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              <span>99.2% verified attendance log</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 4: Fee & Accounting Engine */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <CreditCard size={24} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                Fees & Instant Invoices
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                FINANCE
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Configurable fee structures for each class, online payments,
              one-click printable receipts, automated dues reminders, and full
              audit-ready reconciliation.
            </p>
            <div className="text-xs font-semibold text-purple-600 flex items-center gap-1">
              <span>Zero reconciliation discrepancies</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 5: Live GPS Transport */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all">
              <Bus size={24} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                Live GPS Bus Tracking
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-700">
                SAFETY
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Parents track school bus location on an interactive map with live
              speed, stop ETA notifications, and driver communication — no more
              stressful waiting at stops.
            </p>
            <div className="text-xs font-semibold text-cyan-600 flex items-center gap-1">
              <span>Real-time ETA & student boarding log</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Card 6: Connected Growth Room */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Award size={24} />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                Connected Growth Room
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                COLLABORATION
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Brings the Teacher Mentor, Student, and Parent into one focused
              milestone room. Track action items, log interventions, and award
              verifiable digital certificates.
            </p>
            <div className="text-xs font-semibold text-amber-600 flex items-center gap-1">
              <span>Non-gaming growth credit ledger</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ROLE PORTALS SHOWCASE (Inspired by SchoolOS Tab Explorer) */}
      <section id="portals" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-white rounded-3xl border border-indigo-100/90 p-6 sm:p-10 shadow-xl shadow-indigo-900/5">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              Tailored Role Dashboards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-3">
              One Unified System, 6 Specialized Portals
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Each stakeholder gets a tailored experience designed specifically for
              their daily priorities without confusing clutter.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 border-b border-slate-100 pb-5">
            {[
              { id: "teacher", label: "Teacher Mentor", icon: Users },
              { id: "student", label: "Student Learner", icon: BookOpen },
              { id: "parent", label: "Parent Partner", icon: UserCheck },
              { id: "principal", label: "Principal / Admin", icon: ShieldCheck },
              { id: "accountant", label: "Fee Accountant", icon: CreditCard },
              { id: "driver", label: "Bus Driver", icon: Bus },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeRoleTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveRoleTab(
                      tab.id as
                        | "principal"
                        | "teacher"
                        | "student"
                        | "parent"
                        | "accountant"
                        | "driver"
                    )
                  }
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Role Tab Content Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/70 rounded-2xl p-6 sm:p-8 border border-slate-100">
            {/* Left Info */}
            <div className="lg:col-span-7">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${currentRole.accent}`}
              >
                {currentRole.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                {currentRole.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                {currentRole.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {currentRole.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={17}
                      className="text-indigo-600 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-xs sm:text-sm text-slate-700 font-semibold">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href={currentRole.route}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl shadow transition-all hover:scale-105"
              >
                <span>Enter {currentRole.title}</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* Right Interactive Mockup Snapshot */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-800">
                      {currentRole.title} Preview
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Live Role Sync
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      Live Metric
                    </p>
                    <p className="text-base font-extrabold text-slate-900 mt-0.5">
                      {currentRole.mockupData.metric}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500">
                        Operational Status
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {currentRole.mockupData.stat1}
                      </p>
                    </div>
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-indigo-600">
                        Activity Indicator
                      </p>
                      <p className="text-sm font-bold text-indigo-950">
                        {currentRole.mockupData.stat2}
                      </p>
                    </div>
                    <Sparkles size={16} className="text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY NURTUREKERNEL HIGHLIGHT (The Difference) */}
      <section id="highlights" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            Why Schools Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-4">
            Built for Real Student Growth, Not Just Data Storage
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Traditional school software only records what happened in the past.
            NurtureKernel actively helps educators and parents improve the future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legacy System */}
          <div className="bg-white rounded-2xl border border-rose-100 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-rose-600 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Legacy School Management Systems</span>
            </div>
            <ul className="space-y-3.5 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span>Clunky interfaces that teachers dread using every day</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span>Isolated data silos where exam marks are trapped in spreadsheets</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span>Zero personalized learning or adaptive practice for weak students</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <span>Parents left anxious with no real-time bus or gate updates</span>
              </li>
            </ul>
          </div>

          {/* NurtureKernel */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-indigo-800">
            <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>NurtureKernel Growth Platform</span>
            </div>
            <ul className="space-y-3.5 text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Blazing-fast responsive design optimized for mobile & desktop</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Connected data linking marks, attendance, and student interventions</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>AI Mistake Book diagnosing root causes with active reattempt loops</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Live RFID gate alerts and GPS school bus ETA straight to parents</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION (SchoolOS Style Banner) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-indigo-600/25 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4">
              Get Started with NurtureKernel
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-5 leading-tight">
              Ready to Upgrade Your Entire School Experience?
            </h2>
            <p className="text-indigo-100 text-base sm:text-lg mb-8 leading-relaxed font-normal">
              Join educators, administrators, and parents who have made the shift
              from basic record-keeping to proactive student growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href={loggedIn ? homeRoute : "/teacher"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-indigo-700 hover:bg-slate-100 font-extrabold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 text-base"
              >
                <span>Enter NurtureKernel Platform</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-800/60 hover:bg-indigo-800/80 text-white border border-indigo-400/30 font-bold rounded-xl transition-all text-base"
              >
                <span>Sign In to Account</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLEAN MODERN FOOTER */}
      <footer className="w-full border-t border-slate-200 bg-white py-12 text-sm text-slate-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Col 1: Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <GraduationCap size={18} />
                </div>
                <span className="font-extrabold text-base text-slate-900">
                  NurtureKernel Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                The next-generation School OS unifying administration, RFID
                safety, and AI student development.
              </p>
              <p className="text-xs text-slate-400">
                Green Valley International School Edition
              </p>
            </div>

            {/* Col 2: Core Portals */}
            <div>
              <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Portals
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/teacher" className="hover:text-indigo-600 transition-colors">
                    Teacher Mentor
                  </Link>
                </li>
                <li>
                  <Link href="/student" className="hover:text-indigo-600 transition-colors">
                    Student Growth
                  </Link>
                </li>
                <li>
                  <Link href="/parent" className="hover:text-indigo-600 transition-colors">
                    Parent Partner
                  </Link>
                </li>
                <li>
                  <Link href="/principal" className="hover:text-indigo-600 transition-colors">
                    Principal & Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Operations */}
            <div>
              <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Operations
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/accountant" className="hover:text-indigo-600 transition-colors">
                    Fees & Finance
                  </Link>
                </li>
                <li>
                  <Link href="/driver" className="hover:text-indigo-600 transition-colors">
                    GPS Transport Fleet
                  </Link>
                </li>
                <li>
                  <Link href="/super-admin/iot" className="hover:text-indigo-600 transition-colors">
                    RFID Smart Gates
                  </Link>
                </li>
                <li>
                  <Link href="/student/mistakes" className="hover:text-indigo-600 transition-colors">
                    Mistake Book AI
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Platform Security & Status */}
            <div>
              <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                Security & Uptime
              </p>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>All Systems Operational (99.9%)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <ShieldCheck size={14} className="text-indigo-600" />
                  <span>End-to-End Role Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={14} className="text-indigo-600" />
                  <span>Real-time Cloud Sync</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>© 2026 NurtureKernel Hub. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Terms of Service</span>
              <span>·</span>
              <span>System Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
