import React, { useState } from 'react';
import { X, CheckSquare, Plus } from 'lucide-react';
import { ONBOARDING_PHASES } from '../constants/personas';

export default function CreateTaskModal({ isOpen, onClose, employees, onAddTask }) {
  const [formData, setFormData] = useState({
    employeeId: employees[0]?.id || '',
    title: '',
    description: '',
    phase: 'Day 1 Setup',
    category: 'IT Setup',
    assignedTo: 'Employee',
    validatorRole: 'IT Administrator',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onAddTask(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add task.');
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
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Custom Onboarding Task</h2>
              <p className="text-xs text-slate-400">Assign a milestone with designated reviewer validation</p>
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
              Assign to Employee *
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.department} - {emp.jobTitle})
                </option>
              ))}
            </select>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Complete Security Key Pairing or Submit Tax Documents"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description & Verification Criteria
            </label>
            <textarea
              rows={2}
              placeholder="Describe what needs to be delivered or proven to pass verification..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Phase */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Onboarding Phase
              </label>
              <select
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {ONBOARDING_PHASES.map(ph => (
                  <option key={ph} value={ph}>{ph}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="HR Paperwork">HR Paperwork</option>
                <option value="IT Setup">IT Setup</option>
                <option value="Tools & Permissions">Tools & Permissions</option>
                <option value="Compliance">Compliance</option>
                <option value="Training">Training</option>
                <option value="Management">Management</option>
              </select>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Owner / Assignee
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Employee">Employee (New Hire)</option>
                <option value="IT Support">IT Support</option>
                <option value="HR">HR Team</option>
                <option value="Hiring Manager">Hiring Manager</option>
              </select>
            </div>

            {/* Validator Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Validator Role
              </label>
              <select
                value={formData.validatorRole}
                onChange={(e) => setFormData({ ...formData, validatorRole: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="HR Specialist">HR Specialist</option>
                <option value="IT Administrator">IT Administrator</option>
                <option value="Hiring Manager">Hiring Manager</option>
                <option value="Security Officer">Security Officer</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
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
              <Plus className="w-4 h-4" />
              <span>Add Milestone Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
