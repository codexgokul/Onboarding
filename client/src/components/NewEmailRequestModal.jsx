import React, { useState } from 'react';
import { X, Mail, Check, Shield } from 'lucide-react';

export default function NewEmailRequestModal({ isOpen, onClose, employees, defaultEmployee, onSubmit }) {
  const [employeeId, setEmployeeId] = useState(defaultEmployee ? defaultEmployee.id : employees[0]?.id || '');
  const [requestedEmail, setRequestedEmail] = useState('');
  const [alias, setAlias] = useState('');
  const [distributionList, setDistributionList] = useState('all-employees@acmecorp.io, eng-team@acmecorp.io');
  const [mailboxTier, setMailboxTier] = useState('Business Standard (2TB Storage)');
  const [require2FA, setRequire2FA] = useState(true);
  const [securityEnforcement, setSecurityEnforcement] = useState('Authenticator App / Passkey');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update requested email automatically when employee selection changes
  React.useEffect(() => {
    const emp = employees.find(e => e.id === employeeId);
    if (emp) {
      const clean = emp.fullName.toLowerCase().trim().replace(/[^a-z0-9]/g, '.');
      setRequestedEmail(`${clean}@acmecorp.io`);
      setAlias(`${emp.fullName.toLowerCase().split(' ')[0]}@acmecorp.io`);
    }
  }, [employeeId, employees]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestedEmail.trim()) {
      setError('Please provide the requested corporate email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit({
        employeeId,
        requestedEmail: requestedEmail.trim(),
        aliases: alias ? alias.split(',').map(s => s.trim()).filter(Boolean) : [],
        distributionLists: distributionList.split(',').map(s => s.trim()).filter(Boolean),
        mailboxTier,
        require2FA,
        securityEnforcement,
        notes: notes.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit email access request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Request Corporate Email Access</h2>
              <p className="text-xs text-slate-400">Configure mailbox, security policies, and group memberships</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Select Employee */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Employee *
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.department} - {emp.jobTitle})
                </option>
              ))}
            </select>
          </div>

          {/* Requested Corporate Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Primary Corporate Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. sarah.jenkins@acmecorp.io"
              value={requestedEmail}
              onChange={(e) => setRequestedEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Aliases */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Secondary Aliases (comma separated)
            </label>
            <input
              type="text"
              placeholder="sjenkins@acmecorp.io, sarah.j@acmecorp.io"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Distribution Lists */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Distribution Groups (comma separated)
            </label>
            <input
              type="text"
              placeholder="all-employees@acmecorp.io, eng-team@acmecorp.io"
              value={distributionList}
              onChange={(e) => setDistributionList(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white text-[11px] focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Mailbox Tier */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mailbox Storage Tier
              </label>
              <select
                value={mailboxTier}
                onChange={(e) => setMailboxTier(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Business Starter (30GB)">Business Starter (30GB)</option>
                <option value="Business Standard (2TB Storage)">Business Standard (2TB Storage)</option>
                <option value="Enterprise Plus (Unlimited Vault)">Enterprise Plus (Unlimited Vault)</option>
              </select>
            </div>

            {/* Security Enforcement */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Security Policy Enforcement
              </label>
              <select
                value={securityEnforcement}
                onChange={(e) => setSecurityEnforcement(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Authenticator App / Passkey">Authenticator App / Passkey</option>
                <option value="Hardware FIDO2 Security Key Mandatory">Hardware FIDO2 Key Mandatory</option>
                <option value="SMS / Push Notification 2FA">SMS / Push Notification 2FA</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notes for IT Admin
            </label>
            <textarea
              rows={2}
              placeholder="Any special mailbox aliases, delegator access, or migration requests..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Submit Email Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
