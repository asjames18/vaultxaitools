import Link from 'next/link';

const adminNav = [
  { label: 'Dashboard',       href: '/admin' },
  { label: 'Tools',           href: '/admin/tools' },
  { label: 'Blog',            href: '/admin/blog' },
  { label: 'Analytics',       href: '/admin/analytics' },
  { label: 'Contact',         href: '/admin/contact' },
  { label: 'Automation',      href: '/admin/automation' },
  { label: 'Content',         href: '/admin/content-management' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar — hidden on mobile, visible md+ */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <span className="text-green-400 font-bold text-xs tracking-widest uppercase">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1" aria-label="Admin navigation">
          {adminNav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-green-400 hover:bg-gray-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <Link
            href="/"
            className="block px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-300 transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
