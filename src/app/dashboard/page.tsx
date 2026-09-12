"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated") {
      const role = (session?.user as { role?: string })?.role;
      const roleRoutes: Record<string, string> = {
        SUPER_ADMIN: "/super-admin",
        PRINCIPAL: "/principal",
        TEACHER: "/teacher",
        STUDENT: "/student",
        PARENT: "/parent",
        DRIVER: "/driver",
      };
      router.replace(role && roleRoutes[role] ? roleRoutes[role] : "/super-admin");
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-3">
      <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
      <p className="text-sm text-slate-400">Loading your NurtureKernel workspace...</p>
    </div>
  );
}
