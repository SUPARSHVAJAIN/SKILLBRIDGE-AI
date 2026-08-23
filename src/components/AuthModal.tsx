import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { X, Lock, Mail, User as UserIcon, Building2, Briefcase, Sparkles, GraduationCap, Building } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, demoLogin } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [universityOrCompany, setUniversityOrCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          name,
          role,
          universityOrCompany,
          targetRole
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoRole: UserRole) => {
    setError(null);
    setSubmitting(true);
    try {
      await demoLogin(demoRole);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="auth-modal-card" 
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto"
      >
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isLoginMode ? 'Welcome to SkillBridge AI' : 'Create Your Account'}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {isLoginMode ? 'Sign in to access your AST portfolio & sprint roadmap' : 'Join the adaptive competency verification network'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* Instant Demo Accounts */}
        <div className="mb-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            1-Click Instant Demo Profiles
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              id="demo-student-btn"
              type="button"
              onClick={() => handleQuickDemo('student')}
              disabled={submitting}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 text-xs text-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <UserIcon className="w-4 h-4 text-indigo-600 mb-1" />
              <span className="font-medium">CS Student</span>
              <span className="text-[10px] text-slate-500">Alex R.</span>
            </button>
            <button
              id="demo-univ-btn"
              type="button"
              onClick={() => handleQuickDemo('university')}
              disabled={submitting}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 text-xs text-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="font-medium">T&P Officer</span>
              <span className="text-[10px] text-slate-500">Dr. Sarah</span>
            </button>
            <button
              id="demo-recruiter-btn"
              type="button"
              onClick={() => handleQuickDemo('recruiter')}
              disabled={submitting}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 text-xs text-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <Building className="w-4 h-4 text-purple-600 mb-1" />
              <span className="font-medium">Recruiter</span>
              <span className="text-[10px] text-slate-500">David Z.</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    id="reg-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Role Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['student', 'university', 'recruiter'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-1.5 px-2 rounded-lg text-xs capitalize font-medium border transition-all cursor-pointer ${
                        role === r
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r === 'student' ? 'Student' : r === 'university' ? 'T&P Cell' : 'Recruiter'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    {role === 'student' || role === 'university' ? 'University' : 'Company'}
                  </label>
                  <input
                    type="text"
                    value={universityOrCompany}
                    onChange={(e) => setUniversityOrCompany(e.target.value)}
                    placeholder={role === 'recruiter' ? 'CloudScale' : 'Tech Univ'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    {role === 'student' ? 'Target Role' : 'Job Title'}
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder={role === 'student' ? 'Cloud Engineer' : 'Lead Partner'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@skillbridge.ai"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                id="auth-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow-xs shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {submitting ? 'Authenticating...' : isLoginMode ? 'Sign In to SkillBridge' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          {isLoginMode ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(false);
                  setError(null);
                }}
                className="text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(true);
                  setError(null);
                }}
                className="text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
