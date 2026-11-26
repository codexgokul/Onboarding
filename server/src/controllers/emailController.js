import { db, logActivity } from '../db/database.js';

function parseEmailRequest(row) {
  return {
    ...row,
    require2FA: Boolean(row.require2FA),
    aliases: row.aliasesJson ? JSON.parse(row.aliasesJson) : [],
    distributionLists: row.distributionListsJson ? JSON.parse(row.distributionListsJson) : []
  };
}

export function getEmailRequests(req, res) {
  const rows = db.prepare('SELECT * FROM email_requests ORDER BY requestedAt DESC').all();
  res.json(rows.map(parseEmailRequest));
}

export function createEmailRequest(req, res) {
  const {
    employeeId,
    requestedEmail,
    aliases,
    distributionLists,
    mailboxTier,
    require2FA,
    securityEnforcement,
    notes,
    requestedBy
  } = req.body;

  const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(employeeId);
  if (!emp) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const existing = db.prepare('SELECT id FROM email_requests WHERE employeeId = ?').get(employeeId);
  const id = existing ? existing.id : `emr-${Date.now().toString().slice(-4)}`;
  const cleanEmail = requestedEmail || `${emp.fullName.toLowerCase().replace(/\s+/g, '.')}@acmecorp.io`;
  const now = new Date().toISOString();

  if (existing) {
    db.prepare(`
      UPDATE email_requests SET
        requestedEmail = ?,
        aliasesJson = ?,
        distributionListsJson = ?,
        mailboxTier = ?,
        require2FA = ?,
        securityEnforcement = ?,
        status = 'Pending Review',
        notes = ?
      WHERE id = ?
    `).run(
      cleanEmail,
      JSON.stringify(aliases || []),
      JSON.stringify(distributionLists || ['all-employees@acmecorp.io']),
      mailboxTier || 'Business Standard (2TB Storage)',
      require2FA !== undefined ? (require2FA ? 1 : 0) : 1,
      securityEnforcement || 'Authenticator App / Passkey',
      notes || 'Corporate email mailbox access requested.',
      id
    );
  } else {
    db.prepare(`
      INSERT INTO email_requests (id, employeeId, employeeName, department, requestedEmail, aliasesJson, distributionListsJson, mailboxTier, require2FA, securityEnforcement, status, requestedBy, requestedAt, approvedBy, approvedAt, provisionedAt, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      employeeId,
      emp.fullName,
      emp.department,
      cleanEmail,
      JSON.stringify(aliases || []),
      JSON.stringify(distributionLists || ['all-employees@acmecorp.io']),
      mailboxTier || 'Business Standard (2TB Storage)',
      require2FA !== undefined ? (require2FA ? 1 : 0) : 1,
      securityEnforcement || 'Authenticator App / Passkey',
      'Pending Review',
      requestedBy || 'HR Manager',
      now,
      null,
      null,
      null,
      notes || 'Corporate email mailbox access requested.'
    );
  }

  logActivity(
    'Email Access Requested',
    requestedBy || 'HR',
    `${emp.fullName} (${cleanEmail})`,
    `Mailbox Tier: ${mailboxTier || 'Business Standard'}`
  );

  const updated = db.prepare('SELECT * FROM email_requests WHERE id = ?').get(id);
  res.status(201).json(parseEmailRequest(updated));
}

export function updateEmailStatus(req, res) {
  const row = db.prepare('SELECT * FROM email_requests WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Email request not found' });
  }

  const { status, approverName, notes } = req.body;
  const now = new Date().toISOString();

  let approvedBy = row.approvedBy;
  let approvedAt = row.approvedAt;
  let provisionedAt = row.provisionedAt;

  if (status === 'Approved' || status === 'Provisioned') {
    approvedBy = approverName || 'IT Support Lead';
    approvedAt = approvedAt || now;
    if (status === 'Provisioned') {
      provisionedAt = now;
      // Update employee's corporateEmail
      db.prepare('UPDATE employees SET corporateEmail = ? WHERE id = ?').run(row.requestedEmail, row.employeeId);
    }
  }

  db.prepare(`
    UPDATE email_requests SET
      status = ?,
      approvedBy = ?,
      approvedAt = ?,
      provisionedAt = ?,
      notes = COALESCE(?, notes)
    WHERE id = ?
  `).run(
    status,
    approvedBy,
    approvedAt,
    provisionedAt,
    notes,
    req.params.id
  );

  logActivity(
    `Email Request ${status}`,
    approverName || 'IT Admin',
    `${row.employeeName} (${row.requestedEmail})`,
    notes || `Status transitioned to ${status}`
  );

  const updated = db.prepare('SELECT * FROM email_requests WHERE id = ?').get(req.params.id);
  res.json(parseEmailRequest(updated));
}
