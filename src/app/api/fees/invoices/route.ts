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
    const studentId = searchParams.get("studentId") || undefined;
    const status = searchParams.get("status") || undefined;

    // Parents and Students can only see their own invoices
    let targetStudentId = studentId;
    if (context!.role === "STUDENT" && context!.studentId) {
      targetStudentId = context!.studentId;
    } else if (context!.role === "PARENT" && context!.parentId) {
      const parent = dataStore.findParentById(context!.parentId);
      if (parent?.childrenIds && parent.childrenIds.length > 0) {
        if (!targetStudentId || !parent.childrenIds.includes(targetStudentId)) {
          targetStudentId = parent.childrenIds[0];
        }
      }
    }

    const invoices = dataStore.getFeeInvoices({
      schoolId,
      studentId: targetStudentId,
      status,
    });

    return NextResponse.json(successResponse(invoices));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch fee invoices", "INTERNAL_ERROR"),
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

    const invoice = dataStore.addFeeInvoice({
      ...body,
      schoolId,
    });

    return NextResponse.json(successResponse(invoice, "Invoice generated successfully"), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to generate fee invoice", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
