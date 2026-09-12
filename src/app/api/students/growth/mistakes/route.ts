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

    const mistakes = dataStore.getMistakeBook(studentId);
    return NextResponse.json(successResponse(mistakes));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch mistake book", "INTERNAL_ERROR"),
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
      return NextResponse.json(errorResponse("Mistake item ID required", "VALIDATION_ERROR"), { status: 400 });
    }

    const body = await req.json();
    const updated = dataStore.updateMistakeItem(id, body);
    if (!updated) {
      return NextResponse.json(errorResponse("Mistake record not found", "NOT_FOUND"), { status: 404 });
    }

    return NextResponse.json(successResponse(updated, "Mistake status updated"));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to update mistake", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
