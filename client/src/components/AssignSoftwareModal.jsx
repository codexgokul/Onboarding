import React, { useState, useEffect } from 'react';
import { X, Shield, Check } from 'lucide-react';

export default function AssignSoftwareModal({
  isOpen,
  onClose,
  employees,
  softwareCatalog,
  defaultEmployee,
  onAssign
}) {
  const [employeeId, setEmployeeId] = useState(defaultEmployee ? defaultEmployee.id : employees[0]?.id || '');
  const [softwareId, setSoftwareId] = useState(softwareCatalog[0]?.id || '');
  const [role, setRole] = useState('');
  const [licenseType, setLicenseType] = useState('Standard Corporate License');
  const [justification, setJustification] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedSoftware = softwareCatalog.find(s => s.id === softwareId) || softwareCatalog[0];

  useEffect(() => {
    if (selectedSoftware && selectedSoftware.roles && selectedSoftware.roles.length > 0) {
      setRole(selectedSoftware.roles[0]);
    }
  }, [softwareId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await onAssign({
        employeeId,
        softwareId: selectedSoftware.id,
        softwareName: selectedSoftware.name,
        role: role || 'Standard Member',
        licenseType,
        justification: justification.trim() || 'Role requirement for daily onboarding and workflows.'
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to assign software permission.');
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
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Assign Tool & Software Permission</h2>
              <p className="text-xs text-slate-400">Grant role-based enterprise software access seats</p>
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

          {/* Select Software */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Software Application *
            </label>
            <select
              value={softwareId}
              onChange={(e) => setSoftwareId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {softwareCatalog.map(sw => (
                <option key={sw.id} value={sw.id}>
                  {sw.name} ({sw.category})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Access Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Access Level / Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {selectedSoftware?.roles?.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* License Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                License Type
              </label>
              <select
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Standard Corporate License">Standard Corporate License</option>
                <option value="Enterprise Seat (SSO)">Enterprise Seat (SSO)</option>
                <option value="Dedicated Developer Seat">Dedicated Developer Seat</option>
                <option value="Admin / privileged License">Admin / Privileged License</option>
              </select>
            </div>
          </div>

          {/* Business Justification */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Business Justification
            </label>
            <textarea
              rows={2}
              placeholder="Explain why this role needs access to this application..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
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
              <span>Assign Permission</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
