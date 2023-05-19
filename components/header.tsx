'use client';

import React from 'react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import { NextFont } from 'next/dist/compiled/@next/font';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { NavItem } from '@/types';
import { cls } from '@/lib/utils';

const navItems: NavItem[] = [
  {
    title: 'Posts',
    href: '/',
  },
  {
    title: 'GitHub',
    href: 'https://github.com/m1nsuppp',
  },
];

const font: NextFont = Montserrat({
  weight: '300',
  style: 'normal',
  subsets: ['latin'],
  preload: true,
  fallback: ['system-ui'],
});

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className={cls(
        font.className,
        'w-full py-4 mx-auto',
        'flex justify-between items-end'
      )}
    >
      <h1 className="tracking-tighter text-2xl text-gray-300">
        <Link href={'/'}>{siteConfig.name}</Link>
      </h1>
      <nav className="flex justify-center items-center gap-x-4 tracking-tighter">
        {navItems.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className={cls(
              'border-b hover:border-b-red-400 hover:text-red-400',
              pathname === link.href
                ? 'border-b-red-400 text-red-400'
                : 'border-b-transparent text-white'
            )}
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </header>
  );
}
