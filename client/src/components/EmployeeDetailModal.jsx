import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Laptop, 
  Shield, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink,
  Award,
  Sparkles,
  AlertCircle,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EmployeeDetailModal({
  isOpen,
  onClose,
  employee,
  tasks,
  emailRequest,
  permissions,
  currentPersona,
  onOpenSubmitProofModal,
  onOpenValidateModal,
  onOpenSoftwareModal,
  onOpenEmailModal
}) {
  const [activeTab, setActiveTab] = useState('tasks');

  if (!isOpen || !employee) return null;

  const empTasks = tasks.filter(t => t.employeeId === employee.id);
  const totalTasks = empTasks.length;
  const validatedTasks = empTasks.filter(t => t.validation?.isValidated || t.status === 'Validated').length;
  const percentage = totalTasks > 0 ? Math.round((validatedTasks / totalTasks) * 100) : 0;
  const isAllComplete = percentage === 100 && totalTasks > 0;

  const handleCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header with Hero Banner */}
        <div className="p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-start justify-between relative">
          <div className="flex items-start gap-4">
            <img
              src={employee.avatar}
              alt={employee.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-800 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white">{employee.fullName}</h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {employee.seniority}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  isAllComplete
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {employee.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {employee.jobTitle} • <strong className="text-indigo-400">{employee.department}</strong>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Manager: <span className="text-slate-200">{employee.manager}</span> • Starts <span className="text-slate-200">{employee.startDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAllComplete && (
              <button
                onClick={handleCelebrate}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Celebrate!</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-300">Onboarding Health:</span>
            <span className="text-indigo-400 font-bold">{percentage}% Complete</span>
            <span className="text-slate-500">({validatedTasks} of {totalTasks} milestones verified)</span>
          </div>
          <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAllComplete ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 px-6 border-b border-slate-800 bg-slate-900/50">
          {[
            { id: 'tasks', label: `Milestone Tasks (${empTasks.length})` },
            { id: 'email', label: 'Corporate Email Access' },
            { id: 'permissions', label: `Software Tools (${permissions.length})` },
            { id: 'details', label: 'Profile & Hardware Details' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {isAllComplete && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-center gap-3">
                  <Award className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Onboarding Sign-Off Complete! 🎓</h4>
                    <p className="text-xs text-emerald-300">
                      All {totalTasks} milestones have been verified and signed off by HR, IT, and Hiring Management.
                    </p>
                  </div>
                </div>
              )}

              {empTasks.map(task => {
                const isValidated = task.validation?.isValidated || task.status === 'Validated';
                const isUnderValidation = task.status === 'Under Validation';

                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          {task.phase}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {task.category}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Due {task.dueDate}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{task.title}</h4>
                      <p className="text-[11px] text-slate-400">{task.description}</p>

                      {task.proof && (
                        <div className="text-[11px] text-indigo-300 flex items-center gap-1.5 pt-1">
                          <FileText className="w-3 h-3" />
                          <span>Evidence: {task.proof.title}</span>
                          {task.proof.url && (
                            <a href={task.proof.url} target="_blank" rel="noreferrer" className="underline">
                              (View)
                            </a>
                          )}
                        </div>
                      )}

                      {isValidated && task.validation?.validatedBy && (
                        <p className="text-[11px] text-emerald-400 pt-0.5">
                          ✓ Signed by {task.validation.validatedBy} - "{task.validation.comments}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
                      {!isValidated && (
                        <button
                          onClick={() => onOpenSubmitProofModal(task, employee)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                        >
                          Submit Proof
                        </button>
                      )}
                      <button
                        onClick={() => onOpenValidateModal(task, employee)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isValidated
                            ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                            : isUnderValidation
                            ? 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isValidated ? 'Validated' : isUnderValidation ? 'Review & Validate' : 'Verify'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: EMAIL */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              {emailRequest ? (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400">Corporate Email Account</h4>
                      <p className="text-sm font-bold text-white font-mono mt-0.5">
                        {emailRequest.requestedEmail}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      emailRequest.status === 'Provisioned'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {emailRequest.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">Assigned Aliases:</span>
                      <div className="flex flex-wrap gap-1">
                        {emailRequest.aliases?.map((a, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-slate-300">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Mailing Lists:</span>
                      <div className="flex flex-wrap gap-1">
                        {emailRequest.distributionLists?.map((dl, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-indigo-300">
                            {dl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-400 border-t border-slate-800/80">
                    <span>Security Requirement: <strong className="text-slate-200">{emailRequest.securityEnforcement}</strong></span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">No email access request found for this employee.</p>
                  <button
                    onClick={() => onOpenEmailModal(employee)}
                    className="mt-3 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
                  >
                    Request Corporate Email
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SOFTWARE PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Active Licenses & Permissions</span>
                <button
                  onClick={() => onOpenSoftwareModal(employee)}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Tool</span>
                </button>
              </div>

              {permissions.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400">
                  No software permissions assigned yet.
                </div>
              ) : (
                permissions.map(perm => (
                  <div
                    key={perm.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-white">{perm.softwareName}</h4>
                      <p className="text-slate-400 text-[11px]">Role: <strong className="text-indigo-300">{perm.role}</strong> • {perm.licenseType}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                      perm.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {perm.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: PROFILE & HARDWARE */}
          {activeTab === 'details' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-500 block mb-0.5">Personal Email:</span>
                  <span className="text-white font-medium">{employee.personalEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Corporate Email:</span>
                  <span className="text-indigo-300 font-mono">{employee.corporateEmail || 'Not provisioned'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Direct Phone:</span>
                  <span className="text-white font-medium">{employee.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Workplace Location:</span>
                  <span className="text-white font-medium">{employee.location}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block mb-0.5">Hardware & Assets:</span>
                  <span className="text-white font-medium">{employee.hardwarePreference}</span>
                </div>
              </div>

              {employee.emergencyContact && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="font-semibold text-slate-300 mb-2">Emergency Contact</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-slate-500 block">Name:</span>
                      <span className="text-white">{employee.emergencyContact.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Relation:</span>
                      <span className="text-white">{employee.emergencyContact.relation || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Phone:</span>
                      <span className="text-white">{employee.emergencyContact.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
