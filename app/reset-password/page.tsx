'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
        setChecking(false);
      } else if (event === 'SIGNED_IN' && session) {
        setIsValidSession(true);
        setChecking(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      }
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated! Redirecting to login...' });
      setTimeout(() => router.push('/sign-in'), 2500);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2.5 h-2.5 bg-[#4ade80] rounded-full" />
            <span className="text-[#4ade80] font-bold text-sm tracking-widest uppercase">
              Melanated In Tech
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reset your password</h1>
          <p className="text-gray-500 text-sm">Enter a new password for your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-8">

          {/* Status messages */}
          {message && (
            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === 'success'
                ? 'bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80]'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {checking ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-[#4ade80]/30 border-t-[#4ade80] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Verifying your link...</p>
            </div>
          ) : isValidSession ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/20 transition-all text-sm"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80]/20 transition-all text-sm"
                />
              </div>

              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-4">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Requirements</p>
                <ul className="space-y-1 text-xs text-gray-500">
                  <li className={`flex items-center gap-2 ${password.length >= 6 ? 'text-[#4ade80]' : ''}`}>
                    <span>{password.length >= 6 ? '✓' : '·'}</span> At least 6 characters
                  </li>
                  <li className={`flex items-center gap-2 ${password === confirmPassword && password.length > 0 ? 'text-[#4ade80]' : ''}`}>
                    <span>{password === confirmPassword && password.length > 0 ? '✓' : '·'}</span> Passwords match
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#4ade80] text-black font-bold rounded-lg hover:bg-[#22c55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-6">
                This link is invalid or has expired. Request a new password reset.
              </p>
              <button
                onClick={() => router.push('/sign-in')}
                className="w-full py-3 bg-[#4ade80] text-black font-bold rounded-lg hover:bg-[#22c55e] transition-colors text-sm"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © 2025 Melanated In Tech
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4ade80]/30 border-t-[#4ade80] rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
