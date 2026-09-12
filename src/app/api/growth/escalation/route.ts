import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

// GET /api/growth/escalation?studentId=... - Retrieve escalation cases & teacher support audits
export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["student:read", "growth:read", "analytics:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId") || "student-01";
    const user = context!.user;

    const escCase = dataStore.recordTaskMiss(studentId, "task-init", "Initial Diagnostic Check", true, "Baseline Init");
    const teacherAudit = dataStore.auditTeacherSupport(user.teacherId || "teacher-01", studentId);

    return NextResponse.json(
      successResponse({
        escalationCase: escCase,
        teacherAudit,
        studentId,
      })
    );
  } catch (err: any) {
    console.error("Escalation GET error:", err);
    return NextResponse.json(errorResponse(err.message || "Failed to load escalation status", "INTERNAL_ERROR"), { status: 500 });
  }
}

// POST /api/growth/escalation - Simulate task miss, record exception, or update escalation state
export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:growth_edit", "school:manage", "student:manage"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { action, studentId, taskId, taskTitle, isValidException, exceptionReason } = body;

    if (action === "SIMULATE_MISS") {
      const esc = dataStore.recordTaskMiss(
        studentId || "student-01",
        taskId || `task-${Date.now()}`,
        taskTitle || "Geometry Homework Assignment #3",
        !!isValidException,
        exceptionReason
      );

      // Notify parent & teacher if status reaches RED / ATTENTION REQUIRED
      if (esc.status === "RED") {
        dataStore.addGrowthMessage(studentId || "student-01", {
          roomId: `gr-${studentId || "student-01"}`,
          senderId: "system",
          senderName: "Smart Edu Escalation Engine",
          senderRole: "SUPER_ADMIN",
          text: "⚠️ Attention Required: 3 required learning tasks remain incomplete. A targeted support plan review is recommended.",
          category: "UPDATE",
        });
      }

      return NextResponse.json(successResponse(esc));
    }

    if (action === "AUDIT_TEACHER") {
      const user = context!.user;
      const audit = dataStore.auditTeacherSupport(user.teacherId || "teacher-01", studentId || "student-01");
      return NextResponse.json(successResponse(audit));
    }

    return NextResponse.json(errorResponse("Invalid escalation action", "BAD_REQUEST"), { status: 400 });
  } catch (err: any) {
    console.error("Escalation POST error:", err);
    return NextResponse.json(errorResponse(err.message || "Escalation operation failed", "INTERNAL_ERROR"), { status: 500 });
  }
}
