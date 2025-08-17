'use client';

import { useEffect, useState } from 'react';

export default function SettingsClient() {
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [savingEmailPref, setSavingEmailPref] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Initialize theme and email notification preference
  useEffect(() => {
    try {
      // Theme - default to dark mode
      const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
      const isDark = storedTheme ? storedTheme === 'dark' : true; // Default to dark
      setDarkMode(isDark);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark);
      }
    } catch {}

    // Load newsletter/email notification preference from profiles
    (async () => {
      try {
        const { createClient } = await import('@/lib/supabase');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;
        const { data } = await supabase
          .from('profiles')
          .select('newsletter_opt_in')
          .eq('id', session.user.id)
          .maybeSingle();
        if (data && typeof data.newsletter_opt_in === 'boolean') {
          setEmailNotifications(Boolean(data.newsletter_opt_in));
        }
      } catch {}
    })();
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', next);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      }
    } catch {}
  };

  const toggleEmailNotifications = async () => {
    const next = !emailNotifications;
    setEmailNotifications(next);
    setSavingEmailPref(true);
    setStatus(null);
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setStatus('Please sign in again to save preferences.');
        return;
      }
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'X-Supabase-Authorization': `Bearer ${session.access_token}`,
          'X-Refresh-Token': session.refresh_token ?? ''
        },
        credentials: 'include',
        body: JSON.stringify({ newsletterOptIn: next })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error || 'Failed to save preference.');
      } else {
        setStatus('Preference saved.');
      }
    } catch (e) {
      setStatus('Failed to save preference.');
    } finally {
      setSavingEmailPref(false);
      setTimeout(() => setStatus(null), 2500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Switch to light theme</p>
        </div>
        <button
          type="button"
          aria-pressed={darkMode}
          onClick={toggleDarkMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}></span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about new tools and features</p>
        </div>
        <button
          type="button"
          aria-pressed={emailNotifications}
          onClick={toggleEmailNotifications}
          disabled={savingEmailPref}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'} ${savingEmailPref ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`}></span>
        </button>
      </div>

      {status && (
        <div className="text-sm text-gray-600 dark:text-gray-400">{status}</div>
      )}
    </div>
  );
}


