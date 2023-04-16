import React from 'react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import { NextFont } from 'next/dist/compiled/@next/font';
import { useRouter } from 'next/router';

type NavLink = {
  name: string;
  href: string;
};

const links: NavLink[] = [
  {
    name: 'Posts',
    href: '/',
  },
  {
    name: 'GitHub',
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
  const router = useRouter();
  const { pathname } = router;

  return (
    <header
      className={`${font.className} max-w-4xl mx-auto px-4 py-8 flex justify-between items-center`}
    >
      <h1 className="sm:text-4xl text-2xl tracking-tighter text-gray-700 hover:text-blue-600">
        <Link href={'/'}>{`m1nsuppp's blog`}</Link>
      </h1>
      <nav>
        <ul className="flex">
          {links.map((link) => (
            <li
              key={link.name}
              className="sm:text-lg text-base font-semibold pl-4"
            >
              <Link
                href={link.href}
                className={`hover:text-blue-600 ${
                  pathname === link.href ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
