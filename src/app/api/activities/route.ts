import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["activity:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = context!.schoolId || searchParams.get("schoolId");
    const activities = dataStore.getActivities(schoolId || undefined);
    return NextResponse.json(successResponse(activities));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["activity:create"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { name, category, objective, date, classId, skills, evaluation, reflection, participantIds } = body;
    const schoolId = context!.schoolId || body.schoolId;

    if (!name || !category || !schoolId) {
      return NextResponse.json(errorResponse("Name, category, and school are required", "VALIDATION_ERROR"), {
        status: 400,
      });
    }

    const cls = classId ? dataStore.getClasses(schoolId).find((c) => c.id === classId) : undefined;

    const activity = dataStore.addActivity({
      name,
      category,
      objective,
      date: date || new Date().toISOString().split("T")[0],
      classId,
      className: cls?.name || "Class 7-A",
      teacherId: context!.user.teacherId || context!.user.id,
      teacherName: `${context!.user.firstName} ${context!.user.lastName}`,
      skills: Array.isArray(skills) ? skills : (skills || "Robotics, Problem Solving").split(",").map((s: string) => s.trim()),
      evaluation,
      reflection,
      participantIds: participantIds || dataStore.getStudents(schoolId).map((s) => s.id),
      schoolId,
    });

    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId,
      action: "CREATE_ACTIVITY",
      target: `Created activity ${activity.name} (${activity.category})`,
    });

    return NextResponse.json(successResponse(activity), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
