import React, { useState } from 'react';
import { Activity, Search, ShieldCheck, CheckCircle2, UserPlus, Mail, Shield, Filter } from 'lucide-react';

export default function ActivityLogView({ activityLogs }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = activityLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">System Audit Trail</h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
              SOC2 & Compliance Ready
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Immutable log of all onboarding events, task validation sign-offs, email provisioning, and access grants.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filteredLogs.length}</span> audit events
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, employee, or detail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden divide-y divide-slate-800">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No audit records match your search.
          </div>
        ) : (
          filteredLogs.map(log => {
            const isValidation = log.action.includes('Validated');
            const isEmail = log.action.includes('Email');
            const isProfile = log.action.includes('Profile');
            const isPermission = log.action.includes('Permission');

            const Icon = isValidation ? CheckCircle2 :
                         isEmail ? Mail :
                         isProfile ? UserPlus :
                         isPermission ? Shield : Activity;

            const iconColor = isValidation ? 'text-emerald-400 bg-emerald-500/10' :
                              isEmail ? 'text-indigo-400 bg-indigo-500/10' :
                              isProfile ? 'text-blue-400 bg-blue-500/10' :
                              'text-purple-400 bg-purple-500/10';

            return (
              <div key={log.id} className="p-4 hover:bg-slate-850/50 transition-colors flex items-start gap-3.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{log.action}</span>
                      <span className="text-xs text-indigo-400 font-semibold">• {log.target}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{log.details}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Triggered by <strong className="text-slate-400">{log.actor}</strong>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
