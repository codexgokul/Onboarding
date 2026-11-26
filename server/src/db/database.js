import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/index.js';
import { seedData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data folder exists
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(config.dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // Create tables with relational constraints
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      personalEmail TEXT NOT NULL,
      corporateEmail TEXT,
      jobTitle TEXT NOT NULL,
      department TEXT NOT NULL,
      seniority TEXT NOT NULL,
      manager TEXT,
      startDate TEXT,
      phone TEXT,
      location TEXT,
      status TEXT NOT NULL DEFAULT 'In Progress',
      avatar TEXT,
      hardwarePreference TEXT,
      emergencyContactJson TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      phase TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      assignedTo TEXT NOT NULL,
      validatorRole TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'Medium',
      dueDate TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      proofJson TEXT,
      validationJson TEXT,
      FOREIGN KEY (employeeId) REFERENCES employees (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_employeeId ON tasks (employeeId);

    CREATE TABLE IF NOT EXISTS email_requests (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      employeeName TEXT NOT NULL,
      department TEXT NOT NULL,
      requestedEmail TEXT NOT NULL,
      aliasesJson TEXT,
      distributionListsJson TEXT,
      mailboxTier TEXT,
      require2FA INTEGER NOT NULL DEFAULT 1,
      securityEnforcement TEXT,
      status TEXT NOT NULL DEFAULT 'Pending Review',
      requestedBy TEXT,
      requestedAt TEXT NOT NULL,
      approvedBy TEXT,
      approvedAt TEXT,
      provisionedAt TEXT,
      notes TEXT,
      FOREIGN KEY (employeeId) REFERENCES employees (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_emails_employeeId ON email_requests (employeeId);

    CREATE TABLE IF NOT EXISTS software_catalog (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      rolesJson TEXT NOT NULL,
      defaultDepartmentsJson TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS software_permissions (
      id TEXT PRIMARY KEY,
      employeeId TEXT NOT NULL,
      softwareId TEXT NOT NULL,
      softwareName TEXT NOT NULL,
      role TEXT NOT NULL,
      licenseType TEXT,
      status TEXT NOT NULL DEFAULT 'Pending Approval',
      assignedBy TEXT,
      assignedAt TEXT NOT NULL,
      justification TEXT,
      securityApproval INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (employeeId) REFERENCES employees (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_perms_employeeId ON software_permissions (employeeId);

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      action TEXT NOT NULL,
      actor TEXT NOT NULL,
      target TEXT NOT NULL,
      details TEXT
    );
  `);

  // Check if database needs initial seeding
  const count = db.prepare('SELECT COUNT(*) as count FROM employees').get().count;
  if (count === 0) {
    seedDatabase();
  }
}

export function seedDatabase() {
  console.log('Seeding SQLite database with initial onboarding dataset...');

  const insertEmployee = db.prepare(`
    INSERT INTO employees (id, fullName, personalEmail, corporateEmail, jobTitle, department, seniority, manager, startDate, phone, location, status, avatar, hardwarePreference, emergencyContactJson, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTask = db.prepare(`
    INSERT INTO tasks (id, employeeId, phase, title, description, category, assignedTo, validatorRole, priority, dueDate, status, proofJson, validationJson)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertEmail = db.prepare(`
    INSERT INTO email_requests (id, employeeId, employeeName, department, requestedEmail, aliasesJson, distributionListsJson, mailboxTier, require2FA, securityEnforcement, status, requestedBy, requestedAt, approvedBy, approvedAt, provisionedAt, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSoftware = db.prepare(`
    INSERT INTO software_catalog (id, name, category, icon, color, rolesJson, defaultDepartmentsJson)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPermission = db.prepare(`
    INSERT INTO software_permissions (id, employeeId, softwareId, softwareName, role, licenseType, status, assignedBy, assignedAt, justification, securityApproval)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertLog = db.prepare(`
    INSERT INTO activity_logs (id, timestamp, action, actor, target, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction(() => {
    // Clear existing
    db.prepare('DELETE FROM activity_logs').run();
    db.prepare('DELETE FROM software_permissions').run();
    db.prepare('DELETE FROM software_catalog').run();
    db.prepare('DELETE FROM email_requests').run();
    db.prepare('DELETE FROM tasks').run();
    db.prepare('DELETE FROM employees').run();

    // Employees
    for (const emp of seedData.employees) {
      insertEmployee.run(
        emp.id,
        emp.fullName,
        emp.personalEmail,
        emp.corporateEmail || '',
        emp.jobTitle,
        emp.department,
        emp.seniority,
        emp.manager,
        emp.startDate,
        emp.phone,
        emp.location,
        emp.status,
        emp.avatar,
        emp.hardwarePreference,
        JSON.stringify(emp.emergencyContact || {}),
        emp.createdAt
      );
    }

    // Tasks
    for (const t of seedData.tasks) {
      insertTask.run(
        t.id,
        t.employeeId,
        t.phase,
        t.title,
        t.description,
        t.category,
        t.assignedTo,
        t.validatorRole,
        t.priority,
        t.dueDate,
        t.status,
        t.proof ? JSON.stringify(t.proof) : null,
        t.validation ? JSON.stringify(t.validation) : null
      );
    }

    // Email Requests
    for (const r of seedData.emailRequests) {
      insertEmail.run(
        r.id,
        r.employeeId,
        r.employeeName,
        r.department,
        r.requestedEmail,
        JSON.stringify(r.aliases || []),
        JSON.stringify(r.distributionLists || []),
        r.mailboxTier,
        r.require2FA ? 1 : 0,
        r.securityEnforcement,
        r.status,
        r.requestedBy,
        r.requestedAt,
        r.approvedBy || null,
        r.approvedAt || null,
        r.provisionedAt || null,
        r.notes || ''
      );
    }

    // Software Catalog
    for (const s of seedData.softwareCatalog) {
      insertSoftware.run(
        s.id,
        s.name,
        s.category,
        s.icon,
        s.color,
        JSON.stringify(s.roles || []),
        JSON.stringify(s.defaultDepartments || [])
      );
    }

    // Software Permissions
    for (const p of seedData.softwarePermissions) {
      insertPermission.run(
        p.id,
        p.employeeId,
        p.softwareId,
        p.softwareName,
        p.role,
        p.licenseType,
        p.status,
        p.assignedBy,
        p.assignedAt,
        p.justification,
        p.securityApproval ? 1 : 0
      );
    }

    // Activity Logs
    for (const l of seedData.activityLogs) {
      insertLog.run(
        l.id,
        l.timestamp,
        l.action,
        l.actor,
        l.target,
        l.details
      );
    }
  });

  tx();
  console.log('Database seeded successfully!');
}

export function logActivity(action, actor, target, details) {
  const id = 'act-' + Date.now();
  const timestamp = new Date().toISOString();
  db.prepare(`
    INSERT INTO activity_logs (id, timestamp, action, actor, target, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, timestamp, action, actor, target, details);

  return { id, timestamp, action, actor, target, details };
}
