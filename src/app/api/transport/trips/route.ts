import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["gps:update", "transport:read"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { busId, routeId } = body;
    const schoolId = context!.schoolId || body.schoolId || "school-gv-01";
    const driverId = context!.user.driverId || "driver-01";

    const trip = dataStore.startTrip(driverId, busId || "bus-07", routeId || "route-03", schoolId);

    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId,
      action: "START_BUS_ROUTE",
      target: `Started route for ${trip.busNumber} (${trip.routeName})`,
    });

    return NextResponse.json(successResponse(trip));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
