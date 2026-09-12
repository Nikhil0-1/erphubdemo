import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

// GET /api/attendance - Fetch attendance records
export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["attendance:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    const classId = searchParams.get("classId");
    const studentId = searchParams.get("studentId");
    const schoolId = context!.schoolId || searchParams.get("schoolId");

    let records = dataStore.getAttendance({
      schoolId: schoolId || undefined,
      studentId: studentId || undefined,
      date: dateStr || undefined,
      classId: classId || undefined,
    });

    return NextResponse.json(successResponse(records));
  } catch (err: any) {
    console.error("Attendance fetch error:", err);
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch attendance records", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

// POST /api/attendance - Mark attendance (Single or Bulk)
export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["attendance:mark"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { records, date: inputDate, studentId, status, source } = body;
    const schoolId = context!.schoolId || body.schoolId;

    if (!schoolId) {
      return NextResponse.json(
        errorResponse("School ID is required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const dateStr = inputDate || new Date().toISOString().split("T")[0];

    // If bulk marking array is provided
    if (records && Array.isArray(records)) {
      const itemsToSave = records.map((r: any) => {
        const student = dataStore.findStudentById(r.studentId);
        return {
          studentId: r.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : r.studentName,
          rollNumber: student?.rollNumber || r.rollNumber,
          date: dateStr,
          status: r.status as "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY",
          markedBy: context!.user.id,
          source: (source as "MANUAL" | "IOT") || "MANUAL",
          schoolId,
        };
      });

      const saved = dataStore.recordBatchAttendance(itemsToSave);

      // Log audit
      dataStore.logAudit({
        userId: context!.user.id,
        userName: `${context!.user.firstName} ${context!.user.lastName}`,
        role: context!.user.role,
        schoolId,
        action: "MARK_ATTENDANCE_BATCH",
        target: `Recorded attendance for ${saved.length} students on ${dateStr}`,
      });

      return NextResponse.json(successResponse(saved));
    }

    // Single student record
    if (!studentId || !status) {
      return NextResponse.json(
        errorResponse("studentId and status are required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const student = dataStore.findStudentById(studentId);
    const saved = dataStore.recordAttendance({
      studentId,
      studentName: student ? `${student.firstName} ${student.lastName}` : undefined,
      rollNumber: student?.rollNumber,
      date: dateStr,
      status,
      markedBy: context!.user.id,
      source: (source as "MANUAL" | "IOT") || "MANUAL",
      schoolId,
    });

    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId,
      action: "MARK_ATTENDANCE",
      target: `Marked ${status} for student ${studentId} on ${dateStr}`,
    });

    return NextResponse.json(successResponse(saved));
  } catch (err: any) {
    console.error("Attendance mark error:", err);
    return NextResponse.json(
      errorResponse(err.message || "Failed to mark attendance", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
