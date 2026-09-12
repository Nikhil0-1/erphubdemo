"use client";

import { useSession } from "next-auth/react";
import HeroSection from "@/components/HeroSection";

export default function HomePage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const isLoggedIn = !!session?.user;

  const role = (session?.user as { role?: string })?.role;
  const roleRoutes: Record<string, string> = {
    SUPER_ADMIN: "/super-admin",
    PRINCIPAL: "/principal",
    TEACHER: "/teacher",
    STUDENT: "/student",
    PARENT: "/parent",
    DRIVER: "/driver",
  };

  const homeRoute = role && roleRoutes[role] ? roleRoutes[role] : "/super-admin";

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return <HeroSection loggedIn={isLoggedIn} homeRoute={homeRoute} />;
}
