// src/lib/firebase-auth.ts
// Firebase Authentication Service & RBAC / Authorization Algorithms

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { UserRole } from "@/types";

export const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  SUPER_ADMIN: "/super-admin",
  PRINCIPAL: "/principal",
  ACCOUNTANT: "/accountant",
  TEACHER: "/teacher",
  STAFF: "/principal",
  STUDENT: "/student",
  PARENT: "/parent",
  DRIVER: "/driver",
};

// ============================================================
// TYPES & INTERFACES
// ============================================================

export interface UserProfileData {
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  schoolId?: string;
  schoolName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt?: unknown;
  updatedAt?: unknown;
  lastLoginAt?: unknown;
}

export interface AuthResult {
  success: boolean;
  user?: FirebaseUser;
  profile?: UserProfileData;
  redirectUrl?: string;
  error?: string;
}

// ============================================================
// ALGORITHM 1: ERROR TRANSLATION
// Converts Firebase error codes to user-friendly messages
// ============================================================

export function getFriendlyErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Galat email ya password. Kripya check karein.";
    case "auth/email-already-in-use":
      return "Yeh email pehle se registered hai. Kripya login karein.";
    case "auth/weak-password":
      return "Password kam se kam 6 characters ka hona chahiye.";
    case "auth/invalid-email":
      return "Kripya ek valid email address enter karein.";
    case "auth/user-disabled":
      return "Aapka account disable ho gaya hai. Administrator se sampark karein.";
    case "auth/too-many-requests":
      return "Bahut zyada koshishein hui hain. Kripya thodi der baad prayas karein.";
    case "auth/network-request-failed":
      return "Network connection problem. Kripya apna internet connection check karein.";
    case "auth/popup-closed-by-user":
      return "Sign in popup band kar diya gaya tha.";
    case "auth/popup-blocked":
      return "Popup browser dwara block ho gaya. Kripya popup allow karein.";
    default:
      return "Authentication error: " + errorCode;
  }
}

// ============================================================
// ALGORITHM 2: PROFILE SYNCHRONIZATION
// Fetches or automatically initializes user profile in Firestore
// ============================================================

export async function syncUserProfile(
  user: FirebaseUser,
  initialRole?: UserRole,
  additionalData?: Partial<UserProfileData>
): Promise<UserProfileData> {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data() as UserProfileData;
    // Update last login timestamp
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    }).catch(() => {});
    return data;
  }

  // Determine default role: Super Admin for specific master emails or fallback to initialRole / STUDENT
  let assignedRole: UserRole = initialRole || "STUDENT";
  const emailLower = (user.email || "").toLowerCase();

  if (emailLower.includes("admin@smartedu.com") || emailLower.startsWith("admin@")) {
    assignedRole = "SUPER_ADMIN";
  } else if (emailLower.includes("principal")) {
    assignedRole = "PRINCIPAL";
  } else if (emailLower.includes("teacher")) {
    assignedRole = "TEACHER";
  } else if (emailLower.includes("accountant")) {
    assignedRole = "ACCOUNTANT";
  } else if (emailLower.includes("driver")) {
    assignedRole = "DRIVER";
  } else if (emailLower.includes("parent")) {
    assignedRole = "PARENT";
  }

  const nameParts = (user.displayName || "").split(" ");
  const firstName = additionalData?.firstName || nameParts[0] || "User";
  const lastName = additionalData?.lastName || nameParts.slice(1).join(" ") || "";

  const newProfile: UserProfileData = {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    role: assignedRole,
    schoolId: additionalData?.schoolId || "school_1",
    schoolName: additionalData?.schoolName || "Green Valley International School",
    avatarUrl: user.photoURL || undefined,
    status: "ACTIVE",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    ...additionalData,
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}

// ============================================================
// ALGORITHM 3: EMAIL & PASSWORD LOGIN
// ============================================================

export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const profile = await syncUserProfile(cred.user);
    const redirectUrl = ROLE_HOME_ROUTES[profile.role] || "/";

    return {
      success: true,
      user: cred.user,
      profile,
      redirectUrl,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    return {
      success: false,
      error: getFriendlyErrorMessage(error.code || error.message || "auth/unknown"),
    };
  }
}

// ============================================================
// ALGORITHM 4: USER REGISTRATION
// ============================================================

export async function registerWithEmail(
  email: string,
  password: string,
  role: UserRole = "STUDENT",
  profileData?: {
    firstName?: string;
    lastName?: string;
    schoolId?: string;
    schoolName?: string;
  }
): Promise<AuthResult> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const displayName = `${profileData?.firstName || ""} ${profileData?.lastName || ""}`.trim();

    if (displayName) {
      await updateProfile(cred.user, { displayName }).catch(() => {});
    }

    const profile = await syncUserProfile(cred.user, role, profileData);
    const redirectUrl = ROLE_HOME_ROUTES[profile.role] || "/";

    return {
      success: true,
      user: cred.user,
      profile,
      redirectUrl,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    return {
      success: false,
      error: getFriendlyErrorMessage(error.code || error.message || "auth/unknown"),
    };
  }
}

// ============================================================
// ALGORITHM 5: GOOGLE SIGN-IN
// ============================================================

export async function loginWithGoogle(): Promise<AuthResult> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const profile = await syncUserProfile(cred.user);
    const redirectUrl = ROLE_HOME_ROUTES[profile.role] || "/";

    return {
      success: true,
      user: cred.user,
      profile,
      redirectUrl,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    return {
      success: false,
      error: getFriendlyErrorMessage(error.code || error.message || "auth/unknown"),
    };
  }
}

// ============================================================
// ALGORITHM 6: LOGOUT
// ============================================================

export async function logoutUser(): Promise<{ success: boolean; error?: string }> {
  try {
    await signOut(auth);
    return { success: true };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { success: false, error: error.message };
  }
}

// ============================================================
// ALGORITHM 7: PASSWORD RESET
// ============================================================

export async function resetPassword(
  email: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return {
      success: true,
      message: "Password reset link aapki email par bhej diya gaya hai.",
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    return {
      success: false,
      error: getFriendlyErrorMessage(error.code || error.message || "auth/unknown"),
    };
  }
}

// ============================================================
// ALGORITHM 8: ROLE-BASED ACCESS CONTROL (RBAC) CHECK
// Validates if a user role has authority for a target role or feature
// ============================================================

export function checkRoleAccess(
  userRole: UserRole,
  targetRole: UserRole
): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  if (userRole === "PRINCIPAL") {
    return targetRole !== "SUPER_ADMIN";
  }
  return userRole === targetRole;
}
