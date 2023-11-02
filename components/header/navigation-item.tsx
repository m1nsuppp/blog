'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from './constants';

export function NavigationItem(navItem: NavItem) {
  const pathname = usePathname();

  const isCurrentPathname = pathname === navItem.href;

  return (
    <Link
      href={navItem.href}
      key={navItem.href}
      className={isCurrentPathname ? 'text-red-400' : 'text-gray-200'}
    >
      {navItem.title}
    </Link>
  );
}
