// School Analytics API - Principal Dashboard Data
import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
  const { context, error } = await requireAuth(["school:read"]);
  if (error) return error;

  const schoolId = context!.schoolId || "school-gv-01";

  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const students = dataStore.getStudents(schoolId).length;
    const teachers = dataStore.getTeachers(schoolId).length;

    const todayAttendance = dataStore.getAttendance({ schoolId, date: todayStr });
    const presentToday = todayAttendance.filter((a) => a.status === "PRESENT").length || students;
    const absentToday = todayAttendance.filter((a) => a.status === "ABSENT").length;
    const activeBuses = dataStore.getBuses(schoolId).length;
    const iotDevices = dataStore.getIoTDevices(schoolId).length;
    const pendingConcerns = dataStore.getConcerns(schoolId).filter((c) => c.status === "OPEN").length;

    return NextResponse.json(
      successResponse({
        students,
        teachers,
        presentToday,
        absentToday,
        activeBuses,
        iotDevices,
        pendingActions: pendingConcerns,
      })
    );
  } catch (err: any) {
    console.error("School analytics error:", err);
    return NextResponse.json(errorResponse("Failed to load school analytics", "INTERNAL_ERROR"), { status: 500 });
  }
}
