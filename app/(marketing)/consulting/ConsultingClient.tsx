'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type BrandConstants = {
  SITE_NAME: string;
  PRIMARY_CTA_TEXT: string;
  CONTACT_EMAIL: string;
  BUSINESS_CITY: string;
  TWITTER_HANDLE: string;
  LOGO_SRC: string;
  OG_IMAGE: string;
  BASE_URL: string;
};

interface Props {
  constants: BrandConstants;
}

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function useEscapeToClose(onClose: () => void) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);
}

function useFocusTrap(isOpen: boolean, containerRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const focusable = containerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          (last || first)?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          (first || last)?.focus();
        }
      }
    }
    containerRef.current.addEventListener('keydown', onKeyDown as any);
    (first || containerRef.current).focus();
    return () => containerRef.current?.removeEventListener('keydown', onKeyDown as any);
  }, [isOpen, containerRef]);
}

function ContactModal({ open, onClose, context }: { open: boolean; onClose: () => void; context?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEscapeToClose(onClose);
  useFocusTrap(open, containerRef);
  const [status, setStatus] = useState<string>('');

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-labelledby="contact-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl outline-none dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 id="contact-modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
            Send us a message
          </h3>
          <button
            onClick={onClose}
            aria-label="Close contact form"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        <p aria-live="polite" className="sr-only">
          {status}
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = String(formData.get('name') || '').trim();
            const email = String(formData.get('email') || '').trim();
            const phone = String(formData.get('phone') || '').trim();
            const company = String(formData.get('company') || '').trim();
            const message = String(formData.get('message') || '').trim();

            if (!name || !email || !message) {
              alert('Please fill in name, email, and message.');
              return;
            }
            try {
              const subject = context ? `Consulting Inquiry — ${context}` : 'Consulting Inquiry';
              const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, company, subject, message }),
              });
              if (res.ok) {
                setStatus("Thanks! We'll get back to you within 24 hours.");
                onClose();
              } else {
                setStatus('There was an error sending your message.');
                alert('Something went wrong. Please try again.');
              }
            } catch {
              setStatus('Network error. Please try again.');
              alert('Network error. Please try again.');
            }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name *
              </label>
              <input
                id="c-name"
                name="name"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="c-email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <input
                id="c-email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="c-phone" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone (optional)
              </label>
              <input
                id="c-phone"
                name="phone"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="c-company" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company/Org
              </label>
              <input
                id="c-company"
                name="company"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="c-message" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message *
              </label>
              <textarea
                id="c-message"
                name="message"
                rows={4}
                required
                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StarterKitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEscapeToClose(onClose);
  useFocusTrap(open, containerRef);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-labelledby="starter-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl outline-none dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 id="starter-modal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
            Get the AI Starter Kit
          </h3>
          <button
            onClick={onClose}
            aria-label="Close starter kit"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Drop your email and we’ll send a link to the Starter Kit (PDF, videos, and templates).
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get('name') || '').trim();
            const email = String(fd.get('email') || '').trim();
            const org = String(fd.get('org') || '').trim();
            const goal = String(fd.get('goal') || '').trim();
            if (!name || !email) {
              alert('Please enter name and email.');
              return;
            }
            try {
              const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name,
                  email,
                  subject: 'Starter Kit Signup',
                  message: `Org Type: ${org}\nGoal: ${goal}`,
                }),
              });
              if (res.ok) {
                onClose();
                alert('Thanks! Check your inbox soon.');
              } else {
                alert('Error submitting. Please try again.');
              }
            } catch {
              alert('Network error. Please try again.');
            }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="s-name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name *
              </label>
              <input
                id="s-name"
                name="name"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="s-email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <input
                id="s-email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="s-org" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Organization Type
              </label>
              <input
                id="s-org"
                name="org"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="s-goal" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Biggest AI Goal
              </label>
              <input
                id="s-goal"
                name="goal"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Get Starter Kit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ConsultingClient({ constants }: Props) {
  const [contactOpen, setContactOpen] = useState(false);
  const [starterOpen, setStarterOpen] = useState(false);
  const [contactContext, setContactContext] = useState<string>('');
  const [showSticky, setShowSticky] = useState(false);

  const openContact = useCallback((context?: string) => {
    if (context) setContactContext(context);
    window.dispatchEvent(new CustomEvent('vaultx-cta', { detail: 'contact-click' }));
    setContactOpen(true);
  }, []);

  const openStarter = useCallback(() => {
    window.dispatchEvent(new CustomEvent('vaultx-cta', { detail: 'starter-click' }));
    setStarterOpen(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      // Reveal sticky CTA after reader has meaningfully engaged
      const threshold = Math.max(400, window.innerHeight * 0.4);
      setShowSticky(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                The right AI tools for your use case—set up and taught.
              </h1>
              <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                We help you choose what to use, how to use it, and ship workflows your team actually runs on Monday.
                <span className="font-semibold"> No fluff. Real wins.</span>
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  data-analytics="contact-hero"
                  onClick={() => openContact('Hero CTA')}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {constants.PRIMARY_CTA_TEXT}
                </button>
                <button
                  data-analytics="starter-hero"
                  onClick={openStarter}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Get the Starter Kit
                </button>
              </div>
              <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                Higher-Ed Ready · SMB Friendly · Faith & Nonprofit Support
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                <Image
                  src={constants.OG_IMAGE}
                  alt="VaultX AI consulting hero"
                  width={1200}
                  height={675}
                  className="mx-auto rounded-xl h-auto w-full"
                  sizes="(min-width: 1024px) 700px, 100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" role="main">
        {/* Value Props */}
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Strategy that’s real',
                  desc: 'Practical roadmaps with fast wins',
                },
                {
                  title: 'Training without gatekeeping',
                  desc: 'No certs, hands-on skills your team uses Monday',
                },
                {
                  title: 'Done-with-you setups',
                  desc: 'Workflows, prompts, automations installed',
                },
                {
                  title: 'Kingdom & Culture aligned',
                  desc: 'Empowerment with integrity',
                },
              ].map((card, i) => (
                <div key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services (3 pillars) */}
        <section className="bg-white py-16 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What we do</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Strategy & Implementation',
                  body: '90-Day AI Roadmaps, Workflow Builds (ChatGPT, Zapier/Make, Notion AI), integrations with your stack.',
                  outcomes: ['Save time', 'Reduce costs', 'Improve CX'],
                },
                {
                  title: 'Training',
                  body: 'Team Workshops (2–4h), Private Trainings, 1:1 Coaching.',
                  outcomes: ['Upskill staff', 'SOPs that stick', 'Real usage by Monday'],
                },
                {
                  title: 'Toolkits & Templates',
                  body: 'Prompt Packs, Automation Blueprints, AI Starter Kit (videos + guides).',
                  outcomes: ['Generate leads', 'Reduce manual work', 'Faster content'],
                },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{s.body}</p>
                  <ul className="mt-4 space-y-1">
                    {s.outcomes.map((o) => (
                      <li key={o} className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <span aria-hidden>✅</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Section-level CTA retained below; per-card CTA removed for clarity */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tool Guidance Grid: Which tool is best for… */}
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Which tool is best for…</h2>
              <button
                data-analytics="contact-tool-guidance"
                onClick={() => openContact('Tool selection help')}
                className="hidden rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:block dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Ask us for your stack
              </button>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { use: 'Content & Marketing', rec: 'ChatGPT + Jasper + Canva', why: 'Fast content, brand-safe, team-friendly' },
                { use: 'Customer Support', rec: 'Intercom + Zendesk AI', why: 'Triage, faster replies, fewer escalations' },
                { use: 'Ops Automation', rec: 'Zapier/Make + Notion AI', why: 'Automate busywork across apps' },
                { use: 'Analytics & Reporting', rec: 'Power BI / Tableau + GA4', why: 'Dashboards that answer real questions' },
                { use: 'Docs & SOPs', rec: 'Notion AI + ChatGPT', why: 'Reusable prompts, instant SOP drafts' },
                { use: 'Image & Creative', rec: 'Midjourney + Canva', why: 'On-brand visuals, quick turnaround' }
              ].map((g, i) => (
                <div key={i} className="rounded-2xl bg-white p-6 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{g.use}</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{g.rec}</div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{g.why}</p>
                  {/* Per-row CTA removed; use section-level ask button to reduce choice overload */}
                </div>
              ))}
            </div>
            <div className="mt-6 sm:hidden">
              <button
                data-analytics="contact-tool-guidance-mobile"
                onClick={() => openContact('Tool selection help')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Ask us for your stack
              </button>
            </div>
          </div>
        </section>

        {/* Packages (3 cards) */}
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Pick your momentum</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Quick Launch AI',
                  desc: 'Spin up your first workflow and prompt system in days.',
                  bestFor: 'New to AI and want fast wins',
                  delivers: ['One workflow live', 'Team quick start', 'Checklist + SOP'],
                },
                {
                  title: 'AI Growth Plan',
                  desc: '90-day plan with 2–3 initiatives and training.',
                  bestFor: 'Leaders who want measurable ROI',
                  delivers: ['Roadmap + KPIs', 'Workshops', 'Implementation support'],
                },
                {
                  title: 'AI Transformation Day',
                  desc: 'Deep-dive strategy + build with your team in one day.',
                  bestFor: 'Teams ready to ship now',
                  delivers: ['Live builds', 'Team training', 'Follow-up support'],
                },
              ].map((p, i) => (
                <div key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{p.title}</h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{p.desc}</p>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Best for: {p.bestFor}</p>
                  <ul className="mt-4 space-y-1">
                    {p.delivers.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                        <span aria-hidden>📦</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Section-level CTA retained elsewhere; per-card CTA removed */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before / After story */}
        <section className="bg-white py-16 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-8 lg:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Before</h3>
                <ul className="mt-3 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Too many tools. Not sure what to use.</li>
                  <li>• Ideas stuck in docs. No working workflows.</li>
                  <li>• Team confused. Low adoption.</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">After</h3>
                <ul className="mt-3 space-y-2 text-gray-800 dark:text-gray-200">
                  <li>• Clear picks for your stack—why and how.</li>
                  <li>• One or two workflows live and documented.</li>
                  <li>• Team trained with SOPs and prompts.</li>
                </ul>
                <div className="mt-6">
                  <button
                    data-analytics="contact-before-after"
                    onClick={() => openContact('Before/After CTA')}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {constants.PRIMARY_CTA_TEXT}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-white py-16 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How we roll</h2>
            <ol className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Discover', desc: 'We listen. We map. We prioritize.' },
                { title: 'Design', desc: 'Simple plans with real outcomes.' },
                { title: 'Build', desc: 'We install and integrate with your stack.' },
                { title: 'Train', desc: 'Hands-on workshops so the team actually uses it.' },
              ].map((s, i) => (
                <li key={i} className="rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
                  <div className="text-2xl font-extrabold text-blue-600">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{s.desc}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-gray-600 dark:text-gray-400">No fluff. No confusion. Just momentum.</p>
          </div>
        </section>

        {/* Industries */}
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Industries we serve</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                'Small Businesses',
                'Higher Ed',
                'Nonprofits & Churches',
                'Real Estate',
                'Creators/Coaches',
                'Crypto & DeFi Educators',
              ].map((i) => (
                <div key={i} className="rounded-xl bg-white p-4 text-gray-800 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
                  {i}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results / Proof */}
        <section className="bg-white py-16 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Proof & results</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                { name: 'A. Rivera', role: 'Director, EDU', quote: 'We shipped more in two weeks than last quarter.' },
                { name: 'J. Patel', role: 'Founder, SMB', quote: 'Clear plan, fast wins, team trained. No fluff.' },
                { name: 'S. Lee', role: 'Ops Lead, Nonprofit', quote: 'Finally AI that respects our values and time.' },
              ].map((t, i) => (
                <figure key={i} className="rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
                  <blockquote className="text-gray-800 dark:text-gray-200">“{t.quote}”</blockquote>
                  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{t.name}</span> — {t.role}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-10 grid grid-cols-3 items-center gap-6 opacity-70 [filter:grayscale(100%)]">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-10 rounded bg-gray-200 dark:bg-gray-700" aria-hidden />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 py-16 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">FAQ</h2>
            <dl className="mt-8 grid gap-6 md:grid-cols-2">
              {[
                { q: 'Is this hands-on training?', a: 'Yes. We build together so your team can run it Monday.' },
                { q: 'What tools do you set up?', a: 'ChatGPT, Zapier/Make, Notion AI, and your current stack where possible.' },
                { q: 'Faith-based?', a: 'Values-driven and faith-rooted. We serve everyone with integrity.' },
                { q: 'Remote or on-site?', a: 'Both. We coach worldwide and can join on-site where needed.' },
                { q: 'Data security?', a: 'Privacy-first configs; enterprise options available.' },
                { q: 'Timeline to value?', a: 'Many see wins in week one with the Quick Launch.' },
                { q: 'Custom quotes?', a: 'Yes—send us a message to start the conversation.' },
                { q: 'Refunds?', a: 'Reasonable policy. We aim for outcomes, not surprises.' },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl bg-white p-6 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                  <dt className="text-lg font-semibold text-gray-900 dark:text-white">{item.q}</dt>
                  <dd className="mt-2 text-gray-700 dark:text-gray-300">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="relative isolate overflow-hidden bg-blue-600 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-3xl font-bold text-white">Let’s map your next 90 days.</h2>
              <button
                data-analytics="contact-cta-banner"
                onClick={() => openContact('CTA Banner')}
                className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
              >
                {constants.PRIMARY_CTA_TEXT}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="sr-only" aria-hidden>{constants.SITE_NAME}</footer>

      {/* Modals */}
      {/* Enhance ContactModal to include context in subject */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} context={contactContext} />
      <StarterKitModal open={starterOpen} onClose={() => setStarterOpen(false)} />

      {/* Sticky mobile CTA */}
      {showSticky && !contactOpen && !starterOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 shadow-md sm:hidden dark:border-gray-700 dark:bg-gray-900/95 [padding-bottom:env(safe-area-inset-bottom)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <span className="text-sm text-gray-800 dark:text-gray-200">Let’s plan your next 90 days.</span>
            <button
              data-analytics="contact-sticky-mobile"
              onClick={() => openContact('Sticky mobile CTA')}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {constants.PRIMARY_CTA_TEXT}
            </button>
          </div>
        </div>
      )}
    </>
  );
}


