import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["development:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const schoolId = context!.schoolId || searchParams.get("schoolId");

    const records = dataStore.getDevelopment(studentId || undefined, schoolId || undefined);
    return NextResponse.json(successResponse(records));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["development:create"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { studentId, area, observation, feedback, level, date, source } = body;
    const schoolId = context!.schoolId || body.schoolId;

    if (!studentId || !area || !observation || !schoolId) {
      return NextResponse.json(
        errorResponse("Student, area, observation, and school are required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const student = dataStore.findStudentById(studentId);
    if (!student) {
      return NextResponse.json(errorResponse("Student not found", "NOT_FOUND"), { status: 404 });
    }

    const dev = dataStore.addDevelopment({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      teacherId: context!.user.teacherId || context!.user.id,
      teacherName: `${context!.user.firstName} ${context!.user.lastName}`,
      area,
      observation,
      feedback: feedback || "Consistent effort observed.",
      level: level || "Developing",
      date: date || new Date().toISOString().split("T")[0],
      schoolId,
      source: (source as "TEACHER" | "ASSISTANT_APPROVED") || "TEACHER",
    });

    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId,
      action: "RECORD_DEVELOPMENT",
      target: `Recorded ${area} (${level}) for ${student.firstName} ${student.lastName}`,
    });

    return NextResponse.json(successResponse(dev), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
