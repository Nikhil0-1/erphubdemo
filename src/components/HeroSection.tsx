"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";

interface HeroSectionProps {
  loggedIn: boolean;
  homeRoute: string;
}

export default function HeroSection({ loggedIn, homeRoute }: HeroSectionProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* HEADER BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight leading-none">Smart Edu</span>
              <span className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase mt-0.5">Growth Platform</span>
            </div>
          </Link>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={loggedIn ? homeRoute : "/teacher"}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-lg shadow-md shadow-sky-500/20 transition-all hover:shadow-sky-500/30"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 flex flex-col gap-3 text-sm font-medium text-slate-200">
            <Link
              href="/login"
              className="w-full text-center py-2.5 text-slate-200 bg-slate-800 rounded-lg font-semibold"
            >
              Sign In
            </Link>
            <Link
              href={loggedIn ? homeRoute : "/teacher"}
              className="w-full text-center py-2.5 text-white bg-sky-500 rounded-lg font-semibold shadow-md shadow-sky-500/20"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* HERO MAIN SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-24 pb-16 w-full flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* LEFT COLUMN: Clean Content Hierarchy */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles size={14} className="animate-pulse" />
              <span>STUDENT-FIRST EDUCATION PLATFORM</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              From School Management <br className="hidden sm:inline" />
              to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
                Student Development
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mb-8 leading-relaxed font-normal">
              One connected platform where teachers guide, students improve, and parents stay connected — powered by responsible AI.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <Link
                href={loggedIn ? homeRoute : "/teacher"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl text-base shadow-xl shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Explore Smart Edu</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 rounded-xl text-base font-medium transition-all active:scale-95"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Polished Compact Student Growth Visual */}
          <div className="lg:col-span-5 w-full">
            <div className="w-full max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-sky-500/10 backdrop-blur-xl relative">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    AK
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">Aarav Kumar</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Class 7-A · Green Valley School</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                  Active Growth
                </span>
              </div>

              {/* Subject & Score Growth Pill */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 mb-4">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                  <span>Mathematics — Geometry</span>
                  <span className="text-emerald-400 font-bold">+17% Growth</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 text-lg font-bold line-through">51%</span>
                    <span className="text-sky-400 text-2xl font-black">68%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-500/15 text-emerald-300 rounded-full">
                    <TrendingUp size={14} />
                    Verified Delta
                  </div>
                </div>
              </div>

              {/* Status List */}
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/50 text-slate-300">
                  <span className="text-slate-400 font-medium">AI Recommended:</span>
                  <span className="font-semibold text-purple-300">Targeted Practice + Revision</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/50 text-slate-300">
                  <span className="text-slate-400 font-medium">Teacher Review:</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={13} /> Completed (Rahul Sharma)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/50 text-slate-300">
                  <span className="text-slate-400 font-medium">Parent Partner:</span>
                  <span className="font-semibold text-sky-400">Growth Update Sent (Raj Kumar)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-sky-400" />
            <span className="font-bold text-slate-300">Smart Edu Platform</span>
            <span>· Green Valley International School</span>
          </div>
          <div>
            © 2026 Smart Edu Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}


