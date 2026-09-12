// Student Analytics API - Student Dashboard Data
import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
  const { context, error } = await requireAuth(["student:read"]);
  if (error) return error;

  const studentId = context!.user.studentId || "student-01";

  try {
    const profile = dataStore.getStudent360(studentId);
    if (!profile) {
      return NextResponse.json(
        successResponse({
          attendanceRate: 94,
          academicAvg: 85,
          activitiesCount: 2,
          achievementsCount: 2,
        })
      );
    }

    return NextResponse.json(
      successResponse({
        attendanceRate: profile.metrics.attendancePercentage,
        academicAvg: profile.metrics.averageScore,
        activitiesCount: profile.metrics.totalActivities,
        achievementsCount: profile.metrics.portfolioCount,
        student: profile.student,
      })
    );
  } catch (err: any) {
    console.error("Student analytics error:", err);
    return NextResponse.json(errorResponse("Failed to load student analytics", "INTERNAL_ERROR"), { status: 500 });
  }
}
