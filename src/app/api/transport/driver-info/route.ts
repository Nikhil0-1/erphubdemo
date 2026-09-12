import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["transport:read"]);
  if (error) return error;

  try {
    const schoolId = context!.schoolId || "school-gv-01";
    const buses = dataStore.getBuses(schoolId);
    const routes = dataStore.getRoutes(schoolId);
    const bus = buses[0];
    const route = routes[0];
    const activeTrip = bus ? dataStore.getActiveTrip(bus.id) : null;

    const driverInfo = {
      busNumber: bus?.number || "BUS-07",
      busId: bus?.id || "bus-07",
      routeName: route?.name || "Route 3",
      routeId: route?.id || "route-03",
      driverId: context!.user.driverId || "driver-01",
      activeTrip: activeTrip || null,
    };

    return NextResponse.json(successResponse(driverInfo));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
