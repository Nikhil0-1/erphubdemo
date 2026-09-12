import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["transport:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = context!.schoolId || searchParams.get("schoolId") || "school-gv-01";
    const driverId = context!.user.driverId || searchParams.get("driverId");

    const buses = dataStore.getBuses(schoolId);
    const routes = dataStore.getRoutes(schoolId);
    const activeTrip = buses.length > 0 ? dataStore.getActiveTrip(buses[0].id) : undefined;

    // Driver specific info
    let driverInfo = null;
    if (context!.user.role === "DRIVER" || driverId) {
      const bus = buses[0];
      const route = routes[0];
      driverInfo = {
        busNumber: bus?.number || "BUS-07",
        busId: bus?.id || "bus-07",
        routeName: route?.name || "Route 3",
        routeId: route?.id || "route-03",
        driverId: context!.user.driverId || "driver-01",
        activeTrip: activeTrip || null,
      };
    }

    return NextResponse.json(
      successResponse({
        buses,
        routes,
        activeTrip: activeTrip || null,
        driverInfo,
      })
    );
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["gps:update", "transport:read"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { action, driverId, busId, routeId, tripId, latitude, longitude, accuracy } = body;
    const schoolId = context!.schoolId || body.schoolId || "school-gv-01";

    // 1. Start Trip
    if (action === "start-trip") {
      const trip = dataStore.startTrip(
        driverId || context!.user.driverId || "driver-01",
        busId || "bus-07",
        routeId || "route-03",
        schoolId
      );

      dataStore.logAudit({
        userId: context!.user.id,
        userName: `${context!.user.firstName} ${context!.user.lastName}`,
        role: context!.user.role,
        schoolId,
        action: "START_BUS_ROUTE",
        target: `Started route for ${trip.busNumber} (${trip.routeName})`,
      });

      return NextResponse.json(successResponse(trip));
    }

    // 2. Update GPS Location
    if (action === "update-gps") {
      if (!tripId || latitude === undefined || longitude === undefined) {
        return NextResponse.json(
          errorResponse("tripId, latitude, and longitude are required", "VALIDATION_ERROR"),
          { status: 400 }
        );
      }

      const updated = dataStore.updateGPSLocation(tripId, parseFloat(latitude), parseFloat(longitude), accuracy);
      return NextResponse.json(successResponse(updated));
    }

    // 3. End Trip
    if (action === "end-trip") {
      if (!tripId) {
        return NextResponse.json(errorResponse("tripId is required", "VALIDATION_ERROR"), { status: 400 });
      }

      const ended = dataStore.endTrip(tripId);

      dataStore.logAudit({
        userId: context!.user.id,
        userName: `${context!.user.firstName} ${context!.user.lastName}`,
        role: context!.user.role,
        schoolId,
        action: "END_BUS_ROUTE",
        target: `Ended route for trip ${tripId}`,
      });

      return NextResponse.json(successResponse(ended));
    }

    return NextResponse.json(errorResponse("Invalid action", "BAD_REQUEST"), { status: 400 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
