import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["school:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = context!.schoolId || searchParams.get("schoolId") || "school-gv-01";

    const devices = dataStore.getIoTDevices(schoolId);
    const events = dataStore.getIoTEvents(schoolId);

    return NextResponse.json(
      successResponse({
        devices,
        events,
        summary: {
          totalDevices: devices.length,
          onlineDevices: devices.filter((d) => d.status === "ONLINE").length,
          offlineDevices: devices.filter((d) => d.status === "OFFLINE").length,
          totalEvents: events.length,
        },
      })
    );
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["attendance:mark", "school:manage", "teacher:manage"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { action, deviceId, studentId } = body;
    const schoolId = context!.schoolId || body.schoolId || "school-gv-01";

    // Action: simulate-rfid
    if (action === "simulate-rfid" || studentId) {
      const targetStudentId = studentId || "student-01";
      const targetDeviceId = deviceId || "GV-RFID-01";

      const result = dataStore.simulateRFIDScan(targetDeviceId, targetStudentId);

      dataStore.logAudit({
        userId: context!.user.id,
        userName: `${context!.user.firstName} ${context!.user.lastName}`,
        role: context!.user.role,
        schoolId,
        action: "SIMULATE_RFID_SCAN",
        target: `Simulated RFID Scan for student ${targetStudentId} on device ${targetDeviceId}`,
      });

      return NextResponse.json(
        successResponse({
          success: true,
          attendance: result.attendance,
          event: result.event,
          message: `RFID Scan processed. ${result.attendance.studentName} marked PRESENT.`,
        })
      );
    }

    return NextResponse.json(errorResponse("Invalid action", "BAD_REQUEST"), { status: 400 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
