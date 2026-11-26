import React, { useState } from 'react';
import { X, Sparkles, Check, User, Mail, Briefcase, Building, Calendar, Phone, Laptop, Shield } from 'lucide-react';
import { DEPARTMENTS } from '../constants/personas';

export default function CreateEmployeeModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    personalEmail: '',
    jobTitle: '',
    department: 'Engineering',
    seniority: 'Mid-Level',
    manager: 'Alexandre Dupont (VP of Engineering)',
    startDate: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10),
    phone: '+1 (555) 019-2834',
    location: 'Remote (US)',
    hardwarePreference: 'MacBook Pro 14" M3 Pro',
    emergencyContact: {
      name: '',
      relation: '',
      phone: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Please provide the employee full name.');
      return;
    }
    if (!formData.personalEmail.trim()) {
      setError('Please provide a personal email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onCreate(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create employee profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create Employee Profile</h2>
              <p className="text-xs text-slate-400">Initiate onboarding pipeline and automated access requests</p>
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

          {/* Automated Benefits Banner */}
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3">
            <Shield className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-indigo-300">
              <span className="font-semibold text-white">Automated Provisioning Included:</span> Submitting this profile will automatically generate standard onboarding tasks, create a corporate email request draft, and pre-populate the department tool access bundle.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Personal Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Personal Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="jordan.miller@gmail.com"
                  value={formData.personalEmail}
                  onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job Title *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Seniority */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Seniority Level
              </label>
              <select
                value={formData.seniority}
                onChange={(e) => setFormData({ ...formData, seniority: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead / Staff</option>
                <option value="Director">Director / Executive</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Hiring Manager */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hiring Manager / Mentor
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Dupont (VP Engineering)"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location & Workplace Mode
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco (Hybrid) or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Hardware Preference */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hardware & Asset Equipment
              </label>
              <div className="relative">
                <Laptop className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. MacBook Pro 16&quot; M3 Max + 32&quot; 4K Monitor"
                  value={formData.hardwarePreference}
                  onChange={(e) => setFormData({ ...formData, hardwarePreference: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 mb-2">Emergency Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Contact Name"
                value={formData.emergencyContact.name}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                })}
                className="px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Relationship (e.g. Spouse)"
                value={formData.emergencyContact.relation}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, relation: e.target.value }
                })}
                className="px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Contact Phone"
                value={formData.emergencyContact.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                })}
                className="px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
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
                <span>Creating Profile...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Create & Launch Onboarding</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
