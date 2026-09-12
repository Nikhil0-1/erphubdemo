import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["student:growth_view", "teacher:growth_edit"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId") || undefined;
    const schoolId = context!.schoolId || searchParams.get("schoolId") || undefined;

    const interventions = dataStore.getInterventions(studentId, schoolId);
    return NextResponse.json(successResponse(interventions));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch interventions", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:growth_edit"]);
  if (error) return error;

  try {
    const body = await req.json();
    const schoolId = context!.schoolId || body.schoolId;
    if (!schoolId || !body.studentId) {
      return NextResponse.json(errorResponse("School ID and student ID are required", "VALIDATION_ERROR"), { status: 400 });
    }

    const student = dataStore.findStudentById(body.studentId);
    const intervention = dataStore.addIntervention({
      ...body,
      schoolId,
      studentName: student ? `${student.firstName} ${student.lastName}` : body.studentName || "Student",
      teacherId: context!.teacherId || context!.userId,
      teacherName: context!.name || "Teacher",
    });

    return NextResponse.json(successResponse(intervention, "Intervention logged successfully"), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to log intervention", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:growth_edit"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(errorResponse("Intervention ID required", "VALIDATION_ERROR"), { status: 400 });
    }
    const body = await req.json();
    const updated = dataStore.updateIntervention(id, body);
    if (!updated) {
      return NextResponse.json(errorResponse("Intervention not found", "NOT_FOUND"), { status: 404 });
    }
    return NextResponse.json(successResponse(updated, "Intervention updated"));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to update intervention", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
