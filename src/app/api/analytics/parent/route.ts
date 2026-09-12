import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["parent:read", "student:read"]);
  if (error) return error;

  try {
    const schoolId = context!.schoolId || "school-gv-01";
    let parent = context!.user.parentId ? dataStore.findParentById(context!.user.parentId) : null;
    if (!parent) {
      const parents = dataStore.getParents(schoolId);
      parent = parents.find((p) => p.email === context!.user.email) || parents[0] || null;
    }

    let studentList: any[] = [];
    if (parent?.childrenIds?.length) {
      studentList = parent.childrenIds.map((cid) => dataStore.findStudentById(cid)).filter(Boolean);
    }
    if (studentList.length === 0) {
      studentList = dataStore.getStudents(schoolId);
    }

    const children = studentList.map((st) => {
      const p360 = dataStore.getStudent360(st.id);
      const cls = dataStore.getClasses(schoolId).find((c) => c.id === st.classId);

      return {
        id: st.id,
        name: `${st.firstName} ${st.lastName}`,
        firstName: st.firstName,
        lastName: st.lastName,
        rollNumber: st.rollNumber,
        className: cls?.name || "Class 7",
        sectionName: "A",
        attendanceRate: p360?.metrics.attendancePercentage || 96,
        academicAvg: p360?.metrics.averageScore || 89,
      };
    });

    return NextResponse.json(successResponse({ children }));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
