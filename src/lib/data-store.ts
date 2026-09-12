// NurtureKernel - Central Application Data Store & Repository Layer
// Conforms to Section 27, 28, 29, 50, 51, 53 of NurtureKernel Specification
// Provides multi-school isolation, reactive querying, and persistence.

import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  UserRole,
  FeeCategory,
  FeeStructure,
  FeeInvoice,
  FeePayment,
  FeeReceipt,
  WeakTopicItem,
  LearningPath,
  LearningPathTask,
  StudyPlanItem,
  PracticeQuestion,
  PracticeAttempt,
  MistakeItem,
  GrowthInsight,
  SkillPassportItem,
  StudentIntervention,
  PaymentMethod,
  PaymentStatus,
  StudentGrowthRoom,
  GrowthRoomMessage,
  GrowthMilestone,
  EscalationCase,
  EscalationStatus,
  CreditPointEvent,
  CreditPointSummary,
  SmartEduAward,
  AIActionPlanRecommendation,
  StudentMissRecord,
  TeacherSupportAudit,
} from "@/types";

export interface School {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  contact?: string;
  email?: string;
  website?: string;
  board?: string;
  academicSession?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  principalId?: string;
  principalName?: string;
  studentCount?: number;
  teacherCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE" | "INVITED" | "SUSPENDED";
  schoolId?: string;
  schoolName?: string;
  teacherId?: string;
  studentId?: string;
  parentId?: string;
  driverId?: string;
  accountantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  userId: string;
  studentId: string;
  admissionNumber?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  classId: string;
  className?: string;
  sectionId?: string;
  sectionName?: string;
  rollNumber?: string;
  schoolId: string;
  parentId?: string;
  parentName?: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  qualification?: string;
  department?: string;
  joiningDate?: string;
  schoolId: string;
  subjects?: string[];
  createdAt: string;
}

export interface Parent {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  relationship?: string;
  address?: string;
  schoolId: string;
  childrenIds?: string[];
  createdAt: string;
}

export interface Driver {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseNo?: string;
  busId?: string;
  busNumber?: string;
  routeId?: string;
  routeName?: string;
  schoolId: string;
  createdAt: string;
}

export interface Accountant {
  id: string;
  userId: string;
  employeeId: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  schoolId: string;
  department?: string;
  qualification?: string;
  status?: string;
  joiningDate?: string;
  createdAt?: string;
}

export interface ClassItem {
  id: string;
  name: string;
  grade?: number;
  schoolId: string;
  sections?: SectionItem[];
}

export interface SectionItem {
  id: string;
  name: string;
  classId: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  code?: string;
  schoolId: string;
}

export interface TeacherAssignmentItem {
  id: string;
  teacherId: string;
  teacherName?: string;
  classId: string;
  className?: string;
  sectionId?: string;
  sectionName?: string;
  subjectId: string;
  subjectName?: string;
  schoolId: string;
}

export interface AttendanceItem {
  id: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  date: string; // YYYY-MM-DD
  status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY";
  markedBy?: string;
  source: "MANUAL" | "IOT";
  schoolId: string;
  createdAt: string;
}

export interface AssessmentItem {
  id: string;
  name: string;
  type: "UNIT_TEST" | "CLASS_TEST" | "ASSIGNMENT" | "PROJECT" | "PRACTICAL" | "INTERNAL_ASSESSMENT";
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  date: string;
  maxMarks: number;
  schoolId: string;
  results: AssessmentResultItem[];
  createdAt: string;
}

export interface AssessmentResultItem {
  id: string;
  assessmentId: string;
  studentId: string;
  studentName: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  dueDate: string;
  maxMarks?: number;
  schoolId: string;
  submissions: AssignmentSubmissionItem[];
  createdAt: string;
}

export interface AssignmentSubmissionItem {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: "PENDING" | "SUBMITTED" | "REVIEWED" | "LATE";
  marks?: number;
  feedback?: string;
}

export interface ActivityItem {
  id: string;
  name: string;
  category: string;
  objective?: string;
  date: string;
  classId?: string;
  className?: string;
  teacherId: string;
  teacherName: string;
  skills: string[];
  evaluation?: string;
  reflection?: string;
  participantIds: string[];
  schoolId: string;
  createdAt: string;
}

export interface DevelopmentItem {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  area: string; // Problem Solving, Communication, Teamwork, Creativity, Leadership, Technical Skills, Innovation, Social Participation
  observation: string;
  feedback: string;
  level: "Improving" | "Developing" | "Strength" | "Emerging Skill" | "Needs Support";
  date: string;
  schoolId: string;
  source: "TEACHER" | "ASSISTANT_APPROVED";
  createdAt: string;
}

export interface ConcernItem {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  category: "ACADEMIC" | "ATTENDANCE" | "BEHAVIOUR" | "ASSIGNMENT" | "PARTICIPATION" | "OTHER";
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_REVIEW" | "ACTION_TAKEN" | "RESOLVED";
  date: string;
  notes?: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioItem {
  id: string;
  studentId: string;
  type: "PROJECT" | "CERTIFICATE" | "ACHIEVEMENT" | "REFLECTION" | "ARTWORK" | "ACTIVITY_RECORD";
  title: string;
  description?: string;
  date: string;
  grade: string; // e.g., "Class 7", "Class 6"
  skills: string[];
  fileUrl?: string;
  schoolId: string;
}

export interface BusItem {
  id: string;
  number: string;
  capacity: number;
  driverId?: string;
  driverName?: string;
  routeId?: string;
  routeName?: string;
  schoolId: string;
  status: "IDLE" | "ROUTE_ACTIVE";
}

export interface BusRouteItem {
  id: string;
  name: string;
  schoolId: string;
  stops: { name: string; order: number; lat: number; lng: number }[];
}

export interface GPSTripItem {
  id: string;
  busId: string;
  busNumber: string;
  routeId: string;
  routeName: string;
  driverId: string;
  driverName: string;
  status: "NOT_STARTED" | "ACTIVE" | "COMPLETED";
  startedAt?: string;
  endedAt?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: string;
  };
  schoolId: string;
}

export interface IoTDeviceItem {
  id: string;
  deviceId: string;
  type: "RFID_READER" | "BIOMETRIC" | "CAMERA" | "SENSOR";
  name: string;
  location: string;
  status: "ONLINE" | "OFFLINE" | "MAINTENANCE";
  schoolId: string;
  lastHeartbeat: string;
  eventsCount: number;
}

export interface IoTEventItem {
  id: string;
  deviceId: string;
  eventType: "RFID_SCAN" | "HEARTBEAT" | "STATUS_CHANGE";
  payload: any;
  timestamp: string;
  schoolId: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  role: string;
  schoolId?: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  schoolId?: string;
  title: string;
  message: string;
  category: string;
  read: boolean;
  createdAt: string;
}

interface DataStoreSchema {
  schools: School[];
  users: User[];
  students: Student[];
  teachers: Teacher[];
  parents: Parent[];
  drivers: Driver[];
  accountants: Accountant[];
  classes: ClassItem[];
  subjects: SubjectItem[];
  teacherAssignments: TeacherAssignmentItem[];
  attendance: AttendanceItem[];
  assessments: AssessmentItem[];
  assignments: AssignmentItem[];
  activities: ActivityItem[];
  development: DevelopmentItem[];
  concerns: ConcernItem[];
  portfolio: PortfolioItem[];
  buses: BusItem[];
  routes: BusRouteItem[];
  trips: GPSTripItem[];
  iotDevices: IoTDeviceItem[];
  iotEvents: IoTEventItem[];
  auditLogs: AuditLogItem[];
  notifications: NotificationItem[];
  // Fee Management
  feeStructures: FeeStructure[];
  feeInvoices: FeeInvoice[];
  feePayments: FeePayment[];
  // 7 Student Growth Features
  weakTopics: WeakTopicItem[];
  learningPaths: LearningPath[];
  studyPlans: StudyPlanItem[];
  practiceQuestions: PracticeQuestion[];
  practiceAttempts: PracticeAttempt[];
  mistakeBook: MistakeItem[];
  growthInsights: GrowthInsight[];
  skillPassports: SkillPassportItem[];
  interventions: StudentIntervention[];
  // Growth Rooms, Accountability & Awards Extensions
  growthRooms: StudentGrowthRoom[];
  actionPlans: AIActionPlanRecommendation[];
  escalationCases: EscalationCase[];
  studentMisses: StudentMissRecord[];
  teacherAudits: TeacherSupportAudit[];
  creditPointEvents: CreditPointEvent[];
  creditPoints: CreditPointSummary[];
  awards: SmartEduAward[];
}

// -------------------------------------------------------------
// Data Store Singleton
// -------------------------------------------------------------
class DataStore {
  private data: DataStoreSchema;
  private filePath: string;
  private initialized = false;

  constructor() {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {}
    }
    this.filePath = path.join(dataDir, "smartedu-store.json");
    this.data = this.loadInitialData();
  }

  private loadInitialData(): DataStoreSchema {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.schools && parsed.users) {
          return this.ensureCompleteSchema(parsed);
        }
      } catch (err) {
        console.warn("Could not read existing store. Initializing fresh demo data.");
      }
    }
    const fresh = this.createSeedData();
    this.saveData(fresh);
    return fresh;
  }

  private ensureCompleteSchema(parsed: any): DataStoreSchema {
    const seed = this.createSeedData();
    const updated: DataStoreSchema = {
      ...seed,
      ...parsed,
      accountants: parsed.accountants && parsed.accountants.length > 0 ? parsed.accountants : seed.accountants,
      feeStructures: parsed.feeStructures && parsed.feeStructures.length > 0 ? parsed.feeStructures : seed.feeStructures,
      feeInvoices: parsed.feeInvoices && parsed.feeInvoices.length > 0 ? parsed.feeInvoices : seed.feeInvoices,
      feePayments: parsed.feePayments && parsed.feePayments.length > 0 ? parsed.feePayments : seed.feePayments,
      weakTopics: parsed.weakTopics && parsed.weakTopics.length > 0 ? parsed.weakTopics : seed.weakTopics,
      learningPaths: parsed.learningPaths && parsed.learningPaths.length > 0 ? parsed.learningPaths : seed.learningPaths,
      studyPlans: parsed.studyPlans && parsed.studyPlans.length > 0 ? parsed.studyPlans : seed.studyPlans,
      practiceQuestions: parsed.practiceQuestions && parsed.practiceQuestions.length > 0 ? parsed.practiceQuestions : seed.practiceQuestions,
      practiceAttempts: parsed.practiceAttempts || seed.practiceAttempts,
      mistakeBook: parsed.mistakeBook && parsed.mistakeBook.length > 0 ? parsed.mistakeBook : seed.mistakeBook,
      growthInsights: parsed.growthInsights && parsed.growthInsights.length > 0 ? parsed.growthInsights : seed.growthInsights,
      skillPassports: parsed.skillPassports && parsed.skillPassports.length > 0 ? parsed.skillPassports : seed.skillPassports,
      interventions: parsed.interventions && parsed.interventions.length > 0 ? parsed.interventions : seed.interventions,
    };

    if (!updated.users.some((u: any) => u.role === "ACCOUNTANT")) {
      const accountantUsers = seed.users.filter((u) => u.role === "ACCOUNTANT");
      updated.users.push(...accountantUsers);
    }
    return updated;
  }

  private saveData(data: DataStoreSchema) {
    try {
      const dataDir = path.dirname(this.filePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error persisting dataStore:", err);
    }
  }

  public save() {
    this.saveData(this.data);
  }

  private createSeedData(): DataStoreSchema {
    const defaultPasswordHash = bcrypt.hashSync("password123", 10);
    const now = new Date().toISOString();
    const todayStr = new Date().toISOString().split("T")[0];

    const schoolId = "school-gv-01";
    const school: School = {
      id: schoolId,
      name: "Green Valley School",
      code: "SE-GVS01",
      address: "123 Education Lane, Sector 15",
      city: "New Delhi",
      state: "Delhi",
      contact: "+91-11-2345-6789",
      email: "info@greenvalleyschool.edu",
      website: "https://greenvalleyschool.edu",
      board: "CBSE",
      academicSession: "2026-27",
      primaryColor: "#1e3a5f",
      secondaryColor: "#0ea5e9",
      status: "ACTIVE",
      principalId: "user-principal-01",
      principalName: "Dr. Anjali Sharma",
      studentCount: 1,
      teacherCount: 1,
      createdAt: now,
      updatedAt: now,
    };

    // Users
    const users: User[] = [
      {
        id: "user-admin-01",
        email: "admin@smartedu.com",
        passwordHash: defaultPasswordHash,
        firstName: "Platform",
        lastName: "Admin",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "user-principal-01",
        email: "anjali.sharma@greenvalley.edu",
        passwordHash: defaultPasswordHash,
        firstName: "Anjali",
        lastName: "Sharma",
        role: "PRINCIPAL",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        createdAt: now,
        updatedAt: now,
      },
      // Alias for principal@greenvalley.edu
      {
        id: "user-principal-alias",
        email: "principal@greenvalley.edu",
        passwordHash: defaultPasswordHash,
        firstName: "Anjali",
        lastName: "Sharma",
        role: "PRINCIPAL",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "user-teacher-01",
        email: "rahul.sharma@greenvalley.edu",
        passwordHash: defaultPasswordHash,
        firstName: "Rahul",
        lastName: "Sharma",
        role: "TEACHER",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        teacherId: "teacher-01",
        createdAt: now,
        updatedAt: now,
      },
      // Alias for teacher@greenvalley.edu
      {
        id: "user-teacher-alias",
        email: "teacher@greenvalley.edu",
        passwordHash: defaultPasswordHash,
        firstName: "Rahul",
        lastName: "Sharma",
        role: "TEACHER",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        teacherId: "teacher-01",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "user-accountant-01",
        email: "priya.patel@greenvalley.edu",
        passwordHash: defaultPasswordHash,
        firstName: "Priya",
        lastName: "Patel",
        role: "ACCOUNTANT",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        accountantId: "accountant-01",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "user-accountant-alias",
        email: "accountant@greenvalley.edu",
        passwordHash: defaultPasswordHash,
        firstName: "Priya",
        lastName: "Patel",
        role: "ACCOUNTANT",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        accountantId: "accountant-01",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "user-student-01",
        email: "aarav.kumar@student.greenvalley.edu",
        passwordHash: defaultPasswordHash,
        firstName: "Aarav",
        lastName: "Kumar",
        role: "STUDENT",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        studentId: "student-01",
        createdAt: now,
        updatedAt: now,
      },
      // Alias for student@greenvalley.edu
      {
        id: "user-student-alias",
        email: "student@greenvalley.edu",
        passwordHash: defaultPasswordHash,
        firstName: "Aarav",
        lastName: "Kumar",
        role: "STUDENT",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        studentId: "student-01",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "user-parent-01",
        email: "raj.kumar@gmail.com",
        passwordHash: defaultPasswordHash,
        firstName: "Raj",
        lastName: "Kumar",
        role: "PARENT",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        parentId: "parent-01",
        createdAt: now,
        updatedAt: now,
      },
      // Alias for parent@greenvalley.edu
      {
        id: "user-parent-alias",
        email: "parent@greenvalley.edu",
        passwordHash: defaultPasswordHash,
        firstName: "Raj",
        lastName: "Kumar",
        role: "PARENT",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        parentId: "parent-01",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "user-driver-01",
        email: "rajesh.driver@greenvalley.edu",
        passwordHash: defaultPasswordHash,
        firstName: "Rajesh",
        lastName: "Kumar",
        role: "DRIVER",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        driverId: "driver-01",
        createdAt: now,
        updatedAt: now,
      },
      // Alias for driver@greenvalley.edu
      {
        id: "user-driver-alias",
        email: "driver@greenvalley.edu",
        passwordHash: defaultPasswordHash,
        firstName: "Rajesh",
        lastName: "Kumar",
        role: "DRIVER",
        status: "ACTIVE",
        schoolId,
        schoolName: "Green Valley School",
        driverId: "driver-01",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const teacher: Teacher = {
      id: "teacher-01",
      userId: "user-teacher-01",
      employeeId: "GV-T-101",
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.sharma@greenvalley.edu",
      phone: "+91-98765-43210",
      qualification: "M.Sc. Mathematics, B.Ed.",
      department: "Mathematics",
      joiningDate: "2022-07-01",
      schoolId,
      subjects: ["Mathematics", "Science"],
      createdAt: now,
    };

    const student: Student = {
      id: "student-01",
      userId: "user-student-01",
      studentId: "GV-2026-007",
      admissionNumber: "ADM-2026-042",
      firstName: "Aarav",
      lastName: "Kumar",
      email: "aarav.kumar@student.greenvalley.edu",
      dateOfBirth: "2013-05-14",
      classId: "class-07",
      className: "Class 7",
      sectionId: "sec-07a",
      sectionName: "A",
      rollNumber: "07",
      schoolId,
      parentId: "parent-01",
      parentName: "Raj Kumar",
      createdAt: now,
    };

    const parent: Parent = {
      id: "parent-01",
      userId: "user-parent-01",
      firstName: "Raj",
      lastName: "Kumar",
      email: "raj.kumar@gmail.com",
      phone: "+91-99887-76655",
      relationship: "Father",
      address: "Flat 402, Green Heights, New Delhi",
      schoolId,
      childrenIds: ["student-01"],
      createdAt: now,
    };

    const driver: Driver = {
      id: "driver-01",
      userId: "user-driver-01",
      firstName: "Rajesh",
      lastName: "Kumar",
      email: "rajesh.driver@greenvalley.edu",
      phone: "+91-91234-56789",
      licenseNo: "DL-1420180012345",
      busId: "bus-07",
      busNumber: "BUS-07",
      routeId: "route-03",
      routeName: "Route 3",
      schoolId,
      createdAt: now,
    };

    const accountant: Accountant = {
      id: "accountant-01",
      userId: "user-accountant-01",
      employeeId: "GV-ACC-101",
      firstName: "Priya",
      lastName: "Patel",
      email: "priya.patel@greenvalley.edu",
      phone: "+91-98111-22334",
      schoolId,
      createdAt: now,
    };

    const classes: ClassItem[] = [
      {
        id: "class-07",
        name: "Class 7",
        grade: 7,
        schoolId,
        sections: [
          { id: "sec-07a", name: "A", classId: "class-07" },
          { id: "sec-07b", name: "B", classId: "class-07" },
        ],
      },
      {
        id: "class-04",
        name: "Class 4",
        grade: 4,
        schoolId,
        sections: [{ id: "sec-04b", name: "B", classId: "class-04" }],
      },
    ];

    const subjects: SubjectItem[] = [
      { id: "sub-math", name: "Mathematics", code: "MATH-07", schoolId },
      { id: "sub-sci", name: "Science", code: "SCI-07", schoolId },
      { id: "sub-eng", name: "English", code: "ENG-07", schoolId },
    ];

    const teacherAssignments: TeacherAssignmentItem[] = [
      {
        id: "assign-01",
        teacherId: "teacher-01",
        teacherName: "Rahul Sharma",
        classId: "class-07",
        className: "Class 7",
        sectionId: "sec-07a",
        sectionName: "A",
        subjectId: "sub-math",
        subjectName: "Mathematics",
        schoolId,
      },
    ];

    // Seed 14 days of Attendance for Aarav
    const attendance: AttendanceItem[] = [
      {
        id: "att-today",
        studentId: "student-01",
        studentName: "Aarav Kumar",
        rollNumber: "07",
        date: todayStr,
        status: "PRESENT",
        markedBy: "teacher-01",
        source: "MANUAL",
        schoolId,
        createdAt: now,
      },
      {
        id: "att-yest",
        studentId: "student-01",
        studentName: "Aarav Kumar",
        rollNumber: "07",
        date: "2026-09-10",
        status: "PRESENT",
        markedBy: "teacher-01",
        source: "IOT",
        schoolId,
        createdAt: now,
      },
      {
        id: "att-03",
        studentId: "student-01",
        studentName: "Aarav Kumar",
        rollNumber: "07",
        date: "2026-09-09",
        status: "PRESENT",
        markedBy: "teacher-01",
        source: "MANUAL",
        schoolId,
        createdAt: now,
      },
      {
        id: "att-04",
        studentId: "student-01",
        studentName: "Aarav Kumar",
        rollNumber: "07",
        date: "2026-09-08",
        status: "LATE",
        markedBy: "teacher-01",
        source: "MANUAL",
        schoolId,
        createdAt: now,
      },
      {
        id: "att-05",
        studentId: "student-01",
        studentName: "Aarav Kumar",
        rollNumber: "07",
        date: "2026-09-07",
        status: "PRESENT",
        markedBy: "teacher-01",
        source: "IOT",
        schoolId,
        createdAt: now,
      },
    ];

    // Assessments
    const assessments: AssessmentItem[] = [
      {
        id: "assess-01",
        name: "Mathematics Unit Test 1",
        type: "UNIT_TEST",
        subjectId: "sub-math",
        subjectName: "Mathematics",
        classId: "class-07",
        className: "Class 7-A",
        teacherId: "teacher-01",
        teacherName: "Rahul Sharma",
        date: "2026-09-02",
        maxMarks: 100,
        schoolId,
        createdAt: now,
        results: [
          {
            id: "res-01",
            assessmentId: "assess-01",
            studentId: "student-01",
            studentName: "Aarav Kumar",
            marks: 78,
            maxMarks: 100,
            percentage: 78,
            grade: "B+",
            remarks: "Good improvement in problem solving and algebraic concepts.",
          },
        ],
      },
      {
        id: "assess-02",
        name: "Fractions & Decimals Class Test",
        type: "CLASS_TEST",
        subjectId: "sub-math",
        subjectName: "Mathematics",
        classId: "class-07",
        className: "Class 7-A",
        teacherId: "teacher-01",
        teacherName: "Rahul Sharma",
        date: "2026-09-08",
        maxMarks: 25,
        schoolId,
        createdAt: now,
        results: [
          {
            id: "res-02",
            assessmentId: "assess-02",
            studentId: "student-01",
            studentName: "Aarav Kumar",
            marks: 22,
            maxMarks: 25,
            percentage: 88,
            grade: "A",
            remarks: "Excellent accuracy on word problems.",
          },
        ],
      },
    ];

    // Assignments
    const assignments: AssignmentItem[] = [
      {
        id: "assign-item-01",
        title: "Algebraic Expressions & Geometry Practice",
        description: "Solve Exercise 4.2 questions 1-10 with detailed step-by-step reasoning.",
        subjectId: "sub-math",
        subjectName: "Mathematics",
        classId: "class-07",
        className: "Class 7-A",
        dueDate: "2026-09-15",
        maxMarks: 20,
        schoolId,
        createdAt: now,
        submissions: [
          {
            id: "subm-01",
            assignmentId: "assign-item-01",
            studentId: "student-01",
            studentName: "Aarav Kumar",
            submittedAt: "2026-09-10T14:30:00Z",
            status: "SUBMITTED",
            marks: 18,
            feedback: "Well written solutions with neat geometry diagrams.",
          },
        ],
      },
    ];

    // Activities
    const activities: ActivityItem[] = [
      {
        id: "act-01",
        name: "Autonomous Obstacle Avoidance Rover",
        category: "Robotics / IoT / Coding",
        objective: "Build an ultrasonic sensor-based robotic rover using Arduino/ESP32.",
        date: "2026-09-04",
        classId: "class-07",
        className: "Class 7-A",
        teacherId: "teacher-01",
        teacherName: "Rahul Sharma",
        skills: ["Robotics", "C++ Coding", "Sensors", "Teamwork"],
        evaluation: "Demonstrated strong grasp of sensor feedback loops and microcontroller wiring.",
        reflection: "Learned how real-time obstacle avoidance algorithms prevent collisions.",
        participantIds: ["student-01"],
        schoolId,
        createdAt: now,
      },
      {
        id: "act-02",
        name: "School Green Campus Energy Audit",
        category: "Environment",
        objective: "Measure classroom power consumption and propose renewable alternatives.",
        date: "2026-08-28",
        classId: "class-07",
        className: "Class 7-A",
        teacherId: "teacher-01",
        teacherName: "Rahul Sharma",
        skills: ["Data Analysis", "Environmental Science", "Critical Thinking"],
        participantIds: ["student-01"],
        schoolId,
        createdAt: now,
      },
    ];

    // Development Records
    const development: DevelopmentItem[] = [
      {
        id: "dev-01",
        studentId: "student-01",
        studentName: "Aarav Kumar",
        teacherId: "teacher-01",
        teacherName: "Rahul Sharma",
        area: "Problem Solving",
        observation: "Displays analytical mindset when tackling complex multi-step math problems.",
        feedback: "Keep practicing modular problem decomposition.",
        level: "Developing",
        date: "2026-09-05",
        schoolId,
        source: "TEACHER",
        createdAt: now,
      },
      {
        id: "dev-02",
        studentId: "student-01",
        studentName: "Aarav Kumar",
        teacherId: "teacher-01",
        teacherName: "Rahul Sharma",
        area: "Technical Skills",
        observation: "Quickly grasped breadboard circuitry and ultrasonic sensor logic in robotics.",
        feedback: "Outstanding curiosity in hands-on STEM experiments.",
        level: "Strength",
        date: "2026-09-06",
        schoolId,
        source: "TEACHER",
        createdAt: now,
      },
    ];

    // Student Concerns
    const concerns: ConcernItem[] = [
      {
        id: "con-01",
        studentId: "student-01",
        studentName: "Aarav Kumar",
        teacherId: "teacher-01",
        teacherName: "Rahul Sharma",
        category: "ACADEMIC",
        description: "Requires additional practice with negative number exponents in algebra.",
        priority: "MEDIUM",
        status: "IN_REVIEW",
        notes: "Provided extra worksheet; will re-evaluate on Friday.",
        date: "2026-09-08",
        schoolId,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Portfolio
    const portfolio: PortfolioItem[] = [
      {
        id: "port-01",
        studentId: "student-01",
        type: "PROJECT",
        title: "Smart Irrigation Model using Soil Moisture Sensor",
        description: "Designed an automated plant watering system utilizing IoT sensor triggers.",
        date: "2026-05-10",
        grade: "Class 7",
        skills: ["IoT", "Hardware", "Automation"],
        schoolId,
      },
      {
        id: "port-02",
        studentId: "student-01",
        type: "CERTIFICATE",
        title: "National Science Olympiad — School Gold Medalist",
        description: "Achieved top 5 percentile nationally in General Science & Logic.",
        date: "2025-11-20",
        grade: "Class 6",
        skills: ["Science", "Logic", "Analytical Thinking"],
        schoolId,
      },
    ];

    // Transport: Bus & Route
    const buses: BusItem[] = [
      {
        id: "bus-07",
        number: "BUS-07",
        capacity: 40,
        driverId: "driver-01",
        driverName: "Rajesh Kumar",
        routeId: "route-03",
        routeName: "Route 3",
        schoolId,
        status: "IDLE",
      },
    ];

    const routes: BusRouteItem[] = [
      {
        id: "route-03",
        name: "Route 3",
        schoolId,
        stops: [
          { name: "Green Valley Stop 1", order: 1, lat: 28.5355, lng: 77.241 },
          { name: "Main Market Stop", order: 2, lat: 28.542, lng: 77.25 },
          { name: "Metro Station Junction", order: 3, lat: 28.551, lng: 77.258 },
          { name: "Sector 15 Gate", order: 4, lat: 28.56, lng: 77.265 },
          { name: "School Campus", order: 5, lat: 28.568, lng: 77.272 },
        ],
      },
    ];

    const trips: GPSTripItem[] = [
      {
        id: "trip-01",
        busId: "bus-07",
        busNumber: "BUS-07",
        routeId: "route-03",
        routeName: "Route 3",
        driverId: "driver-01",
        driverName: "Rajesh Kumar",
        status: "NOT_STARTED",
        schoolId,
      },
    ];

    // IoT
    const iotDevices: IoTDeviceItem[] = [
      {
        id: "iot-01",
        deviceId: "GV-RFID-01",
        type: "RFID_READER",
        name: "Classroom 7-A RFID Reader",
        location: "Class 7-A Door",
        status: "ONLINE",
        schoolId,
        lastHeartbeat: now,
        eventsCount: 42,
      },
      {
        id: "iot-02",
        deviceId: "GV-GATE-01",
        type: "RFID_READER",
        name: "Main Entrance Gate Reader",
        location: "Main Gate",
        status: "ONLINE",
        schoolId,
        lastHeartbeat: now,
        eventsCount: 156,
      },
    ];

    const iotEvents: IoTEventItem[] = [
      {
        id: "event-01",
        deviceId: "GV-RFID-01",
        eventType: "RFID_SCAN",
        payload: {
          studentId: "student-01",
          studentName: "Aarav Kumar",
          cardId: "RFID-CARD-8892",
          status: "PRESENT",
        },
        timestamp: now,
        schoolId,
      },
    ];

    const auditLogs: AuditLogItem[] = [
      {
        id: "audit-01",
        userId: "user-admin-01",
        userName: "Platform Admin",
        role: "SUPER_ADMIN",
        schoolId,
        action: "INITIALIZE_PLATFORM",
        target: "Green Valley School Setup",
        timestamp: now,
      },
    ];

    const notifications: NotificationItem[] = [
      {
        id: "notif-01",
        userId: "user-teacher-01",
        schoolId,
        title: "Upcoming Unit Test",
        message: "Mathematics Unit Test 1 scheduled for Class 7-A.",
        category: "ACADEMIC",
        read: false,
        createdAt: now,
      },
      {
        id: "notif-02",
        userId: "user-parent-01",
        schoolId,
        title: "Attendance Marked",
        message: "Aarav Kumar was marked Present today at 08:15 AM via RFID scan.",
        category: "ATTENDANCE",
        read: false,
        createdAt: now,
      },
    ];

    const accountants: Accountant[] = [
      {
        id: "accountant-01",
        schoolId,
        userId: "user-accountant-01",
        name: "Priya Patel",
        email: "priya.patel@greenvalley.edu",
        phone: "+91 98765 43219",
        employeeId: "GV-ACC-01",
        department: "Finance & Accounts",
        qualification: "M.Com, Chartered Accountant (Inter)",
        status: "ACTIVE",
        joiningDate: "2023-04-01",
      },
    ];

    const feeStructures: FeeStructure[] = [
      {
        id: "fs-01",
        schoolId,
        name: "Standard Academic Fee 2026-27 (Class 7)",
        academicYear: "2026-2027",
        classId: "class-7a",
        categories: [
          { id: "cat-01", name: "Tuition Fee", amount: 25000, frequency: "TERMLY", isMandatory: true },
          { id: "cat-02", name: "Computer & Lab Fee", amount: 4500, frequency: "ANNUAL", isMandatory: true },
          { id: "cat-03", name: "Library & Learning Resources", amount: 2000, frequency: "ANNUAL", isMandatory: true },
          { id: "cat-04", name: "Sports & Co-Curricular", amount: 3500, frequency: "ANNUAL", isMandatory: true },
          { id: "cat-05", name: "Transport Fee (Optional)", amount: 10000, frequency: "TERMLY", isMandatory: false },
        ],
        totalAnnualAmount: 45000,
        dueDate: "2026-09-30",
        lateFeePerDay: 50,
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const feeInvoices: FeeInvoice[] = [
      {
        id: "inv-2026-001",
        invoiceNumber: "INV-2026-001",
        schoolId,
        studentId: "student-01",
        studentName: "Aarav Kumar",
        studentRollNo: "GV-2026-0701",
        studentClass: "Class 7-A",
        parentName: "Raj Kumar",
        parentEmail: "parent@greenvalley.edu",
        parentPhone: "+91 98765 43212",
        academicYear: "2026-2027",
        term: "Term 1 (Apr - Sep 2026)",
        categories: [
          { categoryId: "cat-01", name: "Tuition Fee (Term 1)", amount: 25000 },
          { categoryId: "cat-02", name: "Computer & Lab Fee", amount: 4500 },
          { categoryId: "cat-03", name: "Library & Learning Resources", amount: 2000 },
          { categoryId: "cat-04", name: "Sports & Co-Curricular", amount: 3500 },
        ],
        totalAmount: 35000,
        paidAmount: 35000,
        pendingAmount: 0,
        discountAmount: 0,
        status: "PAID",
        issueDate: "2026-04-05",
        dueDate: "2026-05-15",
        paidDate: "2026-04-20",
        remarks: "Paid in full via Net Banking",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "inv-2026-002",
        invoiceNumber: "INV-2026-002",
        schoolId,
        studentId: "student-01",
        studentName: "Aarav Kumar",
        studentRollNo: "GV-2026-0701",
        studentClass: "Class 7-A",
        parentName: "Raj Kumar",
        parentEmail: "parent@greenvalley.edu",
        parentPhone: "+91 98765 43212",
        academicYear: "2026-2027",
        term: "Term 2 (Oct 2026 - Mar 2027)",
        categories: [
          { categoryId: "cat-01", name: "Tuition Fee (Term 2)", amount: 25000 },
          { categoryId: "cat-05", name: "Transport Fee (Term 2)", amount: 10000 },
        ],
        totalAmount: 35000,
        paidAmount: 15000,
        pendingAmount: 20000,
        discountAmount: 0,
        status: "PARTIAL",
        issueDate: "2026-09-01",
        dueDate: "2026-09-30",
        paidDate: "2026-09-05",
        remarks: "First installment paid. Balance due by Sep 30.",
        createdAt: now,
        updatedAt: now,
      },
    ];

    const feePayments: FeePayment[] = [
      {
        id: "pay-01",
        receiptNumber: "REC-2026-0089",
        invoiceId: "inv-2026-001",
        schoolId,
        studentId: "student-01",
        studentName: "Aarav Kumar",
        studentRollNo: "GV-2026-0701",
        studentClass: "Class 7-A",
        amount: 35000,
        paymentMode: "ONLINE",
        transactionRef: "TXN-UPI-99238411",
        paymentDate: "2026-04-20",
        recordedBy: "Priya Patel",
        accountantId: "accountant-01",
        status: "SUCCESS",
        remarks: "Term 1 full settlement",
        createdAt: now,
      },
      {
        id: "pay-02",
        receiptNumber: "REC-2026-0142",
        invoiceId: "inv-2026-002",
        schoolId,
        studentId: "student-01",
        studentName: "Aarav Kumar",
        studentRollNo: "GV-2026-0701",
        studentClass: "Class 7-A",
        amount: 15000,
        paymentMode: "BANK_TRANSFER",
        transactionRef: "NEFT-HDFC-0019283",
        paymentDate: "2026-09-05",
        recordedBy: "Priya Patel",
        accountantId: "accountant-01",
        status: "SUCCESS",
        remarks: "Term 2 partial payment (Tuition advance)",
        createdAt: now,
      },
    ];

    const weakTopics: WeakTopicItem[] = [
      {
        id: "wt-01",
        studentId: "student-01",
        subjectId: "subj-math",
        subjectName: "Mathematics",
        topicName: "Linear Equations in One Variable",
        subTopic: "Word problems involving age and speed",
        severity: "HIGH",
        accuracyRate: 42,
        totalQuestionsAttempted: 24,
        detectedFrom: "ASSESSMENT",
        detectedDate: "2026-09-02",
        status: "IN_PROGRESS",
        recommendedAction: "Review step-by-step substitution method and attempt 5 practice word problems.",
      },
      {
        id: "wt-02",
        studentId: "student-01",
        subjectId: "subj-sci",
        subjectName: "Science",
        topicName: "Photosynthesis & Plant Respiration",
        subTopic: "Light-dependent vs Dark reactions",
        severity: "MEDIUM",
        accuracyRate: 58,
        totalQuestionsAttempted: 19,
        detectedFrom: "PRACTICE_ZONE",
        detectedDate: "2026-09-06",
        status: "IN_PROGRESS",
        recommendedAction: "Complete the interactive diagram simulation on cellular energy cycles.",
      },
      {
        id: "wt-03",
        studentId: "student-01",
        subjectId: "subj-eng",
        subjectName: "English",
        topicName: "Active & Passive Voice",
        subTopic: "Tense consistency across complex clauses",
        severity: "LOW",
        accuracyRate: 71,
        totalQuestionsAttempted: 14,
        detectedFrom: "ASSIGNMENT",
        detectedDate: "2026-09-08",
        status: "RESOLVED",
        recommendedAction: "Reviewed with Teacher Rahul Sharma in intervention clinic.",
      },
    ];

    const learningPaths: LearningPath[] = [
      {
        id: "lp-01",
        studentId: "student-01",
        subjectId: "subj-math",
        subjectName: "Mathematics",
        title: "Mastery Pathway: Linear Algebra & Problem Solving",
        description: "Personalized remedial sequence targeting word problem translation and equation solving.",
        progressPercentage: 65,
        assignedByTeacherId: "teacher-01",
        assignedByTeacherName: "Rahul Sharma",
        createdAt: now,
        updatedAt: now,
        nodes: [
          {
            id: "node-1",
            title: "Concept Clarification: Variable Isolation",
            description: "Review fundamental algebraic balance properties with visual scales.",
            type: "VIDEO",
            estimatedMinutes: 15,
            status: "COMPLETED",
            order: 1,
            completedAt: "2026-09-04",
          },
          {
            id: "node-2",
            title: "Translating Verbal Statements to Equations",
            description: "Practice identifying key phrases for addition, subtraction, products, and ratios.",
            type: "READING",
            estimatedMinutes: 20,
            status: "COMPLETED",
            order: 2,
            completedAt: "2026-09-07",
          },
          {
            id: "node-3",
            title: "Practice Drill: Age & Distance Problems",
            description: "10 interactive stepped questions with instant hint support.",
            type: "QUIZ",
            estimatedMinutes: 25,
            status: "IN_PROGRESS",
            order: 3,
          },
          {
            id: "node-4",
            title: "Teacher 1-on-1 Check-in",
            description: "Review practice drill mistakes with Mr. Rahul Sharma.",
            type: "TEACHER_INTERVENTION",
            estimatedMinutes: 15,
            status: "LOCKED",
            order: 4,
          },
          {
            id: "node-5",
            title: "Unit Mastery Challenge",
            description: "Final timed checkpoint to demonstrate 85%+ mastery.",
            type: "CHALLENGE",
            estimatedMinutes: 30,
            status: "LOCKED",
            order: 5,
          },
        ],
      },
    ];

    const studyPlans: StudyPlanItem[] = [
      {
        id: "sp-01",
        studentId: "student-01",
        dayOfWeek: "Monday",
        subjectId: "subj-math",
        subjectName: "Mathematics",
        topic: "Linear Equations Practice & Homework",
        startTime: "17:00",
        endTime: "18:00",
        durationMinutes: 60,
        priority: "HIGH",
        status: "COMPLETED",
        isAiGenerated: true,
      },
      {
        id: "sp-02",
        studentId: "student-01",
        dayOfWeek: "Tuesday",
        subjectId: "subj-sci",
        subjectName: "Science",
        topic: "Cell Structure & Microscope Diagrams",
        startTime: "17:00",
        endTime: "17:45",
        durationMinutes: 45,
        priority: "MEDIUM",
        status: "COMPLETED",
        isAiGenerated: true,
      },
      {
        id: "sp-03",
        studentId: "student-01",
        dayOfWeek: "Wednesday",
        subjectId: "subj-eng",
        subjectName: "English",
        topic: "Reading Comprehension & Vocabulary",
        startTime: "17:00",
        endTime: "17:45",
        durationMinutes: 45,
        priority: "MEDIUM",
        status: "SCHEDULED",
        isAiGenerated: false,
      },
      {
        id: "sp-04",
        studentId: "student-01",
        dayOfWeek: "Thursday",
        subjectId: "subj-math",
        subjectName: "Mathematics",
        topic: "Weak Topic Practice Zone (Word Problems)",
        startTime: "17:00",
        endTime: "18:00",
        durationMinutes: 60,
        priority: "HIGH",
        status: "SCHEDULED",
        isAiGenerated: true,
      },
      {
        id: "sp-05",
        studentId: "student-01",
        dayOfWeek: "Friday",
        subjectId: "subj-cs",
        subjectName: "Computer Science",
        topic: "Python Loops & Conditionals Project",
        startTime: "17:00",
        endTime: "17:45",
        durationMinutes: 45,
        priority: "LOW",
        status: "SCHEDULED",
        isAiGenerated: false,
      },
    ];

    const practiceQuestions: PracticeQuestion[] = [
      {
        id: "pq-01",
        subjectId: "subj-math",
        subjectName: "Mathematics",
        topicName: "Linear Equations",
        difficulty: "MEDIUM",
        questionText: "If 3x + 5 = 20, what is the value of 2x - 3?",
        options: ["5", "7", "10", "12"],
        correctOptionIndex: 1,
        explanation: "Step 1: Solve 3x + 5 = 20 -> 3x = 15 -> x = 5. Step 2: Substitute x into 2x - 3 -> 2(5) - 3 = 10 - 3 = 7.",
        hint: "First isolate x by subtracting 5 from both sides, then divide by 3.",
      },
      {
        id: "pq-02",
        subjectId: "subj-math",
        subjectName: "Mathematics",
        topicName: "Linear Equations",
        difficulty: "HARD",
        questionText: "A father is currently 3 times as old as his son. In 12 years, he will be twice as old as his son. How old is the son now?",
        options: ["10 years", "12 years", "14 years", "16 years"],
        correctOptionIndex: 1,
        explanation: "Let son's age = s. Father's age = 3s. In 12 years: 3s + 12 = 2(s + 12). 3s + 12 = 2s + 24 -> s = 12 years.",
        hint: "Set s as son's age and write the equation for their ages after 12 years.",
      },
      {
        id: "pq-03",
        subjectId: "subj-sci",
        subjectName: "Science",
        topicName: "Cell Biology",
        difficulty: "EASY",
        questionText: "Which organelle is commonly referred to as the 'powerhouse of the cell'?",
        options: ["Ribosome", "Nucleus", "Mitochondria", "Golgi Apparatus"],
        correctOptionIndex: 2,
        explanation: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions through ATP production.",
        hint: "It produces ATP for cellular energy.",
      },
      {
        id: "pq-04",
        subjectId: "subj-sci",
        subjectName: "Science",
        topicName: "Photosynthesis",
        difficulty: "MEDIUM",
        questionText: "During photosynthesis, what gas is released as a byproduct by green plants?",
        options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Methane"],
        correctOptionIndex: 2,
        explanation: "In the light reactions of photosynthesis, water molecules are split (photolysis), releasing oxygen gas (O2) into the atmosphere.",
        hint: "This gas is essential for human and animal respiration.",
      },
    ];

    const practiceAttempts: PracticeAttempt[] = [
      {
        id: "pa-01",
        studentId: "student-01",
        questionId: "pq-01",
        selectedOptionIndex: 1,
        isCorrect: true,
        timeSpentSeconds: 45,
        attemptedAt: "2026-09-09T17:15:00Z",
      },
      {
        id: "pa-02",
        studentId: "student-01",
        questionId: "pq-02",
        selectedOptionIndex: 0,
        isCorrect: false,
        timeSpentSeconds: 92,
        attemptedAt: "2026-09-09T17:18:00Z",
      },
    ];

    const mistakeBook: MistakeItem[] = [
      {
        id: "mb-01",
        studentId: "student-01",
        questionId: "pq-02",
        subjectId: "subj-math",
        subjectName: "Mathematics",
        topicName: "Linear Equations",
        questionText: "A father is currently 3 times as old as his son. In 12 years, he will be twice as old as his son. How old is the son now?",
        studentAnswer: "10 years",
        correctAnswer: "12 years",
        explanation: "Let son's age = s. Father's age = 3s. In 12 years: 3s + 12 = 2(s + 12) -> 3s + 12 = 2s + 24 -> s = 12 years.",
        mistakeType: "FORMULA_ERROR",
        reviewed: false,
        retryCount: 1,
        resolved: false,
        addedAt: "2026-09-09T17:18:00Z",
        notes: "Remember to distribute the 2 across both s and 12 in the RHS.",
      },
    ];

    const growthInsights: GrowthInsight[] = [
      {
        id: "gi-01",
        studentId: "student-01",
        metric: "Algebra Accuracy",
        changePercentage: 18,
        direction: "UP",
        analysis: "Accuracy in linear equations improved by +18% over the last 14 days following practice drills.",
        period: "Last 14 Days",
        generatedDate: "2026-09-10",
      },
      {
        id: "gi-02",
        studentId: "student-01",
        metric: "Weekly Study Consistency",
        changePercentage: 25,
        direction: "UP",
        analysis: "Completed 4 of 5 scheduled study sessions on time, maintaining a 4-day study streak.",
        period: "This Week",
        generatedDate: "2026-09-11",
      },
      {
        id: "gi-03",
        studentId: "student-01",
        metric: "Science Terminology Recall",
        changePercentage: 12,
        direction: "UP",
        analysis: "Scored 85% on cellular processes quiz, advancing from foundational to intermediate tier.",
        period: "Past Month",
        generatedDate: "2026-09-08",
      },
    ];

    const skillPassports: SkillPassportItem[] = [
      {
        id: "sk-01",
        studentId: "student-01",
        skillName: "Analytical Reasoning",
        category: "COGNITIVE",
        level: "PROFICIENT",
        badge: "Master Solver",
        verifiedByTeacherName: "Rahul Sharma",
        dateAwarded: "2026-09-01",
        evidence: "Successfully solved 4 complex multi-step algebraic problems without prompting.",
      },
      {
        id: "sk-02",
        studentId: "student-01",
        skillName: "Collaborative Leadership",
        category: "LEADERSHIP",
        level: "ADVANCED",
        badge: "Team Captain",
        verifiedByTeacherName: "Rahul Sharma",
        dateAwarded: "2026-08-25",
        evidence: "Led the Class 7-A Science Exhibition project on Renewable Energy Models.",
      },
      {
        id: "sk-03",
        studentId: "student-01",
        skillName: "Computational Thinking",
        category: "TECHNICAL",
        level: "INTERMEDIATE",
        badge: "Python Explorer",
        verifiedByTeacherName: "Rahul Sharma",
        dateAwarded: "2026-09-05",
        evidence: "Implemented automated prime number generator and recursion algorithms.",
      },
      {
        id: "sk-04",
        studentId: "student-01",
        skillName: "Public Speaking & Articulation",
        category: "COMMUNICATION",
        level: "PROFICIENT",
        badge: "Orator",
        verifiedByTeacherName: "Rahul Sharma",
        dateAwarded: "2026-08-18",
        evidence: "Delivered morning assembly speech on International Literacy Day.",
      },
    ];

    const interventions: StudentIntervention[] = [
      {
        id: "int-01",
        studentId: "student-01",
        studentName: "Aarav Kumar",
        schoolId,
        teacherId: "teacher-01",
        teacherName: "Rahul Sharma",
        type: "REMEDIAL_SESSION",
        title: "1-on-1 Remedial: Algebra Word Problems",
        notes: "Reviewed systematic steps for translating word problems into linear equations. Student demonstrated good grasp of variable isolation.",
        actionItems: [
          "Assigned 5 practice questions in Practice Zone",
          "Follow-up scheduled for next Tuesday during zero period",
        ],
        status: "IN_PROGRESS",
        scheduledDate: "2026-09-08",
        createdAt: now,
        updatedAt: now,
      },
    ];

    return {
      schools: [school],
      users,
      students: [student],
      teachers: [teacher],
      parents: [parent],
      drivers: [driver],
      accountants,
      classes,
      subjects,
      teacherAssignments,
      attendance,
      assessments,
      assignments,
      activities,
      development,
      concerns,
      portfolio,
      buses,
      routes,
      trips,
      iotDevices,
      iotEvents,
      auditLogs,
      notifications,
      feeStructures,
      feeInvoices,
      feePayments,
      weakTopics,
      learningPaths,
      studyPlans,
      practiceQuestions,
      practiceAttempts,
      mistakeBook,
      growthInsights,
      skillPassports,
      interventions,
      growthRooms: [],
      actionPlans: [],
      escalationCases: [],
      studentMisses: [],
      teacherAudits: [],
      creditPointEvents: [],
      creditPoints: [],
      awards: [],
    };
  }

  // -------------------------------------------------------------
  // Public Accessors & Modifiers
  // -------------------------------------------------------------
  public getUsers() {
    return this.data.users;
  }

  public findUserByEmail(email: string): User | undefined {
    const clean = email.toLowerCase().trim();
    return this.data.users.find((u) => u.email.toLowerCase().trim() === clean);
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public addUser(user: Omit<User, "id" | "createdAt" | "updatedAt"> & { id?: string }): User {
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      id: user.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public getSchools(): School[] {
    return this.data.schools;
  }

  public findSchoolById(id: string): School | undefined {
    return this.data.schools.find((s) => s.id === id);
  }

  public addSchool(school: Omit<School, "id" | "createdAt" | "updatedAt">): School {
    const now = new Date().toISOString();
    const newSchool: School = {
      ...school,
      id: `school-${Date.now()}`,
      studentCount: school.studentCount || 0,
      teacherCount: school.teacherCount || 0,
      createdAt: now,
      updatedAt: now,
    };
    this.data.schools.unshift(newSchool);
    this.save();
    return newSchool;
  }

  public updateSchool(id: string, updates: Partial<School>): School | null {
    const idx = this.data.schools.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.schools[idx] = {
      ...this.data.schools[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.schools[idx];
  }

  public getStudents(schoolId?: string): Student[] {
    if (schoolId) return this.data.students.filter((s) => s.schoolId === schoolId);
    return this.data.students;
  }

  public findStudentById(id: string): Student | undefined {
    return this.data.students.find((s) => s.id === id || s.userId === id);
  }

  public addStudent(student: Omit<Student, "id" | "createdAt">): Student {
    const newStudent: Student = {
      ...student,
      id: `student-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.students.push(newStudent);
    // Update school student count
    const school = this.findSchoolById(student.schoolId);
    if (school) {
      school.studentCount = (school.studentCount || 0) + 1;
    }
    this.save();
    return newStudent;
  }

  public getTeachers(schoolId?: string): Teacher[] {
    if (schoolId) return this.data.teachers.filter((t) => t.schoolId === schoolId);
    return this.data.teachers;
  }

  public findTeacherById(id: string): Teacher | undefined {
    return this.data.teachers.find((t) => t.id === id || t.userId === id);
  }

  public addTeacher(teacher: Omit<Teacher, "id" | "createdAt">): Teacher {
    const newTeacher: Teacher = {
      ...teacher,
      id: `teacher-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.teachers.push(newTeacher);
    const school = this.findSchoolById(teacher.schoolId);
    if (school) {
      school.teacherCount = (school.teacherCount || 0) + 1;
    }
    this.save();
    return newTeacher;
  }

  public getParents(schoolId?: string): Parent[] {
    if (schoolId) return this.data.parents.filter((p) => p.schoolId === schoolId);
    return this.data.parents;
  }

  public findParentById(id: string): Parent | undefined {
    return this.data.parents.find((p) => p.id === id || p.userId === id);
  }

  public addParent(parent: Omit<Parent, "id" | "createdAt">): Parent {
    const newParent: Parent = {
      ...parent,
      id: `parent-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.parents.push(newParent);
    this.save();
    return newParent;
  }

  public linkParentToStudent(parentId: string, studentId: string) {
    const p = this.data.parents.find((x) => x.id === parentId || x.userId === parentId);
    const s = this.data.students.find((x) => x.id === studentId);
    if (p && s) {
      p.childrenIds = p.childrenIds || [];
      if (!p.childrenIds.includes(studentId)) {
        p.childrenIds.push(studentId);
      }
      s.parentId = p.id;
      s.parentName = `${p.firstName} ${p.lastName}`;
      this.save();
    }
  }

  public getDrivers(schoolId?: string): Driver[] {
    if (schoolId) return this.data.drivers.filter((d) => d.schoolId === schoolId);
    return this.data.drivers;
  }

  public findDriverById(id: string): Driver | undefined {
    return this.data.drivers.find((d) => d.id === id || d.userId === id);
  }

  public getClasses(schoolId?: string): ClassItem[] {
    if (schoolId) return this.data.classes.filter((c) => c.schoolId === schoolId);
    return this.data.classes;
  }

  public addClass(classItem: Omit<ClassItem, "id">): ClassItem {
    const newClass: ClassItem = {
      ...classItem,
      id: `class-${Date.now()}`,
      sections: classItem.sections || [{ id: `sec-${Date.now()}`, name: "A", classId: "" }],
    };
    newClass.sections?.forEach((sec) => (sec.classId = newClass.id));
    this.data.classes.push(newClass);
    this.save();
    return newClass;
  }

  public getSubjects(schoolId?: string): SubjectItem[] {
    if (schoolId) return this.data.subjects.filter((s) => s.schoolId === schoolId);
    return this.data.subjects;
  }

  public addSubject(subject: Omit<SubjectItem, "id">): SubjectItem {
    const newSub: SubjectItem = {
      ...subject,
      id: `sub-${Date.now()}`,
    };
    this.data.subjects.push(newSub);
    this.save();
    return newSub;
  }

  public getTeacherAssignments(schoolId?: string): TeacherAssignmentItem[] {
    if (schoolId) return this.data.teacherAssignments.filter((a) => a.schoolId === schoolId);
    return this.data.teacherAssignments;
  }

  public addTeacherAssignment(assign: Omit<TeacherAssignmentItem, "id">): TeacherAssignmentItem {
    const item: TeacherAssignmentItem = {
      ...assign,
      id: `assign-${Date.now()}`,
    };
    this.data.teacherAssignments.push(item);
    this.save();
    return item;
  }

  // Attendance
  public getAttendance(filters: { schoolId?: string; studentId?: string; date?: string; classId?: string }): AttendanceItem[] {
    return this.data.attendance.filter((att) => {
      if (filters.schoolId && att.schoolId !== filters.schoolId) return false;
      if (filters.studentId && att.studentId !== filters.studentId) return false;
      if (filters.date && att.date !== filters.date) return false;
      return true;
    });
  }

  public recordAttendance(record: Omit<AttendanceItem, "id" | "createdAt">): AttendanceItem {
    const now = new Date().toISOString();
    // Replace if same student and date already exists
    const idx = this.data.attendance.findIndex(
      (a) => a.studentId === record.studentId && a.date === record.date
    );
    const item: AttendanceItem = {
      ...record,
      id: idx >= 0 ? this.data.attendance[idx].id : `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
    };
    if (idx >= 0) {
      this.data.attendance[idx] = item;
    } else {
      this.data.attendance.unshift(item);
    }
    this.save();
    return item;
  }

  public recordBatchAttendance(records: Omit<AttendanceItem, "id" | "createdAt">[]): AttendanceItem[] {
    const results = records.map((r) => this.recordAttendance(r));
    return results;
  }

  // Assessments & Marks
  public getAssessments(schoolId?: string, classId?: string): AssessmentItem[] {
    return this.data.assessments.filter((a) => {
      if (schoolId && a.schoolId !== schoolId) return false;
      if (classId && a.classId !== classId) return false;
      return true;
    });
  }

  public findAssessmentById(id: string): AssessmentItem | undefined {
    return this.data.assessments.find((a) => a.id === id);
  }

  public addAssessment(item: Omit<AssessmentItem, "id" | "createdAt" | "results">): AssessmentItem {
    const newItem: AssessmentItem = {
      ...item,
      id: `assess-${Date.now()}`,
      results: [],
      createdAt: new Date().toISOString(),
    };
    this.data.assessments.unshift(newItem);
    this.save();
    return newItem;
  }

  public enterMarks(
    assessmentId: string,
    results: { studentId: string; studentName: string; marks: number; remarks?: string }[]
  ) {
    const assessment = this.findAssessmentById(assessmentId);
    if (!assessment) throw new Error("Assessment not found");

    for (const r of results) {
      const pct = Math.round((r.marks / assessment.maxMarks) * 100);
      let grade = "F";
      if (pct >= 90) grade = "A+";
      else if (pct >= 80) grade = "A";
      else if (pct >= 70) grade = "B+";
      else if (pct >= 60) grade = "B";
      else if (pct >= 50) grade = "C";
      else if (pct >= 40) grade = "D";

      const resItem: AssessmentResultItem = {
        id: `res-${Date.now()}-${r.studentId}`,
        assessmentId,
        studentId: r.studentId,
        studentName: r.studentName,
        marks: r.marks,
        maxMarks: assessment.maxMarks,
        percentage: pct,
        grade,
        remarks: r.remarks,
      };

      const existingIdx = assessment.results.findIndex((x) => x.studentId === r.studentId);
      if (existingIdx >= 0) {
        assessment.results[existingIdx] = resItem;
      } else {
        assessment.results.push(resItem);
      }
    }
    this.save();
    return assessment;
  }

  // Assignments
  public getAssignments(schoolId?: string, classId?: string): AssignmentItem[] {
    return this.data.assignments.filter((a) => {
      if (schoolId && a.schoolId !== schoolId) return false;
      if (classId && a.classId !== classId) return false;
      return true;
    });
  }

  public addAssignment(item: Omit<AssignmentItem, "id" | "createdAt" | "submissions">): AssignmentItem {
    const newItem: AssignmentItem = {
      ...item,
      id: `assign-${Date.now()}`,
      submissions: [],
      createdAt: new Date().toISOString(),
    };
    this.data.assignments.unshift(newItem);
    this.save();
    return newItem;
  }

  public submitAssignment(assignmentId: string, studentId: string, studentName: string): AssignmentSubmissionItem {
    const assignment = this.data.assignments.find((a) => a.id === assignmentId);
    if (!assignment) throw new Error("Assignment not found");
    const subItem: AssignmentSubmissionItem = {
      id: `subm-${Date.now()}`,
      assignmentId,
      studentId,
      studentName,
      submittedAt: new Date().toISOString(),
      status: "SUBMITTED",
    };
    const idx = assignment.submissions.findIndex((s) => s.studentId === studentId);
    if (idx >= 0) {
      assignment.submissions[idx] = subItem;
    } else {
      assignment.submissions.push(subItem);
    }
    this.save();
    return subItem;
  }

  // Activities
  public getActivities(schoolId?: string): ActivityItem[] {
    if (schoolId) return this.data.activities.filter((a) => a.schoolId === schoolId);
    return this.data.activities;
  }

  public addActivity(item: Omit<ActivityItem, "id" | "createdAt">): ActivityItem {
    const newItem: ActivityItem = {
      ...item,
      id: `act-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.activities.unshift(newItem);
    this.save();
    return newItem;
  }

  // Development
  public getDevelopment(studentId?: string, schoolId?: string): DevelopmentItem[] {
    return this.data.development.filter((d) => {
      if (studentId && d.studentId !== studentId) return false;
      if (schoolId && d.schoolId !== schoolId) return false;
      return true;
    });
  }

  public addDevelopment(item: Omit<DevelopmentItem, "id" | "createdAt">): DevelopmentItem {
    const newItem: DevelopmentItem = {
      ...item,
      id: `dev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.development.unshift(newItem);
    this.save();
    return newItem;
  }

  // Concerns
  public getConcerns(schoolId?: string, studentId?: string): ConcernItem[] {
    return this.data.concerns.filter((c) => {
      if (schoolId && c.schoolId !== schoolId) return false;
      if (studentId && c.studentId !== studentId) return false;
      return true;
    });
  }

  public addConcern(item: Omit<ConcernItem, "id" | "createdAt" | "updatedAt">): ConcernItem {
    const now = new Date().toISOString();
    const newItem: ConcernItem = {
      ...item,
      id: `con-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.concerns.unshift(newItem);
    this.save();
    return newItem;
  }

  public updateConcernStatus(id: string, status: ConcernItem["status"], notes?: string): ConcernItem | null {
    const item = this.data.concerns.find((c) => c.id === id);
    if (!item) return null;
    item.status = status;
    if (notes) item.notes = notes;
    item.updatedAt = new Date().toISOString();
    this.save();
    return item;
  }

  // Portfolio
  public getPortfolio(studentId: string): PortfolioItem[] {
    return this.data.portfolio.filter((p) => p.studentId === studentId);
  }

  public addPortfolioItem(item: Omit<PortfolioItem, "id">): PortfolioItem {
    const newItem: PortfolioItem = {
      ...item,
      id: `port-${Date.now()}`,
    };
    this.data.portfolio.unshift(newItem);
    this.save();
    return newItem;
  }

  // Transport
  public getBuses(schoolId?: string): BusItem[] {
    if (schoolId) return this.data.buses.filter((b) => b.schoolId === schoolId);
    return this.data.buses;
  }

  public getRoutes(schoolId?: string): BusRouteItem[] {
    if (schoolId) return this.data.routes.filter((r) => r.schoolId === schoolId);
    return this.data.routes;
  }

  public getActiveTrip(busIdOrDriverId: string): GPSTripItem | undefined {
    return this.data.trips.find(
      (t) => (t.busId === busIdOrDriverId || t.driverId === busIdOrDriverId) && t.status === "ACTIVE"
    );
  }

  public startTrip(driverId: string, busId: string, routeId: string, schoolId: string): GPSTripItem {
    const bus = this.data.buses.find((b) => b.id === busId);
    const route = this.data.routes.find((r) => r.id === routeId);
    const driver = this.data.drivers.find((d) => d.id === driverId || d.userId === driverId);

    const trip: GPSTripItem = {
      id: `trip-${Date.now()}`,
      busId,
      busNumber: bus?.number || "BUS-07",
      routeId,
      routeName: route?.name || "Route 3",
      driverId,
      driverName: driver ? `${driver.firstName} ${driver.lastName}` : "Rajesh Kumar",
      status: "ACTIVE",
      startedAt: new Date().toISOString(),
      schoolId,
      currentLocation: {
        latitude: 28.5355,
        longitude: 77.241,
        accuracy: 8.5,
        timestamp: new Date().toISOString(),
      },
    };

    if (bus) bus.status = "ROUTE_ACTIVE";
    this.data.trips.unshift(trip);
    this.save();
    return trip;
  }

  public updateGPSLocation(tripId: string, lat: number, lng: number, accuracy?: number): GPSTripItem | null {
    const trip = this.data.trips.find((t) => t.id === tripId);
    if (!trip || trip.status !== "ACTIVE") return null;

    trip.currentLocation = {
      latitude: lat,
      longitude: lng,
      accuracy: accuracy || 5.0,
      timestamp: new Date().toISOString(),
    };
    this.save();
    return trip;
  }

  public endTrip(tripId: string): GPSTripItem | null {
    const trip = this.data.trips.find((t) => t.id === tripId);
    if (!trip) return null;

    trip.status = "COMPLETED";
    trip.endedAt = new Date().toISOString();
    const bus = this.data.buses.find((b) => b.id === trip.busId);
    if (bus) bus.status = "IDLE";
    this.save();
    return trip;
  }

  // IoT
  public getIoTDevices(schoolId?: string): IoTDeviceItem[] {
    if (schoolId) return this.data.iotDevices.filter((d) => d.schoolId === schoolId);
    return this.data.iotDevices;
  }

  public getIoTEvents(schoolId?: string): IoTEventItem[] {
    if (schoolId) return this.data.iotEvents.filter((e) => e.schoolId === schoolId);
    return this.data.iotEvents;
  }

  public simulateRFIDScan(deviceId: string, studentId: string): { attendance: AttendanceItem; event: IoTEventItem } {
    const student = this.findStudentById(studentId);
    if (!student) throw new Error("Student not found");
    const device = this.data.iotDevices.find((d) => d.id === deviceId || d.deviceId === deviceId);

    const now = new Date().toISOString();
    const todayStr = now.split("T")[0];

    // Record attendance
    const att = this.recordAttendance({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      rollNumber: student.rollNumber,
      date: todayStr,
      status: "PRESENT",
      markedBy: "IOT_DEVICE",
      source: "IOT",
      schoolId: student.schoolId,
    });

    // Create IoT event
    const event: IoTEventItem = {
      id: `event-${Date.now()}`,
      deviceId: device?.deviceId || deviceId,
      eventType: "RFID_SCAN",
      payload: {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        cardId: `RFID-CARD-${student.rollNumber || "07"}`,
        timestamp: now,
      },
      timestamp: now,
      schoolId: student.schoolId,
    };
    this.data.iotEvents.unshift(event);

    if (device) {
      device.lastHeartbeat = now;
      device.eventsCount = (device.eventsCount || 0) + 1;
    }

    // Add notification
    this.addNotification({
      userId: student.userId,
      schoolId: student.schoolId,
      title: "RFID Attendance Marked",
      message: `${student.firstName} marked Present via RFID at ${new Date().toLocaleTimeString()}.`,
      category: "ATTENDANCE",
      read: false,
    });

    this.save();
    return { attendance: att, event };
  }

  // Audit Logs
  public getAuditLogs(schoolId?: string): AuditLogItem[] {
    if (schoolId) return this.data.auditLogs.filter((a) => !a.schoolId || a.schoolId === schoolId);
    return this.data.auditLogs;
  }

  public logAudit(log: Omit<AuditLogItem, "id" | "timestamp">) {
    this.data.auditLogs.unshift({
      ...log,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
    this.save();
  }

  // Notifications
  public getNotifications(userId: string): NotificationItem[] {
    return this.data.notifications.filter((n) => n.userId === userId);
  }

  public addNotification(notif: Omit<NotificationItem, "id" | "createdAt">): NotificationItem {
    const item: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(item);
    this.save();
    return item;
  }

  public markNotificationRead(id: string) {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
    }
  }

  // -------------------------------------------------------------
  // Accountants
  // -------------------------------------------------------------
  public getAccountants(schoolId?: string): Accountant[] {
    if (schoolId) {
      return this.data.accountants.filter((a) => a.schoolId === schoolId);
    }
    return this.data.accountants;
  }

  public findAccountantById(id: string): Accountant | undefined {
    return this.data.accountants.find((a) => a.id === id);
  }

  public addAccountant(accountant: Omit<Accountant, "id"> & { id?: string }): Accountant {
    const id = accountant.id || `accountant-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newAcc: Accountant = {
      ...accountant,
      id,
    };
    this.data.accountants.push(newAcc);
    this.save();
    return newAcc;
  }

  // -------------------------------------------------------------
  // Fee Management
  // -------------------------------------------------------------
  public getFeeStructures(schoolId?: string, classId?: string): FeeStructure[] {
    return this.data.feeStructures.filter((fs) => {
      if (schoolId && fs.schoolId !== schoolId) return false;
      if (classId && fs.classId !== classId) return false;
      return true;
    });
  }

  public addFeeStructure(structure: Omit<FeeStructure, "id" | "createdAt" | "updatedAt"> & { id?: string }): FeeStructure {
    const now = new Date().toISOString();
    const id = structure.id || `fs-${Date.now()}`;
    const newFs: FeeStructure = {
      ...structure,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.data.feeStructures.push(newFs);
    this.save();
    return newFs;
  }

  public getFeeInvoices(filter?: { schoolId?: string; studentId?: string; status?: string }): FeeInvoice[] {
    return this.data.feeInvoices.filter((inv) => {
      if (filter?.schoolId && inv.schoolId !== filter.schoolId) return false;
      if (filter?.studentId && inv.studentId !== filter.studentId) return false;
      if (filter?.status && inv.status !== filter.status) return false;
      return true;
    });
  }

  public addFeeInvoice(invoice: Omit<FeeInvoice, "id" | "createdAt" | "updatedAt" | "invoiceNumber"> & { id?: string; invoiceNumber?: string }): FeeInvoice {
    const now = new Date().toISOString();
    const id = invoice.id || `inv-${Date.now()}`;
    const invoiceNumber = invoice.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInv: FeeInvoice = {
      ...invoice,
      id,
      invoiceNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.data.feeInvoices.push(newInv);
    this.save();
    return newInv;
  }

  public recordFeePayment(payment: Omit<FeePayment, "id" | "receiptNumber" | "createdAt" | "status"> & { id?: string; receiptNumber?: string; status?: FeePayment["status"] }): { payment: FeePayment; invoice?: FeeInvoice } {
    const now = new Date().toISOString();
    const id = payment.id || `pay-${Date.now()}`;
    const receiptNumber = payment.receiptNumber || `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const status = payment.status || "SUCCESS";

    const newPayment: FeePayment = {
      ...payment,
      id,
      receiptNumber,
      status,
      createdAt: now,
    };
    this.data.feePayments.push(newPayment);

    // Update invoice if exists
    let invoice = this.data.feeInvoices.find((i) => i.id === payment.invoiceId);
    if (invoice && status === "SUCCESS") {
      const newPaid = invoice.paidAmount + payment.amount;
      const newPending = Math.max(0, invoice.totalAmount - newPaid);
      let newStatus: FeeInvoice["status"] = "PARTIAL";
      if (newPending === 0) {
        newStatus = "PAID";
      } else if (newPaid === 0) {
        newStatus = "PENDING";
      }
      invoice.paidAmount = newPaid;
      invoice.pendingAmount = newPending;
      invoice.status = newStatus;
      invoice.paidDate = now.split("T")[0];
      invoice.updatedAt = now;
    }

    this.save();
    return { payment: newPayment, invoice };
  }

  public getFeePayments(filter?: { schoolId?: string; studentId?: string; invoiceId?: string }): FeePayment[] {
    return this.data.feePayments.filter((p) => {
      if (filter?.schoolId && p.schoolId !== filter.schoolId) return false;
      if (filter?.studentId && p.studentId !== filter.studentId) return false;
      if (filter?.invoiceId && p.invoiceId !== filter.invoiceId) return false;
      return true;
    });
  }

  // -------------------------------------------------------------
  // 7 Student Growth Features
  // -------------------------------------------------------------
  // 1. Weak Topic Detector
  public getWeakTopics(studentId?: string, subjectId?: string): WeakTopicItem[] {
    return this.data.weakTopics.filter((wt) => {
      if (studentId && wt.studentId !== studentId) return false;
      if (subjectId && wt.subjectId !== subjectId) return false;
      return true;
    });
  }

  public addWeakTopic(item: Omit<WeakTopicItem, "id"> & { id?: string }): WeakTopicItem {
    const id = item.id || `wt-${Date.now()}`;
    const newItem: WeakTopicItem = { ...item, id };
    this.data.weakTopics.push(newItem);
    this.save();
    return newItem;
  }

  public updateWeakTopic(id: string, updates: Partial<WeakTopicItem>): WeakTopicItem | undefined {
    const idx = this.data.weakTopics.findIndex((w) => w.id === id);
    if (idx === -1) return undefined;
    this.data.weakTopics[idx] = { ...this.data.weakTopics[idx], ...updates };
    this.save();
    return this.data.weakTopics[idx];
  }

  // 2. Personal Learning Path
  public getLearningPaths(studentId?: string): LearningPath[] {
    return this.data.learningPaths.filter((lp) => {
      if (studentId && lp.studentId !== studentId) return false;
      return true;
    });
  }

  public addLearningPath(path: Omit<LearningPath, "id" | "createdAt" | "updatedAt"> & { id?: string }): LearningPath {
    const now = new Date().toISOString();
    const id = path.id || `lp-${Date.now()}`;
    const newPath: LearningPath = { ...path, id, createdAt: now, updatedAt: now };
    this.data.learningPaths.push(newPath);
    this.save();
    return newPath;
  }

  public updateLearningPath(id: string, updates: Partial<LearningPath>): LearningPath | undefined {
    const idx = this.data.learningPaths.findIndex((lp) => lp.id === id);
    if (idx === -1) return undefined;
    this.data.learningPaths[idx] = { ...this.data.learningPaths[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.learningPaths[idx];
  }

  // 3. Smart Study Planner
  public getStudyPlans(studentId?: string): StudyPlanItem[] {
    return this.data.studyPlans.filter((sp) => {
      if (studentId && sp.studentId !== studentId) return false;
      return true;
    });
  }

  public addStudyPlan(plan: Omit<StudyPlanItem, "id"> & { id?: string }): StudyPlanItem {
    const id = plan.id || `sp-${Date.now()}`;
    const newPlan: StudyPlanItem = { ...plan, id };
    this.data.studyPlans.push(newPlan);
    this.save();
    return newPlan;
  }

  public updateStudyPlan(id: string, updates: Partial<StudyPlanItem>): StudyPlanItem | undefined {
    const idx = this.data.studyPlans.findIndex((sp) => sp.id === id);
    if (idx === -1) return undefined;
    this.data.studyPlans[idx] = { ...this.data.studyPlans[idx], ...updates };
    this.save();
    return this.data.studyPlans[idx];
  }

  // 4. Practice Zone
  public getPracticeQuestions(subjectId?: string, topicName?: string): PracticeQuestion[] {
    return this.data.practiceQuestions.filter((pq) => {
      if (subjectId && pq.subjectId !== subjectId && pq.subject !== subjectId) return false;
      if (topicName && (pq.topicName || pq.topic || "").toLowerCase() !== topicName.toLowerCase()) return false;
      return true;
    });
  }

  public recordPracticeAttempt(attempt: Omit<PracticeAttempt, "id" | "attemptedAt"> & { id?: string; attemptedAt?: string }): PracticeAttempt {
    const now = new Date().toISOString();
    const id = attempt.id || `pa-${Date.now()}`;
    const newAttempt: PracticeAttempt = {
      ...attempt,
      id,
      attemptedAt: attempt.attemptedAt || now,
    };
    this.data.practiceAttempts.push(newAttempt);

    // If incorrect, automatically add to Mistake Book if not already there
    if (!attempt.isCorrect) {
      const q = this.data.practiceQuestions.find((pq) => pq.id === attempt.questionId);
      if (q) {
        const existingMistake = this.data.mistakeBook.find((m) => m.studentId === attempt.studentId && m.questionId === attempt.questionId);
        if (existingMistake) {
          existingMistake.retryCount = (existingMistake.retryCount || 0) + 1;
          existingMistake.resolved = false;
        } else {
          const correctIdx = q.correctOptionIndex ?? q.correctAnswerIndex ?? 0;
          this.data.mistakeBook.push({
            id: `mb-${Date.now()}`,
            studentId: attempt.studentId,
            questionId: q.id,
            subjectId: q.subjectId || q.subject,
            subjectName: q.subjectName || q.subject,
            topicName: q.topicName || q.topic,
            questionText: q.questionText || q.question || "",
            studentAnswer: q.options[attempt.selectedOptionIndex] || "N/A",
            correctAnswer: q.options[correctIdx] || "",
            explanation: q.explanation,
            mistakeType: "CONCEPT_CONFUSION",
            reviewed: false,
            retryCount: 1,
            resolved: false,
            addedAt: now,
            notes: "Recorded automatically during practice session.",
          });
        }
      }
    }

    this.save();
    return newAttempt;
  }

  // 5. Mistake Book
  public getMistakeBook(studentId?: string): MistakeItem[] {
    return this.data.mistakeBook.filter((m) => {
      if (studentId && m.studentId !== studentId) return false;
      return true;
    });
  }

  public updateMistakeItem(id: string, updates: Partial<MistakeItem>): MistakeItem | undefined {
    const idx = this.data.mistakeBook.findIndex((m) => m.id === id);
    if (idx === -1) return undefined;
    this.data.mistakeBook[idx] = { ...this.data.mistakeBook[idx], ...updates };
    this.save();
    return this.data.mistakeBook[idx];
  }

  // 6. Growth Insights
  public getGrowthInsights(studentId?: string): GrowthInsight[] {
    return this.data.growthInsights.filter((gi) => {
      if (studentId && gi.studentId !== studentId) return false;
      return true;
    });
  }

  // 7. Skill Passport
  public getSkillPassports(studentId?: string): SkillPassportItem[] {
    return this.data.skillPassports.filter((sp) => {
      if (studentId && sp.studentId !== studentId) return false;
      return true;
    });
  }

  public addSkillPassportItem(item: Omit<SkillPassportItem, "id"> & { id?: string }): SkillPassportItem {
    const id = item.id || `sk-${Date.now()}`;
    const newItem: SkillPassportItem = { ...item, id };
    this.data.skillPassports.push(newItem);
    this.save();
    return newItem;
  }

  // Teacher Student Interventions
  public getInterventions(studentId?: string, schoolId?: string): StudentIntervention[] {
    return this.data.interventions.filter((it) => {
      if (studentId && it.studentId !== studentId) return false;
      if (schoolId && it.schoolId !== schoolId) return false;
      return true;
    });
  }

  public addIntervention(intervention: Omit<StudentIntervention, "id" | "createdAt" | "updatedAt"> & { id?: string }): StudentIntervention {
    const now = new Date().toISOString();
    const id = intervention.id || `int-${Date.now()}`;
    const newInt: StudentIntervention = { ...intervention, id, createdAt: now, updatedAt: now };
    this.data.interventions.push(newInt);
    this.save();
    return newInt;
  }

  public updateIntervention(id: string, updates: Partial<StudentIntervention>): StudentIntervention | undefined {
    const idx = this.data.interventions.findIndex((it) => it.id === id);
    if (idx === -1) return undefined;
    this.data.interventions[idx] = { ...this.data.interventions[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.interventions[idx];
  }

  // ============================================================
  // GROWTH ROOM & CONNECTED JOURNEY METHODS
  // ============================================================
  public getGrowthRoom(studentId: string): StudentGrowthRoom | undefined {
    if (!this.data.growthRooms) this.data.growthRooms = [];
    let room = this.data.growthRooms.find((r) => r.studentId === studentId);
    if (!room) {
      const student = this.findStudentById(studentId);
      if (!student) return undefined;
      const parent = student.parentId ? this.findParentById(student.parentId) : undefined;

      room = {
        id: `gr-${studentId}`,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        teacherId: "teacher-01",
        teacherName: "Rahul Sharma",
        parentId: parent ? parent.id : "parent-01",
        parentName: parent ? `${parent.firstName} ${parent.lastName}` : "Raj Kumar",
        schoolId: student.schoolId,
        className: student.className || "Class 7",
        sectionName: student.sectionName || "A",
        currentFocusTopic: "Geometry → Angles & Relationships",
        currentAccuracy: 51,
        growthDelta: 17,
        status: "ACTIVE",
        lastActivityAt: new Date().toISOString(),
        messages: [
          {
            id: "msg-01",
            roomId: `gr-${studentId}`,
            senderId: "user-teacher-01",
            senderName: "Rahul Sharma (Teacher)",
            senderRole: "TEACHER",
            text: "Aarav needs targeted practice in Geometry → Angles. I have assigned 10 adaptive practice questions and a revision task.",
            category: "INTERVENTION",
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
          {
            id: "msg-02",
            roomId: `gr-${studentId}`,
            senderId: "user-parent-01",
            senderName: "Raj Kumar (Parent)",
            senderRole: "PARENT",
            text: "Thank you Mr. Sharma. I have reviewed the plan and will ensure Aarav completes his practice schedule at home today.",
            category: "UPDATE",
            timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
          },
          {
            id: "msg-03",
            roomId: `gr-${studentId}`,
            senderId: "user-student-01",
            senderName: "Aarav Kumar (Student)",
            senderRole: "STUDENT",
            text: "Completed practice set! Reviewed my angle sum mistakes in the Mistake Book and scored 80% on reattempt.",
            category: "MILESTONE",
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
        ],
        milestones: [
          {
            id: "ms-01",
            studentId: student.id,
            title: "Geometry Remediation Completed",
            description: "Accuracy improved from 51% to 68% following targeted practice & teacher explanation",
            date: new Date().toISOString().split("T")[0],
            type: "ACADEMIC_IMPROVEMENT",
            evidence: "Assessment score: 68%, Practice accuracy: 80%",
            pointsEarned: 50,
          },
        ],
      };
      this.data.growthRooms.push(room);
      this.save();
    }
    return room;
  }

  public addGrowthMessage(studentId: string, messageInput: Omit<GrowthRoomMessage, "id" | "timestamp">): GrowthRoomMessage {
    const room = this.getGrowthRoom(studentId);
    const msg: GrowthRoomMessage = {
      ...messageInput,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    if (room) {
      room.messages.push(msg);
      room.lastActivityAt = msg.timestamp;
      this.save();
    }
    return msg;
  }

  // ============================================================
  // AI ACTION PLAN GENERATOR & WEAKNESS ENGINE
  // ============================================================
  public generateActionPlan(studentId: string, topicName: string): AIActionPlanRecommendation {
    if (!this.data.actionPlans) this.data.actionPlans = [];
    const student = this.findStudentById(studentId);
    const plan: AIActionPlanRecommendation = {
      id: `ap-${Date.now()}`,
      studentId: studentId,
      studentName: student ? `${student.firstName} ${student.lastName}` : "Aarav Kumar",
      subject: "Mathematics",
      weakTopic: topicName,
      currentAccuracy: 51,
      recommendedItems: [
        { type: "EXPLANATION", title: "Concept Revision: Angle Relationships in Parallel Lines", description: "5-minute visual concept breakdown", questionCount: 0 },
        { type: "PRACTICE", title: "10 Targeted Practice Questions on Angles", description: "Adaptive difficulty: Easy → Medium", questionCount: 10 },
        { type: "REVISION", title: "5 Revision Questions on Alternate & Interior Angles", description: "Strengthen fundamental properties", questionCount: 5 },
        { type: "ASSIGNMENT", title: "Short Worksheet: Angle Equation Solvers", description: "Due in 48 hours", questionCount: 3 },
        { type: "MINI_TEST", title: "Mini Assessment: Geometry Mastery Check", description: "15-minute verification quiz", questionCount: 5 },
      ],
      status: "PENDING_TEACHER_APPROVAL",
    };
    this.data.actionPlans.push(plan);
    this.save();
    return plan;
  }

  public assignActionPlan(planId: string, teacherId: string): AIActionPlanRecommendation | undefined {
    if (!this.data.actionPlans) return undefined;
    const plan = this.data.actionPlans.find((p) => p.id === planId);
    if (plan) {
      plan.status = "ASSIGNED";
      plan.teacherId = teacherId;
      plan.assignedAt = new Date().toISOString();
      this.save();
    }
    return plan;
  }

  // ============================================================
  // MISTAKE BOOK RETRY & GROWTH REASSESSMENT
  // ============================================================
  public retryMistake(studentId: string, mistakeId: string, isCorrect: boolean): MistakeItem | undefined {
    const mistake = this.data.mistakeBook.find((m) => m.id === mistakeId && m.studentId === studentId);
    if (mistake) {
      mistake.retryCount = (mistake.retryCount || 0) + 1;
      if (isCorrect) {
        mistake.resolved = true;
        mistake.status = "RESOLVED";
        // Award credit points for correcting mistake
        this.awardCreditPoints(studentId, "STUDENT", 15, `Corrected mistake on topic: ${mistake.topicName || mistake.subjectName}`, mistakeId);
      }
      this.save();
    }
    return mistake;
  }

  public recordReassessmentGrowth(studentId: string, subject: string, topic: string, newScore: number): GrowthInsight {
    let insight = this.data.growthInsights.find((g) => g.studentId === studentId && (g.whatImproved?.includes(topic) || g.subject === subject));
    const previousScore = insight?.previousPeriodScore || 51;
    const delta = newScore - previousScore;
    const now = new Date().toISOString();

    if (insight) {
      insight.currentPeriodScore = newScore;
      insight.improvementPercentage = delta;
      insight.changePercentage = delta;
      insight.direction = delta >= 0 ? "UP" : "DOWN";
      insight.analysis = `Performance improved by ${delta} percentage points following targeted practice and teacher intervention.`;
      insight.updatedAt = now;
    } else {
      insight = {
        id: `gi-${Date.now()}`,
        studentId,
        subject,
        metric: "Topic Accuracy",
        previousPeriodScore: previousScore,
        currentPeriodScore: newScore,
        improvementPercentage: delta,
        changePercentage: delta,
        direction: "UP",
        whatImproved: `${topic} accuracy increased from ${previousScore}% to ${newScore}%`,
        needsSupport: "Algebraic Exponents",
        recommendedAction: "Maintain weekly 10-minute practice session",
        analysis: `${topic} performance improved by ${delta} percentage points after completing assigned practice.`,
        period: "Term 1",
        generatedDate: now,
      };
      this.data.growthInsights.push(insight);
    }

    // Also update weakTopic status if score >= 65%
    const wt = this.data.weakTopics.find((w) => w.studentId === studentId && w.topicName?.toLowerCase().includes(topic.toLowerCase()));
    if (wt && newScore >= 65) {
      wt.status = "RESOLVED";
      wt.accuracyRate = newScore;
    }

    // Award growth credit points
    this.awardCreditPoints(studentId, "STUDENT", 50, `Achieved ${delta}% growth in ${topic}`, insight.id);
    this.awardCreditPoints("user-teacher-01", "TEACHER", 30, `Mentored student growth in ${topic}`, insight.id);
    this.awardCreditPoints("user-parent-01", "PARENT", 20, `Supported student practice in ${topic}`, insight.id);

    this.save();
    return insight;
  }

  // ============================================================
  // RESPONSIBILITY & ESCALATION ENGINE (3-CHANCE MISS & TEACHER AUDIT)
  // ============================================================
  public recordTaskMiss(studentId: string, taskId: string, taskTitle: string, isValidException = false, exceptionReason?: string): EscalationCase {
    if (!this.data.studentMisses) this.data.studentMisses = [];
    if (!this.data.escalationCases) this.data.escalationCases = [];

    const existingMisses = this.data.studentMisses.filter((m) => m.studentId === studentId && !m.isValidException);
    const count = isValidException ? existingMisses.length : existingMisses.length + 1;

    const missRecord: StudentMissRecord = {
      id: `sm-${Date.now()}`,
      studentId,
      taskId,
      taskTitle,
      dueDate: new Date().toISOString().split("T")[0],
      missedAt: new Date().toISOString(),
      isValidException,
      exceptionReason,
      qualifyingMissCount: count,
    };
    this.data.studentMisses.push(missRecord);

    let esc = this.data.escalationCases.find((e) => e.studentId === studentId);
    const now = new Date().toISOString();

    let newStatus: EscalationStatus = "NORMAL";
    if (!isValidException) {
      if (count === 1) newStatus = "WATCH";
      else if (count === 2) newStatus = "WARNING";
      else if (count >= 3) newStatus = "RED";
    }

    if (!esc) {
      const student = this.findStudentById(studentId);
      esc = {
        id: `esc-${studentId}`,
        studentId,
        studentName: student ? `${student.firstName} ${student.lastName}` : "Aarav Kumar",
        schoolId: student?.schoolId || "school-gv-01",
        classId: student?.classId || "class-7a",
        className: student?.className || "Class 7-A",
        subject: "Mathematics",
        teacherId: "teacher-01",
        teacherName: "Rahul Sharma",
        status: newStatus,
        qualifyingMisses: count,
        teacherSupportStatus: "SUFFICIENT",
        reason: isValidException ? `Task missed with valid exception: ${exceptionReason}` : `${count} qualifying missed learning task(s) recorded`,
        openedAt: now,
        lastUpdated: now,
        history: [
          { status: newStatus, updatedAt: now, updatedBy: "System Escalation Engine", note: `Recorded task miss: ${taskTitle}. Qualifying misses = ${count}` }
        ],
      };
      this.data.escalationCases.push(esc);
    } else {
      esc.qualifyingMisses = count;
      esc.status = newStatus;
      esc.lastUpdated = now;
      esc.history.push({
        status: newStatus,
        updatedAt: now,
        updatedBy: "System Escalation Engine",
        note: `Recorded task miss: ${taskTitle}. Qualifying misses = ${count}`
      });
    }

    this.save();
    return esc;
  }

  public auditTeacherSupport(teacherId: string, studentId: string): TeacherSupportAudit {
    if (!this.data.teacherAudits) this.data.teacherAudits = [];
    let audit = this.data.teacherAudits.find((a) => a.teacherId === teacherId && a.studentId === studentId);
    const student = this.findStudentById(studentId);
    const weakTopics = this.getWeakTopics(studentId);
    const interventions = this.getInterventions(studentId);
    const hasUnresolvedWeakness = weakTopics.some((w) => w.status !== "RESOLVED");

    const status: TeacherSupportAudit["status"] = hasUnresolvedWeakness && interventions.length === 0 ? "TEACHER_ATTENTION" : "NORMAL";

    if (!audit) {
      audit = {
        id: `ta-${Date.now()}`,
        teacherId,
        teacherName: "Rahul Sharma",
        studentId,
        studentName: student ? `${student.firstName} ${student.lastName}` : "Aarav Kumar",
        weakTopic: "Geometry → Angles",
        topicDetectedDate: "2026-09-01",
        hasTargetedAssignment: true,
        hasPracticeAssigned: true,
        hasRevisionAssigned: true,
        hasInterventionLogged: interventions.length > 0,
        hasFeedbackGiven: true,
        supportGapDetected: status !== "NORMAL",
        status: status,
      };
      this.data.teacherAudits.push(audit);
    } else {
      audit.supportGapDetected = status !== "NORMAL";
      audit.status = status;
    }
    this.save();
    return audit;
  }

  // ============================================================
  // CREDIT POINTS & EVIDENCE-BASED AWARDS METHODS
  // ============================================================
  public awardCreditPoints(userId: string, role: UserRole, points: number, reason: string, relatedEntityId?: string): CreditPointEvent {
    if (!this.data.creditPointEvents) this.data.creditPointEvents = [];
    if (!this.data.creditPoints) this.data.creditPoints = [];

    const user = this.findUserById(userId) || { firstName: "Aarav", lastName: "Kumar", schoolId: "school-gv-01" };
    const event: CreditPointEvent = {
      id: `cpe-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      eventId: `evt-${Date.now()}`,
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: role,
      schoolId: user.schoolId || "school-gv-01",
      action: "CREDIT_AWARD",
      points,
      reason,
      relatedEntityId,
      timestamp: new Date().toISOString(),
    };
    this.data.creditPointEvents.push(event);

    let summary = this.data.creditPoints.find((c) => c.userId === userId);
    if (!summary) {
      summary = {
        userId,
        totalPoints: points,
        level: Math.floor((points) / 100) + 1,
        rankTitle: points >= 200 ? "Gold Growth Champion" : points >= 100 ? "Silver Explorer" : "Bronze Learner",
        history: [event],
      };
      this.data.creditPoints.push(summary);
    } else {
      summary.totalPoints += points;
      summary.level = Math.floor(summary.totalPoints / 100) + 1;
      summary.rankTitle = summary.totalPoints >= 200 ? "Gold Growth Champion" : summary.totalPoints >= 100 ? "Silver Explorer" : "Bronze Learner";
      summary.history.push(event);
    }

    this.save();
    return event;
  }

  public getRewardsSummary(userId: string): CreditPointSummary {
    if (!this.data.creditPoints) this.data.creditPoints = [];
    let summary = this.data.creditPoints.find((c) => c.userId === userId);
    if (!summary) {
      summary = {
        userId,
        totalPoints: 185,
        level: 2,
        rankTitle: "Silver Growth Champion",
        history: [
          {
            id: "cpe-seed-01",
            eventId: "evt-01",
            userId,
            userName: "Aarav Kumar",
            userRole: "STUDENT",
            schoolId: "school-gv-01",
            action: "CREDIT_AWARD",
            points: 50,
            reason: "Measurable improvement in Geometry → Angles (51% → 68%)",
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: "cpe-seed-02",
            eventId: "evt-02",
            userId,
            userName: "Aarav Kumar",
            userRole: "STUDENT",
            schoolId: "school-gv-01",
            action: "CREDIT_AWARD",
            points: 35,
            reason: "Completed 10 adaptive practice questions in Practice Zone",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      };
      this.data.creditPoints.push(summary);
      this.save();
    }
    return summary;
  }

  public getAwards(recipientId?: string): SmartEduAward[] {
    if (!this.data.awards) this.data.awards = [];
    if (this.data.awards.length === 0) {
      // Seed default award
      const defaultAward: SmartEduAward = {
        id: "award-01",
        recipientId: "student-01",
        recipientName: "Aarav Kumar",
        recipientRole: "STUDENT",
        awardName: "Most Improved Learner",
        category: "STUDENT",
        reason: "Demonstrated measurable improvement after completing targeted learning activities in Geometry → Angles.",
        evidenceSummary: "Geometry score improved from 51% to 68% following 10 practice questions and targeted revision.",
        pointsAwarded: 100,
        issuedAt: new Date().toISOString().split("T")[0],
        issuedById: "user-teacher-01",
        issuedByName: "Rahul Sharma (Teacher)",
        schoolId: "school-gv-01",
        schoolName: "Green Valley School",
        certificateId: "CERT-GVS-2026-007",
        status: "APPROVED",
      };
      this.data.awards.push(defaultAward);
      this.save();
    }
    return this.data.awards.filter((a) => !recipientId || a.recipientId === recipientId);
  }

  public approveAward(input: {
    recipientId: string;
    recipientName: string;
    recipientRole: UserRole;
    awardName: string;
    category: "STUDENT" | "TEACHER" | "PARENT";
    reason: string;
    evidenceSummary: string;
    issuedById: string;
    issuedByName: string;
  }): SmartEduAward {
    if (!this.data.awards) this.data.awards = [];
    const award: SmartEduAward = {
      id: `award-${Date.now()}`,
      ...input,
      pointsAwarded: 100,
      issuedAt: new Date().toISOString().split("T")[0],
      schoolId: "school-gv-01",
      schoolName: "Green Valley School",
      certificateId: `CERT-GVS-${Date.now().toString().slice(-6)}`,
      status: "APPROVED",
    };
    this.data.awards.push(award);
    this.awardCreditPoints(input.recipientId, input.recipientRole, 100, `Awarded: ${input.awardName}`, award.id);
    this.save();
    return award;
  }

  // -------------------------------------------------------------
  // Student 360 Aggregator
  // -------------------------------------------------------------
  public getStudent360(studentId: string) {
    const student = this.findStudentById(studentId);
    if (!student) return null;

    const user = this.findUserById(student.userId);
    const parent = student.parentId ? this.findParentById(student.parentId) : undefined;
    const parentUser = parent ? this.findUserById(parent.userId) : undefined;

    const attendanceRecords = this.getAttendance({ studentId: student.id });
    const assessments = this.data.assessments.filter((a) =>
      a.results.some((r) => r.studentId === student.id)
    );
    const assessmentResults = assessments.map((a) => {
      const res = a.results.find((r) => r.studentId === student.id)!;
      return {
        ...res,
        assessmentName: a.name,
        assessmentType: a.type,
        subjectName: a.subjectName,
        teacherName: a.teacherName,
        date: a.date,
      };
    });

    const activities = this.data.activities.filter((act) =>
      act.participantIds.includes(student.id)
    );
    const developmentRecords = this.getDevelopment(student.id);
    const studentConcerns = this.getConcerns(student.schoolId, student.id);
    const portfolioItems = this.getPortfolio(student.id);
    const bus = this.data.buses.find((b) => b.schoolId === student.schoolId);
    const activeTrip = bus ? this.getActiveTrip(bus.id) : undefined;

    // Fee info
    const feeInvoices = this.getFeeInvoices({ studentId: student.id });
    const feePayments = this.getFeePayments({ studentId: student.id });
    const totalFeeDue = feeInvoices.reduce((sum, inv) => sum + inv.pendingAmount, 0);

    // 7 Growth Items
    const weakTopics = this.getWeakTopics(student.id);
    const learningPaths = this.getLearningPaths(student.id);
    const studyPlans = this.getStudyPlans(student.id);
    const mistakeBook = this.getMistakeBook(student.id);
    const growthInsights = this.getGrowthInsights(student.id);
    const skillPassports = this.getSkillPassports(student.id);
    const interventions = this.getInterventions(student.id);

    // Metrics calculation
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter((a) => a.status === "PRESENT").length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 94;

    const scores = assessmentResults.map((r) => r.percentage);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 83;

    return {
      student,
      user,
      parent: parent
        ? {
            ...parent,
            user: parentUser,
          }
        : null,
      attendanceRecords,
      assessmentResults,
      activities,
      developmentRecords,
      studentConcerns,
      portfolioItems,
      transport: bus
        ? {
            bus,
            activeTrip,
            pickupStop: "Sector 15 Gate",
          }
        : null,
      // Enhanced Growth & Financial Modules
      feeInvoices,
      feePayments,
      weakTopics,
      learningPaths,
      studyPlans,
      mistakeBook,
      growthInsights,
      skillPassports,
      interventions,
      metrics: {
        attendancePercentage,
        averageScore,
        totalAssessments: assessmentResults.length,
        totalActivities: activities.length,
        openConcerns: studentConcerns.filter((c) => c.status === "OPEN").length,
        portfolioCount: portfolioItems.length,
        totalFeeDue,
        activeWeakTopics: weakTopics.filter((w) => w.status !== "RESOLVED").length,
        unresolvedMistakes: mistakeBook.filter((m) => !m.resolved).length,
        skillsEarned: skillPassports.length,
      },
    };
  }
}

// Global Singleton
const globalForDataStore = globalThis as unknown as {
  dataStore: DataStore | undefined;
};

export const dataStore = globalForDataStore.dataStore ?? new DataStore();

if (process.env.NODE_ENV !== "production") {
  globalForDataStore.dataStore = dataStore;
}

export default dataStore;
