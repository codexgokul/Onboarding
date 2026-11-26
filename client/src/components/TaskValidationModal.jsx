import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  FileCheck2, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';

export default function TaskValidationModal({ 
  isOpen, 
  onClose, 
  task, 
  employee, 
  currentPersona, 
  onValidate 
}) {
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !task) return null;

  const handleDecision = async (isValidated) => {
    try {
      setLoading(true);
      setError('');
      await onValidate(task.id, {
        isValidated,
        comments: comments.trim() || (isValidated ? 'Verification confirmed. Task marked complete.' : 'Revisions requested.'),
        validatedBy: `${currentPersona.name} (${currentPersona.roleTitle})`,
        validatorRole: currentPersona.badge
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update validation.');
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
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Validate Task Completion</h2>
              <p className="text-xs text-slate-400">Review evidence and sign off on completion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task & Assignee Card */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              {task.phase} • {task.category}
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">{task.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{task.description}</p>
          </div>

          {/* Submitted Proof Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Submitted Evidence
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                Under Validation
              </span>
            </div>

            {task.proof ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{task.proof.title}</span>
                  <span className="text-[10px] text-slate-500 uppercase">{task.proof.type}</span>
                </div>

                {task.proof.url && (
                  <a
                    href={task.proof.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 underline break-all"
                  >
                    <span>{task.proof.url}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                )}

                {task.proof.notes && (
                  <p className="text-slate-300 text-xs bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 italic">
                    "{task.proof.notes}"
                  </p>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">
                No formal attachment uploaded. Marked complete by assignee for verification.
              </div>
            )}
          </div>

          {/* Validator Role Box */}
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <img
                src={currentPersona.avatar}
                alt={currentPersona.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-slate-300">
                Signing as <strong className="text-white">{currentPersona.name}</strong> ({currentPersona.roleTitle})
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              Required: {task.validatorRole}
            </span>
          </div>

          {/* Feedback / Comments textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reviewer Notes / Validation Feedback
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Audit trail confirmed. All requirements satisfied."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Actions: Approve vs Reject */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDecision(false)}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-red-950/40 text-red-400 hover:text-red-300 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Return / Reject</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDecision(true)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Validate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
