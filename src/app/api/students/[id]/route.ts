import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

// GET /api/students/[id] - Comprehensive Student 360° Aggregation
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { context, error } = await requireAuth(["student:read"]);
  if (error) return error;

  try {
    const { id } = await params;

    const profile = dataStore.getStudent360(id);
    if (!profile) {
      return NextResponse.json(
        errorResponse("Student not found", "NOT_FOUND"),
        { status: 404 }
      );
    }

    // Authorization checks
    const user = context!.user;
    if (user.role === "STUDENT" && user.studentId !== profile.student.id && user.id !== profile.student.userId) {
      return NextResponse.json(
        errorResponse("Unauthorized access to student record", "FORBIDDEN"),
        { status: 403 }
      );
    }
    if (user.role === "PARENT" && user.parentId && profile.student.parentId !== user.parentId) {
      return NextResponse.json(
        errorResponse("Unauthorized access to student record", "FORBIDDEN"),
        { status: 403 }
      );
    }

    const growthRoom = dataStore.getGrowthRoom(id);
    const creditSummary = dataStore.getRewardsSummary(profile.student.userId || id);
    const awards = dataStore.getAwards(profile.student.id);
    const escalationCase = dataStore.recordTaskMiss(id, "check", "Status Check", true, "Audit");

    const fullProfile = {
      ...profile,
      growthRoom,
      creditSummary,
      awards,
      escalationCase,
    };

    return NextResponse.json(successResponse(fullProfile));
  } catch (err: any) {
    console.error("Student 360 error:", err);
    return NextResponse.json(
      errorResponse(err.message || "Failed to load student 360 profile", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
