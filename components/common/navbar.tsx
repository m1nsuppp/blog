import { navItems } from '@/data/navbar';
import { Path } from '@/lib/constants';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { cn } from '@/lib/utils';

const montserratFont = Montserrat({
  fallback: ['system-ui'],
  display: 'block',
  style: 'normal',
  weight: '300',
  subsets: ['latin'],
});

const Navbar: React.FC = () => {
  return (
    <nav
      className={cn(
        montserratFont.className,
        'max-w-4xl w-full bg-neutral-800',
        'flex justify-between items-end p-2',
        'text-white -tracking-widest mx-auto'
      )}
    >
      <Link
        href={Path.HOME}
        className="text-2xl hover:text-red-400"
      >
        {'m1nsuppp'}
      </Link>
      <div>
        {navItems.map((navItem) => (
          <Link
            key={navItem.title}
            href={navItem.href}
            className="text-lg mx-2 hover:text-red-400"
          >
            {navItem.title}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
