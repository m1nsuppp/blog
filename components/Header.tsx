'use client';

import React from 'react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import { NextFont } from 'next/dist/compiled/@next/font';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/types';
import { siteConfig } from '@/config/site';

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

const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <header
      className={`${font.className} max-w-4xl mx-auto px-4 py-8 flex justify-between items-center`}
    >
      <h1 className="sm:text-4xl text-2xl tracking-tighter text-white hover:text-red-400">
        <Link href={'/'}>{siteConfig.name}</Link>
      </h1>
      <nav>
        <ul className="flex">
          {navItems.map((link) => (
            <li
              key={link.title}
              className="sm:text-lg text-base font-semibold pl-4"
            >
              <Link
                href={link.href}
                className={`border-b hover:border-b-red-400 hover:text-red-400 ${
                  pathname === link.href
                    ? 'border-b-red-400 text-red-400'
                    : 'border-b-transparent text-white'
                }`}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
