"use client";

import StudentGrowthRoomComponent from "@/components/growth/StudentGrowthRoom";
import { PageHeader } from "@/components/dashboard/shared";

export default function StudentGrowthRoomPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Growth Room"
        subtitle="Your personal learning space connecting you with your teacher mentor and parent"
      />
      <StudentGrowthRoomComponent studentId="student-01" userRole="STUDENT" />
    </div>
  );
}
