import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["gps:update", "transport:read"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { tripId, latitude, longitude, accuracy } = body;

    if (!tripId || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        errorResponse("tripId, latitude, and longitude are required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const updated = dataStore.updateGPSLocation(tripId, parseFloat(latitude), parseFloat(longitude), accuracy);
    return NextResponse.json(successResponse(updated));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
