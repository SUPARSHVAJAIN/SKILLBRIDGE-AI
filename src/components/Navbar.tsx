import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Sparkles,
  Layers,
  Calendar,
  Presentation,
  GraduationCap,
  Building,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Plus,
  LogIn
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'diagnostic' | 'gallery' | 'sprint' | 'presentation' | 'university' | 'recruiter';
  onTabChange: (tab: 'diagnostic' | 'gallery' | 'sprint' | 'presentation' | 'university' | 'recruiter') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenProfile: () => void;
  onOpenUploadProject: () => void;
}

interface NavItem {
  id: 'diagnostic' | 'gallery' | 'sprint' | 'presentation' | 'university' | 'recruiter';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenAuth,
  onOpenProfile,
  onOpenUploadProject
}) => {
  const { user, logout, demoLogin } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'diagnostic', label: 'AST Diagnostic', icon: Sparkles, badge: 'Live AI' },
    { id: 'gallery', label: 'Portfolio Gallery', icon: Layers, badge: 'Upload & Edit' },
    { id: 'sprint', label: '30-Day Sprints', icon: Calendar },
    { id: 'presentation', label: 'Slide Deck Explorer', icon: Presentation, badge: '5 Slides' },
    { id: 'university', label: 'T&P Cell Radar', icon: GraduationCap },
    { id: 'recruiter', label: 'Recruiter Match', icon: Building }
  ];

  const handleRoleSwitch = async (role: UserRole) => {
    setDemoMenuOpen(false);
    await demoLogin(role);
    if (role === 'university') onTabChange('university');
    else if (role === 'recruiter') onTabChange('recruiter');
    else onTabChange('diagnostic');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange('diagnostic')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900 tracking-tight">SkillBridge</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    AI
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block -mt-1 font-medium">Omni_EdTech_5 Engine</span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive 
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-300/50' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Upload Button */}
            <button
              id="header-upload-btn"
              onClick={onOpenUploadProject}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload to Gallery</span>
            </button>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                id="role-switcher-btn"
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium shadow-xs transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="capitalize">{user?.role || 'Guest'} Mode</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs text-slate-700">
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Active Persona:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('student')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">SUPARSHVA JAIN</div>
                      <div className="text-[10px] text-slate-500">CS Senior / Student</div>
                    </div>
                    {user?.role === 'student' && <span className="text-indigo-600 font-bold">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('university')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Dr. Sarah Chen</div>
                      <div className="text-[10px] text-slate-500">T&P Cell Academic Head</div>
                    </div>
                    {user?.role === 'university' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('recruiter')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">David Zhang</div>
                      <div className="text-[10px] text-slate-500">Lead Tech Recruiter</div>
                    </div>
                    {user?.role === 'recruiter' && <span className="text-purple-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar / Auth */}
            {user ? (
              <div className="relative">
                <button
                  id="user-avatar-btn"
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/40 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs text-slate-700">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                        {user.phone && (
                          <div className="text-[10px] text-slate-400 font-mono">{user.phone}</div>
                        )}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="inline-block px-1.5 py-0.2 rounded text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200/60 capitalize font-semibold">
                            {user.role}
                          </span>
                          <span className="inline-block px-1.5 py-0.2 rounded text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold">
                            OTP 2FA Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAuth('login');
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-slate-700 hover:text-slate-900 cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Switch Account / Sign In with OTP</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-slate-700 hover:text-slate-900 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Edit Profile & Preferences</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onTabChange('gallery');
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2 text-slate-700 hover:text-slate-900 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Personal Gallery</span>
                      </button>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex items-center gap-1 pb-3 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
