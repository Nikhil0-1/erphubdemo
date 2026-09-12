import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

// GET /api/growth/rewards?userId=... - Fetch Credit Points summary and Awards list
export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["student:read", "growth:read", "portfolio:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const user = context!.user;
    const targetUserId = searchParams.get("userId") || user.id;
    const recipientId = searchParams.get("recipientId") || "student-01";

    const creditSummary = dataStore.getRewardsSummary(targetUserId);
    const awards = dataStore.getAwards(recipientId);

    return NextResponse.json(
      successResponse({
        creditSummary,
        awards,
      })
    );
  } catch (err: any) {
    console.error("Rewards GET error:", err);
    return NextResponse.json(errorResponse(err.message || "Failed to load rewards data", "INTERNAL_ERROR"), { status: 500 });
  }
}

// POST /api/growth/rewards - Issue or approve an award, or record credit points
export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["teacher:growth_edit", "school:manage", "principal:manage"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { action, recipientId, recipientName, recipientRole, awardName, category, reason, evidenceSummary } = body;
    const user = context!.user;

    if (action === "APPROVE_AWARD") {
      if (!recipientId || !awardName || !reason) {
        return NextResponse.json(errorResponse("recipientId, awardName, and reason are required", "BAD_REQUEST"), { status: 400 });
      }

      const award = dataStore.approveAward({
        recipientId,
        recipientName: recipientName || "Aarav Kumar",
        recipientRole: recipientRole || "STUDENT",
        awardName,
        category: category || "STUDENT",
        reason,
        evidenceSummary: evidenceSummary || "Demonstrated verified academic growth in Geometry → Angles",
        issuedById: user.id,
        issuedByName: `${user.firstName} ${user.lastName} (${user.role.charAt(0) + user.role.slice(1).toLowerCase()})`,
      });

      // Post milestone into Growth Room
      dataStore.addGrowthMessage(recipientId, {
        roomId: `gr-${recipientId}`,
        senderId: user.id,
        senderName: `${user.firstName} ${user.lastName} (Teacher)`,
        senderRole: user.role,
        text: `🏆 Awarded ${award.recipientName} the "${award.awardName}" award for ${award.reason}`,
        category: "CELEBRATION",
      });

      return NextResponse.json(successResponse(award));
    }

    if (action === "ADD_CREDIT_POINTS") {
      const { points, userId, userRole, pointReason } = body;
      const event = dataStore.awardCreditPoints(
        userId || user.id,
        userRole || user.role,
        points || 15,
        pointReason || "Active learning participation"
      );
      return NextResponse.json(successResponse(event));
    }

    return NextResponse.json(errorResponse("Invalid rewards action", "BAD_REQUEST"), { status: 400 });
  } catch (err: any) {
    console.error("Rewards POST error:", err);
    return NextResponse.json(errorResponse(err.message || "Rewards operation failed", "INTERNAL_ERROR"), { status: 500 });
  }
}
