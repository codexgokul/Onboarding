import { db, logActivity } from '../db/database.js';

function parsePermission(row) {
  return {
    ...row,
    securityApproval: Boolean(row.securityApproval)
  };
}

export function getSoftwareCatalog(req, res) {
  const rows = db.prepare('SELECT * FROM software_catalog').all();
  const parsed = rows.map(r => ({
    ...r,
    roles: JSON.parse(r.rolesJson),
    defaultDepartments: JSON.parse(r.defaultDepartmentsJson)
  }));
  res.json(parsed);
}

export function getPermissions(req, res) {
  const { employeeId } = req.query;
  let rows;
  if (employeeId) {
    rows = db.prepare('SELECT * FROM software_permissions WHERE employeeId = ? ORDER BY assignedAt DESC').all(employeeId);
  } else {
    rows = db.prepare('SELECT * FROM software_permissions ORDER BY assignedAt DESC').all();
  }
  res.json(rows.map(parsePermission));
}

export function assignPermission(req, res) {
  const {
    employeeId,
    softwareId,
    softwareName,
    role,
    licenseType,
    justification,
    assignedBy
  } = req.body;

  const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(employeeId);
  if (!emp) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const id = 'perm-' + Date.now();
  const assignedAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO software_permissions (id, employeeId, softwareId, softwareName, role, licenseType, status, assignedBy, assignedAt, justification, securityApproval)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    employeeId,
    softwareId,
    softwareName || 'Software Application',
    role || 'Standard Member',
    licenseType || 'Corporate License',
    'Pending Approval',
    assignedBy || 'Manager',
    assignedAt,
    justification || 'Role requirement for onboarding workflow.',
    0
  );

  logActivity(
    'Software Permission Requested',
    assignedBy || 'Manager',
    `${emp.fullName} -> ${softwareName || 'Software'} (${role || 'Standard Member'})`,
    justification || 'Standard onboarding assignment'
  );

  const created = db.prepare('SELECT * FROM software_permissions WHERE id = ?').get(id);
  res.status(201).json(parsePermission(created));
}

export function updatePermissionStatus(req, res) {
  const row = db.prepare('SELECT * FROM software_permissions WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Permission not found' });
  }

  const { status, securityApproval, approverName } = req.body;
  const newStatus = status || row.status;
  const newSec = securityApproval !== undefined ? (securityApproval ? 1 : 0) : row.securityApproval;

  db.prepare(`
    UPDATE software_permissions SET
      status = ?,
      securityApproval = ?
    WHERE id = ?
  `).run(newStatus, newSec, req.params.id);

  const emp = db.prepare('SELECT fullName FROM employees WHERE id = ?').get(row.employeeId);
  logActivity(
    `Permission ${newStatus}`,
    approverName || 'IT Security Lead',
    `${emp?.fullName || 'Employee'} -> ${row.softwareName}`,
    `Access status: ${newStatus}, Security cleared: ${Boolean(newSec)}`
  );

  const updated = db.prepare('SELECT * FROM software_permissions WHERE id = ?').get(req.params.id);
  res.json(parsePermission(updated));
}

export function revokePermission(req, res) {
  const row = db.prepare('SELECT * FROM software_permissions WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Permission not found' });
  }

  db.prepare('DELETE FROM software_permissions WHERE id = ?').run(req.params.id);

  logActivity(
    'Permission Revoked',
    'IT Admin',
    `${row.softwareName} for ${row.employeeId}`,
    'Revoked software license seat.'
  );

  res.json({ success: true, message: 'Permission revoked successfully' });
}
