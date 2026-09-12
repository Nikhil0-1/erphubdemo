import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";
import { hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = context!.schoolId || searchParams.get("schoolId");
    const teachers = dataStore.getTeachers(schoolId || undefined);
    const assignments = dataStore.getTeacherAssignments(schoolId || undefined);

    const result = teachers.map((t) => ({
      ...t,
      assignments: assignments.filter((a) => a.teacherId === t.id),
    }));

    return NextResponse.json(successResponse(result));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:create"]);
  if (error) return error;

  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      employeeId,
      department,
      qualification,
      subjects,
      classId,
      sectionId,
      subjectId,
    } = body;
    const schoolId = context!.schoolId || body.schoolId;

    if (!firstName || !lastName || !email || !schoolId) {
      return NextResponse.json(
        errorResponse("First name, last name, email, and school are required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = dataStore.findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(errorResponse("User with this email already exists", "DUPLICATE"), { status: 409 });
    }

    const passwordHash = await hashPassword("password123");
    const user = dataStore.addUser({
      email: cleanEmail,
      passwordHash,
      firstName,
      lastName,
      phone,
      role: "TEACHER",
      status: "ACTIVE",
      schoolId,
    });

    const teacher = dataStore.addTeacher({
      userId: user.id,
      employeeId: employeeId || `GV-T-${Math.floor(100 + Math.random() * 900)}`,
      firstName,
      lastName,
      email: cleanEmail,
      phone,
      department: department || "Academics",
      qualification: qualification || "B.Ed.",
      joiningDate: new Date().toISOString().split("T")[0],
      schoolId,
      subjects: subjects || ["Mathematics"],
    });

    user.teacherId = teacher.id;
    dataStore.save();

    // Assign to class if specified
    if (classId && subjectId) {
      const cls = dataStore.getClasses(schoolId).find((c) => c.id === classId);
      const sec = cls?.sections?.find((s) => s.id === sectionId);
      const sub = dataStore.getSubjects(schoolId).find((s) => s.id === subjectId);

      dataStore.addTeacherAssignment({
        teacherId: teacher.id,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        classId,
        className: cls?.name || "Class 7",
        sectionId: sectionId || sec?.id,
        sectionName: sec?.name || "A",
        subjectId,
        subjectName: sub?.name || "Mathematics",
        schoolId,
      });
    }

    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId,
      action: "ADD_TEACHER",
      target: `Added Teacher ${teacher.firstName} ${teacher.lastName} (${cleanEmail})`,
    });

    return NextResponse.json(successResponse(teacher), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
