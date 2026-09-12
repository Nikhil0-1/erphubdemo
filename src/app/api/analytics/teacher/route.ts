// Teacher Analytics API - Teacher Dashboard Data
import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
  const { context, error } = await requireAuth(["teacher:read", "class:read"]);
  if (error) return error;

  const schoolId = context!.schoolId || "school-gv-01";
  const teacherId = context!.user.teacherId || "teacher-01";

  try {
    const classes = dataStore.getClasses(schoolId);
    const assignments = dataStore.getTeacherAssignments(schoolId);

    const teacherClasses = classes.map((cls) => {
      const students = dataStore.getStudents(schoolId).filter((s) => s.classId === cls.id);
      const assign = assignments.find((a) => a.classId === cls.id);
      return {
        id: cls.id,
        name: cls.name,
        sectionName: assign?.sectionName || "A",
        subjectName: assign?.subjectName || "Mathematics",
        studentCount: students.length || 1,
        attendanceRate: 94,
      };
    });

    const pendingConcerns = dataStore.getConcerns(schoolId).filter((c) => c.status === "OPEN").length;
    const pendingAssessments = dataStore.getAssessments(schoolId).length;

    return NextResponse.json(
      successResponse({
        classes: teacherClasses,
        pendingConcerns,
        pendingAssessments,
      })
    );
  } catch (err: any) {
    console.error("Teacher analytics error:", err);
    return NextResponse.json(errorResponse("Failed to load teacher analytics", "INTERNAL_ERROR"), { status: 500 });
  }
}
