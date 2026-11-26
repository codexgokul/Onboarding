import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from './services/api';
import { PERSONAS } from './constants/personas';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import EmployeeDirectory from './components/EmployeeDirectory';
import EmailAccessHub from './components/EmailAccessHub';
import SoftwarePermissionsHub from './components/SoftwarePermissionsHub';
import TaskTrackingHub from './components/TaskTrackingHub';
import ActivityLogView from './components/ActivityLogView';
import CreateEmployeeModal from './components/CreateEmployeeModal';
import CreateTaskModal from './components/CreateTaskModal';
import NewEmailRequestModal from './components/NewEmailRequestModal';
import AssignSoftwareModal from './components/AssignSoftwareModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import TaskSubmitProofModal from './components/TaskSubmitProofModal';
import TaskValidationModal from './components/TaskValidationModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentPersona, setCurrentPersona] = useState(PERSONAS[0]); // Default to HR Admin

  // Data states
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [emailRequests, setEmailRequests] = useState([]);
  const [softwareCatalog, setSoftwareCatalog] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [createEmployeeModalOpen, setCreateEmployeeModalOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [softwareModalOpen, setSoftwareModalOpen] = useState(false);
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState(null);

  const [submitProofModalOpen, setSubmitProofModalOpen] = useState(false);
  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [activeTaskForModal, setActiveTaskForModal] = useState(null);
  const [activeEmployeeForTaskModal, setActiveEmployeeForTaskModal] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAllData = async () => {
    try {
      const [
        statsRes,
        employeesRes,
        tasksRes,
        emailsRes,
        catalogRes,
        permsRes,
        logsRes
      ] = await Promise.all([
        api.getStats(),
        api.getEmployees(),
        api.getTasks(),
        api.getEmailRequests(),
        api.getSoftwareCatalog(),
        api.getPermissions(),
        api.getActivityLogs()
      ]);

      setStats(statsRes);
      setEmployees(employeesRes);
      setTasks(tasksRes);
      setEmailRequests(emailsRes);
      setSoftwareCatalog(catalogRes);
      setPermissions(permsRes);
      setActivityLogs(logsRes);

      // If detail modal is open, keep selected employee updated
      if (selectedEmployeeForDetail) {
        const updated = employeesRes.find(e => e.id === selectedEmployeeForDetail.id);
        if (updated) setSelectedEmployeeForDetail(updated);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      showToast('Error syncing with backend server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleCreateEmployee = async (formData) => {
    const newEmp = await api.createEmployee(formData);
    showToast(`Profile created for ${newEmp.fullName} with tasks & email request initialized!`);
    await loadAllData();
  };

  const handleCreateTask = async (taskData) => {
    const newTask = await api.createTask(taskData);
    showToast(`Task "${newTask.title}" added successfully!`);
    await loadAllData();
  };

  const handleSubmitProof = async (taskId, proofData) => {
    await api.submitTaskProof(taskId, proofData);
    showToast('Task evidence submitted for validation!');
    await loadAllData();
  };

  const handleValidateTask = async (taskId, validationData) => {
    const updated = await api.validateTask(taskId, validationData);
    if (validationData.isValidated) {
      showToast(`Task validated: "${updated.title}" signed off!`);
      // Trigger confetti if employee hit 100%
      const emp = employees.find(e => e.id === updated.employeeId);
      if (emp) {
        const empTasks = tasks.filter(t => t.employeeId === emp.id);
        const unvalidatedOthers = empTasks.filter(t => t.id !== taskId && !t.validation?.isValidated);
        if (unvalidatedOthers.length === 0) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
          showToast(`🎉 Congratulations! ${emp.fullName} has completed 100% of their onboarding!`);
        }
      }
    } else {
      showToast(`Task returned for revisions with reviewer comments.`, 'info');
    }
    await loadAllData();
  };

  const handleNewEmailRequest = async (emailData) => {
    await api.createEmailRequest(emailData);
    showToast(`Email request submitted for ${emailData.requestedEmail}`);
    await loadAllData();
  };

  const handleUpdateEmailStatus = async (id, status, approverName, notes) => {
    await api.updateEmailStatus(id, { status, approverName, notes });
    showToast(`Email request updated to ${status}`);
    await loadAllData();
  };

  const handleAssignSoftware = async (permData) => {
    await api.assignPermission(permData);
    showToast(`Assigned ${permData.softwareName} (${permData.role})`);
    await loadAllData();
  };

  const handleUpdatePermissionStatus = async (id, statusData) => {
    await api.updatePermissionStatus(id, statusData);
    showToast(`Software permission updated!`);
    await loadAllData();
  };

  const handleRevokePermission = async (id) => {
    if (confirm('Are you sure you want to revoke this software permission?')) {
      await api.revokePermission(id);
      showToast('Software permission revoked.');
      await loadAllData();
    }
  };

  // Open helper modals
  const handleOpenEmailModal = (emp) => {
    setSelectedEmployeeForModal(emp);
    setEmailModalOpen(true);
  };

  const handleOpenSoftwareModal = (emp) => {
    setSelectedEmployeeForModal(emp);
    setSoftwareModalOpen(true);
  };

  const handleSelectEmployeeDetail = (emp) => {
    setSelectedEmployeeForDetail(emp);
    setDetailModalOpen(true);
  };

  const handleOpenSubmitProofModal = (task, emp) => {
    setActiveTaskForModal(task);
    setActiveEmployeeForTaskModal(emp || employees.find(e => e.id === task.employeeId));
    setSubmitProofModalOpen(true);
  };

  const handleOpenValidateModal = (task, emp) => {
    setActiveTaskForModal(task);
    setActiveEmployeeForTaskModal(emp || employees.find(e => e.id === task.employeeId));
    setValidateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold animate-bounce bg-slate-900 border-indigo-500/50 text-white">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentPersona={currentPersona}
        setCurrentPersona={setCurrentPersona}
        onOpenCreateModal={() => setCreateEmployeeModalOpen(true)}
        stats={stats}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading onboarding system...</p>
          </div>
        ) : (
          <>
            {/* Persona Quick Status Pill */}
            <div className="mb-4 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>Acting as:</span>
                <strong className="text-white">{currentPersona.name}</strong>
                <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded font-medium">
                  {currentPersona.badge}
                </span>
                <span className="hidden sm:inline text-slate-500">
                  — {currentPersona.description}
                </span>
              </div>
              <button
                onClick={() => setCurrentTab('activity')}
                className="text-indigo-400 hover:text-indigo-300 font-medium text-[11px]"
              >
                Audit Stream
              </button>
            </div>

            {/* View Switcher */}
            {currentTab === 'dashboard' && (
              <DashboardOverview
                stats={stats}
                employees={employees}
                tasks={tasks}
                activityLogs={activityLogs}
                setCurrentTab={setCurrentTab}
                onSelectEmployee={handleSelectEmployeeDetail}
                onOpenCreateModal={() => setCreateEmployeeModalOpen(true)}
              />
            )}

            {currentTab === 'employees' && (
              <EmployeeDirectory
                employees={employees}
                onSelectEmployee={handleSelectEmployeeDetail}
                onOpenCreateModal={() => setCreateEmployeeModalOpen(true)}
                onOpenEmailModal={handleOpenEmailModal}
                onOpenSoftwareModal={handleOpenSoftwareModal}
              />
            )}

            {currentTab === 'tasks' && (
              <TaskTrackingHub
                tasks={tasks}
                employees={employees}
                currentPersona={currentPersona}
                onOpenCreateTaskModal={() => setCreateTaskModalOpen(true)}
                onOpenSubmitProofModal={handleOpenSubmitProofModal}
                onOpenValidateModal={handleOpenValidateModal}
              />
            )}

            {currentTab === 'emails' && (
              <EmailAccessHub
                emailRequests={emailRequests}
                employees={employees}
                currentPersona={currentPersona}
                onOpenNewEmailModal={() => {
                  setSelectedEmployeeForModal(null);
                  setEmailModalOpen(true);
                }}
                onUpdateEmailStatus={handleUpdateEmailStatus}
              />
            )}

            {currentTab === 'permissions' && (
              <SoftwarePermissionsHub
                permissions={permissions}
                softwareCatalog={softwareCatalog}
                employees={employees}
                currentPersona={currentPersona}
                onOpenAssignModal={() => {
                  setSelectedEmployeeForModal(null);
                  setSoftwareModalOpen(true);
                }}
                onUpdatePermissionStatus={handleUpdatePermissionStatus}
                onRevokePermission={handleRevokePermission}
              />
            )}

            {currentTab === 'activity' && (
              <ActivityLogView activityLogs={activityLogs} />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <CreateEmployeeModal
        isOpen={createEmployeeModalOpen}
        onClose={() => setCreateEmployeeModalOpen(false)}
        onCreate={handleCreateEmployee}
      />

      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        employees={employees}
        onAddTask={handleCreateTask}
      />

      <NewEmailRequestModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        employees={employees}
        defaultEmployee={selectedEmployeeForModal}
        onSubmit={handleNewEmailRequest}
      />

      <AssignSoftwareModal
        isOpen={softwareModalOpen}
        onClose={() => setSoftwareModalOpen(false)}
        employees={employees}
        softwareCatalog={softwareCatalog}
        defaultEmployee={selectedEmployeeForModal}
        onAssign={handleAssignSoftware}
      />

      <EmployeeDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        employee={selectedEmployeeForDetail}
        tasks={tasks}
        emailRequest={emailRequests.find(r => r.employeeId === selectedEmployeeForDetail?.id)}
        permissions={permissions.filter(p => p.employeeId === selectedEmployeeForDetail?.id)}
        currentPersona={currentPersona}
        onOpenSubmitProofModal={handleOpenSubmitProofModal}
        onOpenValidateModal={handleOpenValidateModal}
        onOpenSoftwareModal={handleOpenSoftwareModal}
        onOpenEmailModal={handleOpenEmailModal}
      />

      <TaskSubmitProofModal
        isOpen={submitProofModalOpen}
        onClose={() => setSubmitProofModalOpen(false)}
        task={activeTaskForModal}
        employee={activeEmployeeForTaskModal}
        onSubmitProof={handleSubmitProof}
      />

      <TaskValidationModal
        isOpen={validateModalOpen}
        onClose={() => setValidateModalOpen(false)}
        task={activeTaskForModal}
        employee={activeEmployeeForTaskModal}
        currentPersona={currentPersona}
        onValidate={handleValidateTask}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>TalentFlow Employee Onboarding System • All 5 Core Capabilities Configured</p>
      </footer>
    </div>
  );
}
