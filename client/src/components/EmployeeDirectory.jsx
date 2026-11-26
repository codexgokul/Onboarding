import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Shield, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Laptop, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { DEPARTMENTS } from '../constants/personas';

export default function EmployeeDirectory({
  employees,
  onSelectEmployee,
  onOpenCreateModal,
  onOpenEmailModal,
  onOpenSoftwareModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.corporateEmail && emp.corporateEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Employee Profiles</h1>
          <p className="text-xs text-slate-400">
            Create and track comprehensive new hire records, onboard milestones, and identity provisioning
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Employee Profile</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, role, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>
      </div>

      {/* Employees Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800">
          <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No employee profiles found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new employee profile to start their onboarding journey.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
          >
            Create Profile Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredEmployees.map(emp => {
            const pct = emp.progress?.percentage || 0;
            return (
              <div
                key={emp.id}
                className="rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all p-5 flex flex-col justify-between shadow-sm relative group"
              >
                <div>
                  {/* Top card info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.fullName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {emp.fullName}
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {emp.seniority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          {emp.jobTitle} • <span className="text-indigo-400">{emp.department}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      emp.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : emp.status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {emp.status}
                    </span>
                  </div>

                  {/* Metadata chips */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">Starts {emp.startDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{emp.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate col-span-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate text-slate-300 font-mono text-[11px]">
                        {emp.corporateEmail || 'No corporate email provisioned'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate col-span-2">
                      <Laptop className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="truncate text-[11px] text-slate-400">
                        {emp.hardwarePreference}
                      </span>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">Onboarding Milestones</span>
                      <span className="font-semibold text-white">
                        {pct}% ({emp.progress?.validated || 0}/{emp.progress?.total || 0} validated)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct === 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenEmailModal(emp)}
                      title="Request or Manage Corporate Email"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenSoftwareModal(emp)}
                      title="Assign Software & Tool Permissions"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectEmployee(emp)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>View Roadmap & Tasks</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
