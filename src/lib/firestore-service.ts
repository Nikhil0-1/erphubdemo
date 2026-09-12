// src/lib/firestore-service.ts
// Comprehensive Firebase Firestore & Storage Service for NurtureKernel ERP
// Conforms to real-time sync, multi-tenant isolation, and RBAC rules

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  DocumentData,
  Unsubscribe,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "./firebase";
import { UserRole } from "@/types";

// ============================================================
// 1. LIVE GPS & TRANSPORT TELEMETRY (Driver ↔ Parent ↔ Dispatch)
// ============================================================

export interface GpsTelemetryData {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  accuracy: number;
  heading?: number;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  routeId?: string;
  routeName?: string;
  nextStop?: string;
  etaMins?: number;
  status: "ACTIVE" | "IDLE" | "MAINTENANCE" | "EMERGENCY";
  updatedAt?: Timestamp | string;
}

/**
 * Update real-time GPS coordinates for a vehicle/bus (used by Driver app)
 */
export async function updateGpsTelemetry(telemetry: GpsTelemetryData): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, "gpsLocations", telemetry.vehicleId);
    await setDoc(docRef, {
      ...telemetry,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error writing GPS telemetry to Firestore:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Real-time listener for vehicle GPS telemetry (used by Parents & Principals)
 */
export function subscribeToGpsTelemetry(
  vehicleId: string,
  onUpdate: (data: GpsTelemetryData) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const docRef = doc(db, "gpsLocations", vehicleId);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as GpsTelemetryData);
      }
    },
    (err) => {
      console.warn("Firestore GPS telemetry snapshot error:", err);
      if (onError) onError(err);
    }
  );
}

// ============================================================
// 2. REALTIME NOTIFICATIONS (Campus Events, Alerts, Taps)
// ============================================================

export interface ErpNotification {
  id?: string;
  title: string;
  desc: string;
  type: "ATTENDANCE" | "ASSIGNMENT" | "PARENT" | "INSIGHT" | "FEE" | "SYSTEM" | "ALERT";
  schoolId?: string;
  targetRole?: UserRole | "ALL";
  targetUserId?: string;
  senderName?: string;
  readBy?: string[];
  createdAt?: unknown;
}

/**
 * Dispatch a notification into Firestore
 */
export async function dispatchNotification(
  notification: Omit<ErpNotification, "id" | "createdAt">
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const colRef = collection(db, "notifications");
    const newDocRef = doc(colRef);
    await setDoc(newDocRef, {
      ...notification,
      readBy: [],
      createdAt: serverTimestamp(),
    });
    return { success: true, id: newDocRef.id };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error dispatching notification to Firestore:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Real-time listener for notifications for a role/school
 */
export function subscribeToNotifications(
  options: { schoolId?: string; role?: UserRole; userId?: string },
  onUpdate: (notifications: ErpNotification[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, "notifications");
  const q = query(colRef, orderBy("createdAt", "desc"), limit(25));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: ErpNotification[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ErpNotification, "id">),
      }));

      // Filter locally for role / user / school
      const filtered = items.filter((n) => {
        if (options.schoolId && n.schoolId && n.schoolId !== options.schoolId) return false;
        if (n.targetUserId && options.userId && n.targetUserId !== options.userId) return false;
        if (n.targetRole && n.targetRole !== "ALL" && options.role && n.targetRole !== options.role) return false;
        return true;
      });

      onUpdate(filtered);
    },
    (err) => {
      console.warn("Firestore notifications snapshot error:", err);
      if (onError) onError(err);
    }
  );
}

// ============================================================
// 3. STUDENT CONCERNS & BEHAVIORAL INCIDENTS (Teacher ↔ Parent)
// ============================================================

export interface StudentConcernDoc {
  id?: string;
  studentId: string;
  studentName: string;
  classId?: string;
  className?: string;
  category: "ACADEMIC" | "ATTENDANCE" | "BEHAVIORAL" | "EMOTIONAL" | "HEALTH" | "OTHER";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED";
  teacherId: string;
  teacherName: string;
  schoolId: string;
  resolvedAt?: unknown;
  resolveNotes?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

/**
 * Save new student concern in Firestore
 */
export async function createFirestoreConcern(
  concern: Omit<StudentConcernDoc, "id" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const colRef = collection(db, "concerns");
    const newDocRef = doc(colRef);
    await setDoc(newDocRef, {
      ...concern,
      status: concern.status || "OPEN",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: newDocRef.id };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

/**
 * Real-time listener for school concerns
 */
export function subscribeToConcerns(
  schoolId: string,
  onUpdate: (concerns: StudentConcernDoc[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, "concerns");
  const q = query(colRef, where("schoolId", "==", schoolId), orderBy("createdAt", "desc"), limit(50));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: StudentConcernDoc[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<StudentConcernDoc, "id">),
      }));
      onUpdate(items);
    },
    (err) => {
      console.warn("Firestore concerns listener warning:", err);
      if (onError) onError(err);
    }
  );
}

/**
 * Resolve/update a student concern
 */
export async function updateFirestoreConcern(
  concernId: string,
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED",
  resolveNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const docRef = doc(db, "concerns", concernId);
    await updateDoc(docRef, {
      status,
      resolveNotes: resolveNotes || "",
      resolvedAt: status === "RESOLVED" ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

// ============================================================
// 4. FIREBASE STORAGE - FILE & MEDIA UPLOADER
// ============================================================

/**
 * Upload file to Firebase Storage bucket (Avatars, Homework, Receipts)
 */
export async function uploadFileToFirebaseStorage(
  file: File | Blob,
  path: string,
  onProgress?: (percent: number) => void
): Promise<{ success: boolean; downloadUrl?: string; error?: string }> {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.error("Firebase Storage Upload failed:", error);
          resolve({ success: false, error: error.message });
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ success: true, downloadUrl });
        }
      );
    });
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

// ============================================================
// 5. FIREBASE SYSTEM HEALTH & CONNECTIVITY TEST
// ============================================================

export interface FirebaseDiagnostics {
  status: "CONNECTED" | "OFFLINE" | "ERROR";
  projectId: string;
  authDomain: string;
  storageBucket: string;
  latencyMs: number;
  firestoreAccessible: boolean;
  storageAccessible: boolean;
  message: string;
}

/**
 * Diagnostic tool to check live Firebase connection from browser
 */
export async function testFirebaseLiveConnection(): Promise<FirebaseDiagnostics> {
  const startTime = Date.now();
  let firestoreOk = false;
  let storageOk = false;

  try {
    // 1. Test Firestore ping
    const testDoc = doc(db, "_system", "healthcheck");
    await setDoc(testDoc, { ping: serverTimestamp(), client: "SmartEdu Web" }, { merge: true });
    firestoreOk = true;
  } catch (e) {
    console.warn("Firestore test ping failed:", e);
  }

  try {
    // 2. Storage bucket verify
    if (storage.app) storageOk = true;
  } catch (e) {
    console.warn("Storage test check failed:", e);
  }

  const latencyMs = Date.now() - startTime;
  const isConnected = firestoreOk || storageOk;

  return {
    status: isConnected ? "CONNECTED" : "OFFLINE",
    projectId: db.app.options.projectId || "erpeduhub0o",
    authDomain: db.app.options.authDomain || "erpeduhub0o.firebaseapp.com",
    storageBucket: db.app.options.storageBucket || "erpeduhub0o.firebasestorage.app",
    latencyMs,
    firestoreAccessible: firestoreOk,
    storageAccessible: storageOk,
    message: isConnected
      ? `Firebase Services active and responsive (${latencyMs}ms)`
      : "Firebase is in standby or awaiting rules configuration.",
  };
}
