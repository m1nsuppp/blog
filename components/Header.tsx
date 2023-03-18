import React from 'react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';

const font = Montserrat({
  weight: '300',
  style: 'normal',
  subsets: ['latin'],
  preload: true,
  fallback: ['system-ui'],
});

const Header: React.FC = () => {
  return (
    <header
      className={`${font.className} max-w-2xl mx-auto px-4 py-8 flex justify-between items-center`}
    >
      <h1 className="text-2xl tracking-tighter text-gray-700">
        m1nsuppp's blog
      </h1>
      <nav>
        <ul className="flex">
          <li className="text-lg font-semibold pl-4">
            <Link href={'/'} className="text-blue-600">
              Posts
            </Link>
          </li>
          <li className="text-lg font-semibold pl-4">
            <Link
              href={'https://github.com/m1nsuppp'}
              className="text-gray-700 hover:text-blue-600"
            >
              GitHub
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
