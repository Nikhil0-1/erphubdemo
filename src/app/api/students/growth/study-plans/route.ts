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

    const plans = dataStore.getStudyPlans(studentId);
    return NextResponse.json(successResponse(plans));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch study plans", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["student:growth_view", "teacher:growth_edit"]);
  if (error) return error;

  try {
    const body = await req.json();
    let studentId = body.studentId;
    if (context!.role === "STUDENT" && context!.studentId) {
      studentId = context!.studentId;
    }
    const plan = dataStore.addStudyPlan({
      ...body,
      studentId,
    });
    return NextResponse.json(successResponse(plan, "Study session scheduled"), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to add study session", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { context, error } = await requireAuth(["student:growth_view", "teacher:growth_edit"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(errorResponse("Plan ID required", "VALIDATION_ERROR"), { status: 400 });
    }
    const body = await req.json();
    const updated = dataStore.updateStudyPlan(id, body);
    return NextResponse.json(successResponse(updated, "Study plan updated"));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to update study plan", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
