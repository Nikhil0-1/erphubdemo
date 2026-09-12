// Platform Analytics API - Super Admin Dashboard Data
import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET() {
  const { context, error } = await requireAuth(["platform:manage"]);
  if (error) return error;

  try {
    const schools = dataStore.getSchools();
    const activeSchools = schools.filter((s) => s.status === "ACTIVE").length;
    const principals = dataStore.getUsers().filter((u) => u.role === "PRINCIPAL" && u.status === "ACTIVE").length;
    const students = dataStore.getStudents().length;
    const teachers = dataStore.getTeachers().length;
    const buses = dataStore.getBuses().length;
    const iotDevices = dataStore.getIoTDevices().length;
    const auditLogs = dataStore.getAuditLogs().length;

    const schoolData = schools.map((school) => ({
      id: school.id,
      name: school.name,
      code: school.code,
      status: school.status,
      city: school.city || "New Delhi",
      principalName: school.principalName || "Dr. Anjali Sharma",
      studentCount: dataStore.getStudents(school.id).length,
      teacherCount: dataStore.getTeachers(school.id).length,
      primaryColor: school.primaryColor || "#1e3a5f",
    }));

    return NextResponse.json(
      successResponse({
        stats: {
          totalSchools: schools.length,
          activeSchools,
          totalPrincipals: principals,
          totalStudents: students,
          activeTeachers: teachers,
          activeBuses: buses,
          iotDevices,
          platformAlerts: 0,
          auditLogsCount: auditLogs,
        },
        schools: schoolData,
      })
    );
  } catch (err: any) {
    console.error("Platform analytics error:", err);
    return NextResponse.json(errorResponse("Failed to load platform analytics", "INTERNAL_ERROR"), { status: 500 });
  }
}
