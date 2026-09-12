"use client";

import StudentGrowthRoomComponent from "@/components/growth/StudentGrowthRoom";
import { PageHeader } from "@/components/dashboard/shared";

export default function ParentGrowthRoomPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Child Growth Room — Aarav Kumar"
        subtitle="Transparent view of Aarav's learning progress, weak area remediation, and teacher collaboration"
      />
      <StudentGrowthRoomComponent studentId="student-01" userRole="PARENT" />
    </div>
  );
}
