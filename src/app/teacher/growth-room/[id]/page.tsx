"use client";

import { use } from "react";
import StudentGrowthRoomComponent from "@/components/growth/StudentGrowthRoom";
import { PageHeader } from "@/components/dashboard/shared";

export default function TeacherStudentGrowthRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Growth Room — Aarav Kumar"
        subtitle="Dedicated development space connecting Teacher Rahul, Student Aarav, and Parent Raj around continuous learning growth"
      />
      <StudentGrowthRoomComponent studentId={resolvedParams.id} userRole="TEACHER" />
    </div>
  );
}
