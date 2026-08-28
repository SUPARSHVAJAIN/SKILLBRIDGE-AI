import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, OtpDeliveryResponse } from '../types';
import {
  X,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  Sparkles,
  GraduationCap,
  Building,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  Send,
  MessageSquare
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, requestOtp, verifyOtp, loginWithCredentialsAndOtp, demoLogin } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');
  
  // Form fields
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [universityOrCompany, setUniversityOrCompany] = useState('');
  const [targetRole, setTargetRole] = useState('');
  
  // OTP state
  const [otpStep, setOtpStep] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState<'login' | 'register'>('login');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpSession, setOtpSession] = useState<(OtpDeliveryResponse & { identifier: string; userName?: string }) | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);
  
  // UI states
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSimulatedNotification, setShowSimulatedNotification] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setIsLoginMode(initialMode === 'login');
      setOtpStep(false);
      setError(null);
      setSuccessMsg(null);
      setOtpDigits(['', '', '', '', '', '']);
      setShowSimulatedNotification(false);
    }
  }, [isOpen, initialMode]);

  // Resend countdown timer
  useEffect(() => {
    let timer: any;
    if (otpStep && resendCountdown > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (resendCountdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [otpStep, resendCountdown]);

  if (!isOpen) return null;

  // Handle requesting OTP for Login or Registration
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (isLoginMode) {
        if (loginMethod === 'password') {
          // Verify credentials first then send OTP
          const target = identifier.trim() || email.trim();
          if (!target || !password) {
            throw new Error('Please enter your login email/mobile and password.');
          }
          const resp = await loginWithCredentialsAndOtp(target, password);
          setOtpSession(resp);
          setOtpPurpose('login');
          setOtpStep(true);
          setResendCountdown(30);
          setShowSimulatedNotification(true);
          setSuccessMsg(`OTP sent to both ${resp.maskedEmail} and ${resp.maskedPhone}`);
        } else {
          // Direct OTP Passwordless Login
          const target = identifier.trim() || email.trim();
          if (!target) {
            throw new Error('Please enter your registered Email address or Mobile number.');
          }
          const resp = await requestOtp({
            identifier: target,
            purpose: 'login'
          });
          setOtpSession(resp);
          setOtpPurpose('login');
          setOtpStep(true);
          setResendCountdown(30);
          setShowSimulatedNotification(true);
          setSuccessMsg(`OTP dispatched to your Email (${resp.maskedEmail}) and Mobile (${resp.maskedPhone})`);
        }
      } else {
        // Registration with Dual OTP Verification
        if (!name.trim() || !email.trim()) {
          throw new Error('Full Name and Email Address are required.');
        }
        const resp = await requestOtp({
          email: email.trim(),
          phone: phone.trim() || '+1 (555) 349-2810',
          name: name.trim(),
          password: password || 'password123',
          role,
          universityOrCompany: universityOrCompany.trim(),
          targetRole: targetRole.trim(),
          purpose: 'register'
        });
        setOtpSession(resp);
        setOtpPurpose('register');
        setOtpStep(true);
        setResendCountdown(30);
        setShowSimulatedNotification(true);
        setSuccessMsg(`Verification code sent to ${resp.maskedEmail} and ${resp.maskedPhone}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    // Only accept numeric
    const cleanVal = val.replace(/[^0-9]/g, '');
    
    if (cleanVal.length > 1) {
      // Handle paste of whole code
      const pasted = cleanVal.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-advance
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Verify OTP submission
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const targetIdentifier = otpSession?.identifier || identifier || email;
      await verifyOtp({
        identifier: targetIdentifier,
        code,
        purpose: otpPurpose
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1-Click Auto Fill from Simulated Notification
  const handleAutoFillOtp = () => {
    if (otpSession?.demoOtp) {
      const digits = otpSession.demoOtp.split('');
      setOtpDigits(digits);
      handleVerifyOtp(otpSession.demoOtp);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!canResend) return;
    setError(null);
    setSubmitting(true);
    try {
      const targetIdentifier = otpSession?.identifier || identifier || email;
      const resp = await requestOtp({
        identifier: targetIdentifier,
        email: email || targetIdentifier,
        phone: phone || otpSession?.maskedPhone,
        purpose: otpPurpose,
        name,
        role,
        universityOrCompany,
        targetRole,
        password
      });
      setOtpSession(resp);
      setResendCountdown(30);
      setCanResend(false);
      setShowSimulatedNotification(true);
      setSuccessMsg(`Fresh verification code sent to your Email and Mobile.`);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1-Click Instant Demo login
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="auth-modal-card" 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-800 max-h-[92vh] overflow-y-auto"
      >
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 mb-3 shadow-xs">
            {otpStep ? <ShieldCheck className="w-6 h-6 text-indigo-600" /> : <Lock className="w-6 h-6 text-indigo-600" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {otpStep
              ? 'Dual-Channel Verification'
              : isLoginMode
              ? 'Sign In to SkillBridge AI'
              : 'Create Your Account'}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
            {otpStep
              ? 'Enter the 6-digit OTP dispatched simultaneously to your Email and Mobile Number'
              : isLoginMode
              ? 'Access your AST portfolio, vector gap diagnostics, and adaptive 30-day roadmap'
              : 'Join the AST-driven verified engineering competency network'}
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs md:text-sm flex items-start gap-2 animate-in fade-in">
            <span className="font-bold">⚠️</span>
            <div className="flex-1">{error}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs md:text-sm flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{successMsg}</div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION VIEW */}
        {otpStep ? (
          <div className="space-y-5">
            {/* Delivered Channels Badge Header */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2.5">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                <Send className="w-3.5 h-3.5 text-indigo-600" />
                OTP Code Dispatched To:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-xs">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Email Inbox</div>
                    <div className="font-mono text-xs text-slate-900 font-semibold">{otpSession?.maskedEmail || 'Registered Email'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-xs">
                  <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">SMS / Mobile</div>
                    <div className="font-mono text-xs text-slate-900 font-semibold">{otpSession?.maskedPhone || '+1 (555) ***-2810'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE SIMULATED DELIVERY TOAST / NOTIFICATION PREVIEW */}
            {showSimulatedNotification && otpSession?.demoOtp && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-4 shadow-xl border border-indigo-500/30 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Incoming SMS & Email Delivery</span>
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      </div>
                      <div className="text-[10px] text-indigo-200">Just now · Secure Dual-Channel Gateway</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSimulatedNotification(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 mb-3 border border-white/10 text-xs">
                  <p className="text-slate-200 font-mono">
                    <span className="text-indigo-300 font-semibold">[SkillBridge AI]</span> Your 6-digit verification code is <strong className="text-amber-300 tracking-widest text-sm bg-black/30 px-1.5 py-0.5 rounded">{otpSession.demoOtp}</strong>. Valid for 5 minutes.
                  </p>
                </div>

                <button
                  type="button"
                  id="auto-fill-otp-btn"
                  onClick={handleAutoFillOtp}
                  className="w-full py-1.5 px-3 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  1-Click Auto-Fill Code ({otpSession.demoOtp}) & Sign In
                </button>
              </div>
            )}

            {/* 6-DIGIT OTP INPUT */}
            <div>
              <label className="block text-xs font-medium text-slate-700 text-center mb-3">
                Enter the 6-Digit Security Code
              </label>
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-bold rounded-xl border bg-slate-50 transition-all ${
                      digit
                        ? 'border-indigo-600 bg-white text-indigo-700 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 text-slate-900 focus:border-indigo-500 focus:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="button"
              id="verify-otp-submit-btn"
              onClick={() => handleVerifyOtp()}
              disabled={submitting || otpDigits.join('').length !== 6}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Security Code...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Verify & Access SkillBridge
                </>
              )}
            </button>

            {/* Resend & Change Info Controls */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setOtpStep(false);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back / Edit Info
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || submitting}
                className={`font-semibold flex items-center gap-1.5 cursor-pointer ${
                  canResend ? 'text-indigo-600 hover:underline' : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${submitting ? 'animate-spin' : ''}`} />
                {canResend ? 'Resend OTP to Email & SMS' : `Resend in ${resendCountdown}s`}
              </button>
            </div>
          </div>
        ) : (
          /* STEP 1: LOGIN / REGISTER INPUT VIEW */
          <div className="space-y-5">
            {/* Instant Demo Switcher */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
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
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 text-xs text-slate-800 transition-all cursor-pointer shadow-xs"
                >
                  <UserIcon className="w-4 h-4 text-indigo-600 mb-1" />
                  <span className="font-semibold text-slate-900 truncate w-full text-center">Suparshva J.</span>
                  <span className="text-[10px] text-slate-500">CS Student</span>
                </button>
                <button
                  id="demo-univ-btn"
                  type="button"
                  onClick={() => handleQuickDemo('university')}
                  disabled={submitting}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-xs text-slate-800 transition-all cursor-pointer shadow-xs"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="font-semibold text-slate-900 truncate w-full text-center">Dr. Sarah</span>
                  <span className="text-[10px] text-slate-500">T&P Officer</span>
                </button>
                <button
                  id="demo-recruiter-btn"
                  type="button"
                  onClick={() => handleQuickDemo('recruiter')}
                  disabled={submitting}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white hover:bg-purple-50/60 border border-slate-200 hover:border-purple-300 text-xs text-slate-800 transition-all cursor-pointer shadow-xs"
                >
                  <Building className="w-4 h-4 text-purple-600 mb-1" />
                  <span className="font-semibold text-slate-900 truncate w-full text-center">David Z.</span>
                  <span className="text-[10px] text-slate-500">Recruiter</span>
                </button>
              </div>
            </div>

            {/* Login Mode Toggle Tabs: Instant OTP vs Password */}
            {isLoginMode && (
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'otp'
                      ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                  Dual OTP Login (Email + Mobile)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('password');
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginMethod === 'password'
                      ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-600" />
                  Password + 2FA
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRequestOtp} className="space-y-3.5">
              {/* Registration Specific Fields */}
              {!isLoginMode && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        id="reg-name-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="SUPARSHVA JAIN"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Role Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['student', 'university', 'recruiter'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`py-2 px-2 rounded-xl text-xs capitalize font-medium border transition-all cursor-pointer ${
                            role === r
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-xs'
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
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {role === 'student' || role === 'university' ? 'University' : 'Company'}
                      </label>
                      <input
                        type="text"
                        value={universityOrCompany}
                        onChange={(e) => setUniversityOrCompany(e.target.value)}
                        placeholder={role === 'recruiter' ? 'CloudScale' : 'Tech University'}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {role === 'student' ? 'Target Role' : 'Job Title'}
                      </label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder={role === 'student' ? 'Cloud Engineer' : 'Lead Partner'}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Login Identifier OR Registration Email + Mobile */}
              {isLoginMode ? (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      id="auth-identifier-input"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="suparshva.jain@techuniv.edu or +1 (555) 349-2810"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors font-sans"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    We will send an instant 6-digit OTP to both your registered email & phone
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        id="auth-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="developer@skillbridge.ai"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Number (SMS OTP)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        id="auth-phone-input"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 349-2810"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Password field (if login method is password OR registering) */}
              {(!isLoginMode || loginMethod === 'password') && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      id="auth-password-input"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 mt-3 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Dispatching OTP...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {isLoginMode ? 'Send Verification OTP to Email & Mobile' : 'Verify & Complete Registration'}
                  </>
                )}
              </button>
            </form>

            {/* Bottom Toggle between Sign In / Sign Up */}
            <div className="mt-5 text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
              {isLoginMode ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginMode(false);
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-indigo-600 hover:underline font-semibold cursor-pointer ml-1"
                  >
                    Sign up free
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginMode(true);
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-indigo-600 hover:underline font-semibold cursor-pointer ml-1"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
