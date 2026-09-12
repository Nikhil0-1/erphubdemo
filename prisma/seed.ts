// Smart Edu - Database Seed
// Creates demo data per spec §100

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log("🌱 Seeding Smart Edu database...\n");

  // Clean existing data
  await prisma.gPSLocation.deleteMany();
  await prisma.gPSTrip.deleteMany();
  await prisma.ioTEvent.deleteMany();
  await prisma.ioTDevice.deleteMany();
  await prisma.aIMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.studentConcern.deleteMany();
  await prisma.teacherFeedback.deleteMany();
  await prisma.developmentRecord.deleteMany();
  await prisma.activityParticipant.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.assessmentResult.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.studentTransport.deleteMany();
  await prisma.driverRoute.deleteMany();
  await prisma.busStop.deleteMany();
  await prisma.busRoute.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.teacherAssignment.deleteMany();
  await prisma.parentStudent.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.academicSession.deleteMany();
  await prisma.section.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.schoolUser.deleteMany();
  await prisma.school.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await hashPassword("password123");

  // ============================================================
  // 1. SUPER ADMIN
  // ============================================================
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@smartedu.com",
      passwordHash: defaultPassword,
      firstName: "Platform",
      lastName: "Admin",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });
  console.log("✅ Super Admin created: admin@smartedu.com");

  // ============================================================
  // 2. SCHOOL - Green Valley School
  // ============================================================
  const school = await prisma.school.create({
    data: {
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
    },
  });
  console.log("✅ School created: Green Valley School");

  // ============================================================
  // 3. ACADEMIC SESSION
  // ============================================================
  await prisma.academicSession.create({
    data: {
      name: "2026-27",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2027-03-31"),
      isCurrent: true,
      schoolId: school.id,
    },
  });

  // ============================================================
  // 4. CLASSES & SECTIONS
  // ============================================================
  const classData = [
    { name: "Class 1", grade: 1 },
    { name: "Class 2", grade: 2 },
    { name: "Class 3", grade: 3 },
    { name: "Class 4", grade: 4 },
    { name: "Class 5", grade: 5 },
    { name: "Class 6", grade: 6 },
    { name: "Class 7", grade: 7 },
    { name: "Class 8", grade: 8 },
    { name: "Class 9", grade: 9 },
    { name: "Class 10", grade: 10 },
  ];

  const classes: Record<string, string> = {};
  const sections: Record<string, string> = {};

  for (const cls of classData) {
    const created = await prisma.class.create({
      data: { name: cls.name, grade: cls.grade, schoolId: school.id },
    });
    classes[cls.name] = created.id;

    for (const secName of ["A", "B"]) {
      const sec = await prisma.section.create({
        data: { name: secName, classId: created.id },
      });
      sections[`${cls.name}-${secName}`] = sec.id;
    }
  }
  console.log("✅ Classes & sections created (Class 1-10, A/B)");

  // ============================================================
  // 5. SUBJECTS
  // ============================================================
  const subjectNames = [
    "Mathematics", "English", "Science", "Social Studies", "Hindi",
    "Computer Science", "Physical Education", "Art",
  ];

  const subjects: Record<string, string> = {};
  for (const name of subjectNames) {
    const sub = await prisma.subject.create({
      data: { name, code: name.slice(0, 3).toUpperCase(), schoolId: school.id },
    });
    subjects[name] = sub.id;
  }
  console.log("✅ Subjects created");

  // ============================================================
  // 6. PRINCIPAL - Dr. Anjali Sharma
  // ============================================================
  const principalUser = await prisma.user.create({
    data: {
      email: "anjali.sharma@greenvalley.edu",
      passwordHash: defaultPassword,
      firstName: "Anjali",
      lastName: "Sharma",
      role: "PRINCIPAL",
      status: "ACTIVE",
    },
  });

  await prisma.schoolUser.create({
    data: { schoolId: school.id, userId: principalUser.id, role: "PRINCIPAL" },
  });
  console.log("✅ Principal created: Dr. Anjali Sharma");

  // ============================================================
  // 7. TEACHER - Rahul Sharma (Mathematics)
  // ============================================================
  const teacherUser = await prisma.user.create({
    data: {
      email: "rahul.sharma@greenvalley.edu",
      passwordHash: defaultPassword,
      firstName: "Rahul",
      lastName: "Sharma",
      role: "TEACHER",
      status: "ACTIVE",
    },
  });

  await prisma.schoolUser.create({
    data: { schoolId: school.id, userId: teacherUser.id, role: "TEACHER" },
  });

  const teacher = await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
      employeeId: "EMP-T001",
      qualification: "M.Sc. Mathematics, B.Ed.",
      department: "Mathematics",
      joiningDate: new Date("2022-06-01"),
      schoolId: school.id,
    },
  });

  // Assign teacher to Class 7-A & 7-B Mathematics
  await prisma.teacherAssignment.create({
    data: {
      teacherId: teacher.id,
      classId: classes["Class 7"],
      sectionId: sections["Class 7-A"],
      subjectId: subjects["Mathematics"],
    },
  });
  await prisma.teacherAssignment.create({
    data: {
      teacherId: teacher.id,
      classId: classes["Class 7"],
      sectionId: sections["Class 7-B"],
      subjectId: subjects["Mathematics"],
    },
  });
  console.log("✅ Teacher created: Rahul Sharma (Mathematics, Class 7-A & 7-B)");

  // Additional teacher - Priya Patel (Science)
  const teacher2User = await prisma.user.create({
    data: {
      email: "priya.patel@greenvalley.edu",
      passwordHash: defaultPassword,
      firstName: "Priya",
      lastName: "Patel",
      role: "TEACHER",
      status: "ACTIVE",
    },
  });
  await prisma.schoolUser.create({
    data: { schoolId: school.id, userId: teacher2User.id, role: "TEACHER" },
  });
  const teacher2 = await prisma.teacher.create({
    data: {
      userId: teacher2User.id,
      employeeId: "EMP-T002",
      qualification: "M.Sc. Physics, B.Ed.",
      department: "Science",
      joiningDate: new Date("2023-04-01"),
      schoolId: school.id,
    },
  });
  await prisma.teacherAssignment.create({
    data: {
      teacherId: teacher2.id,
      classId: classes["Class 7"],
      sectionId: sections["Class 7-A"],
      subjectId: subjects["Science"],
    },
  });

  // ============================================================
  // 8. STUDENTS - Class 7-A
  // ============================================================
  const studentData = [
    { first: "Aarav", last: "Kumar", id: "STU-001", roll: "01" },
    { first: "Ishaan", last: "Verma", id: "STU-002", roll: "02" },
    { first: "Ananya", last: "Singh", id: "STU-003", roll: "03" },
    { first: "Diya", last: "Gupta", id: "STU-004", roll: "04" },
    { first: "Vivaan", last: "Reddy", id: "STU-005", roll: "05" },
    { first: "Saanvi", last: "Joshi", id: "STU-006", roll: "06" },
    { first: "Arjun", last: "Nair", id: "STU-007", roll: "07" },
    { first: "Myra", last: "Kapoor", id: "STU-008", roll: "08" },
    { first: "Reyansh", last: "Mehta", id: "STU-009", roll: "09" },
    { first: "Anika", last: "Das", id: "STU-010", roll: "10" },
    { first: "Kabir", last: "Thakur", id: "STU-011", roll: "11" },
    { first: "Riya", last: "Malhotra", id: "STU-012", roll: "12" },
    { first: "Vihaan", last: "Choudhary", id: "STU-013", roll: "13" },
    { first: "Sara", last: "Pillai", id: "STU-014", roll: "14" },
    { first: "Aditya", last: "Banerjee", id: "STU-015", roll: "15" },
    { first: "Avni", last: "Srivastava", id: "STU-016", roll: "16" },
    { first: "Dhruv", last: "Saxena", id: "STU-017", roll: "17" },
    { first: "Kiara", last: "Desai", id: "STU-018", roll: "18" },
    { first: "Rohan", last: "Iyer", id: "STU-019", roll: "19" },
    { first: "Nisha", last: "Chauhan", id: "STU-020", roll: "20" },
    { first: "Arnav", last: "Mishra", id: "STU-021", roll: "21" },
    { first: "Tara", last: "Bhatt", id: "STU-022", roll: "22" },
    { first: "Yash", last: "Pandey", id: "STU-023", roll: "23" },
    { first: "Meera", last: "Rao", id: "STU-024", roll: "24" },
    { first: "Kian", last: "Agarwal", id: "STU-025", roll: "25" },
    { first: "Pooja", last: "Sharma", id: "STU-026", roll: "26" },
    { first: "Siddharth", last: "Kulkarni", id: "STU-027", roll: "27" },
    { first: "Aisha", last: "Khan", id: "STU-028", roll: "28" },
    { first: "Dev", last: "Rajan", id: "STU-029", roll: "29" },
    { first: "Zara", last: "Bhatia", id: "STU-030", roll: "30" },
    { first: "Krish", last: "Menon", id: "STU-031", roll: "31" },
    { first: "Lavanya", last: "Hegde", id: "STU-032", roll: "32" },
  ];

  const students: { id: string; userId: string; name: string }[] = [];

  for (const s of studentData) {
    const studentUser = await prisma.user.create({
      data: {
        email: `${s.first.toLowerCase()}.${s.last.toLowerCase()}@student.greenvalley.edu`,
        passwordHash: defaultPassword,
        firstName: s.first,
        lastName: s.last,
        role: "STUDENT",
        status: "ACTIVE",
      },
    });

    await prisma.schoolUser.create({
      data: { schoolId: school.id, userId: studentUser.id, role: "STUDENT" },
    });

    const student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        studentId: s.id,
        admissionNumber: `ADM-2026-${s.roll}`,
        dateOfBirth: new Date(`2013-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`),
        classId: classes["Class 7"],
        sectionId: sections["Class 7-A"],
        rollNumber: s.roll,
        schoolId: school.id,
      },
    });

    students.push({ id: student.id, userId: studentUser.id, name: `${s.first} ${s.last}` });
  }
  console.log(`✅ ${students.length} students created in Class 7-A`);

  // ============================================================
  // 9. PARENT - Raj Kumar (Aarav's father)
  // ============================================================
  const parentUser = await prisma.user.create({
    data: {
      email: "raj.kumar@gmail.com",
      passwordHash: defaultPassword,
      firstName: "Raj",
      lastName: "Kumar",
      role: "PARENT",
      status: "ACTIVE",
    },
  });

  await prisma.schoolUser.create({
    data: { schoolId: school.id, userId: parentUser.id, role: "PARENT" },
  });

  const parent = await prisma.parent.create({
    data: {
      userId: parentUser.id,
      relationship: "Father",
      schoolId: school.id,
    },
  });

  // Link Aarav to Raj
  await prisma.parentStudent.create({
    data: { parentId: parent.id, studentId: students[0].id },
  });
  console.log("✅ Parent created: Raj Kumar (father of Aarav Kumar)");

  // ============================================================
  // 10. DRIVER - Rajesh Kumar
  // ============================================================
  const driverUser = await prisma.user.create({
    data: {
      email: "rajesh.driver@greenvalley.edu",
      passwordHash: defaultPassword,
      firstName: "Rajesh",
      lastName: "Kumar",
      role: "DRIVER",
      status: "ACTIVE",
    },
  });

  await prisma.schoolUser.create({
    data: { schoolId: school.id, userId: driverUser.id, role: "DRIVER" },
  });

  const driver = await prisma.driver.create({
    data: {
      userId: driverUser.id,
      licenseNo: "DL-1234567890",
      schoolId: school.id,
    },
  });

  // ============================================================
  // 11. TRANSPORT - BUS-07, Route 3
  // ============================================================
  const bus = await prisma.bus.create({
    data: { number: "BUS-07", capacity: 40, schoolId: school.id },
  });

  const route = await prisma.busRoute.create({
    data: { name: "Route 3", schoolId: school.id },
  });

  // Bus stops
  const stops = [
    { name: "Green Valley School", order: 1, lat: 28.6139, lng: 77.209 },
    { name: "Sector 15 Market", order: 2, lat: 28.618, lng: 77.215 },
    { name: "Central Park", order: 3, lat: 28.622, lng: 77.219 },
    { name: "Sunrise Apartments", order: 4, lat: 28.628, lng: 77.225 },
    { name: "Aarav's Stop", order: 5, lat: 28.632, lng: 77.229 },
  ];

  for (const stop of stops) {
    await prisma.busStop.create({
      data: { ...stop, routeId: route.id },
    });
  }

  await prisma.driverRoute.create({
    data: { driverId: driver.id, busId: bus.id, routeId: route.id },
  });

  // Assign Aarav to bus
  await prisma.studentTransport.create({
    data: { studentId: students[0].id, busId: bus.id, stopName: "Aarav's Stop" },
  });
  console.log("✅ Transport created: BUS-07, Route 3, Driver Rajesh Kumar");

  // ============================================================
  // 12. IoT DEVICES
  // ============================================================
  await prisma.ioTDevice.create({
    data: {
      deviceId: "RFID-GATE-001",
      type: "RFID_READER",
      name: "Main Gate RFID Reader",
      location: "Main Gate",
      status: "ONLINE",
      schoolId: school.id,
      lastSeen: new Date(),
    },
  });
  await prisma.ioTDevice.create({
    data: {
      deviceId: "RFID-CLS7A-001",
      type: "RFID_READER",
      name: "Class 7-A RFID Reader",
      location: "Class 7-A",
      status: "ONLINE",
      schoolId: school.id,
      lastSeen: new Date(),
    },
  });
  await prisma.ioTDevice.create({
    data: {
      deviceId: "BIO-STAFF-001",
      type: "BIOMETRIC",
      name: "Staff Biometric Scanner",
      location: "Staff Room",
      status: "OFFLINE",
      schoolId: school.id,
      lastSeen: new Date(Date.now() - 86400000),
    },
  });
  console.log("✅ IoT devices created");

  // ============================================================
  // 13. ATTENDANCE (last 30 days for all students)
  // ============================================================
  const today = new Date();
  for (let day = 0; day < 30; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    for (const student of students) {
      const rand = Math.random();
      let status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY";
      if (rand < 0.88) status = "PRESENT";
      else if (rand < 0.94) status = "ABSENT";
      else if (rand < 0.97) status = "LATE";
      else status = "HALF_DAY";

      // Aarav has 94%+ attendance
      if (student.name === "Aarav Kumar" && rand < 0.96) status = "PRESENT";

      await prisma.attendanceRecord.create({
        data: {
          studentId: student.id,
          date: new Date(date.toISOString().split("T")[0]),
          status,
          markedBy: teacher.id,
          schoolId: school.id,
        },
      });
    }
  }
  console.log("✅ Attendance records created (30 days)");

  // ============================================================
  // 14. ASSESSMENTS & MARKS
  // ============================================================
  const assessments = [
    { name: "Unit Test 1", type: "UNIT_TEST" as const, maxMarks: 100, daysAgo: 45 },
    { name: "Class Test 1", type: "CLASS_TEST" as const, maxMarks: 50, daysAgo: 30 },
    { name: "Unit Test 2", type: "UNIT_TEST" as const, maxMarks: 100, daysAgo: 15 },
  ];

  for (const a of assessments) {
    const assessmentDate = new Date(today);
    assessmentDate.setDate(assessmentDate.getDate() - a.daysAgo);

    const assessment = await prisma.assessment.create({
      data: {
        name: a.name,
        type: a.type,
        subjectId: subjects["Mathematics"],
        classId: classes["Class 7"],
        teacherId: teacher.id,
        date: assessmentDate,
        maxMarks: a.maxMarks,
        schoolId: school.id,
      },
    });

    for (const student of students) {
      const baseScore = student.name === "Aarav Kumar" ? 0.75 : 0.5;
      const marks = Math.round((baseScore + Math.random() * 0.25) * a.maxMarks);
      const remarks =
        marks >= a.maxMarks * 0.8
          ? "Excellent work"
          : marks >= a.maxMarks * 0.6
            ? "Good effort"
            : "Needs improvement";

      await prisma.assessmentResult.create({
        data: {
          assessmentId: assessment.id,
          studentId: student.id,
          marks: Math.min(marks, a.maxMarks),
          remarks,
        },
      });
    }
  }
  console.log("✅ Assessments & marks created");

  // ============================================================
  // 15. ASSIGNMENTS
  // ============================================================
  const assignment1 = await prisma.assignment.create({
    data: {
      title: "Algebraic Expressions Practice",
      description: "Solve exercises 5.1 to 5.3 from the textbook",
      subjectId: subjects["Mathematics"],
      classId: classes["Class 7"],
      dueDate: new Date(Date.now() + 7 * 86400000),
      maxMarks: 20,
      schoolId: school.id,
    },
  });

  await prisma.assignment.create({
    data: {
      title: "Geometry Worksheet",
      description: "Complete the geometry construction worksheet",
      subjectId: subjects["Mathematics"],
      classId: classes["Class 7"],
      dueDate: new Date(Date.now() + 14 * 86400000),
      maxMarks: 25,
      schoolId: school.id,
    },
  });

  // Submissions for assignment 1
  for (let i = 0; i < 25; i++) {
    await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignment1.id,
        studentId: students[i].id,
        marks: Math.round(15 + Math.random() * 5),
        remarks: "Submitted on time",
      },
    });
  }
  console.log("✅ Assignments created");

  // ============================================================
  // 16. ACTIVITIES
  // ============================================================
  const activity1 = await prisma.activity.create({
    data: {
      name: "Robotics Club - Line Follower Challenge",
      category: "ROBOTICS",
      date: new Date(Date.now() - 10 * 86400000),
      objective: "Build and program a line-following robot",
      teacherId: teacher.id,
      classId: classes["Class 7"],
      skills: ["Problem Solving", "Programming", "Teamwork"],
      evaluation: "Students successfully built and tested robots",
      schoolId: school.id,
    },
  });

  // Add participants
  for (let i = 0; i < 8; i++) {
    await prisma.activityParticipant.create({
      data: { activityId: activity1.id, studentId: students[i].id },
    });
  }

  const activity2 = await prisma.activity.create({
    data: {
      name: "Science Exhibition Preparation",
      category: "SCIENCE",
      date: new Date(Date.now() - 5 * 86400000),
      objective: "Prepare projects for annual science exhibition",
      teacherId: teacher2.id,
      classId: classes["Class 7"],
      skills: ["Research", "Presentation", "Creativity"],
      schoolId: school.id,
    },
  });

  for (let i = 0; i < 12; i++) {
    await prisma.activityParticipant.create({
      data: { activityId: activity2.id, studentId: students[i].id },
    });
  }
  console.log("✅ Activities created");

  // ============================================================
  // 17. DEVELOPMENT RECORDS
  // ============================================================
  const devAreas: Array<{ area: "PROBLEM_SOLVING" | "COMMUNICATION" | "TEAMWORK" | "CREATIVITY" | "LEADERSHIP"; level: string }> = [
    { area: "PROBLEM_SOLVING", level: "Strength" },
    { area: "COMMUNICATION", level: "Developing" },
    { area: "TEAMWORK", level: "Strength" },
    { area: "CREATIVITY", level: "Improving" },
    { area: "LEADERSHIP", level: "Emerging skill" },
  ];

  for (const dev of devAreas) {
    await prisma.developmentRecord.create({
      data: {
        studentId: students[0].id, // Aarav
        teacherId: teacher.id,
        area: dev.area,
        observation: `Shows ${dev.level.toLowerCase()} in ${dev.area.toLowerCase().replace("_", " ")}`,
        feedback: `Continue to develop ${dev.area.toLowerCase().replace("_", " ")} through regular practice`,
        level: dev.level,
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
        schoolId: school.id,
      },
    });
  }
  console.log("✅ Development records created for Aarav Kumar");

  // ============================================================
  // 18. TEACHER FEEDBACK
  // ============================================================
  await prisma.teacherFeedback.create({
    data: {
      studentId: students[0].id,
      teacherId: teacher.id,
      feedback: "Aarav has shown remarkable improvement in mathematical problem solving this term. His ability to approach complex algebraic expressions has improved significantly.",
      category: "academic",
      date: new Date(Date.now() - 5 * 86400000),
      schoolId: school.id,
    },
  });

  await prisma.teacherFeedback.create({
    data: {
      studentId: students[0].id,
      teacherId: teacher.id,
      feedback: "Active participant in class discussions and helps fellow students understand difficult concepts.",
      category: "behaviour",
      date: new Date(Date.now() - 15 * 86400000),
      schoolId: school.id,
    },
  });
  console.log("✅ Teacher feedback created");

  // ============================================================
  // 19. STUDENT CONCERNS
  // ============================================================
  await prisma.studentConcern.create({
    data: {
      studentId: students[3].id, // Diya Gupta
      teacherId: teacher.id,
      category: "ATTENDANCE",
      description: "Frequent tardiness in the last two weeks",
      priority: "MEDIUM",
      status: "IN_REVIEW",
      notes: "Parent meeting scheduled",
      date: new Date(Date.now() - 3 * 86400000),
      schoolId: school.id,
    },
  });
  console.log("✅ Student concerns created");

  // ============================================================
  // 20. ACHIEVEMENTS
  // ============================================================
  await prisma.achievement.create({
    data: {
      studentId: students[0].id,
      title: "Mathematics Olympiad - District Level",
      description: "Secured 2nd position in the district-level Mathematics Olympiad",
      date: new Date(Date.now() - 60 * 86400000),
      category: "Academic",
      schoolId: school.id,
    },
  });

  await prisma.achievement.create({
    data: {
      studentId: students[0].id,
      title: "Robotics Competition Winner",
      description: "Won first place in inter-school robotics competition",
      date: new Date(Date.now() - 30 * 86400000),
      category: "Co-curricular",
      schoolId: school.id,
    },
  });
  console.log("✅ Achievements created for Aarav Kumar");

  // ============================================================
  // 21. PORTFOLIO ITEMS
  // ============================================================
  await prisma.portfolioItem.create({
    data: {
      studentId: students[0].id,
      type: "PROJECT",
      title: "Solar System Model",
      description: "Built a working model of the solar system with LED-lit planets",
      date: new Date(Date.now() - 90 * 86400000),
      grade: "Class 7",
      skills: ["Science", "Creativity", "Engineering"],
      schoolId: school.id,
    },
  });

  await prisma.portfolioItem.create({
    data: {
      studentId: students[0].id,
      type: "ACHIEVEMENT",
      title: "Student of the Month - August 2026",
      description: "Recognized for academic excellence and leadership",
      date: new Date(Date.now() - 40 * 86400000),
      grade: "Class 7",
      skills: ["Leadership", "Academic Excellence"],
      schoolId: school.id,
    },
  });

  await prisma.portfolioItem.create({
    data: {
      studentId: students[0].id,
      type: "ACTIVITY_RECORD",
      title: "Robotics Club - Line Follower Challenge",
      description: "Built and programmed a line-following robot using Arduino",
      date: new Date(Date.now() - 10 * 86400000),
      grade: "Class 7",
      skills: ["Programming", "Problem Solving", "Teamwork"],
      schoolId: school.id,
    },
  });
  console.log("✅ Portfolio items created for Aarav Kumar");

  // ============================================================
  // 22. SECOND SCHOOL (for multi-school demo)
  // ============================================================
  const school2 = await prisma.school.create({
    data: {
      name: "Sunrise International Academy",
      code: "SE-SIA01",
      address: "456 Knowledge Park, Phase II",
      city: "Gurugram",
      state: "Haryana",
      contact: "+91-124-555-6789",
      email: "info@sunriseacademy.edu",
      board: "ICSE",
      academicSession: "2026-27",
      primaryColor: "#7c3aed",
      secondaryColor: "#f59e0b",
      status: "ACTIVE",
    },
  });

  const principal2User = await prisma.user.create({
    data: {
      email: "meera.nair@sunriseacademy.edu",
      passwordHash: defaultPassword,
      firstName: "Meera",
      lastName: "Nair",
      role: "PRINCIPAL",
      status: "ACTIVE",
    },
  });

  await prisma.schoolUser.create({
    data: { schoolId: school2.id, userId: principal2User.id, role: "PRINCIPAL" },
  });
  console.log("✅ Second school created: Sunrise International Academy");

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log("\n" + "=".repeat(50));
  console.log("🎓 SMART EDU - Seed Complete!");
  console.log("=".repeat(50));
  console.log("\nLogin Credentials (all use password: password123):");
  console.log("─".repeat(50));
  console.log("Super Admin:  admin@smartedu.com");
  console.log("Principal:    anjali.sharma@greenvalley.edu");
  console.log("Teacher:      rahul.sharma@greenvalley.edu");
  console.log("Student:      aarav.kumar@student.greenvalley.edu");
  console.log("Parent:       raj.kumar@gmail.com");
  console.log("Driver:       rajesh.driver@greenvalley.edu");
  console.log("─".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
