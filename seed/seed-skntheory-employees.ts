import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectToMongoDB } from "../mongodb";
import {
  ActionItem,
  Announcement,
  AnnouncementRead,
  BreakLog,
  CalendarEvent,
  ChatMessage,
  Compensation,
  ComplianceRecord,
  EmployeeAuditLog,
  EmployeeDocument,
  EmployeeProfile,
  EmploymentDetail,
  FormSubmission,
  JobHistory,
  LeaveApplication,
  Meeting,
  MeetingMinutes,
  MeetingParticipant,
  Note,
  Notification,
  OvertimeEntry,
  Payslip,
  PerformanceRecord,
  Project,
  ProjectAssignment,
  ProjectTask,
  Qualification,
  TimeEntry,
  User,
  WorkSession,
} from "../models";

type EmployeeSeed = {
  firstName: string;
  lastName?: string;
  email?: string;
  designation: string;
  notes?: string;
  reportsTo?: "Directors" | "Muzzamil/Hamza";
  department: "Staff" | "Doctors";
  employeeId: string;
  role: "admin" | "user";
};

const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || "123456";
const OVERWRITE_PASSWORDS = process.env.SEED_OVERWRITE_PASSWORDS === "true";

const allModels = [
  User,
  TimeEntry,
  WorkSession,
  OvertimeEntry,
  BreakLog,
  LeaveApplication,
  FormSubmission,
  ChatMessage,
  Note,
  Payslip,
  Announcement,
  Project,
  ProjectAssignment,
  ProjectTask,
  Notification,
  AnnouncementRead,
  EmployeeProfile,
  EmploymentDetail,
  JobHistory,
  Compensation,
  PerformanceRecord,
  Qualification,
  EmployeeDocument,
  ComplianceRecord,
  EmployeeAuditLog,
  Meeting,
  MeetingParticipant,
  MeetingMinutes,
  ActionItem,
  CalendarEvent,
];

const employees: EmployeeSeed[] = [
  {
    firstName: "Abdullah",
    lastName: "Seja",
    email: "sejaabd@gmail.com",
    designation: "Director/CEO",
    department: "Staff",
    employeeId: "ADMIN001",
    role: "admin",
  },
  {
    firstName: "Muzamil",
    lastName: "Arif",
    email: "muzamil.2095@gmail.com",
    designation: "Business Manager",
    notes: "10am to 7pm",
    reportsTo: "Directors",
    department: "Staff",
    employeeId: "STF001",
    role: "user",
  },
  {
    firstName: "Hamza",
    lastName: "Zahid",
    email: "hz64949@gmail.com",
    designation: "Admin Manager",
    notes: "10am to 7pm",
    reportsTo: "Directors",
    department: "Staff",
    employeeId: "STF002",
    role: "user",
  },
  {
    firstName: "Salma",
    designation: "House Keeping",
    notes: "9:30 am to 7 pm",
    reportsTo: "Muzzamil/Hamza",
    department: "Staff",
    employeeId: "STF003",
    role: "user",
  },
  {
    firstName: "Rabia",
    designation: "House Keeping",
    notes: "9:30 am to 7 pm",
    reportsTo: "Muzzamil/Hamza",
    department: "Staff",
    employeeId: "STF004",
    role: "user",
  },
  {
    firstName: "Nirmala",
    lastName: "Rimesh",
    email: "nirmalasoharm32@gmail.com",
    designation: "Nurse",
    notes: "11:00 to 7pm",
    reportsTo: "Muzzamil/Hamza",
    department: "Staff",
    employeeId: "STF005",
    role: "user",
  },
  {
    firstName: "Sehrish",
    lastName: "Yousuf",
    email: "1994sehrishyousuf@gmail",
    designation: "Technician",
    notes: "daily 3:00 pm to 7:00 pm",
    reportsTo: "Muzzamil/Hamza",
    department: "Staff",
    employeeId: "STF006",
    role: "user",
  },
  {
    firstName: "Iqra",
    lastName: "Khan",
    email: "izadi409@gmail.com",
    designation: "Receptionist",
    notes: "10:30 am to 7pm",
    reportsTo: "Muzzamil/Hamza",
    department: "Staff",
    employeeId: "STF007",
    role: "user",
  },
  {
    firstName: "Aman",
    designation: "Kitchen Boy",
    notes: "10:30 am to 7pm",
    reportsTo: "Muzzamil/Hamza",
    department: "Staff",
    employeeId: "STF008",
    role: "user",
  },
  {
    firstName: "Kainat",
    email: "kainatttkhann.27@gmail.com",
    designation: "Social Media",
    notes: "11 to 7pm",
    reportsTo: "Directors",
    department: "Staff",
    employeeId: "STF009",
    role: "user",
  },
  {
    firstName: "Bushra",
    email: "bushramuhammadarif2001@gmail.com",
    designation: "Pharmacy",
    notes: "11am to 7pm",
    reportsTo: "Muzzamil/Hamza",
    department: "Staff",
    employeeId: "STF010",
    role: "user",
  },
  {
    firstName: "Azher",
    lastName: "Ali Shah",
    email: "sazhershah787@gmail",
    designation: "Receptionist",
    notes: "10 to 7 pm",
    reportsTo: "Muzzamil/Hamza",
    department: "Staff",
    employeeId: "STF011",
    role: "user",
  },
  {
    firstName: "Neelma",
    lastName: "Raza",
    email: "email@email.com",
    designation: "Aesthetic Physician",
    notes: "daily 3:00 pm to 7:00 pm",
    reportsTo: "Directors",
    department: "Doctors",
    employeeId: "DOC001",
    role: "user",
  },
  {
    firstName: "Nazia",
    lastName: "Wasif",
    email: "nidawasif@gmail",
    designation: "Dermatologist",
    notes: "Tue to Thur 4:00 to 6:00 pm",
    reportsTo: "Directors",
    department: "Doctors",
    employeeId: "DOC002",
    role: "user",
  },
  {
    firstName: "Saba",
    lastName: "Jerjees",
    email: "sabajerjees@gmail",
    designation: "Doctor and Director",
    notes: "Daily 11 to 7:00 pm",
    department: "Doctors",
    employeeId: "DOC003",
    role: "admin",
  },
  {
    firstName: "Iqra",
    lastName: "Khan",
    email: "drigranazia@gmail.com",
    designation: "Dermatologist",
    notes: "Mon to Thursday, sat 12 to 5pm",
    reportsTo: "Directors",
    department: "Doctors",
    employeeId: "DOC004",
    role: "user",
  },
  {
    firstName: "Wersha",
    lastName: "Chand",
    email: "varshaaadultani@gmail.com",
    designation: "Technician",
    notes: "daily 10:30 to 7:00 pm",
    department: "Doctors",
    employeeId: "DOC005",
    role: "user",
  },
  {
    firstName: "Faryal",
    lastName: "Goher",
    email: "fielbee1@gmail.com",
    designation: "Technician",
    notes: "Daily 12 to 5 pm",
    department: "Doctors",
    employeeId: "DOC006",
    role: "user",
  },
];

function fullName(employee: EmployeeSeed) {
  return [employee.firstName, employee.lastName].filter(Boolean).join(" ");
}

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase() || undefined;
}

function supervisorKey(reportsTo?: EmployeeSeed["reportsTo"]) {
  if (reportsTo === "Directors") return "ADMIN001";
  if (reportsTo === "Muzzamil/Hamza") return "STF001";
  return undefined;
}

async function ensureCollections() {
  for (const model of allModels) {
    await model.createCollection();
    await model.syncIndexes();
  }
}

async function upsertUsers(passwordHash: string) {
  const usersByEmployeeId = new Map<string, mongoose.Types.ObjectId>();

  for (const employee of employees) {
    const email = normalizeEmail(employee.email);
    const openId = `skn-${employee.employeeId.toLowerCase()}`;
    const existing = await User.findOne({
      $or: [{ employeeId: employee.employeeId }, ...(email ? [{ email }] : [])],
    });

    if (!existing) {
      const created = await User.create({
        openId,
        name: fullName(employee),
        email,
        loginMethod: "custom",
        role: employee.role,
        employeeId: employee.employeeId,
        password: passwordHash,
        department: employee.department,
        position: employee.designation,
        lastSignedIn: new Date(0),
      });
      usersByEmployeeId.set(employee.employeeId, created._id);
      continue;
    }

    existing.openId = existing.openId || openId;
    existing.name = fullName(employee);
    existing.email = email;
    existing.loginMethod = "custom";
    existing.role = employee.role;
    existing.employeeId = employee.employeeId;
    existing.department = employee.department;
    existing.position = employee.designation;
    if (OVERWRITE_PASSWORDS || !existing.password) {
      existing.password = passwordHash;
    }
    await existing.save();
    usersByEmployeeId.set(employee.employeeId, existing._id);
  }

  return usersByEmployeeId;
}

async function upsertEmployeeDetails(usersByEmployeeId: Map<string, mongoose.Types.ObjectId>) {
  for (const employee of employees) {
    const userId = usersByEmployeeId.get(employee.employeeId);
    if (!userId) {
      throw new Error(`Missing seeded user for ${fullName(employee)}`);
    }

    const supervisorEmployeeId = supervisorKey(employee.reportsTo);
    const supervisorId = supervisorEmployeeId
      ? usersByEmployeeId.get(supervisorEmployeeId)
      : undefined;
    const email = normalizeEmail(employee.email);

    await EmployeeProfile.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          ...(email ? { personalEmail: email } : {}),
        },
      },
      { upsert: true }
    );

    await EmploymentDetail.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          jobTitle: employee.designation,
          department: employee.department,
          employmentStatus: "full_time",
          supervisorId,
          teamStructure: employee.reportsTo ? `Reports to ${employee.reportsTo}` : "",
          shift: employee.notes || "",
        },
      },
      { upsert: true }
    );
  }
}

async function run() {
  const connected = await connectToMongoDB();
  if (!connected) {
    console.error("[Seed] MongoDB not connected. Check MONGODB_URI.");
    process.exit(1);
  }

  await ensureCollections();
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const usersByEmployeeId = await upsertUsers(passwordHash);
  await upsertEmployeeDetails(usersByEmployeeId);

  console.log(`[Seed] Seeded ${employees.length} SKN Theory employees.`);
  console.log(`[Seed] Default password: ${DEFAULT_PASSWORD}`);
  console.log("[Seed] Admin logins: ADMIN001, DOC003");
  await mongoose.connection.close();
}

run().catch(error => {
  console.error("[Seed] Failed:", error);
  process.exit(1);
});
