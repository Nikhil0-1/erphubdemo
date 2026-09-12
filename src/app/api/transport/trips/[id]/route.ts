import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { context, error } = await requireAuth(["gps:update", "transport:read"]);
  if (error) return error;

  try {
    const tripId = params.id;
    const body = await req.json();
    const { status } = body;

    if (status === "COMPLETED") {
      const ended = dataStore.endTrip(tripId);
      if (!ended) {
        return NextResponse.json(errorResponse("Trip not found", "NOT_FOUND"), { status: 404 });
      }

      dataStore.logAudit({
        userId: context!.user.id,
        userName: `${context!.user.firstName} ${context!.user.lastName}`,
        role: context!.user.role,
        schoolId: context!.schoolId || "school-gv-01",
        action: "END_BUS_ROUTE",
        target: `Ended route for trip ${tripId}`,
      });

      return NextResponse.json(successResponse(ended));
    }

    return NextResponse.json(errorResponse("Unsupported status update", "BAD_REQUEST"), { status: 400 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
