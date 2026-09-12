"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user) {
      const role = (session.user as { role?: string })?.role;
      const roleRoutes: Record<string, string> = {
        SUPER_ADMIN: "/super-admin",
        PRINCIPAL: "/principal",
        TEACHER: "/teacher",
        STUDENT: "/student",
        PARENT: "/parent",
        DRIVER: "/driver",
      };
      const target = role && roleRoutes[role] ? roleRoutes[role] : "/teacher";
      router.replace(target);
    } else {
      router.replace("/login");
    }
  }, [session, status, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="w-9 h-9 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          Loading Smart Edu...
        </span>
      </div>
    </main>
  );
}
