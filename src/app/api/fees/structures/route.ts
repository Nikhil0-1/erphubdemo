import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["fee:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = context!.schoolId || searchParams.get("schoolId") || undefined;
    const classId = searchParams.get("classId") || undefined;

    const structures = dataStore.getFeeStructures(schoolId, classId);
    return NextResponse.json(successResponse(structures));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch fee structures", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["fee:manage"]);
  if (error) return error;

  try {
    const body = await req.json();
    const schoolId = context!.schoolId || body.schoolId;
    if (!schoolId) {
      return NextResponse.json(errorResponse("School ID required", "VALIDATION_ERROR"), { status: 400 });
    }

    const structure = dataStore.addFeeStructure({
      ...body,
      schoolId,
    });

    return NextResponse.json(successResponse(structure, "Fee structure created successfully"), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to create fee structure", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
