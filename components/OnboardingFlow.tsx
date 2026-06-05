'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { X } from 'lucide-react';

const STORAGE_KEY = 'onboarding-completed';

const ROLES = [
  { id: 'builder', label: 'Builder', emoji: '🔧', desc: 'Building AI agents & automations' },
  { id: 'learner', label: 'Learner', emoji: '📚', desc: 'Learning AI & emerging tech' },
  { id: 'researcher', label: 'Researcher', emoji: '🔬', desc: 'Researching AI tools & trends' },
  { id: 'creator', label: 'Creator', emoji: '✨', desc: 'Creating content with AI' },
];

const CATEGORIES = [
  { id: 'Writing', emoji: '✍️' },
  { id: 'Image Generation', emoji: '🎨' },
  { id: 'Video', emoji: '🎥' },
  { id: 'Coding', emoji: '💻' },
  { id: 'Research', emoji: '🔬' },
  { id: 'Productivity', emoji: '⚡' },
  { id: 'Marketing', emoji: '📣' },
  { id: 'Audio', emoji: '🎵' },
  { id: 'Business', emoji: '💼' },
  { id: 'Design', emoji: '🎭' },
  { id: 'Automation', emoji: '🤖' },
  { id: 'Analytics', emoji: '📊' },
];

interface Props {
  userId: string;
}

export default function OnboardingFlow({ userId }: Props) {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Only show once — check localStorage and DB
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) return;

    const checkDB = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', userId)
          .maybeSingle();
        if (data?.onboarding_completed) {
          localStorage.setItem(STORAGE_KEY, '1');
          return;
        }
        // Show onboarding after a short delay for better UX
        setTimeout(() => setShow(true), 1200);
      } catch {
        // If column doesn't exist yet, show anyway
        setTimeout(() => setShow(true), 1200);
      }
    };
    checkDB();
  }, [userId]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : prev.length < 3 ? [...prev, cat] : prev
    );
  };

  const complete = async () => {
    setSaving(true);
    try {
      await supabase.from('profiles').upsert({
        id: userId,
        preferred_role: role,
        preferred_categories: selectedCategories,
        newsletter_opt_in: newsletterOptIn,
        onboarding_completed: true,
      });
    } catch {
      // Best-effort — don't block the user
    }
    localStorage.setItem(STORAGE_KEY, '1');
    setSaving(false);
    setStep(5);
  };

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setShow(false);
  };

  if (!show) return null;

  const progress = Math.round((step / 5) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-800">
          <div
            className="h-1 bg-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <span className="text-xs font-medium text-gray-400">Step {Math.min(step, 4)} of 4</span>
          {step < 5 && (
            <button onClick={dismiss} aria-label="Skip onboarding" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="px-6 pb-6">
          {/* Step 1 — Role */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">What brings you here?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">We'll personalize your experience based on your goals.</p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all ${
                      role === r.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600'
                    }`}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{r.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{r.desc}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!role}
                className="mt-5 w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold transition-colors"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 — Categories */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Pick your focus areas</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Choose up to 3 categories — we'll surface the best tools for you.</p>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all ${
                      selectedCategories.includes(cat.id)
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : selectedCategories.length >= 3
                        ? 'border-gray-200 dark:border-gray-700 opacity-40 cursor-not-allowed'
                        : 'border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600'
                    }`}
                  >
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white leading-tight">{cat.id}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedCategories.length === 0}
                  className="flex-[2] py-3 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold transition-colors"
                >
                  Continue ({selectedCategories.length}/3) →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Newsletter */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Stay in the loop</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Get weekly tool drops, AI tips, and community highlights — tailored to <strong className="text-green-500">{selectedCategories.slice(0, 2).join(' & ')}</strong>.
              </p>
              <div
                onClick={() => setNewsletterOptIn(!newsletterOptIn)}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  newsletterOptIn ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${newsletterOptIn ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                  {newsletterOptIn && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">Yes, send me the weekly digest</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Unsubscribe anytime. No spam.</div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  ← Back
                </button>
                <button
                  onClick={complete}
                  disabled={saving}
                  className="flex-[2] py-3 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-60 text-black font-semibold transition-colors"
                >
                  {saving ? 'Saving…' : "Let's go! 🚀"}
                </button>
              </div>
              <button onClick={dismiss} className="mt-3 w-full text-xs text-gray-400 hover:text-gray-500 text-center transition-colors">
                Skip for now
              </button>
            </div>
          )}

          {/* Step 5 — Celebration */}
          {step === 5 && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're all set!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">
                Your dashboard is personalized for <strong className="text-green-500">{selectedCategories.join(', ')}</strong>.
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Complete your profile to earn your first badge. Welcome to Melanated In Tech! 🌱
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShow(false)}
                  className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-black font-semibold transition-colors"
                >
                  Explore Your Dashboard →
                </button>
                <a
                  href="/AITools"
                  onClick={() => setShow(false)}
                  className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-center transition-colors"
                >
                  Browse AI Tools
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
