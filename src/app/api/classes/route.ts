import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["class:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = context!.schoolId || searchParams.get("schoolId");
    const classes = dataStore.getClasses(schoolId || undefined);
    const subjects = dataStore.getSubjects(schoolId || undefined);
    const assignments = dataStore.getTeacherAssignments(schoolId || undefined);

    return NextResponse.json(
      successResponse({
        classes,
        subjects,
        assignments,
      })
    );
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["class:create"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { action, name, grade, sections, subjectName, teacherId, classId, sectionId, subjectId } = body;
    const schoolId = context!.schoolId || body.schoolId;

    if (!schoolId) {
      return NextResponse.json(errorResponse("School ID is required", "VALIDATION_ERROR"), { status: 400 });
    }

    // Action: create-class
    if (action === "create-class" || (!action && name)) {
      const cls = dataStore.addClass({
        name,
        grade: grade ? parseInt(grade) : undefined,
        schoolId,
        sections: (sections || ["A", "B"]).map((s: string) => ({
          id: `sec-${Date.now()}-${s}`,
          name: s,
          classId: "",
        })),
      });

      dataStore.logAudit({
        userId: context!.user.id,
        userName: `${context!.user.firstName} ${context!.user.lastName}`,
        role: context!.user.role,
        schoolId,
        action: "CREATE_CLASS",
        target: `Created Class ${cls.name}`,
      });

      return NextResponse.json(successResponse(cls), { status: 201 });
    }

    // Action: create-subject
    if (action === "create-subject" || subjectName) {
      const sub = dataStore.addSubject({
        name: subjectName,
        schoolId,
      });
      return NextResponse.json(successResponse(sub), { status: 201 });
    }

    // Action: assign-teacher
    if (action === "assign-teacher" || (teacherId && classId && subjectId)) {
      const teacher = dataStore.findTeacherById(teacherId);
      const cls = dataStore.getClasses(schoolId).find((c) => c.id === classId);
      const sec = cls?.sections?.find((s) => s.id === sectionId);
      const sub = dataStore.getSubjects(schoolId).find((s) => s.id === subjectId);

      const assignment = dataStore.addTeacherAssignment({
        teacherId,
        teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : "Teacher",
        classId,
        className: cls?.name || "Class",
        sectionId: sectionId || sec?.id,
        sectionName: sec?.name || "A",
        subjectId,
        subjectName: sub?.name || "Subject",
        schoolId,
      });

      return NextResponse.json(successResponse(assignment), { status: 201 });
    }

    return NextResponse.json(errorResponse("Invalid action", "BAD_REQUEST"), { status: 400 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
