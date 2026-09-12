import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse } from "@/lib/utils";
import { hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["parent:read"]);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const schoolId = context!.schoolId || searchParams.get("schoolId");
    const parents = dataStore.getParents(schoolId || undefined);

    const result = parents.map((p) => {
      const children = (p.childrenIds || [])
        .map((cid) => dataStore.findStudentById(cid))
        .filter(Boolean);
      return {
        ...p,
        children,
      };
    });

    return NextResponse.json(successResponse(result));
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["parent:create"]);
  if (error) return error;

  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, relationship, address, studentId } = body;
    const schoolId = context!.schoolId || body.schoolId;

    if (!firstName || !lastName || !email || !schoolId) {
      return NextResponse.json(
        errorResponse("First name, last name, email, and school are required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = dataStore.findUserByEmail(cleanEmail);

    if (!user) {
      const passwordHash = await hashPassword("password123");
      user = dataStore.addUser({
        email: cleanEmail,
        passwordHash,
        firstName,
        lastName,
        phone,
        role: "PARENT",
        status: "ACTIVE",
        schoolId,
      });
    }

    const parent = dataStore.addParent({
      userId: user.id,
      firstName,
      lastName,
      email: cleanEmail,
      phone,
      relationship: relationship || "Parent",
      address,
      schoolId,
      childrenIds: studentId ? [studentId] : [],
    });

    user.parentId = parent.id;
    dataStore.save();

    if (studentId) {
      dataStore.linkParentToStudent(parent.id, studentId);
    }

    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId,
      action: "ADD_PARENT",
      target: `Added Parent ${parent.firstName} ${parent.lastName} (${cleanEmail})`,
    });

    return NextResponse.json(successResponse(parent), { status: 201 });
  } catch (err: any) {
    return NextResponse.json(errorResponse(err.message, "INTERNAL_ERROR"), { status: 500 });
  }
}
