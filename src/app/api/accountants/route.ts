import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";
import { hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["school:manage", "staff:manage", "fee:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = context!.schoolId || searchParams.get("schoolId") || undefined;
    const accountants = dataStore.getAccountants(schoolId);
    return NextResponse.json(successResponse(accountants));
  } catch (err: any) {
    return NextResponse.json(
      errorResponse(err.message || "Failed to fetch accountants", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["school:manage", "staff:manage"]);
  if (error) return error;

  try {
    const body = await req.json();
    const schoolId = context!.schoolId || body.schoolId;
    if (!schoolId) {
      return NextResponse.json(errorResponse("School ID is required", "VALIDATION_ERROR"), { status: 400 });
    }

    const { name, email, phone, employeeId, department, qualification, password } = body;
    if (!name || !email) {
      return NextResponse.json(errorResponse("Name and email are required", "VALIDATION_ERROR"), { status: 400 });
    }

    const existingUser = dataStore.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(errorResponse("User with this email already exists", "CONFLICT"), { status: 409 });
    }

    const passwordHash = await hashPassword(password || "password123");
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(" ") || "";

    const user = dataStore.addUser({
      email: email.toLowerCase().trim(),
      passwordHash,
      firstName,
      lastName,
      phone: phone || "",
      role: "ACCOUNTANT",
      status: "ACTIVE",
      schoolId,
    });

    const accountant = dataStore.addAccountant({
      schoolId,
      userId: user.id,
      name,
      email: email.toLowerCase().trim(),
      phone: phone || "",
      employeeId: employeeId || `ACC-${Date.now().toString().slice(-4)}`,
      department: department || "Finance & Accounts",
      qualification: qualification || "Accountant",
      status: "ACTIVE",
      joiningDate: new Date().toISOString().split("T")[0],
    });

    // Link accountantId to user
    user.accountantId = accountant.id;
    dataStore.save();

    dataStore.logAudit({
      userId: context!.userId,
      userName: context!.name || "Principal",
      role: context!.role,
      schoolId,
      action: "INVITE_ACCOUNTANT",
      target: `${name} (${email})`,
    });

    return NextResponse.json(
      successResponse(accountant, "Accountant invited and account provisioned successfully"),
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Invite accountant error:", err);
    return NextResponse.json(
      errorResponse(err.message || "Failed to create accountant", "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
