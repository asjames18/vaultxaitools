'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Heart, User } from 'lucide-react';

const navItems = [
  { name: 'Home',    href: '/',          icon: Home },
  { name: 'Explore', href: '/AITools',   icon: Grid },
  { name: 'Saved',   href: '/favorites', icon: Heart },
  { name: 'Account', href: '/dashboard', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-gray-900 border-t border-gray-800 safe-area-pb">
      <div className="flex items-stretch">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={name}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-green-400'
                  : 'text-gray-400 hover:text-green-400'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? 'stroke-green-400' : ''}`}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span>{name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
