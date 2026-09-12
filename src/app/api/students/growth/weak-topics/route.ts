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
    const subjectId = searchParams.get("subjectId") || undefined;

    if (context!.role === "STUDENT" && context!.studentId) {
      studentId = context!.studentId;
    } else if (context!.role === "PARENT" && context!.parentId) {
      const parent = dataStore.findParentById(context!.parentId);
      if (parent?.childrenIds && parent.childrenIds.length > 0) {
        studentId = studentId || parent.childrenIds[0];
      }
    }

    const items = dataStore.getWeakTopics(studentId, subjectId);
    return NextResponse.json(successResponse(items));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch weak topics", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:growth_edit"]);
  if (error) return error;

  try {
    const body = await req.json();
    const item = dataStore.addWeakTopic(body);
    return NextResponse.json(successResponse(item, "Weak topic recorded"), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to add weak topic", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:growth_edit"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(errorResponse("Topic ID required", "VALIDATION_ERROR"), { status: 400 });
    }
    const body = await req.json();
    const updated = dataStore.updateWeakTopic(id, body);
    if (!updated) {
      return NextResponse.json(errorResponse("Topic not found", "NOT_FOUND"), { status: 404 });
    }
    return NextResponse.json(successResponse(updated, "Weak topic updated"));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to update weak topic", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
