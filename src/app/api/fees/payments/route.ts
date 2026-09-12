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
    const invoiceId = searchParams.get("invoiceId") || undefined;

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

    const payments = dataStore.getFeePayments({
      schoolId,
      studentId: targetStudentId,
      invoiceId,
    });

    return NextResponse.json(successResponse(payments));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch payments", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["fee:manage", "fee:record_payment"]);
  if (error) return error;

  try {
    const body = await req.json();
    const schoolId = context!.schoolId || body.schoolId;
    if (!schoolId) {
      return NextResponse.json(errorResponse("School ID is required", "VALIDATION_ERROR"), { status: 400 });
    }

    if (!body.studentId || !body.amount || !body.paymentMode) {
      return NextResponse.json(
        errorResponse("studentId, amount, and paymentMode are required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const student = dataStore.findStudentById(body.studentId);
    const recordedBy = context!.name || "Accountant Office";
    const accountantId = context!.accountantId || (context!.role === "ACCOUNTANT" ? context!.userId : undefined);

    const result = dataStore.recordFeePayment({
      schoolId,
      studentId: body.studentId,
      studentName: student ? `${student.firstName} ${student.lastName}` : body.studentName || "Student",
      studentRollNo: student?.admissionNumber || student?.studentId || "GV-2026",
      studentClass: student?.className || "Class 7-A",
      invoiceId: body.invoiceId || "inv-direct",
      amount: Number(body.amount),
      paymentMode: body.paymentMode,
      transactionRef: body.transactionRef || `OFFLINE-${Date.now()}`,
      paymentDate: body.paymentDate || new Date().toISOString().split("T")[0],
      recordedBy,
      accountantId,
      status: "SUCCESS",
      remarks: body.remarks || "Payment recorded",
    });

    // Notify parent if student has a parent linked
    if (student?.parentId) {
      const parent = dataStore.findParentById(student.parentId);
      if (parent) {
        dataStore.addNotification({
          userId: parent.userId,
          schoolId,
          title: "Fee Payment Received",
          message: `Fee payment of ₹${Number(body.amount).toLocaleString()} received for ${student.firstName} ${student.lastName}. Receipt: ${result.payment.receiptNumber}.`,
          category: "FEE",
          read: false,
        });
      }
    }

    // Audit log
    dataStore.logAudit({
      userId: context!.userId,
      userName: context!.name || "Accountant",
      role: context!.role,
      schoolId,
      action: "RECORD_FEE_PAYMENT",
      target: `Receipt ${result.payment.receiptNumber} - ₹${body.amount}`,
    });

    return NextResponse.json(
      successResponse(result, `Payment of ₹${body.amount} recorded successfully. Receipt generated: ${result.payment.receiptNumber}`),
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Payment recording error:", err);
    return NextResponse.json(
      errorResponse(err.message || "Failed to record payment", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
