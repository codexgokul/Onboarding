import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Search, 
  Calendar, 
  User, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { ONBOARDING_PHASES } from '../constants/personas';

export default function TaskTrackingHub({
  tasks,
  employees,
  currentPersona,
  onOpenCreateTaskModal,
  onOpenSubmitProofModal,
  onOpenValidateModal
}) {
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => {
    const emp = employees.find(e => e.id === task.employeeId);
    const empName = emp ? emp.fullName : '';

    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPhase = selectedPhase === 'All' || task.phase === selectedPhase;
    const matchesEmp = selectedEmployeeId === 'All' || task.employeeId === selectedEmployeeId;
    const matchesStatus = selectedStatus === 'All' || task.status === selectedStatus;

    return matchesSearch && matchesPhase && matchesEmp && matchesStatus;
  });

  const totalCount = filteredTasks.length;
  const validatedCount = filteredTasks.filter(t => t.validation?.isValidated || t.status === 'Validated').length;
  const pendingReviewCount = filteredTasks.filter(t => t.status === 'Under Validation').length;
  const remainingCount = totalCount - validatedCount;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Onboarding Tasks & Milestone Validation</h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
              Verified Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Track onboarding progression by phase, inspect submitted completion evidence, and validate deliverables.
          </p>
        </div>

        <button
          onClick={onOpenCreateTaskModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task Milestone</span>
        </button>
      </div>

      {/* Phase Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedPhase('All')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            selectedPhase === 'All'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          All Phases ({tasks.length})
        </button>
        {ONBOARDING_PHASES.map(phase => {
          const count = tasks.filter(t => t.phase === phase).length;
          const isSelected = selectedPhase === phase;
          return (
            <button
              key={phase}
              onClick={() => setSelectedPhase(phase)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <span>{phase}</span>
              <span className="ml-1.5 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks by title, criteria, or assignee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Employee Filter */}
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All New Hires</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.fullName}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Under Validation">Under Validation (Action Needed)</option>
            <option value="Validated">Validated (Signed Off)</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Total Filtered</span>
          <span className="font-bold text-white">{totalCount}</span>
        </div>
        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
          <span className="text-emerald-400">Validated</span>
          <span className="font-bold text-emerald-300">{validatedCount}</span>
        </div>
        <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 flex items-center justify-between">
          <span className="text-amber-400">Under Review</span>
          <span className="font-bold text-amber-300">{pendingReviewCount}</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Remaining</span>
          <span className="font-bold text-slate-300">{remainingCount}</span>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800">
            <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No tasks match selected filters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Change the phase or employee filter to see more milestones, or create a custom task.
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const emp = employees.find(e => e.id === task.employeeId);
            const isValidated = task.validation?.isValidated || task.status === 'Validated';
            const isUnderValidation = task.status === 'Under Validation';
            const priorityColor = 
              task.priority === 'High' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
              task.priority === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
              'text-slate-400 bg-slate-800 border-slate-700';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all shadow-sm ${
                  isUnderValidation
                    ? 'bg-slate-900/90 border-amber-500/40 shadow-amber-500/5'
                    : isValidated
                    ? 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Task info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      {/* Phase Badge */}
                      <span className="px-2 py-0.5 rounded font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {task.phase}
                      </span>
                      {/* Category Badge */}
                      <span className="px-2 py-0.5 rounded font-medium bg-slate-800 text-slate-300">
                        {task.category}
                      </span>
                      {/* Priority Badge */}
                      <span className={`px-2 py-0.5 rounded font-semibold border ${priorityColor}`}>
                        {task.priority} Priority
                      </span>
                      {/* Due Date */}
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        Due {task.dueDate}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{task.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                    </div>

                    {/* Assignee & Validator metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                      {emp && (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={emp.avatar}
                            alt={emp.fullName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-slate-300">
                            Employee: <strong className="text-white">{emp.fullName}</strong> ({emp.department})
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Sign-off: <strong className="text-slate-300">{task.validatorRole}</strong></span>
                      </div>
                    </div>

                    {/* Submitted Evidence Box (if any) */}
                    {task.proof && (
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-2.5 text-xs">
                        <FileText className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200 truncate">{task.proof.title}</span>
                            <span className="text-[10px] text-slate-500 uppercase">({task.proof.type})</span>
                          </div>
                          {task.proof.notes && (
                            <p className="text-[11px] text-slate-400 mt-0.5 italic">
                              "{task.proof.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Validated Signature Box (if validated) */}
                    {isValidated && task.validation?.validatedBy && (
                      <div className="mt-2 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">
                            Signed off by {task.validation.validatedBy}
                            {task.validation.validatedAt && (
                              <span className="font-normal text-emerald-400/80 ml-1.5 text-[11px]">
                                on {new Date(task.validation.validatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {task.validation.comments && (
                            <p className="text-[11px] text-emerald-200/90 mt-0.5">
                              "{task.validation.comments}"
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Status & Action Buttons */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 flex-shrink-0">
                    {/* Status Badge */}
                    <div>
                      {isValidated ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Validated
                        </span>
                      ) : isUnderValidation ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          Under Validation
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          <Clock className="w-3.5 h-3.5" />
                          {task.status}
                        </span>
                      )}
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Submit Proof (Assignee action) */}
                      {!isValidated && (
                        <button
                          onClick={() => onOpenSubmitProofModal(task, emp)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{isUnderValidation ? 'Update Proof' : 'Submit Proof'}</span>
                        </button>
                      )}

                      {/* Review & Validate (Reviewer action) */}
                      <button
                        onClick={() => onOpenValidateModal(task, emp)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
                          isUnderValidation
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 font-bold'
                            : isValidated
                            ? 'bg-slate-800/80 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isValidated ? 'Review Sign-off' : isUnderValidation ? 'Validate Proof' : 'Verify'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
