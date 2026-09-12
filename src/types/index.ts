export type UserRole =
  | "SUPER_ADMIN"
  | "PRINCIPAL"
  | "TEACHER"
  | "ACCOUNTANT"
  | "STAFF"
  | "STUDENT"
  | "PARENT"
  | "DRIVER";

export type Permission =
  // School
  | "school:create"
  | "school:read"
  | "school:update"
  | "school:delete"
  | "school:manage"
  // Users
  | "principal:create"
  | "principal:manage"
  | "teacher:create"
  | "teacher:read"
  | "teacher:manage"
  | "student:create"
  | "student:read"
  | "student:manage"
  | "parent:create"
  | "parent:read"
  | "parent:manage"
  | "staff:create"
  | "staff:manage"
  | "driver:create"
  | "driver:manage"
  // Academics
  | "class:create"
  | "class:read"
  | "class:manage"
  | "assessment:create"
  | "assessment:read"
  | "assessment:manage"
  | "marks:create"
  | "marks:read"
  | "marks:manage"
  | "assignment:create"
  | "assignment:read"
  | "assignment:manage"
  // Attendance
  | "attendance:mark"
  | "attendance:read"
  | "attendance:manage"
  // Activities & Development
  | "activity:create"
  | "activity:read"
  | "activity:manage"
  | "development:create"
  | "development:read"
  | "development:manage"
  | "concern:create"
  | "concern:read"
  | "concern:manage"
  | "portfolio:read"
  | "portfolio:manage"
  // Transport
  | "transport:read"
  | "transport:manage"
  | "gps:update"
  | "gps:read"
  // IoT
  | "iot:read"
  | "iot:manage"
  // AI
  | "assistant:use"
  // Platform
  | "analytics:read"
  | "audit:read"
  | "notification:read"
  | "notification:manage"
  | "settings:manage"
  | "platform:manage"
  // Accountant & Fee Management
  | "accountant:create"
  | "accountant:read"
  | "accountant:manage"
  | "fee:create"
  | "fee:read"
  | "fee:update"
  | "fee:delete"
  | "fee:manage"
  | "payment:create"
  | "payment:read"
  | "invoice:create"
  | "invoice:read"
  | "receipt:read"
  // Student Growth & Learning
  | "growth:read"
  | "growth:manage"
  | "learning-path:create"
  | "learning-path:read"
  | "learning-path:manage"
  | "practice:use"
  | "practice:manage"
  | "mistake:read"
  | "mistake:manage"
  | "skill:read"
  | "skill:manage"
  | "intervention:create"
  | "intervention:read"
  | "fee:record_payment"
  | "student:growth_view"
  | "teacher:growth_edit";

// ============================================================
// AUTH TYPES
// ============================================================

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
  schoolName?: string;
  avatarUrl?: string;
  teacherId?: string;
  studentId?: string;
  parentId?: string;
  accountantId?: string;
  permissions?: Permission[];
  driverId?: string;
}

// ============================================================
// API TYPES
// ============================================================

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ============================================================
// SCHOOL TYPES
// ============================================================

export interface CreateSchoolInput {
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
  primaryColor?: string;
  secondaryColor?: string;
  // Principal info
  principalFirstName: string;
  principalLastName: string;
  principalEmail: string;
  principalPhone?: string;
  principalEmployeeId: string;
  // Class configuration
  classes?: { name: string; sections: string[] }[];
  subjects?: string[];
}

// ============================================================
// PEOPLE TYPES
// ============================================================

export interface CreateTeacherInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employeeId: string;
  qualification?: string;
  department?: string;
  joiningDate?: string;
  subjects?: string[];
  classAssignments?: {
    classId: string;
    sectionId?: string;
    subjectId: string;
  }[];
}

export interface CreateStudentInput {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  admissionNumber?: string;
  dateOfBirth?: string;
  classId: string;
  sectionId?: string;
  rollNumber?: string;
  parentId?: string;
}

export interface CreateParentInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  relationship?: string;
  address?: string;
  childrenIds?: string[];
}

// ============================================================
// ACADEMIC TYPES
// ============================================================

export interface CreateAssessmentInput {
  name: string;
  type: string;
  subjectId: string;
  classId: string;
  date: string;
  maxMarks: number;
}

export interface EnterMarksInput {
  assessmentId: string;
  results: {
    studentId: string;
    marks: number;
    remarks?: string;
  }[];
}

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  subjectId: string;
  classId: string;
  dueDate: string;
  maxMarks?: number;
}

// ============================================================
// ATTENDANCE TYPES
// ============================================================

export interface MarkAttendanceInput {
  date: string;
  records: {
    studentId: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY";
  }[];
}

// ============================================================
// ACTIVITY TYPES
// ============================================================

export interface CreateActivityInput {
  name: string;
  category: string;
  date: string;
  objective?: string;
  classId?: string;
  skills?: string[];
  evaluation?: string;
  reflection?: string;
  participantIds?: string[];
}

// ============================================================
// DEVELOPMENT TYPES
// ============================================================

export interface CreateDevelopmentInput {
  studentId: string;
  area: string;
  observation?: string;
  feedback?: string;
  level?: string;
  date: string;
}

// ============================================================
// CONCERN TYPES
// ============================================================

export interface CreateConcernInput {
  studentId: string;
  category: string;
  description: string;
  priority?: string;
  date: string;
  notes?: string;
}

// ============================================================
// TRANSPORT TYPES
// ============================================================

export interface GPSLocationUpdate {
  tripId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

// ============================================================
// DASHBOARD TYPES
// ============================================================

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: string;
}

export interface QuickAction {
  label: string;
  href: string;
  icon: string;
  description?: string;
}

// ============================================================
// FEE MANAGEMENT TYPES
// ============================================================

export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "UPI" | "ONLINE" | "MANUAL_ENTRY" | "CHEQUE";
export type PaymentStatus = "PAID" | "PARTIALLY_PAID" | "PARTIAL" | "PENDING" | "OVERDUE" | "SUCCESS" | "FAILED";
export type InstallmentFrequency = "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "ANNUAL" | "TERMLY";

export interface FeeCategory {
  id: string;
  name: string;
  schoolId?: string;
  amount?: number;
  frequency?: string;
  isMandatory?: boolean;
  description?: string;
}

export interface FeeStructure {
  id: string;
  schoolId: string;
  name?: string;
  classId?: string;
  className?: string;
  sectionId?: string;
  academicYear?: string;
  academicSession?: string;
  installmentFrequency?: InstallmentFrequency;
  categories?: {
    id?: string;
    categoryId?: string;
    name: string;
    amount: number;
    frequency?: string;
    isMandatory?: boolean;
  }[];
  items?: {
    category: string;
    amount: number;
  }[];
  totalAnnualAmount?: number;
  totalAmount?: number;
  dueDate?: string;
  lateFeePerDay?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  studentRollNo?: string;
  studentClass?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  classId?: string;
  className?: string;
  sectionName?: string;
  academicSession?: string;
  academicYear?: string;
  term?: string;
  categories?: {
    categoryId?: string;
    name: string;
    amount: number;
  }[];
  items?: {
    category: string;
    amount: number;
  }[];
  totalAmount: number;
  discount?: number;
  discountAmount?: number;
  lateFee?: number;
  netAmount?: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  issueDate?: string;
  paidDate?: string;
  remarks?: string;
  status: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeePayment {
  id: string;
  paymentNumber?: string;
  receiptNumber: string;
  invoiceId: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  studentRollNo?: string;
  studentClass?: string;
  classId?: string;
  className?: string;
  amount: number;
  paymentDate: string;
  paymentMode?: PaymentMethod | string;
  paymentMethod?: PaymentMethod;
  transactionRef?: string;
  recordedBy?: string;
  recordedByName?: string;
  accountantId?: string;
  notes?: string;
  remarks?: string;
  status: PaymentStatus | string;
  remainingBalance?: number;
  createdAt?: string;
}

export interface FeeReceipt {
  receiptNumber: string;
  schoolId: string;
  schoolName: string;
  schoolLogo?: string;
  paymentId?: string;
  invoiceId?: string;
  studentId: string;
  studentName: string;
  className?: string;
  sectionName?: string;
  amount: number;
  paymentDate: string;
  paymentMethod?: PaymentMethod;
  recordedByName?: string;
  remainingBalance?: number;
  items?: { category: string; amount: number }[];
}

// ============================================================
// SEVEN STUDENT GROWTH TYPES
// ============================================================

// 1. Weak Topic Detector
export type TopicMasteryStatus = "STRONG" | "DEVELOPING" | "NEEDS_SUPPORT" | "IN_PROGRESS" | "RESOLVED";

export interface WeakTopicItem {
  id: string;
  studentId: string;
  subject?: string;
  subjectId?: string;
  subjectName?: string;
  chapter?: string;
  topic?: string;
  topicName?: string;
  subTopic?: string;
  scorePercentage?: number;
  accuracyRate?: number;
  totalQuestionsAttempted?: number;
  severity?: "HIGH" | "MEDIUM" | "LOW";
  status?: TopicMasteryStatus | string;
  detectedDate?: string;
  detectedFrom?: string;
  assessmentReference?: string;
  recommendedAction?: string;
  notes?: string;
}

// 2. Personal Learning Path
export interface LearningPathNode {
  id: string;
  title: string;
  description?: string;
  type: "VIDEO" | "READING" | "QUIZ" | "TEACHER_INTERVENTION" | "CHALLENGE" | string;
  estimatedMinutes?: number;
  status: "COMPLETED" | "IN_PROGRESS" | "LOCKED" | "PENDING";
  order: number;
  completedAt?: string;
}

export interface LearningPathTask {
  id: string;
  title: string;
  description: string;
  weekNumber?: number;
  dueDate?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  resourceLink?: string;
  targetTopic?: string;
}

export interface LearningPath {
  id: string;
  studentId: string;
  studentName?: string;
  subject?: string;
  subjectId?: string;
  subjectName?: string;
  title?: string;
  description?: string;
  goal?: string;
  progressPercentage?: number;
  status?: "DRAFT" | "TEACHER_APPROVED" | "ACTIVE" | "COMPLETED" | string;
  teacherId?: string;
  teacherName?: string;
  teacherNotes?: string;
  assignedByTeacherId?: string;
  assignedByTeacherName?: string;
  tasks?: LearningPathTask[];
  nodes?: LearningPathNode[];
  createdAt?: string;
  updatedAt?: string;
}

// 3. Smart Study Planner
export interface StudyPlanItem {
  id: string;
  studentId: string;
  date?: string;
  dayOfWeek?: string;
  subject?: string;
  subjectId?: string;
  subjectName?: string;
  topic: string;
  startTime?: string;
  endTime?: string;
  durationMinutes: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  completed?: boolean;
  status?: "SCHEDULED" | "COMPLETED" | string;
  isAiGenerated?: boolean;
  notes?: string;
}

// 4. Practice Zone
export interface PracticeQuestion {
  id: string;
  subject?: string;
  subjectId?: string;
  subjectName?: string;
  topic?: string;
  topicName?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  question?: string;
  questionText?: string;
  options: string[];
  correctAnswerIndex?: number;
  correctOptionIndex?: number;
  explanation: string;
  hint?: string;
}

export interface PracticeAttempt {
  id: string;
  studentId: string;
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  attemptedAt: string;
  timeSpentSeconds: number;
}

// 5. Mistake Book
export interface MistakeItem {
  id: string;
  studentId: string;
  questionId?: string;
  subject?: string;
  subjectId?: string;
  subjectName?: string;
  topic?: string;
  topicName?: string;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  mistakeCategory?: string;
  mistakeType?: string;
  status?: "UNRESOLVED" | "REVIEWED" | "RESOLVED" | string;
  reviewed?: boolean;
  retryCount?: number;
  attemptCount?: number;
  resolved?: boolean;
  addedAt?: string;
  date?: string;
  notes?: string;
}

// 6. Growth Insights
export interface GrowthInsight {
  id: string;
  studentId: string;
  subject?: string;
  metric?: string;
  previousPeriodScore?: number;
  currentPeriodScore?: number;
  improvementPercentage?: number;
  changePercentage?: number;
  direction?: "UP" | "DOWN";
  whatImproved?: string;
  needsSupport?: string;
  recommendedAction?: string;
  analysis?: string;
  period?: string;
  generatedDate?: string;
  updatedAt?: string;
}

// 7. Skill Passport
export type SkillProficiencyLevel =
  | "EMERGING"
  | "DEVELOPING"
  | "IMPROVING"
  | "DEMONSTRATED"
  | "ADVANCED"
  | "PROFICIENT"
  | "INTERMEDIATE";

export interface SkillPassportItem {
  id: string;
  studentId: string;
  skillName: string;
  category: "CORE" | "CO_CURRICULAR" | "LEADERSHIP" | "TECHNICAL" | "COGNITIVE" | "COMMUNICATION" | string;
  level: SkillProficiencyLevel;
  badge?: string;
  evidence: string;
  activityCount?: number;
  teacherFeedback?: string;
  verifiedByTeacherId?: string;
  verifiedByTeacherName?: string;
  dateAwarded?: string;
  lastUpdated?: string;
}

// Teacher Intervention
export interface StudentIntervention {
  id: string;
  studentId: string;
  studentName?: string;
  schoolId?: string;
  teacherId?: string;
  teacherName?: string;
  type?: string;
  title?: string;
  notes?: string;
  actionItems?: string[];
  status?: string;
  scheduledDate?: string;
  problemIdentified?: string;
  actionTaken?: string;
  resourcesGiven?: string;
  practiceAssigned?: string;
  followUpDate?: string;
  result?: string;
  teacherNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// STUDENT GROWTH ROOM & CONNECTED JOURNEY TYPES
// ============================================================

export interface GrowthRoomMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  category?: "UPDATE" | "FEEDBACK" | "INTERVENTION" | "CELEBRATION" | "MILESTONE";
  timestamp: string;
  attachments?: { title: string; url: string; type: string }[];
}

export interface GrowthMilestone {
  id: string;
  studentId: string;
  title: string;
  description: string;
  date: string;
  type: "ACADEMIC_IMPROVEMENT" | "SKILL_BADGE" | "AWARD" | "COMPLETION" | "ATTENDANCE";
  evidence?: string;
  pointsEarned?: number;
}

export interface StudentGrowthRoom {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  parentId: string;
  parentName: string;
  schoolId: string;
  className: string;
  sectionName: string;
  currentFocusTopic?: string;
  currentAccuracy?: number;
  growthDelta?: number; // e.g. +17%
  status: "ACTIVE" | "NEEDS_INTERVENTION" | "STABLE" | "EXCELLING";
  lastActivityAt: string;
  messages: GrowthRoomMessage[];
  milestones: GrowthMilestone[];
}

// ============================================================
// AI WEAKNESS DETECTION & ACTION PLAN GENERATOR TYPES
// ============================================================

export interface AIWeaknessAnalysis {
  studentId: string;
  subject: string;
  chapter: string;
  topic: string;
  subTopic?: string;
  evidence: {
    recentAssessmentsAvg: number;
    practiceAccuracy: number;
    repeatedErrorCount: number;
    assignmentCompletionRate: number;
    recencyWeight: number;
  };
  calculatedConfidence: number; // 0 - 100%
  severity: "HIGH" | "MEDIUM" | "LOW";
  priorityScore: number;
  rootCauseSummary: string;
  hasEnoughData: boolean;
}

export interface AIActionPlanRecommendation {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  weakTopic: string;
  currentAccuracy: number;
  recommendedItems: {
    type: "PRACTICE" | "REVISION" | "ASSIGNMENT" | "EXPLANATION" | "MINI_TEST";
    title: string;
    description: string;
    questionCount?: number;
  }[];
  status: "PENDING_TEACHER_APPROVAL" | "ASSIGNED" | "SCHEDULED" | "DISMISSED";
  teacherId?: string;
  assignedAt?: string;
}

// ============================================================
// RESPONSIBILITY & ESCALATION ENGINE TYPES
// ============================================================

export type EscalationStatus =
  | "NORMAL"
  | "WATCH"
  | "WARNING"
  | "INTERVENTION_REQUIRED"
  | "RED"
  | "ACTION_TAKEN"
  | "FOLLOW_UP"
  | "IMPROVED"
  | "RESOLVED";

export interface StudentMissRecord {
  id: string;
  studentId: string;
  taskId: string;
  taskTitle: string;
  dueDate: string;
  missedAt: string;
  isValidException: boolean;
  exceptionReason?: string;
  qualifyingMissCount: number; // 1, 2, or 3
}

export interface TeacherSupportAudit {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  weakTopic: string;
  topicDetectedDate: string;
  hasTargetedAssignment: boolean;
  hasPracticeAssigned: boolean;
  hasRevisionAssigned: boolean;
  hasInterventionLogged: boolean;
  hasFeedbackGiven: boolean;
  supportGapDetected: boolean;
  status: "NORMAL" | "TEACHER_WATCH" | "TEACHER_ATTENTION" | "PRINCIPAL_REVIEW";
  lastAlertAt?: string;
}

export interface EscalationCase {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  classId: string;
  className: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  status: EscalationStatus;
  qualifyingMisses: number;
  teacherSupportStatus: "SUFFICIENT" | "SUPPORT_GAP_DETECTED" | "NEEDS_REVIEW";
  reason: string;
  openedAt: string;
  lastUpdated: string;
  history: {
    status: EscalationStatus;
    updatedAt: string;
    updatedBy: string;
    note: string;
  }[];
}

export interface StudentComplianceScore {
  studentId: string;
  assignmentCompletion: number; // weight 35%
  practiceCompletion: number;   // weight 25%
  deadlineAdherence: number;    // weight 20%
  correctionReattempt: number;  // weight 10%
  studyPlanAdherence: number;   // weight 10%
  overallScore: number;
}

export interface TeacherSupportScore {
  teacherId: string;
  assignmentCoverage: number;       // weight 25%
  practiceCoverage: number;         // weight 25%
  weakTopicIntervention: number;   // weight 25%
  reviewFeedbackRate: number;      // weight 15%
  followUpRate: number;            // weight 10%
  overallScore: number;
}

// ============================================================
// CREDIT POINTS & EVIDENCE-BASED AWARDS TYPES
// ============================================================

export interface CreditPointEvent {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  schoolId: string;
  action: string;
  points: number;
  reason: string;
  relatedEntityId?: string;
  timestamp: string;
}

export interface CreditPointSummary {
  userId: string;
  totalPoints: number;
  level: number;
  rankTitle: string;
  history: CreditPointEvent[];
}

export interface SmartEduAward {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientRole: UserRole; // STUDENT | TEACHER | PARENT
  awardName: string;
  category: "STUDENT" | "TEACHER" | "PARENT";
  reason: string;
  evidenceSummary: string; // e.g. "Geometry 51% -> 68% after targeted practice"
  pointsAwarded: number;
  issuedAt: string;
  issuedById: string;
  issuedByName: string;
  schoolId: string;
  schoolName: string;
  certificateId: string;
  status: "RECOMMENDED_BY_AI" | "APPROVED" | "ISSUED";
}


