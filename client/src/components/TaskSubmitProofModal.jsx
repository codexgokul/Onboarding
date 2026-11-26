import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, FileText, CheckCircle2, Shield } from 'lucide-react';

export default function TaskSubmitProofModal({ isOpen, onClose, task, employee, onSubmitProof }) {
  const [proofType, setProofType] = useState('document');
  const [proofTitle, setProofTitle] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofTitle.trim()) {
      setError('Please provide a proof title or document name.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmitProof(task.id, {
        proofType,
        proofTitle: proofTitle.trim(),
        proofUrl: proofUrl.trim(),
        proofNotes: proofNotes.trim(),
        submittedBy: employee?.fullName || 'Employee'
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit proof.');
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
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Submit Task Proof</h2>
              <p className="text-xs text-slate-400">Provide verification evidence for reviewer sign-off</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Summary Banner */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800/80">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-0.5">
            Milestone Task
          </span>
          <h4 className="text-xs font-bold text-white">{task.title}</h4>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
            <span>Validator: <strong className="text-slate-300">{task.validatorRole}</strong></span>
            <span>•</span>
            <span>Assignee: <strong className="text-indigo-400">{employee?.fullName}</strong></span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Proof Type selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Evidence / Proof Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'document', label: 'Document / PDF', icon: FileText },
                { id: 'screenshot', label: 'Screenshot / 2FA', icon: Shield },
                { id: 'link', label: 'Web Link / PR', icon: LinkIcon }
              ].map(t => {
                const Icon = t.icon;
                const isSel = proofType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setProofType(t.id)}
                    className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      isSel
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Proof Title / File Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Document / Proof Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Signed_Offer_Letter_2026.pdf or YubiKey_2FA_Confirmation"
              value={proofTitle}
              onChange={(e) => setProofTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Proof URL / Reference Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              URL / Cloud Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://docs.company.internal/contracts/contract-01.pdf"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submission Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Completion Notes & Context
            </label>
            <textarea
              rows={3}
              placeholder="Provide details on how the task was completed for the validator..."
              value={proofNotes}
              onChange={(e) => setProofNotes(e.target.value)}
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
              {loading ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit for Verification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
