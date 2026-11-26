import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Key, 
  Search, 
  Check, 
  Filter,
  ExternalLink,
  Code2,
  MessageSquare,
  Mail,
  CheckSquare,
  PenTool,
  Cloud,
  BookOpen,
  Activity,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const ICON_MAP = {
  MessageSquare,
  Mail,
  Code2,
  CheckSquare,
  PenTool,
  Cloud,
  BookOpen,
  ShieldCheck,
  Activity
};

export default function SoftwarePermissionsHub({
  permissions,
  softwareCatalog,
  employees,
  currentPersona,
  onOpenAssignModal,
  onUpdatePermissionStatus,
  onRevokePermission
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredPermissions = permissions.filter(perm => {
    const emp = employees.find(e => e.id === perm.employeeId);
    const empName = emp ? emp.fullName : '';
    const matchesSearch = 
      perm.softwareName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTool = selectedTool === 'All' || perm.softwareId === selectedTool;
    const matchesStatus = selectedStatus === 'All' || perm.status === selectedStatus;

    return matchesSearch && matchesTool && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Software Permissions & Tool Access</h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
              Access Matrix & Licensing
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Grant enterprise tool seats, manage role-based access control (RBAC), and review security clearances.
          </p>
        </div>

        <button
          onClick={onOpenAssignModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Tool Permission</span>
        </button>
      </div>

      {/* Software Catalog Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {softwareCatalog.slice(0, 5).map(sw => {
          const Icon = ICON_MAP[sw.icon] || Shield;
          const assignedCount = permissions.filter(p => p.softwareId === sw.id && p.status === 'Active').length;
          return (
            <div 
              key={sw.id}
              onClick={() => setSelectedTool(selectedTool === sw.id ? 'All' : sw.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedTool === sw.id 
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {assignedCount} seats
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{sw.name}</h4>
              <p className="text-[11px] text-slate-400 truncate">{sw.category}</p>
            </div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search permissions by employee name, software tool, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Software Tools</option>
            {softwareCatalog.map(sw => (
              <option key={sw.id} value={sw.id}>{sw.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending Approval">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Permissions Table / Cards */}
      <div className="space-y-3">
        {filteredPermissions.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800">
            <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No permissions match filters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Assign software permissions to equip employees with their development, design, and productivity tools.
            </p>
          </div>
        ) : (
          filteredPermissions.map(perm => {
            const emp = employees.find(e => e.id === perm.employeeId);
            const isActive = perm.status === 'Active';
            const isPending = perm.status === 'Pending Approval';

            return (
              <div
                key={perm.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                {/* Left: Employee + Tool Info */}
                <div className="flex items-start sm:items-center gap-3.5">
                  {emp ? (
                    <img
                      src={emp.avatar}
                      alt={emp.fullName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                      <Shield className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {emp ? emp.fullName : 'Employee'}
                      </h4>
                      <span className="text-[10px] text-slate-400">• {emp?.department}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-indigo-300">
                        {perm.softwareName}
                      </span>
                      <span className="text-slate-600">/</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Role: {perm.role}
                      </span>
                      {perm.licenseType && (
                        <span className="text-[11px] text-slate-500">
                          ({perm.licenseType})
                        </span>
                      )}
                    </div>

                    {perm.justification && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        Justification: "{perm.justification}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Security Badge & IT Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      <span>{perm.status}</span>
                    </span>

                    {/* Security Clearance Tag */}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                      perm.securityApproval 
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' 
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {perm.securityApproval ? 'SecOps Cleared' : 'SecOps Pending'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {isPending && (
                      <button
                        onClick={() => onUpdatePermissionStatus(perm.id, {
                          status: 'Active',
                          securityApproval: true,
                          approverName: currentPersona.name
                        })}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center gap-1"
                        title="Approve access and provision license"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Provision</span>
                      </button>
                    )}

                    <button
                      onClick={() => onRevokePermission(perm.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700/80 transition-colors"
                      title="Revoke Permission"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
