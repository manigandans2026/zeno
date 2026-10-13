import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { signInUser, signUpUser, getCurrentUserProfile, isSupabaseConfigured } from '../lib/supabase';

export default function WaitlistModal({ isOpen, onClose, onLoginSuccess, onAdminLogin }) {
  const [mode, setMode] = useState('signin'); 
  const [step, setStep] = useState(1); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    intent: 'Slow Romance',
    city: 'New York'
  });

  const [vipCode, setVipCode] = useState('');
  const [queueNumber, setQueueNumber] = useState(284);
  const [copied, setCopied] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setSuccessNotice('');
    setIsSubmitting(true);

    const email = (formData.email || '').trim().toLowerCase();
    const password = (formData.password || '').trim();

    try {
      if (mode === 'signin') {
        // 1. Try real Supabase auth if configured
        if (isSupabaseConfigured) {
          try {
            const data = await signInUser(email, password);
            const user = data.user;
            const profile = await getCurrentUserProfile(user.id);

            if (profile?.role === 'admin' || email === 'admin@zuno.com') {
              if (onAdminLogin) onAdminLogin(profile || { role: 'admin', name: 'Super Admin', email });
            } else {
              if (onLoginSuccess) {
                onLoginSuccess({
                  id: user.id,
                  name: profile?.full_name?.split(' ')[0] || user.user_metadata?.full_name?.split(' ')[0] || 'Member',
                  fullName: profile?.full_name || user.user_metadata?.full_name || 'Member',
                  email: user.email,
                  ...profile
                });
              }
            }
            return;
          } catch (supaErr) {
            // If Supabase authentication failed, check if they are using the preset demo accounts
            const isDemoAdmin = email === 'admin@zuno.com' && (password === 'admin123' || password === 'admin');
            const isDemoUser = email === 'kavya@zuno.com' && password === 'password123';

            if (!isDemoAdmin && !isDemoUser) {
              setLoginError(supaErr.message || 'Invalid credentials.');
              return;
            }
          }
        }

        // 2. Demo fallback accounts
        if (email === 'admin@zuno.com') {
          if (password === 'admin123' || password === 'admin') {
            if (onAdminLogin) onAdminLogin({ role: 'admin', name: 'Super Admin', email });
            return;
          } else {
            setLoginError('Invalid password for admin@zuno.com.');
            return;
          }
        }

        if (email === 'kavya@zuno.com') {
          if (password === 'password123') {
            if (onLoginSuccess) {
              onLoginSuccess({
                name: 'Kavya',
                fullName: 'Kavya Krishnan',
                email: 'kavya@zuno.com'
              });
            }
            return;
          } else {
            setLoginError('Invalid password for kavya@zuno.com.');
            return;
          }
        }

        if (!isSupabaseConfigured) {
          setLoginError('Demo sandbox mode: please use authorized accounts (kavya@zuno.com or admin@zuno.com) or configure Supabase.');
          return;
        }
      }

      // Handle Sign Up
      if (mode === 'signup') {
        if (isSupabaseConfigured) {
          try {
            const signupData = await signUpUser(email, password || 'password123', {
              full_name: formData.name,
              intent: formData.intent,
              city: formData.city
            });

            if (signupData?.user && !signupData.session) {
              setSuccessNotice('Account created! Please check your email to verify your address before signing in.');
            }
          } catch (signupErr) {
            setLoginError(signupErr.message || 'Registration failed.');
            return;
          }
        }

        const randomCode = 'ZUNO-VIP-' + Math.floor(1000 + Math.random() * 9000);
        setVipCode(randomCode);
        setQueueNumber(Math.floor(100 + Math.random() * 800));

        if (onLoginSuccess) {
          const userName = formData.name || 'Member';
          onLoginSuccess({
            name: userName.split(' ')[0],
            fullName: userName,
            email: formData.email
          });
        }

        setStep(2);

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {
          console.log('Confetti err', err);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://zuno.ai/invite/${vipCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-pink-100 p-6 overflow-hidden max-h-[90vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-pink-200/50 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-200/50 rounded-full blur-2xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {step === 1 ? (
          <div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className="font-headline-sm text-slate-900 font-bold text-xl">
                {mode === 'signin' ? 'Sign In to Zuno' : 'Join Zuno Community'}
              </span>
            </div>
            
            <p className="font-body-sm text-slate-600 text-xs mb-4">
              {mode === 'signin' 
                ? 'Welcome back! Enter your credentials to access your Zuno profile.' 
                : 'Create your account to unlock voice matching and neural chemistry.'}
            </p>
            
            {loginError && (
              <div className="p-2 mb-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-lg animate-fadeIn">
                {loginError}
              </div>
            )}

            <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 mb-5">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-1.5 text-xs rounded-full font-bold transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-1.5 text-xs rounded-full font-bold transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-xs sm:text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email or Username</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your email address..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-xs sm:text-sm"
                />
              </div>

              {mode === 'signin' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password..."
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-xs sm:text-sm"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Create a strong password..."
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm your password..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-xs sm:text-sm"
                    />
                  </div>
                </>
              )}

              {mode === 'signin' && (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-600 my-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-pink-500 rounded" />
                      <span>Remember me</span>
                    </label>
                    <button type="button" className="text-pink-600 hover:underline font-medium">Forgot password?</button>
                  </div>
                </>
              )}

              {successNotice && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl animate-fadeIn">
                  {successNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full h-11 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 text-white text-xs sm:text-sm font-semibold shadow-[0_6px_22px_rgba(244,63,94,0.35)] hover:shadow-[0_8px_28px_rgba(6,182,212,0.45)] transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>
                  {isSubmitting 
                    ? 'Authenticating...' 
                    : mode === 'signin' 
                      ? 'Sign In to Zuno Dashboard' 
                      : 'Create Account & Join'}
                </span>
                <span className="material-symbols-outlined text-[18px]">
                  {isSubmitting ? 'sync' : 'arrow_forward'}
                </span>
              </button>

            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
              {mode === 'signin' ? (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="font-bold text-pink-600 hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="font-bold text-pink-600 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-2 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-200 text-pink-500 flex items-center justify-center mb-4 shadow-sm animate-bounce">
              <span className="material-symbols-outlined text-[32px]">verified</span>
            </div>

            <h3 className="font-headline-sm text-slate-900 font-bold text-xl">
              Welcome to Zuno, {formData.name || 'Member'}!
            </h3>
            <p className="font-body-sm text-slate-600 mt-1 mb-6 text-sm max-w-xs">
              {mode === 'signin' 
                ? 'Your session has been authenticated successfully.' 
                : `Your account is active. You are #${queueNumber} in line for ${formData.city}.`}
            </p>

            <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-xl shadow-xl text-left border border-slate-700 relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/20 rounded-full blur-xl"></div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Zuno Member Access Pass</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full font-mono">AUTHENTICATED</span>
              </div>

              <div className="font-mono text-xl font-bold tracking-wider text-pink-300 mb-2">
                {vipCode}
              </div>

              <div className="flex justify-between items-end text-xs text-slate-300 border-t border-slate-700/80 pt-2">
                <div>
                  <div className="text-[10px] text-slate-400">MEMBER</div>
                  <div className="font-semibold">{formData.name || formData.email || 'Zuno User'}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">STATUS</div>
                  <div className="font-semibold text-emerald-400">Active</div>
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs mb-4">
              <span className="font-mono text-slate-600 truncate mr-2">zuno.ai/invite/{vipCode}</span>
              <button
                onClick={copyReferral}
                className="px-3 py-1.5 rounded-lg bg-pink-500 text-white font-semibold hover:bg-pink-600 transition-colors shrink-0 cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <button
              onClick={() => {
                setStep(1);
                onClose();
              }}
              className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              Continue to Zuno
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
