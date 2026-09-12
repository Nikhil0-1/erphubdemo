import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

// POST /api/growth/action-plan - Generate or Assign AI Action Plan
export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:growth_edit", "assessment:manage", "student:manage"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { action, studentId, weakTopic, planId } = body;
    const user = context!.user;

    if (action === "GENERATE") {
      if (!studentId || !weakTopic) {
        return NextResponse.json(errorResponse("studentId and weakTopic are required", "BAD_REQUEST"), { status: 400 });
      }
      const plan = dataStore.generateActionPlan(studentId, weakTopic);
      return NextResponse.json(successResponse(plan));
    }

    if (action === "ASSIGN") {
      if (!planId) {
        return NextResponse.json(errorResponse("planId is required for assignment", "BAD_REQUEST"), { status: 400 });
      }
      const assigned = dataStore.assignActionPlan(planId, user.id);
      if (!assigned) {
        return NextResponse.json(errorResponse("Action plan not found", "NOT_FOUND"), { status: 404 });
      }

      // Also create an official teacher intervention record
      dataStore.addIntervention({
        studentId: assigned.studentId,
        studentName: assigned.studentName,
        schoolId: user.schoolId,
        teacherId: user.id,
        teacherName: `${user.firstName} ${user.lastName}`,
        type: "AI_RECOMMENDED_ACTION_PLAN",
        title: `Remediation Plan: ${assigned.weakTopic}`,
        notes: `Assigned 10 targeted practice questions, revision tasks, and worksheet for ${assigned.weakTopic}.`,
        status: "IN_PROGRESS",
        scheduledDate: new Date().toISOString().split("T")[0],
        problemIdentified: `Topic accuracy at ${assigned.currentAccuracy}%`,
        actionTaken: "Assigned targeted practice set & revision plan",
      });

      // Post update into Growth Room
      dataStore.addGrowthMessage(assigned.studentId, {
        roomId: `gr-${assigned.studentId}`,
        senderId: user.id,
        senderName: `${user.firstName} ${user.lastName} (Teacher)`,
        senderRole: "TEACHER",
        text: `🎯 Assigned Remediation Action Plan for ${assigned.weakTopic}: 10 Practice Questions + Revision Worksheet.`,
        category: "INTERVENTION",
      });

      return NextResponse.json(successResponse(assigned));
    }

    return NextResponse.json(errorResponse("Invalid action specified", "BAD_REQUEST"), { status: 400 });
  } catch (err: any) {
    console.error("Action Plan API error:", err);
    return NextResponse.json(errorResponse(err.message || "Action plan operation failed", "INTERNAL_ERROR"), { status: 500 });
  }
}
