import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["assignment:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = context!.schoolId || searchParams.get("schoolId");
    const classId = searchParams.get("classId");

    const assignments = dataStore.getAssignments(schoolId || undefined, classId || undefined);
    return NextResponse.json(successResponse(assignments));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["assignment:create"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { action, title, description, subjectId, classId, dueDate, maxMarks, assignmentId } = body;
    const schoolId = context!.schoolId || body.schoolId;

    if (!schoolId) {
      return NextResponse.json(errorResponse("School ID is required", "VALIDATION_ERROR"), { status: 400 });
    }

    // Student submission
    if (action === "submit" || (assignmentId && context!.user.role === "STUDENT")) {
      const studentId = context!.user.studentId || body.studentId;
      const student = dataStore.findStudentById(studentId);
      const submission = dataStore.submitAssignment(
        assignmentId,
        studentId,
        student ? `${student.firstName} ${student.lastName}` : "Student"
      );
      return NextResponse.json(successResponse(submission));
    }

    // Teacher create assignment
    if (!title || !subjectId || !classId) {
      return NextResponse.json(errorResponse("Title, subject, and class are required", "VALIDATION_ERROR"), {
        status: 400,
      });
    }

    const cls = dataStore.getClasses(schoolId).find((c) => c.id === classId);
    const sub = dataStore.getSubjects(schoolId).find((s) => s.id === subjectId);

    const assignment = dataStore.addAssignment({
      title,
      description,
      subjectId,
      subjectName: sub?.name || "Mathematics",
      classId,
      className: cls?.name || "Class 7-A",
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      maxMarks: maxMarks ? parseFloat(maxMarks) : 20,
      schoolId,
    });

    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId,
      action: "CREATE_ASSIGNMENT",
      target: `Created assignment ${assignment.title}`,
    });

    return NextResponse.json(successResponse(assignment), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
