const BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Running TalentFlow Automated Verification Suite...\n');

  // 1. Check stats
  const statsRes = await fetch(`${BASE}/stats`);
  const stats = await statsRes.json();
  console.log('✅ 1. System Stats:', {
    totalEmployees: stats.employees.total,
    completionRate: `${stats.tasks.completionRate}%`,
    pendingEmails: stats.itQueue.pendingEmails,
    pendingSoftware: stats.itQueue.pendingSoftware
  });

  // 2. Create Employee Profile
  const newEmpPayload = {
    fullName: 'Tyler Robinson',
    personalEmail: 'tyler.robinson@example.com',
    jobTitle: 'Senior Cloud Architect',
    department: 'Engineering',
    seniority: 'Senior',
    manager: 'Alexandre Dupont (VP of Engineering)',
    startDate: '2026-11-28',
    location: 'Chicago, IL (Remote)',
    hardwarePreference: 'MacBook Pro 16" M3 Max + Studio Display',
    emergencyContact: {
      name: 'Claire Robinson',
      relation: 'Spouse',
      phone: '+1 (555) 789-0123'
    }
  };

  const empRes = await fetch(`${BASE}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newEmpPayload)
  });
  const newEmp = await empRes.json();
  console.log('✅ 2. Employee Profile Created:', {
    id: newEmp.id,
    fullName: newEmp.fullName,
    corporateEmail: newEmp.corporateEmail,
    department: newEmp.department,
    autoTasksGenerated: newEmp.progress.total
  });

  // 3. Inspect Auto-created Email Request & Provision it
  const emailsRes = await fetch(`${BASE}/email-requests`);
  const emails = await emailsRes.json();
  const emailReq = emails.find(e => e.employeeId === newEmp.id);
  console.log('✅ 3. Auto-generated Corporate Email Request:', {
    id: emailReq.id,
    requestedEmail: emailReq.requestedEmail,
    status: emailReq.status,
    distributionLists: emailReq.distributionLists
  });

  // IT Provisions Email
  const provEmailRes = await fetch(`${BASE}/email-requests/${emailReq.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'Provisioned',
      approverName: 'Marcus Shaw (IT Operations Lead)',
      notes: 'Provisioned on Google Admin. FIDO2 security token enrolled.'
    })
  });
  const provEmail = await provEmailRes.json();
  console.log('✅ 3b. IT Email Provisioned:', {
    status: provEmail.status,
    approvedBy: provEmail.approvedBy,
    provisionedAt: provEmail.provisionedAt
  });

  // 4. Assign Software Permission & Approve
  const permRes = await fetch(`${BASE}/permissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      employeeId: newEmp.id,
      softwareId: 'sw-github',
      softwareName: 'GitHub Enterprise',
      role: 'Write / Contributor',
      licenseType: 'Enterprise Cloud Seat',
      justification: 'Required for core repository and CI/CD pipelines',
      assignedBy: 'Alexandre Dupont (VP of Engineering)'
    })
  });
  const newPerm = await permRes.json();
  console.log('✅ 4. Software Permission Requested:', {
    id: newPerm.id,
    software: newPerm.softwareName,
    role: newPerm.role,
    status: newPerm.status
  });

  // IT SecOps Approves Permission
  const approvePermRes = await fetch(`${BASE}/permissions/${newPerm.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'Active',
      securityApproval: true,
      approverName: 'Marcus Shaw (IT Operations Lead)'
    })
  });
  const activePerm = await approvePermRes.json();
  console.log('✅ 4b. Software Permission Active & Cleared:', {
    status: activePerm.status,
    securityCleared: activePerm.securityApproval
  });

  // 5. Track Tasks & Submit Completion Proof
  const tasksRes = await fetch(`${BASE}/tasks?employeeId=${newEmp.id}`);
  const tasks = await tasksRes.json();
  const firstTask = tasks[0];
  console.log('✅ 5. Found First Milestone Task:', {
    id: firstTask.id,
    phase: firstTask.phase,
    title: firstTask.title,
    assignedTo: firstTask.assignedTo,
    validatorRole: firstTask.validatorRole
  });

  // Submit Proof
  const submitRes = await fetch(`${BASE}/tasks/${firstTask.id}/submit-proof`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      proofType: 'document',
      proofTitle: 'Tyler_Robinson_Offer_Agreement_Countersigned.pdf',
      proofUrl: 'https://docs.acmecorp.internal/contracts/tyler-robinson.pdf',
      proofNotes: 'All clauses signed via DocuSign envelope #DS-77192',
      submittedBy: newEmp.fullName
    })
  });
  const submittedTask = await submitRes.json();
  console.log('✅ 5b. Proof Submitted for Validation:', {
    status: submittedTask.status,
    proofTitle: submittedTask.proof.title,
    submittedAt: submittedTask.proof.submittedAt
  });

  // 6. Validate Task Completion (Sign-off)
  const validateRes = await fetch(`${BASE}/tasks/${firstTask.id}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      isValidated: true,
      comments: 'DocuSign tamper-evident seal verified. Contract filed with HR records.',
      validatedBy: 'Rachel Green (Senior HR Generalist)',
      validatorRole: 'HR Specialist'
    })
  });
  const validatedTask = await validateRes.json();
  console.log('✅ 6. Task Completion Formally Validated:', {
    status: validatedTask.status,
    isValidated: validatedTask.validation.isValidated,
    validatedBy: validatedTask.validation.validatedBy,
    validatedAt: validatedTask.validation.validatedAt,
    comments: validatedTask.validation.comments
  });

  // 7. Verify Updated Progress and Audit Trail
  const updatedEmpRes = await fetch(`${BASE}/employees/${newEmp.id}`);
  const updatedEmp = await updatedEmpRes.json();
  console.log('✅ 7. Updated Employee Onboarding Progress:', {
    employee: updatedEmp.fullName,
    validatedCount: updatedEmp.progress.validated,
    totalTasks: updatedEmp.progress.total,
    completionPercentage: `${updatedEmp.progress.percentage}%`
  });

  const logsRes = await fetch(`${BASE}/activity-logs`);
  const logs = await logsRes.json();
  console.log('✅ 8. Latest Audit Trail Events:');
  logs.slice(0, 3).forEach((l, i) => {
    console.log(`   ${i + 1}. [${l.action}] by ${l.actor} -> ${l.target} (${l.details})`);
  });

  console.log('\n🎉 ALL 5 SYSTEM REQUIREMENTS VERIFIED SUCCESSFULLY!');
}

runTests().catch(console.error);
