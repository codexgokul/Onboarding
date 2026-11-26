import React, { useState } from 'react';
import { 
  Mail, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Shield, 
  Key, 
  Send, 
  AlertCircle,
  Copy,
  ExternalLink,
  Users,
  Search,
  Check
} from 'lucide-react';

export default function EmailAccessHub({
  emailRequests,
  employees,
  currentPersona,
  onOpenNewEmailModal,
  onUpdateEmailStatus
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const isIT = currentPersona.roleType === 'IT' || currentPersona.roleType === 'HR';

  const filteredRequests = emailRequests.filter(req => {
    const matchesSearch = 
      req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requestedEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || req.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCopyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Email Access Management</h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
              Google Workspace & Exchange
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Request corporate email accounts, configure secondary aliases, assign distribution lists, and enforce 2FA/FIDO2 security.
          </p>
        </div>

        <button
          onClick={onOpenNewEmailModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Email Request</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email requests by employee, address, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Provisioned">Provisioned</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800">
            <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No email access requests found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Requests are automatically generated when employee profiles are created or can be submitted manually.
            </p>
          </div>
        ) : (
          filteredRequests.map(req => {
            const isProvisioned = req.status === 'Provisioned';
            const isApproved = req.status === 'Approved';
            const isPending = req.status === 'Pending Review' || req.status === 'Requested';

            return (
              <div
                key={req.id}
                className="rounded-xl bg-slate-900/70 border border-slate-800 p-5 space-y-4 shadow-sm"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{req.employeeName}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {req.department}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono text-indigo-300 font-semibold">
                          {req.requestedEmail}
                        </span>
                        <button
                          onClick={() => handleCopyEmail(req.requestedEmail, req.id)}
                          className="text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copy email address"
                        >
                          {copiedId === req.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                      isProvisioned
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isApproved
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : req.status === 'Rejected'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {isProvisioned && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isPending && <Clock className="w-3.5 h-3.5" />}
                      <span>{req.status}</span>
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                  {/* Aliases */}
                  <div>
                    <span className="text-slate-500 font-medium block mb-1">Corporate Aliases</span>
                    {req.aliases && req.aliases.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {req.aliases.map((alias, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                            {alias}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-600">None assigned</span>
                    )}
                  </div>

                  {/* Distribution Lists */}
                  <div>
                    <span className="text-slate-500 font-medium block mb-1">Distribution Lists (Google Groups)</span>
                    {req.distributionLists && req.distributionLists.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {req.distributionLists.map((dl, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800/90 text-indigo-300 text-[11px]">
                            {dl}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-600">Standard all-employees only</span>
                    )}
                  </div>

                  {/* Security Tier */}
                  <div>
                    <span className="text-slate-500 font-medium block mb-1">Security & Storage Tier</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Key className="w-3 h-3 text-amber-400" />
                        <span>{req.mailboxTier || 'Standard Business'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span>{req.securityEnforcement || '2FA Mandatory'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footnote / IT Notes & Approver Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-400">
                    {req.notes && (
                      <p className="text-slate-400 italic">
                        Note: {req.notes}
                      </p>
                    )}
                    <span className="text-slate-500">
                      Requested {new Date(req.requestedAt).toLocaleDateString()} by {req.requestedBy}
                      {req.approvedBy && ` • Approved by ${req.approvedBy}`}
                    </span>
                  </div>

                  {/* IT Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {isPending && (
                      <>
                        <button
                          onClick={() => onUpdateEmailStatus(req.id, 'Approved', 'Marcus Shaw (IT Lead)', 'Approved for provisioning.')}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Request</span>
                        </button>
                        <button
                          onClick={() => onUpdateEmailStatus(req.id, 'Rejected', 'Marcus Shaw (IT Lead)', 'Alias conflict or unauthorized format.')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700 text-xs font-medium transition-all"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {isApproved && !isProvisioned && (
                      <button
                        onClick={() => onUpdateEmailStatus(req.id, 'Provisioned', 'Marcus Shaw (IT Lead)', 'Provisioned on Google Admin console with welcome invite sent.')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Provision Mailbox & Send Invite</span>
                      </button>
                    )}

                    {isProvisioned && (
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Live & Active</span>
                      </span>
                    )}
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
