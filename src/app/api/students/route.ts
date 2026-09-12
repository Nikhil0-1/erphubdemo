import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";
import { hashPassword } from "@/lib/auth";

// GET /api/students - List students with search, class, and section filters
export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["student:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const sectionId = searchParams.get("sectionId");
    const search = (searchParams.get("search") || "").toLowerCase().trim();
    const schoolId = context!.schoolId || searchParams.get("schoolId");

    let students = dataStore.getStudents(schoolId || undefined);

    if (classId) {
      students = students.filter((s) => s.classId === classId);
    }
    if (sectionId) {
      students = students.filter((s) => s.sectionId === sectionId);
    }
    if (search) {
      students = students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(search) ||
          s.lastName.toLowerCase().includes(search) ||
          s.studentId.toLowerCase().includes(search) ||
          s.email.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(successResponse(students));
  } catch (err: any) {
    console.error("Students list error:", err);
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch students", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

// POST /api/students - Enroll new student
export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["student:create"]);
  if (error) return error;

  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      studentId,
      admissionNumber,
      dateOfBirth,
      classId,
      sectionId,
      rollNumber,
      parentId,
    } = body;
    const schoolId = context!.schoolId || body.schoolId;

    if (!firstName || !lastName || !classId || !schoolId) {
      return NextResponse.json(
        errorResponse("First name, last name, class, and school are required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const cleanEmail = (email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.greenvalley.edu`).trim();

    // 1. Create User
    const passwordHash = await hashPassword("password123");
    const user = dataStore.addUser({
      email: cleanEmail,
      passwordHash,
      firstName,
      lastName,
      role: "STUDENT",
      status: "ACTIVE",
      schoolId,
    });

    // Lookup class/section names
    const classes = dataStore.getClasses(schoolId);
    const cls = classes.find((c) => c.id === classId);
    const sec = cls?.sections?.find((s) => s.id === sectionId);

    // 2. Add Student
    const student = dataStore.addStudent({
      userId: user.id,
      studentId: studentId || `GV-2026-${Math.floor(100 + Math.random() * 900)}`,
      admissionNumber: admissionNumber || `ADM-${Date.now().toString().slice(-4)}`,
      firstName,
      lastName,
      email: cleanEmail,
      dateOfBirth,
      classId,
      className: cls?.name || "Class 7",
      sectionId: sectionId || sec?.id,
      sectionName: sec?.name || "A",
      rollNumber: rollNumber || String(dataStore.getStudents(schoolId).length + 1),
      schoolId,
      parentId,
    });

    user.studentId = student.id;
    dataStore.save();

    // 3. Link parent if provided
    if (parentId) {
      dataStore.linkParentToStudent(parentId, student.id);
    }

    // Log audit
    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId,
      action: "ENROLL_STUDENT",
      target: `Student ${student.firstName} ${student.lastName} (${student.studentId}) in ${student.className}-${student.sectionName}`,
    });

    return NextResponse.json(successResponse(student), { status: 201 });
  } catch (err: any) {
    console.error("Student enroll error:", err);
    return NextResponse.json(
      errorResponse(err.message || "Failed to enroll student", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
