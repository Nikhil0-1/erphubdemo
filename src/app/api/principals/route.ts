import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  const { context, error } = await requireAuth(["principal:manage"]);
  if (error) return error;

  try {
    const principals = dataStore.getUsers().filter((u) => u.role === "PRINCIPAL");
    return NextResponse.json(successResponse(principals));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["principal:create"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, schoolId } = body;

    if (!firstName || !lastName || !email || !schoolId) {
      return NextResponse.json(
        errorResponse("First name, last name, email, and school are required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const school = dataStore.findSchoolById(schoolId);
    if (!school) {
      return NextResponse.json(errorResponse("School not found", "NOT_FOUND"), { status: 404 });
    }

    const existing = dataStore.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(errorResponse("User with this email already exists", "DUPLICATE"), { status: 409 });
    }

    const passwordHash = await hashPassword("password123");
    const user = dataStore.addUser({
      email: email.toLowerCase().trim(),
      passwordHash,
      firstName,
      lastName,
      phone,
      role: "PRINCIPAL",
      status: "ACTIVE",
      schoolId: school.id,
      schoolName: school.name,
    });

    school.principalId = user.id;
    school.principalName = `${user.firstName} ${user.lastName}`;
    dataStore.save();

    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId: school.id,
      action: "ASSIGN_PRINCIPAL",
      target: `Assigned ${user.firstName} ${user.lastName} as Principal of ${school.name}`,
    });

    return NextResponse.json(successResponse(user), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
