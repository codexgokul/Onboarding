import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Shield, 
  CheckSquare, 
  Activity, 
  Plus, 
  LayoutDashboard,
  UserCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { PERSONAS } from '../constants/personas';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  currentPersona, 
  setCurrentPersona, 
  onOpenCreateModal,
  stats 
}) {
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users, badge: stats?.employees?.total },
    { id: 'tasks', label: 'Task Tracking & Validation', icon: CheckSquare, badge: stats?.tasks?.pendingValidation, badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { id: 'emails', label: 'Email Access', icon: Mail, badge: stats?.itQueue?.pendingEmails, badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' },
    { id: 'permissions', label: 'Software Permissions', icon: Shield, badge: stats?.itQueue?.pendingSoftware, badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
    { id: 'activity', label: 'Audit Trail', icon: Activity }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top tier: Brand, Persona switcher, and Action CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  TalentFlow
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full tracking-wide uppercase">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400">Employee Onboarding & Access Lifecycle</p>
            </div>
          </div>

          {/* Right actions: Persona switcher and Create Employee */}
          <div className="flex items-center gap-3">
            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all text-left"
              >
                <img
                  src={currentPersona.avatar}
                  alt={currentPersona.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {currentPersona.name}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {currentPersona.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block leading-tight">
                    {currentPersona.roleTitle}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
              </button>

              {personaDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setPersonaDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl py-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Switch Active Persona</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="max-h-80 overflow-y-auto py-1">
                      {PERSONAS.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setCurrentPersona(p);
                            setPersonaDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2.5 text-left flex items-start gap-3 hover:bg-slate-800/70 transition-colors ${
                            currentPersona.id === p.id ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : ''
                          }`}
                        >
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-8 h-8 rounded-full object-cover mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-200 truncate">
                                {p.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                                {p.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">{p.roleTitle}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Create Employee CTA */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Employee</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto py-1 border-t border-slate-800/60 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-indigo-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                      item.badgeColor || 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
