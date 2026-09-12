import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

// GET /api/growth-room?studentId=... - Retrieve Student Growth Room
export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["student:growth_view", "student:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const user = context!.user;
    let studentId = searchParams.get("studentId");

    if (!studentId) {
      if (user.role === "STUDENT" && user.studentId) {
        studentId = user.studentId;
      } else if (user.role === "PARENT" && user.parentId) {
        const children = dataStore.getStudents().filter((s) => s.parentId === user.parentId);
        if (children.length > 0) studentId = children[0].id;
      }
    }

    const finalStudentId = studentId || "student-01";
    const room = dataStore.getGrowthRoom(finalStudentId);
    if (!room) {
      return NextResponse.json(errorResponse("Growth Room not found", "NOT_FOUND"), { status: 404 });
    }

    return NextResponse.json(successResponse(room));
  } catch (err: any) {
    console.error("Growth Room GET error:", err);
    return NextResponse.json(errorResponse(err.message || "Failed to load Growth Room", "INTERNAL_ERROR"), { status: 500 });
  }
}

// POST /api/growth-room - Post new guidance message or update into Growth Room
export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:growth_edit", "student:read", "parent:read"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { studentId, text, category, attachments } = body;

    if (!studentId || !text) {
      return NextResponse.json(errorResponse("studentId and text are required", "BAD_REQUEST"), { status: 400 });
    }

    const user = context!.user;
    const message = dataStore.addGrowthMessage(studentId, {
      roomId: `gr-${studentId}`,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName} (${user.role.charAt(0) + user.role.slice(1).toLowerCase()})`,
      senderRole: user.role,
      text,
      category: category || "UPDATE",
      attachments,
    });

    // Award credit points if teacher gives feedback or parent responds meaningfully
    if (user.role === "TEACHER") {
      dataStore.awardCreditPoints(user.id, "TEACHER", 10, "Provided mentor feedback in Growth Room", message.id);
    } else if (user.role === "PARENT") {
      dataStore.awardCreditPoints(user.id, "PARENT", 10, "Engaged in Student Growth Room", message.id);
    }

    return NextResponse.json(successResponse(message));
  } catch (err: any) {
    console.error("Growth Room POST error:", err);
    return NextResponse.json(errorResponse(err.message || "Failed to post to Growth Room", "INTERNAL_ERROR"), { status: 500 });
  }
}
