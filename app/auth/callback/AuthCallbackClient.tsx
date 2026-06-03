'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function AuthCallbackClient() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    if (!searchParams) return;

    const handleAuthCallback = async () => {
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type'); // 'recovery' | 'signup' | etc.
        const tokenHash = searchParams.get('token_hash'); // PKCE flow
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'Authentication failed');
          setTimeout(() => router.push('/'), 3000);
          return;
        }

        // PKCE flow: exchange token_hash for session
        if (tokenHash && type) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });

          if (verifyError) {
            setStatus('error');
            setMessage('Invalid or expired link. Please request a new one.');
            setTimeout(() => router.push('/'), 3000);
            return;
          }

          setStatus('success');
          if (type === 'recovery') {
            setMessage('Identity verified! Redirecting to password reset...');
            setTimeout(() => router.push('/reset-password'), 1500);
          } else {
            setMessage('Email confirmed successfully! Redirecting...');
            setTimeout(() => router.push('/'), 2000);
          }
          return;
        }

        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setStatus('error');
            setMessage('Failed to set session');
            setTimeout(() => router.push('/'), 3000);
            return;
          }

          if (data.user) {
            setStatus('success');
            if (type === 'recovery') {
              setMessage('Identity verified! Redirecting to password reset...');
              setTimeout(() => router.push('/reset-password'), 1500);
            } else {
              setMessage('Email confirmed successfully! Redirecting...');
              setTimeout(() => router.push('/'), 2000);
            }
          }
        } else {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setStatus('success');
            setMessage('Already authenticated! Redirecting...');
            setTimeout(() => router.push('/'), 2000);
          } else {
            setStatus('error');
            setMessage('No authentication tokens found');
            setTimeout(() => router.push('/'), 3000);
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handleAuthCallback();
  }, [searchParams, router, supabase]);

  if (!searchParams) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-2.5 h-2.5 bg-[#4ade80] rounded-full" />
          <span className="text-[#4ade80] font-bold text-sm tracking-widest uppercase">
            Melanated In Tech
          </span>
        </div>

        <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-10">
          <div className="flex items-center justify-center mb-6">
            {status === 'loading' && (
              <div className="w-12 h-12 border-2 border-[#4ade80]/30 border-t-[#4ade80] rounded-full animate-spin" />
            )}
            {status === 'success' && (
              <div className="w-12 h-12 bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            {status === 'loading' && 'Verifying...'}
            {status === 'success' && 'Verified!'}
            {status === 'error' && 'Something went wrong'}
          </h2>
          <p className="text-gray-500 text-sm">{message}</p>
        </div>

        <p className="text-gray-600 text-xs mt-6">© 2025 Melanated In Tech</p>
      </div>
    </div>
  );
} 