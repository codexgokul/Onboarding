import { db, logActivity } from '../db/database.js';

function parseTask(row) {
  return {
    ...row,
    proof: row.proofJson ? JSON.parse(row.proofJson) : null,
    validation: row.validationJson ? JSON.parse(row.validationJson) : { isValidated: false, validatedBy: null, validatedAt: null, comments: null }
  };
}

export function getTasks(req, res) {
  const { employeeId, phase, status } = req.query;

  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (employeeId) {
    query += ' AND employeeId = ?';
    params.push(employeeId);
  }
  if (phase) {
    query += ' AND phase = ?';
    params.push(phase);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY rowid ASC';

  const rows = db.prepare(query).all(...params);
  res.json(rows.map(parseTask));
}

export function createTask(req, res) {
  const {
    employeeId,
    title,
    description,
    phase,
    category,
    assignedTo,
    validatorRole,
    priority,
    dueDate
  } = req.body;

  if (!employeeId || !title) {
    return res.status(400).json({ error: 'employeeId and title are required.' });
  }

  const id = 'task-' + Date.now();
  const initialValidation = {
    isValidated: false,
    validatedBy: null,
    validatedAt: null,
    comments: null
  };

  db.prepare(`
    INSERT INTO tasks (id, employeeId, phase, title, description, category, assignedTo, validatorRole, priority, dueDate, status, proofJson, validationJson)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    employeeId,
    phase || 'Day 1 Setup',
    title.trim(),
    description || '',
    category || 'General',
    assignedTo || 'Employee',
    validatorRole || 'HR Specialist',
    priority || 'Medium',
    dueDate || new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    'Pending',
    null,
    JSON.stringify(initialValidation)
  );

  logActivity('Task Created', 'Admin', title.trim(), `Assigned to ${assignedTo || 'Employee'} for ${employeeId}`);

  const created = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.status(201).json(parseTask(created));
}

export function updateTask(req, res) {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, phase, category, assignedTo, validatorRole, priority, dueDate, status } = req.body;

  db.prepare(`
    UPDATE tasks SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      phase = COALESCE(?, phase),
      category = COALESCE(?, category),
      assignedTo = COALESCE(?, assignedTo),
      validatorRole = COALESCE(?, validatorRole),
      priority = COALESCE(?, priority),
      dueDate = COALESCE(?, dueDate),
      status = COALESCE(?, status)
    WHERE id = ?
  `).run(
    title,
    description,
    phase,
    category,
    assignedTo,
    validatorRole,
    priority,
    dueDate,
    status,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(parseTask(updated));
}

// SUBMIT EVIDENCE / PROOF
export function submitProof(req, res) {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { proofType, proofTitle, proofUrl, proofNotes, submittedBy } = req.body;

  const proof = {
    type: proofType || 'document',
    title: proofTitle || 'Verification Proof',
    url: proofUrl || '',
    notes: proofNotes || 'Submitted for reviewer verification.',
    submittedAt: new Date().toISOString()
  };

  db.prepare(`
    UPDATE tasks SET
      status = 'Under Validation',
      proofJson = ?
    WHERE id = ?
  `).run(JSON.stringify(proof), req.params.id);

  const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(row.employeeId);
  logActivity(
    'Task Submitted for Validation',
    submittedBy || emp?.fullName || 'Employee',
    row.title,
    `Proof submitted: ${proof.title}`
  );

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(parseTask(updated));
}

// VALIDATE TASK COMPLETION (Sign off or Return)
export function validateTask(req, res) {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { isValidated, comments, validatedBy, validatorRole } = req.body;
  const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(row.employeeId);

  let newStatus = isValidated ? 'Validated' : 'In Progress';
  const validationObj = {
    isValidated: Boolean(isValidated),
    validatedBy: validatedBy || 'HR Reviewer',
    validatorRole: validatorRole || row.validatorRole || 'Reviewer',
    validatedAt: new Date().toISOString(),
    comments: comments || (isValidated ? 'Verification confirmed. Task marked complete.' : 'Revisions requested.')
  };

  db.prepare(`
    UPDATE tasks SET
      status = ?,
      validationJson = ?
    WHERE id = ?
  `).run(newStatus, JSON.stringify(validationObj), req.params.id);

  logActivity(
    isValidated ? 'Task Validated' : 'Validation Rejected',
    validatedBy || 'Validator',
    `${emp?.fullName || 'Employee'} - ${row.title}`,
    comments || (isValidated ? 'Verification confirmed.' : 'Returned for revisions.')
  );

  // Check if all tasks for this employee are now validated
  const allEmpTasks = db.prepare('SELECT * FROM tasks WHERE employeeId = ?').all(row.employeeId).map(parseTask);
  const allDone = allEmpTasks.every(t => t.validation?.isValidated || t.status === 'Validated');

  if (allDone && emp) {
    db.prepare("UPDATE employees SET status = 'Completed' WHERE id = ?").run(emp.id);
    logActivity(
      'Onboarding Completed 🎉',
      'System Automation',
      emp.fullName,
      '100% of onboarding tasks have been fully validated!'
    );
  }

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(parseTask(updated));
}
