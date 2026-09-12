// NurtureKernel - Zod Validation Schemas
import { z } from "zod";

// ============================================================
// AUTH
// ============================================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ============================================================
// SCHOOL
// ============================================================

export const createSchoolSchema = z.object({
  name: z.string().min(2, "School name is required"),
  code: z.string().min(2, "School code is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional(),
  board: z.string().optional(),
  academicSession: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  principalFirstName: z.string().min(1, "Principal first name is required"),
  principalLastName: z.string().min(1, "Principal last name is required"),
  principalEmail: z.string().email("Invalid principal email"),
  principalPhone: z.string().optional(),
  principalEmployeeId: z.string().min(1, "Employee ID is required"),
  classes: z
    .array(
      z.object({
        name: z.string(),
        sections: z.array(z.string()),
      })
    )
    .optional(),
  subjects: z.array(z.string()).optional(),
});

// ============================================================
// PEOPLE
// ============================================================

export const createTeacherSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  employeeId: z.string().min(1, "Employee ID is required"),
  qualification: z.string().optional(),
  department: z.string().optional(),
  joiningDate: z.string().optional(),
  classAssignments: z
    .array(
      z.object({
        classId: z.string(),
        sectionId: z.string().optional(),
        subjectId: z.string(),
      })
    )
    .optional(),
});

export const createStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  studentId: z.string().min(1, "Student ID is required"),
  admissionNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  classId: z.string().min(1, "Class is required"),
  sectionId: z.string().optional(),
  rollNumber: z.string().optional(),
  parentId: z.string().optional(),
});

export const createParentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  relationship: z.string().optional(),
  address: z.string().optional(),
  childrenIds: z.array(z.string()).optional(),
});

// ============================================================
// ACADEMICS
// ============================================================

export const createAssessmentSchema = z.object({
  name: z.string().min(1, "Assessment name is required"),
  type: z.enum([
    "UNIT_TEST",
    "CLASS_TEST",
    "ASSIGNMENT",
    "PROJECT",
    "PRACTICAL",
    "INTERNAL_ASSESSMENT",
  ]),
  subjectId: z.string().min(1, "Subject is required"),
  classId: z.string().min(1, "Class is required"),
  date: z.string().min(1, "Date is required"),
  maxMarks: z.number().min(1, "Maximum marks must be at least 1"),
});

export const enterMarksSchema = z.object({
  assessmentId: z.string().min(1),
  results: z.array(
    z.object({
      studentId: z.string().min(1),
      marks: z.number().min(0, "Marks cannot be negative"),
      remarks: z.string().optional(),
    })
  ),
});

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  subjectId: z.string().min(1, "Subject is required"),
  classId: z.string().min(1, "Class is required"),
  dueDate: z.string().min(1, "Due date is required"),
  maxMarks: z.number().optional(),
});

// ============================================================
// ATTENDANCE
// ============================================================

export const markAttendanceSchema = z.object({
  date: z.string().min(1, "Date is required"),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY"]),
    })
  ),
});

// ============================================================
// ACTIVITIES & DEVELOPMENT
// ============================================================

export const createActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required"),
  category: z.enum([
    "ROBOTICS", "SCIENCE", "SPORTS", "ENVIRONMENT", "SOCIAL_SERVICE",
    "CREATIVITY", "COMMUNICATION", "INNOVATION", "ENTREPRENEURSHIP",
    "CULTURE", "CIVIC_RESPONSIBILITY", "LIFE_SKILLS",
  ]),
  date: z.string().min(1, "Date is required"),
  objective: z.string().optional(),
  classId: z.string().optional(),
  skills: z.array(z.string()).optional(),
  evaluation: z.string().optional(),
  reflection: z.string().optional(),
  participantIds: z.array(z.string()).optional(),
});

export const createDevelopmentSchema = z.object({
  studentId: z.string().min(1),
  area: z.enum([
    "PROBLEM_SOLVING", "COMMUNICATION", "TEAMWORK", "CREATIVITY",
    "LEADERSHIP", "TECHNICAL_SKILLS", "INNOVATION", "PARTICIPATION",
  ]),
  observation: z.string().optional(),
  feedback: z.string().optional(),
  level: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

export const createConcernSchema = z.object({
  studentId: z.string().min(1),
  category: z.enum([
    "ACADEMIC", "ATTENDANCE", "BEHAVIOUR", "ASSIGNMENT", "PARTICIPATION", "OTHER",
  ]),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

// ============================================================
// TRANSPORT
// ============================================================

export const gpsLocationSchema = z.object({
  tripId: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
  timestamp: z.string().optional(),
});

// ============================================================
// IoT
// ============================================================

export const simulateRfidSchema = z.object({
  deviceId: z.string().min(1),
  studentId: z.string().min(1),
});
