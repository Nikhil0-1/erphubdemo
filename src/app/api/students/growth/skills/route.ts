import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["student:growth_view"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    let studentId = searchParams.get("studentId") || undefined;

    if (context!.role === "STUDENT" && context!.studentId) {
      studentId = context!.studentId;
    } else if (context!.role === "PARENT" && context!.parentId) {
      const parent = dataStore.findParentById(context!.parentId);
      if (parent?.childrenIds && parent.childrenIds.length > 0) {
        studentId = studentId || parent.childrenIds[0];
      }
    }

    const skills = dataStore.getSkillPassports(studentId);
    return NextResponse.json(successResponse(skills));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch skill passport", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:growth_edit"]);
  if (error) return error;

  try {
    const body = await req.json();
    const item = dataStore.addSkillPassportItem({
      ...body,
      verifiedByTeacherName: context!.name || "Teacher",
      dateAwarded: new Date().toISOString().split("T")[0],
    });
    return NextResponse.json(successResponse(item, "Skill badge awarded to student"), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to award skill", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
