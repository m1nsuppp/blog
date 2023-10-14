import Link from 'next/link';
import NavigationItem from './navigation-item';
import { cn } from '@/lib/cn';
import { Montserrat } from 'next/font/google';
import { navItems } from './constants';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: '100',
});

const Navigation = () => {
  return (
    <nav className={cn('flex justify-between items-end -tracking-widest', montserrat.className)}>
      <Link href={'/'}>
        <h1 className={'text-2xl'}>Like A Fool</h1>
      </Link>
      <div className="flex justify-normal items-start gap-x-3 text-lg">
        {navItems.map((navItem) => (
          <NavigationItem
            key={navItem.href}
            {...navItem}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
