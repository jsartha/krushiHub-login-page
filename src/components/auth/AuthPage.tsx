import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Truck,
  Sprout,
  Store
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { SecurityAuditModal } from './SecurityAuditModal';
import { getFailedAttempts, evaluatePasswordSecurity } from '../../utils/security';
import { DEMO_ACCOUNTS } from '../../data/mockData';

export const AuthPage: React.FC = () => {
  const { currentUser, logout, login, signup, quickDemoLogin } = useAuth();

  // Mode: Sign in vs Sign up (Defaults to sign in / login)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Selected Role Module (1: Deliver Fruits, 2: Farmer, 3: Agri Seller)
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  // Form Fields
  const [fullName, setFullName] = useState('Rajesh Patil');
  const [email, setEmail] = useState('farmer@kisandirect.com');
  const [password, setPassword] = useState('Farmer@2026');
  const [confirmPassword, setConfirmPassword] = useState('Farmer@2026');

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Modals
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSecurityAudit, setShowSecurityAudit] = useState(false);
  const [successPopup, setSuccessPopup] = useState<{
    type: 'login' | 'register';
    title: string;
    message: string;
    userName: string;
    userEmail: string;
    userRole: string;
  } | null>(null);

  // Check rate limit on email change or mount
  useEffect(() => {
    if (email) {
      const tracker = getFailedAttempts(email);
      if (tracker.lockUntil && Date.now() < tracker.lockUntil) {
        setLockoutSeconds(Math.ceil((tracker.lockUntil - Date.now()) / 1000));
      } else {
        setLockoutSeconds(0);
      }
    }
  }, [email]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMessage('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // One-click clear entire login interface inputs
  const handleClearInputs = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleFillDemo = (role: UserRole) => {
    setSelectedRole(role);
    const demo = DEMO_ACCOUNTS[role];
    if (demo) {
      setFullName(demo.profile.name);
      setEmail(demo.profile.email);
      setPassword(demo.passwordHint);
      setConfirmPassword(demo.passwordHint);
      setErrorMessage('');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    quickDemoLogin(role);
    const demo = DEMO_ACCOUNTS[role];
    const roleLabel = role === 'delivery' ? 'Fruit Deliverer' : role === 'farmer' ? 'Farmer' : 'Agri Seller';
    setSuccessPopup({
      type: 'login',
      title: 'Login Successfully!',
      message: `Welcome to KrushiHub! You have logged in as ${roleLabel}.`,
      userName: demo?.profile.name || 'Demo User',
      userEmail: demo?.profile.email || `${role}@krushihub.com`,
      userRole: roleLabel,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (lockoutSeconds > 0) {
      setErrorMessage(`Security lockout active. Please wait ${lockoutSeconds}s before retrying.`);
      return;
    }

    if (authMode === 'signup' && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'signin') {
        const res = await login(email, password, selectedRole);
        if (!res.success) {
          setErrorMessage(res.error || 'Authentication failed. Please check credentials or use demo credentials.');
          const tracker = getFailedAttempts(email);
          if (tracker.lockUntil && Date.now() < tracker.lockUntil) {
            setLockoutSeconds(Math.ceil((tracker.lockUntil - Date.now()) / 1000));
          }
        } else {
          const roleLabel = selectedRole === 'delivery' ? 'Fruit Deliverer' : selectedRole === 'farmer' ? 'Farmer' : 'Agri Seller';
          setSuccessMessage(`✓ Login Successfully! Authenticated as ${roleLabel} (${email})`);
          setSuccessPopup({
            type: 'login',
            title: 'Login Successfully!',
            message: `Welcome back to KrushiHub! You have logged in securely.`,
            userName: fullName || email.split('@')[0],
            userEmail: email,
            userRole: roleLabel,
          });
        }
      } else {
        // Sign Up / Register
        const pwdCheck = evaluatePasswordSecurity(password);
        if (pwdCheck.score < 2) {
          setErrorMessage('Password is too weak. Please include at least 8 characters with numbers or symbols.');
          setIsLoading(false);
          return;
        }

        const res = await signup(
          {
            name: fullName || 'New Partner',
            email,
            role: selectedRole,
            location: selectedRole === 'farmer' ? 'Ratnagiri Orchards' : selectedRole === 'delivery' ? 'Mumbai Cold Logistics' : 'Agri Seva Kendra',
          },
          password
        );

        if (!res.success) {
          setErrorMessage(res.error || 'Registration failed.');
        } else {
          const roleLabel = selectedRole === 'delivery' ? 'Fruit Deliverer' : selectedRole === 'farmer' ? 'Farmer' : 'Agri Seller';
          setSuccessMessage(`✓ Registration Successfully! Welcome to KrushiHub.`);
          setSuccessPopup({
            type: 'register',
            title: 'Registration Successfully!',
            message: `Your partner account has been created and verified on KrushiHub.`,
            userName: fullName || 'New Partner',
            userEmail: email,
            userRole: roleLabel,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F6] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Clean, Centered Card */}
      <div className="w-full max-w-[500px] bg-white rounded-[28px] sm:rounded-[32px] shadow-xl shadow-slate-300/40 border border-slate-200/80 p-6 sm:p-10 transition-all">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            {/* Geometric Flower Mark as in design */}
            <div className="w-8 h-8 rounded-lg bg-[#2B4CFF] flex items-center justify-center text-white shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-2.6-6.4-2.1 2.1m-8.6 8.6-2.1 2.1m0-12.8 2.1 2.1m8.6 8.6 2.1 2.1" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              KrushiHub <span className="text-[#2B4CFF] font-semibold text-xs tracking-normal px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100">Farmer E-Com</span>
            </span>
          </div>

          {/* Clear Form & Telemetry buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearInputs}
              title="Clear login interface"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Clear form</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSecurityAudit(true)}
              title="Security logs"
              className="p-1.5 text-slate-400 hover:text-[#2B4CFF] hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-left mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {authMode === 'signin' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {authMode === 'signin' 
              ? 'Log in to access your farmer e-commerce dashboard and orders.'
              : 'Join now to streamline your experience from day one.'}
          </p>
        </div>

        {/* Role Module Selector (1. Deliver Fruits, 2. Farmer, 3. Agri Products Seller) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">Select Module / Role</span>
            <button
              type="button"
              onClick={() => handleFillDemo(selectedRole)}
              className="text-[11px] font-semibold text-[#2B4CFF] hover:underline"
            >
              Fill Demo Credentials
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F4F6F9] rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('delivery');
                handleFillDemo('delivery');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'delivery'
                  ? 'bg-white text-[#2B4CFF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-[#2B4CFF] shrink-0" />
              <span className="truncate">1. Deliver Fruits</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('farmer');
                handleFillDemo('farmer');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'farmer'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">2. Farmer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('seller');
                handleFillDemo('seller');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'seller'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">3. Agri Seller</span>
            </button>
          </div>
        </div>

        {/* Active Session Status */}
        {currentUser && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2B4CFF] shrink-0" />
              <span>
                Active: <strong>{currentUser.name}</strong> ({currentUser.role === 'delivery' ? 'Fruit Deliverer' : currentUser.role === 'farmer' ? 'Farmer' : 'Agri Seller'})
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-[#2B4CFF] hover:underline font-bold ml-2 shrink-0"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Alert messages */}
        {lockoutSeconds > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Security Lockout: Wait {lockoutSeconds}s before attempting again.</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
            <button onClick={() => setErrorMessage('')} className="text-rose-400 hover:text-rose-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Name (for Register) */}
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Roger Gerrard"
                  className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#2B4CFF] focus:ring-2 focus:ring-[#2B4CFF]/10 transition-all placeholder:text-slate-400"
                />
                {fullName && (
                  <button
                    type="button"
                    onClick={() => setFullName('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="krushihub@store.com"
                className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#2B4CFF] focus:ring-2 focus:ring-[#2B4CFF]/10 transition-all placeholder:text-slate-400 font-sans"
              />
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              {authMode === 'signin' && (
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[11px] font-semibold text-[#2B4CFF] hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full pl-4 pr-11 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#2B4CFF] focus:ring-2 focus:ring-[#2B4CFF]/10 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength indicator */}
            <PasswordStrengthIndicator password={password} />
          </div>

          {/* Confirm Password (for Register) */}
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full pl-4 pr-11 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#2B4CFF] focus:ring-2 focus:ring-[#2B4CFF]/10 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || lockoutSeconds > 0}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#2B4CFF] hover:bg-[#203EE0] active:scale-[0.99] transition-all shadow-md shadow-[#2B4CFF]/25 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>{authMode === 'signin' ? 'Sign In' : 'Register'}</span>
              )}
            </button>
          </div>
        </form>

        {/* Social Login Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative px-4 text-xs font-medium text-slate-400 bg-white">
            {authMode === 'signin' ? 'Or Sign In With' : 'Or Register With'}
          </span>
        </div>

        {/* Social Login Buttons: Google and Apple as in design */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin(selectedRole)}
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            {/* Google colored G icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin(selectedRole)}
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            {/* Apple icon */}
            <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.68-.83 1.14-1.99.99-3.17-1.01.04-2.22.68-2.92 1.5-.61.71-1.16 1.88-1.01 3.02 1.13.09 2.28-.56 2.94-1.35z"/>
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Switch Mode link */}
        <div className="text-center mt-6 text-xs text-slate-600">
          {authMode === 'signin' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage('');
                }}
                className="font-bold text-[#2B4CFF] hover:underline"
              >
                Register.
              </button>
            </span>
          ) : (
            <span>
              Already Have An Account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage('');
                }}
                className="font-bold text-[#2B4CFF] hover:underline"
              >
                Sign In.
              </button>
            </span>
          )}
        </div>

        {/* Bottom Copyright and Privacy Policy */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div>Copyright © 2026 KrushiHub Enterprises LTD.</div>
          <button 
            type="button" 
            onClick={() => setShowSecurityAudit(true)}
            className="hover:text-slate-600 transition-colors"
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Success Popup Modal for Register or Login */}
      {successPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 text-center">
            {/* Close button */}
            <button
              onClick={() => setSuccessPopup(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Checkmark icon with glow */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {successPopup.title}
            </h3>

            {/* Message */}
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              {successPopup.message}
            </p>

            {/* Account Details Box */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Account Name</span>
                <span className="font-bold text-slate-900">{successPopup.userName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Registered Email</span>
                <span className="font-mono text-slate-700 truncate max-w-[200px]">{successPopup.userEmail}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">Active Module</span>
                <span className="inline-flex items-center gap-1 font-bold text-[#2B4CFF] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {successPopup.userRole}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-700 pt-0.5">
                <span>Security Status</span>
                <span className="font-semibold">256-Bit Encrypted · Session Active</span>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setSuccessPopup(null)}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-[#2B4CFF] hover:bg-[#203EE0] active:scale-[0.99] transition-all shadow-md shadow-[#2B4CFF]/20"
              >
                Got it, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        initialEmail={email}
      />

      <SecurityAuditModal
        isOpen={showSecurityAudit}
        onClose={() => setShowSecurityAudit(false)}
      />
    </div>
  );
};
