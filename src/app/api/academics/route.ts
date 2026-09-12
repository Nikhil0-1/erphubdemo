import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["assessment:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = context!.schoolId || searchParams.get("schoolId");
    const classId = searchParams.get("classId");

    const assessments = dataStore.getAssessments(schoolId || undefined, classId || undefined);
    return NextResponse.json(successResponse(assessments));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["assessment:create", "marks:create"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { action, name, type, subjectId, classId, date, maxMarks, assessmentId, results } = body;
    const schoolId = context!.schoolId || body.schoolId;

    if (!schoolId) {
      return NextResponse.json(errorResponse("School ID is required", "VALIDATION_ERROR"), { status: 400 });
    }

    // Enter marks
    if (action === "enter-marks" || results) {
      if (!assessmentId || !results || !Array.isArray(results)) {
        return NextResponse.json(errorResponse("assessmentId and results are required", "VALIDATION_ERROR"), {
          status: 400,
        });
      }

      const formattedResults = results.map((r: any) => {
        const student = dataStore.findStudentById(r.studentId);
        return {
          studentId: r.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : r.studentName,
          marks: parseFloat(r.marks),
          remarks: r.remarks,
        };
      });

      const updated = dataStore.enterMarks(assessmentId, formattedResults);

      dataStore.logAudit({
        userId: context!.user.id,
        userName: `${context!.user.firstName} ${context!.user.lastName}`,
        role: context!.user.role,
        schoolId,
        action: "ENTER_MARKS",
        target: `Entered marks for assessment ${updated.name}`,
      });

      return NextResponse.json(successResponse(updated));
    }

    // Create assessment
    if (!name || !subjectId || !classId) {
      return NextResponse.json(errorResponse("Name, subject, and class are required", "VALIDATION_ERROR"), {
        status: 400,
      });
    }

    const cls = dataStore.getClasses(schoolId).find((c) => c.id === classId);
    const sub = dataStore.getSubjects(schoolId).find((s) => s.id === subjectId);

    const assessment = dataStore.addAssessment({
      name,
      type: type || "UNIT_TEST",
      subjectId,
      subjectName: sub?.name || "Mathematics",
      classId,
      className: cls?.name || "Class 7-A",
      teacherId: context!.user.teacherId || context!.user.id,
      teacherName: `${context!.user.firstName} ${context!.user.lastName}`,
      date: date || new Date().toISOString().split("T")[0],
      maxMarks: maxMarks ? parseFloat(maxMarks) : 100,
      schoolId,
    });

    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId,
      action: "CREATE_ASSESSMENT",
      target: `Created assessment ${assessment.name} for ${assessment.className}`,
    });

    return NextResponse.json(successResponse(assessment), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
