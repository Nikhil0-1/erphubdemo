// Schools API - CRUD operations for Super Admin
import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { requireAuth } from "@/lib/permissions";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/utils";
import { hashPassword } from "@/lib/auth";

// GET /api/schools - List all schools
export async function GET(req: NextRequest) {
  const { context, error } = await requireAuth(["school:read"]);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const search = (searchParams.get("search") || "").toLowerCase().trim();
  const status = searchParams.get("status") || "";

  try {
    let schools = dataStore.getSchools();

    // Non-super admins can only see their own school
    if (context!.user.role !== "SUPER_ADMIN" && context!.schoolId) {
      schools = schools.filter((s) => s.id === context!.schoolId);
    }

    if (search) {
      schools = schools.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.code.toLowerCase().includes(search) ||
          (s.city && s.city.toLowerCase().includes(search))
      );
    }

    if (status) {
      schools = schools.filter((s) => s.status === status);
    }

    const total = schools.length;
    const paginated = schools.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json(paginatedResponse(paginated, page, pageSize, total));
  } catch (err) {
    console.error("Schools list error:", err);
    return NextResponse.json(errorResponse("Failed to load schools", "INTERNAL_ERROR"), { status: 500 });
  }
}

// POST /api/schools - Create a new school
export async function POST(req: NextRequest) {
  const { context, error } = await requireAuth(["school:create"]);
  if (error) return error;

  try {
    const body = await req.json();

    if (!body.name || !body.code || !body.principalEmail) {
      return NextResponse.json(
        errorResponse("School name, code, and principal email are required", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    // Check duplicate code
    const existingCode = dataStore.getSchools().find((s) => s.code.toLowerCase() === body.code.toLowerCase().trim());
    if (existingCode) {
      return NextResponse.json(
        errorResponse("A school with this code already exists", "DUPLICATE"),
        { status: 409 }
      );
    }

    // Check existing principal email
    const existingUser = dataStore.findUserByEmail(body.principalEmail);
    if (existingUser) {
      return NextResponse.json(
        errorResponse("A user with this email already exists", "DUPLICATE"),
        { status: 409 }
      );
    }

    // 1. Create Principal User
    const passwordHash = await hashPassword("password123");
    const principalUser = dataStore.addUser({
      email: body.principalEmail.toLowerCase().trim(),
      passwordHash,
      firstName: body.principalFirstName || "Principal",
      lastName: body.principalLastName || "",
      phone: body.principalPhone,
      role: "PRINCIPAL",
      status: "ACTIVE",
    });

    // 2. Create School
    const school = dataStore.addSchool({
      name: body.name.trim(),
      code: body.code.toUpperCase().trim(),
      address: body.address,
      city: body.city,
      state: body.state,
      contact: body.contact,
      email: body.email,
      website: body.website,
      board: body.board || "CBSE",
      academicSession: body.academicSession || "2026-27",
      primaryColor: body.primaryColor || "#1e3a5f",
      secondaryColor: body.secondaryColor || "#0ea5e9",
      status: "ACTIVE",
      principalId: principalUser.id,
      principalName: `${principalUser.firstName} ${principalUser.lastName}`.trim(),
      studentCount: 0,
      teacherCount: 0,
    });

    // Update principal user's schoolId
    principalUser.schoolId = school.id;
    principalUser.schoolName = school.name;
    dataStore.save();

    // 3. Create classes if provided
    if (body.classes && Array.isArray(body.classes)) {
      for (const cls of body.classes) {
        dataStore.addClass({
          name: cls.name,
          schoolId: school.id,
          sections: (cls.sections || ["A"]).map((s: string) => ({
            id: `sec-${Date.now()}-${s}`,
            name: s,
            classId: "",
          })),
        });
      }
    } else {
      // Default classes: Class 1 to Class 10
      ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].forEach((name, idx) => {
        dataStore.addClass({
          name,
          grade: 6 + idx,
          schoolId: school.id,
          sections: [
            { id: `sec-${school.id}-${idx}-a`, name: "A", classId: "" },
            { id: `sec-${school.id}-${idx}-b`, name: "B", classId: "" },
          ],
        });
      });
    }

    // 4. Default subjects
    ["Mathematics", "Science", "English", "Social Studies", "Computer Science"].forEach((name) => {
      dataStore.addSubject({
        name,
        schoolId: school.id,
      });
    });

    // Log audit
    dataStore.logAudit({
      userId: context!.user.id,
      userName: `${context!.user.firstName} ${context!.user.lastName}`,
      role: context!.user.role,
      schoolId: school.id,
      action: "CREATE_SCHOOL",
      target: `School ${school.name} (${school.code}) with Principal ${principalUser.email}`,
    });

    return NextResponse.json(successResponse({ school, principal: principalUser }), { status: 201 });
  } catch (err: any) {
    console.error("School creation error:", err);
    return NextResponse.json(errorResponse(err.message || "Failed to create school", "INTERNAL_ERROR"), {
      status: 500,
    });
  }
}
