'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const adminNav = [
  { label: 'Dashboard',   href: '/admin' },
  { label: 'Tools',       href: '/admin/tools' },
  { label: 'Blog',        href: '/admin/blog' },
  { label: 'Analytics',   href: '/admin/analytics' },
  { label: 'Contact',     href: '/admin/contact' },
  { label: 'Automation',  href: '/admin/automation' },
  { label: 'Content',     href: '/admin/content-management' },
];

function AdminNav({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <span className="text-green-400 font-bold text-xs tracking-widest uppercase">Admin Panel</span>
        {onClose && (
          <button onClick={onClose} aria-label="Close menu" className="text-gray-400 hover:text-white md:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Admin navigation">
        {adminNav.map(item => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 ${
                isActive
                  ? 'bg-green-900/30 text-green-400'
                  : 'text-gray-300 hover:text-green-400 hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-800">
        <Link
          href="/"
          onClick={onClose}
          className="block px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-300 transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
        >
          ← Back to site
        </Link>
      </div>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop sidebar */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex-shrink-0 hidden md:flex flex-col">
        <AdminNav />
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:text-green-400 transition-colors"
        aria-label="Open admin menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-gray-900 flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminNav onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
