import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["student:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const schoolId = context!.schoolId || searchParams.get("schoolId");

    const concerns = dataStore.getConcerns(schoolId || undefined, studentId || undefined);
    return NextResponse.json(successResponse(concerns));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:manage", "student:manage", "student:read"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { action, id, studentId, category, description, priority, status, notes, date } = body;
    const schoolId = context!.schoolId || body.schoolId;

    if (!schoolId) {
      return NextResponse.json(errorResponse("School ID is required", "VALIDATION_ERROR"), { status: 400 });
    }

    // Update status
    if (action === "update-status" || id) {
      const updated = dataStore.updateConcernStatus(id, status, notes);
      if (!updated) {
        return NextResponse.json(errorResponse("Concern not found", "NOT_FOUND"), { status: 404 });
      }
      return NextResponse.json(successResponse(updated));
    }

    // Create concern
    if (!studentId || !category || !description) {
      return NextResponse.json(
        errorResponse("Student, category, and description are required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const student = dataStore.findStudentById(studentId);
    if (!student) {
      return NextResponse.json(errorResponse("Student not found", "NOT_FOUND"), { status: 404 });
    }

    const concern = dataStore.addConcern({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      teacherId: context!.user.teacherId || context!.user.id,
      teacherName: `${context!.user.firstName} ${context!.user.lastName}`,
      category,
      description,
      priority: priority || "MEDIUM",
      status: "OPEN",
      date: date || new Date().toISOString().split("T")[0],
      notes,
      schoolId,
    });

    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId,
      action: "CREATE_CONCERN",
      target: `Logged concern for ${student.firstName} ${student.lastName} (${category})`,
    });

    return NextResponse.json(successResponse(concern), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
