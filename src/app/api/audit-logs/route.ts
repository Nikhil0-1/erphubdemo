import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["platform:manage", "school:manage"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = context!.user.role === "SUPER_ADMIN" ? undefined : context!.schoolId;
    const logs = dataStore.getAuditLogs(schoolId);
    return NextResponse.json(successResponse(logs));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
