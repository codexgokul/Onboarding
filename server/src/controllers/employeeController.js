import { db, logActivity } from '../db/database.js';

function formatEmployee(row, tasks = []) {
  const empTasks = tasks.filter(t => t.employeeId === row.id);
  const validatedCount = empTasks.filter(t => t.validation?.isValidated || t.status === 'Validated').length;
  const totalCount = empTasks.length;
  const percentage = totalCount > 0 ? Math.round((validatedCount / totalCount) * 100) : 0;

  return {
    id: row.id,
    fullName: row.fullName,
    personalEmail: row.personalEmail,
    corporateEmail: row.corporateEmail || '',
    jobTitle: row.jobTitle,
    department: row.department,
    seniority: row.seniority,
    manager: row.manager,
    startDate: row.startDate,
    phone: row.phone,
    location: row.location,
    status: row.status,
    avatar: row.avatar,
    hardwarePreference: row.hardwarePreference,
    emergencyContact: row.emergencyContactJson ? JSON.parse(row.emergencyContactJson) : {},
    createdAt: row.createdAt,
    progress: {
      total: totalCount,
      completed: empTasks.filter(t => t.status === 'Completed' || t.status === 'Validated').length,
      validated: validatedCount,
      percentage
    }
  };
}

function parseTask(row) {
  return {
    ...row,
    proof: row.proofJson ? JSON.parse(row.proofJson) : null,
    validation: row.validationJson ? JSON.parse(row.validationJson) : { isValidated: false, validatedBy: null, validatedAt: null, comments: null }
  };
}

export function getAllEmployees(req, res) {
  const empRows = db.prepare('SELECT * FROM employees ORDER BY createdAt DESC').all();
  const taskRows = db.prepare('SELECT * FROM tasks').all().map(parseTask);

  const formatted = empRows.map(row => formatEmployee(row, taskRows));
  res.json(formatted);
}

export function getEmployeeById(req, res) {
  const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const tasks = db.prepare('SELECT * FROM tasks WHERE employeeId = ?').all(req.params.id).map(parseTask);
  const emailReqRow = db.prepare('SELECT * FROM email_requests WHERE employeeId = ?').get(req.params.id);
  const emailRequest = emailReqRow ? {
    ...emailReqRow,
    require2FA: Boolean(emailReqRow.require2FA),
    aliases: emailReqRow.aliasesJson ? JSON.parse(emailReqRow.aliasesJson) : [],
    distributionLists: emailReqRow.distributionListsJson ? JSON.parse(emailReqRow.distributionListsJson) : []
  } : null;

  const permissions = db.prepare('SELECT * FROM software_permissions WHERE employeeId = ?').all(req.params.id).map(p => ({
    ...p,
    securityApproval: Boolean(p.securityApproval)
  }));

  const formatted = formatEmployee(row, tasks);
  res.json({
    ...formatted,
    tasks,
    emailRequest,
    permissions
  });
}

export function createEmployee(req, res) {
  const {
    fullName,
    personalEmail,
    jobTitle,
    department,
    seniority,
    manager,
    startDate,
    phone,
    location,
    hardwarePreference,
    emergencyContact
  } = req.body;

  if (!fullName || !personalEmail || !department) {
    return res.status(400).json({ error: 'Full name, personal email, and department are required.' });
  }

  const countRow = db.prepare('SELECT COUNT(*) as count FROM employees').get();
  const id = `emp-${String(countRow.count + 1).padStart(3, '0')}`;
  const cleanName = fullName.toLowerCase().trim().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.');
  const corporateEmail = `${cleanName}@acmecorp.io`;
  const createdAt = new Date().toISOString();
  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;

  const tx = db.transaction(() => {
    // 1. Insert Employee
    db.prepare(`
      INSERT INTO employees (id, fullName, personalEmail, corporateEmail, jobTitle, department, seniority, manager, startDate, phone, location, status, avatar, hardwarePreference, emergencyContactJson, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      fullName.trim(),
      personalEmail.trim(),
      corporateEmail,
      jobTitle || 'Team Member',
      department,
      seniority || 'Mid-Level',
      manager || 'Unassigned',
      startDate || createdAt.slice(0, 10),
      phone || '',
      location || 'Remote',
      'In Progress',
      avatar,
      hardwarePreference || 'Standard Laptop',
      JSON.stringify(emergencyContact || { name: '', relation: '', phone: '' }),
      createdAt
    );

    // 2. Insert Standard 7 Onboarding Tasks
    const insertTask = db.prepare(`
      INSERT INTO tasks (id, employeeId, phase, title, description, category, assignedTo, validatorRole, priority, dueDate, status, proofJson, validationJson)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const idPrefix = 'task-' + Date.now().toString().slice(-4);
    const standardTasks = [
      {
        id: `${idPrefix}-1`,
        phase: 'Pre-boarding',
        title: 'Sign Employment Agreement & Confidentiality Terms',
        description: 'Review and e-sign the official offer packet, company handbook acknowledgment, and NDA.',
        category: 'HR Paperwork',
        assignedTo: 'Employee',
        validatorRole: 'HR Specialist',
        priority: 'High',
        dueDate: startDate || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)
      },
      {
        id: `${idPrefix}-2`,
        phase: 'Pre-boarding',
        title: 'Submit Tax & Direct Deposit Banking Information',
        description: 'Upload W-4/I-9 verification docs and direct deposit account details.',
        category: 'HR Paperwork',
        assignedTo: 'Employee',
        validatorRole: 'HR Specialist',
        priority: 'High',
        dueDate: startDate || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)
      },
      {
        id: `${idPrefix}-3`,
        phase: 'Day 1 Setup',
        title: 'Corporate Email & Identity Setup',
        description: 'Log into corporate Google Workspace account and activate mandatory Multi-Factor Authentication.',
        category: 'IT Setup',
        assignedTo: 'IT Support',
        validatorRole: 'IT Administrator',
        priority: 'High',
        dueDate: startDate || new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10)
      },
      {
        id: `${idPrefix}-4`,
        phase: 'Day 1 Setup',
        title: 'Hardware Receipt & Disk Encryption Verification',
        description: 'Receive company laptop, verify BitLocker/FileVault encryption enabled, and enroll in MDM.',
        category: 'IT Setup',
        assignedTo: 'Employee',
        validatorRole: 'IT Administrator',
        priority: 'High',
        dueDate: startDate || new Date(Date.now() + 86400000 * 6).toISOString().slice(0, 10)
      },
      {
        id: `${idPrefix}-5`,
        phase: 'Week 1',
        title: 'Mandatory Information Security & Phishing Awareness',
        description: 'Complete the required SOC2 compliance training video and pass the verification assessment.',
        category: 'Compliance',
        assignedTo: 'Employee',
        validatorRole: 'Security Officer',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 10).toISOString().slice(0, 10)
      },
      {
        id: `${idPrefix}-6`,
        phase: 'Week 1',
        title: 'Department Tools & Workspace Onboarding',
        description: `Setup department specific tools for ${department} and review team workflow guidelines.`,
        category: 'Tools & Permissions',
        assignedTo: 'Employee',
        validatorRole: 'Hiring Manager',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 12).toISOString().slice(0, 10)
      },
      {
        id: `${idPrefix}-7`,
        phase: 'Month 1',
        title: '30-Day Check-in & Initial Milestone Review',
        description: 'Review first month progress, 90-day objectives, and gather onboarding feedback.',
        category: 'Management',
        assignedTo: 'Hiring Manager',
        validatorRole: 'Hiring Manager',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10)
      }
    ];

    for (const t of standardTasks) {
      insertTask.run(
        t.id,
        id,
        t.phase,
        t.title,
        t.description,
        t.category,
        t.assignedTo,
        t.validatorRole,
        t.priority,
        t.dueDate,
        'Pending',
        null,
        JSON.stringify({ isValidated: false, validatedBy: null, validatedAt: null, comments: null })
      );
    }

    // 3. Auto-draft Corporate Email Access Request
    const emailReqId = `emr-${Date.now().toString().slice(-4)}`;
    db.prepare(`
      INSERT INTO email_requests (id, employeeId, employeeName, department, requestedEmail, aliasesJson, distributionListsJson, mailboxTier, require2FA, securityEnforcement, status, requestedBy, requestedAt, approvedBy, approvedAt, provisionedAt, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      emailReqId,
      id,
      fullName.trim(),
      department,
      corporateEmail,
      JSON.stringify([`${fullName.toLowerCase().split(' ')[0]}@acmecorp.io`]),
      JSON.stringify(['all-employees@acmecorp.io', `${department.toLowerCase()}-team@acmecorp.io`]),
      'Business Standard (2TB Storage)',
      1,
      'Authenticator App / Passkey',
      'Pending Review',
      'HR Onboarding System',
      createdAt,
      null,
      null,
      null,
      'Auto-generated upon profile creation. Pending IT review.'
    );

    // 4. Auto-populate Department Software Bundle
    const catalogRows = db.prepare('SELECT * FROM software_catalog').all();
    const insertPerm = db.prepare(`
      INSERT INTO software_permissions (id, employeeId, softwareId, softwareName, role, licenseType, status, assignedBy, assignedAt, justification, securityApproval)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const sw of catalogRows) {
      const depts = JSON.parse(sw.defaultDepartmentsJson || '[]');
      if (depts.includes(department)) {
        const roles = JSON.parse(sw.rolesJson || '[]');
        insertPerm.run(
          `perm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          id,
          sw.id,
          sw.name,
          roles[0] || 'Standard Member',
          'Standard Corporate License',
          'Pending Approval',
          'System Automation',
          createdAt,
          `Default tool bundle for ${department} department.`,
          0
        );
      }
    }

    logActivity(
      'Profile Created',
      'HR System',
      `${fullName.trim()} (${jobTitle || 'Team Member'})`,
      `Created profile with 7 milestones and corporate email requested.`
    );
  });

  tx();

  const createdRow = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
  const tasks = db.prepare('SELECT * FROM tasks WHERE employeeId = ?').all(id).map(parseTask);
  res.status(201).json(formatEmployee(createdRow, tasks));
}

export function updateEmployee(req, res) {
  const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const {
    fullName,
    personalEmail,
    corporateEmail,
    jobTitle,
    department,
    seniority,
    manager,
    startDate,
    phone,
    location,
    status,
    hardwarePreference,
    emergencyContact
  } = req.body;

  db.prepare(`
    UPDATE employees SET
      fullName = COALESCE(?, fullName),
      personalEmail = COALESCE(?, personalEmail),
      corporateEmail = COALESCE(?, corporateEmail),
      jobTitle = COALESCE(?, jobTitle),
      department = COALESCE(?, department),
      seniority = COALESCE(?, seniority),
      manager = COALESCE(?, manager),
      startDate = COALESCE(?, startDate),
      phone = COALESCE(?, phone),
      location = COALESCE(?, location),
      status = COALESCE(?, status),
      hardwarePreference = COALESCE(?, hardwarePreference),
      emergencyContactJson = COALESCE(?, emergencyContactJson)
    WHERE id = ?
  `).run(
    fullName,
    personalEmail,
    corporateEmail,
    jobTitle,
    department,
    seniority,
    manager,
    startDate,
    phone,
    location,
    status,
    hardwarePreference,
    emergencyContact ? JSON.stringify(emergencyContact) : null,
    req.params.id
  );

  logActivity(
    'Profile Updated',
    req.body.updatedBy || 'HR Admin',
    fullName || row.fullName,
    'Updated employee profile details.'
  );

  const updatedRow = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
  const tasks = db.prepare('SELECT * FROM tasks WHERE employeeId = ?').all(req.params.id).map(parseTask);
  res.json(formatEmployee(updatedRow, tasks));
}

export function deleteEmployee(req, res) {
  const row = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
  if (!row) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  db.prepare('DELETE FROM employees WHERE id = ?').run(req.params.id);

  logActivity(
    'Profile Deleted',
    'HR Admin',
    row.fullName,
    'Archived employee and removed related onboarding records.'
  );

  res.json({ success: true, message: 'Employee removed successfully' });
}
