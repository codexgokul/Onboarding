import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Mail, 
  ArrowUpRight, 
  Sparkles,
  AlertCircle,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export default function DashboardOverview({
  stats,
  employees,
  tasks,
  activityLogs,
  setCurrentTab,
  onSelectEmployee,
  onOpenCreateModal
}) {
  const pendingTasks = tasks.filter(t => t.status === 'Under Validation');
  const inProgressEmployees = employees.filter(e => e.status === 'In Progress');

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Context */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-slate-900 border border-indigo-500/20 p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-600/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                System Active
              </span>
              <span className="text-xs text-slate-400">• Automated Onboarding Pipelines</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Employee Onboarding & Access Portal
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              End-to-end new hire setup: profile creation, email provisioning, software permission matrices, milestone task tracking, and verified completion sign-off.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('tasks')}
              className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white text-xs font-semibold border border-slate-700/80 transition-all flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Review Verifications ({pendingTasks.length})</span>
            </button>
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Onboard New Hire</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div 
          onClick={() => setCurrentTab('employees')}
          className="cursor-pointer group p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Onboarding</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stats?.employees?.total || 0}</span>
            <span className="text-xs text-slate-400">employees</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>{stats?.employees?.inProgress || 0} In Progress</span>
            <span className="text-emerald-400 font-medium">{stats?.employees?.completed || 0} Completed</span>
          </div>
        </div>

        {/* Task Completion Rate */}
        <div 
          onClick={() => setCurrentTab('tasks')}
          className="cursor-pointer group p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overall Completion</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stats?.tasks?.completionRate || 0}%</span>
            <span className="text-xs text-slate-400">tasks validated</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>{stats?.tasks?.validated || 0} of {stats?.tasks?.total || 0} milestones signed off</span>
          </div>
        </div>

        {/* Pending Validations */}
        <div 
          onClick={() => setCurrentTab('tasks')}
          className="cursor-pointer group p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending Validation</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-300">{stats?.tasks?.pendingValidation || 0}</span>
            <span className="text-xs text-slate-400">proofs submitted</span>
          </div>
          <div className="mt-2 text-xs text-amber-400/90 pt-2 border-t border-slate-800/80 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Requires reviewer sign-off</span>
          </div>
        </div>

        {/* IT Provisioning Queue */}
        <div 
          onClick={() => setCurrentTab('emails')}
          className="cursor-pointer group p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">IT Access Queue</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stats?.itQueue?.totalPending || 0}</span>
            <span className="text-xs text-slate-400">requests</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>{stats?.itQueue?.pendingEmails || 0} emails</span>
            <span>{stats?.itQueue?.pendingSoftware || 0} permissions</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Onboarding Cohort & Recent Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2 Cols: Active Cohort */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Active Onboarding Cohort</h2>
              <p className="text-xs text-slate-400">Employees currently progressing through their milestones</p>
            </div>
            <button
              onClick={() => setCurrentTab('employees')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View all employees</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {employees.slice(0, 4).map(emp => {
              const pct = emp.progress?.percentage || 0;
              return (
                <div
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp)}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.fullName}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-indigo-500 transition-all"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {emp.fullName}
                          </h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            emp.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {emp.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{emp.jobTitle} • <span className="text-slate-300">{emp.department}</span></p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Manager: {emp.manager}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-white">{pct}%</span>
                      <p className="text-[11px] text-slate-400">
                        {emp.progress?.validated || 0}/{emp.progress?.total || 0} validated
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct === 100
                          ? 'bg-emerald-500'
                          : pct >= 50
                          ? 'bg-indigo-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1 Col: Audit & Activity Log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Validation Audit Trail</h2>
              <p className="text-xs text-slate-400">Live feed of validations & approvals</p>
            </div>
            <button
              onClick={() => setCurrentTab('activity')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Full log
            </button>
          </div>

          <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4 space-y-3.5 max-h-[460px] overflow-y-auto">
            {activityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="text-xs pb-3 border-b border-slate-800/80 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-slate-200 truncate">{log.action}</span>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-indigo-400 font-medium truncate">{log.target}</p>
                <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-2">{log.details}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">by {log.actor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
