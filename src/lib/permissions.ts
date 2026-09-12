// Smart Edu - RBAC Permission System
// Implements role-based access control with school-level isolation

import { UserRole, Permission, SessionUser } from "@/types";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { errorResponse } from "@/lib/utils";

// Re-export Permission
export type { Permission };

// ============================================================
// ROLE → PERMISSIONS MAPPING
// ============================================================

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    // Platform Onboarding Only — No school-operational data
    "school:create",
    "school:read",
    "school:update",
    "school:delete",
    "school:manage",
    "principal:create",
    "principal:manage",
    "platform:manage",
    "audit:read",
    "settings:manage",
  ],

  PRINCIPAL: [
    "school:read",
    "school:update",
    "principal:manage",
    "accountant:create",
    "accountant:read",
    "accountant:manage",
    "teacher:create",
    "teacher:read",
    "teacher:manage",
    "student:create",
    "student:read",
    "student:manage",
    "parent:create",
    "parent:read",
    "parent:manage",
    "staff:create",
    "staff:manage",
    "driver:create",
    "driver:manage",
    "class:create",
    "class:read",
    "class:manage",
    "assessment:read",
    "marks:read",
    "assignment:read",
    "attendance:read",
    "attendance:manage",
    "activity:read",
    "development:read",
    "concern:read",
    "portfolio:read",
    "transport:read",
    "transport:manage",
    "gps:read",
    "iot:read",
    "iot:manage",
    "assistant:use",
    "analytics:read",
    "audit:read",
    "notification:read",
    "notification:manage",
    "settings:manage",
    // Fees
    "fee:read",
    "fee:manage",
    "fee:record_payment",
    "payment:read",
    "invoice:read",
    "receipt:read",
    // Growth
    "growth:read",
    "student:growth_view",
    "teacher:growth_edit",
    "learning-path:read",
    "skill:read",
  ],

  ACCOUNTANT: [
    "student:read",
    "class:read",
    "fee:create",
    "fee:read",
    "fee:update",
    "fee:delete",
    "fee:manage",
    "fee:record_payment",
    "payment:create",
    "payment:read",
    "invoice:create",
    "invoice:read",
    "receipt:read",
    "notification:read",
  ],

  TEACHER: [
    "student:read",
    "class:read",
    "assessment:create",
    "assessment:read",
    "assessment:manage",
    "marks:create",
    "marks:read",
    "marks:manage",
    "assignment:create",
    "assignment:read",
    "assignment:manage",
    "attendance:mark",
    "attendance:read",
    "activity:create",
    "activity:read",
    "activity:manage",
    "development:create",
    "development:read",
    "development:manage",
    "concern:create",
    "concern:read",
    "concern:manage",
    "portfolio:read",
    "transport:read",
    "assistant:use",
    "notification:read",
    // Student Growth Center
    "growth:read",
    "growth:manage",
    "student:growth_view",
    "teacher:growth_edit",
    "learning-path:create",
    "learning-path:read",
    "learning-path:manage",
    "practice:manage",
    "mistake:read",
    "mistake:manage",
    "skill:read",
    "skill:manage",
    "intervention:create",
    "intervention:read",
  ],

  STAFF: [
    "student:read",
    "class:read",
    "attendance:read",
    "transport:read",
    "notification:read",
  ],

  STUDENT: [
    "assessment:read",
    "marks:read",
    "assignment:read",
    "attendance:read",
    "activity:read",
    "development:read",
    "portfolio:read",
    "portfolio:manage",
    "transport:read",
    "assistant:use",
    "notification:read",
    // Student Growth
    "growth:read",
    "student:growth_view",
    "learning-path:read",
    "practice:use",
    "mistake:read",
    "skill:read",
    // Fees
    "fee:read",
    "receipt:read",
  ],

  PARENT: [
    "student:read",
    "assessment:read",
    "marks:read",
    "assignment:read",
    "attendance:read",
    "activity:read",
    "development:read",
    "portfolio:read",
    "transport:read",
    "gps:read",
    "assistant:use",
    "notification:read",
    // Student Growth
    "growth:read",
    "student:growth_view",
    "learning-path:read",
    "skill:read",
    // Fees
    "fee:read",
    "receipt:read",
  ],

  DRIVER: [
    "transport:read",
    "gps:update",
    "gps:read",
    "notification:read",
  ],
};

// ============================================================
// PERMISSION CHECKING
// ============================================================

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// ============================================================
// API MIDDLEWARE
// ============================================================

export interface AuthContext {
  user: SessionUser;
  userId: string;
  role: UserRole;
  schoolId?: string;
  name?: string;
  teacherId?: string;
  studentId?: string;
  parentId?: string;
  driverId?: string;
  accountantId?: string;
}

/**
 * Protect an API route with authentication and optional permission checks.
 * Returns the authenticated user context or an error response.
 */
export async function requireAuth(
  requiredPermissions?: Permission[]
): Promise<{ context?: AuthContext; error?: Response }> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: Response.json(
        errorResponse("Authentication required", "UNAUTHORIZED"),
        { status: 401 }
      ),
    };
  }

  const user = session.user as SessionUser;

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = hasAnyPermission(user.role as UserRole, requiredPermissions);
    if (!hasAccess) {
      return {
        error: Response.json(
          errorResponse("You do not have permission to perform this action.", "FORBIDDEN"),
          { status: 403 }
        ),
      };
    }
  }

  return {
    context: {
      user,
      userId: user.id,
      role: user.role as UserRole,
      schoolId: user.schoolId,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
      teacherId: user.teacherId,
      studentId: user.studentId,
      parentId: user.parentId,
      driverId: user.driverId,
      accountantId: user.accountantId,
    },
  };
}

/**
 * Verify school-level data isolation.
 * Ensures the authenticated user belongs to the school whose data is being accessed.
 */
export function verifySchoolAccess(
  userSchoolId: string | undefined,
  resourceSchoolId: string,
  userRole: UserRole
): boolean {
  // Super Admin can access any school's data (read-only for most)
  if (userRole === "SUPER_ADMIN") return true;

  // All other roles must belong to the same school
  return userSchoolId === resourceSchoolId;
}

/**
 * Get the school ID from the authenticated context.
 * For Super Admin, it can be provided as a query parameter.
 * For all other roles, it's derived from their session.
 */
export function getSchoolIdFromContext(
  context: AuthContext,
  requestSchoolId?: string
): string | undefined {
  if (context.user.role === "SUPER_ADMIN") {
    return requestSchoolId || context.schoolId;
  }
  return context.schoolId;
}

// ============================================================
// ROUTE MAPPING
// ============================================================

export const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  SUPER_ADMIN: "/super-admin",
  PRINCIPAL: "/principal",
  ACCOUNTANT: "/accountant",
  TEACHER: "/teacher",
  STAFF: "/principal", // Staff uses principal-level view with limited access
  STUDENT: "/student",
  PARENT: "/parent",
  DRIVER: "/driver",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  PRINCIPAL: "Principal",
  ACCOUNTANT: "Accountant",
  TEACHER: "Teacher",
  STAFF: "Staff",
  STUDENT: "Student",
  PARENT: "Parent",
  DRIVER: "Driver",
};
