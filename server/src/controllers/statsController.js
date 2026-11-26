import { db, seedDatabase } from '../db/database.js';

export function getStats(req, res) {
  const empRows = db.prepare('SELECT status FROM employees').all();
  const totalEmployees = empRows.length;
  const inProgress = empRows.filter(e => e.status === 'In Progress').length;
  const completed = empRows.filter(e => e.status === 'Completed').length;
  const notStarted = empRows.filter(e => e.status === 'Not Started').length;

  const taskRows = db.prepare('SELECT status, validationJson FROM tasks').all();
  const totalTasks = taskRows.length;
  const validatedTasks = taskRows.filter(t => {
    if (t.status === 'Validated') return true;
    if (t.validationJson) {
      const v = JSON.parse(t.validationJson);
      return Boolean(v.isValidated);
    }
    return false;
  }).length;
  const pendingValidationTasks = taskRows.filter(t => t.status === 'Under Validation').length;

  const emailRows = db.prepare('SELECT status FROM email_requests').all();
  const pendingEmails = emailRows.filter(r => r.status === 'Pending Review' || r.status === 'Requested').length;

  const permRows = db.prepare('SELECT status FROM software_permissions').all();
  const pendingSoftware = permRows.filter(p => p.status === 'Pending Approval').length;

  res.json({
    employees: {
      total: totalEmployees,
      inProgress,
      completed,
      notStarted
    },
    tasks: {
      total: totalTasks,
      validated: validatedTasks,
      pendingValidation: pendingValidationTasks,
      completionRate: totalTasks > 0 ? Math.round((validatedTasks / totalTasks) * 100) : 0
    },
    itQueue: {
      pendingEmails,
      pendingSoftware,
      totalPending: pendingEmails + pendingSoftware
    }
  });
}

export function getActivityLogs(req, res) {
  const rows = db.prepare('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 100').all();
  res.json(rows);
}

export function resetDemo(req, res) {
  seedDatabase();
  res.json({ message: 'Database reset to initial demo state successfully.' });
}
