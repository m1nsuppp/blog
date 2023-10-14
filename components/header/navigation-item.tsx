'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from './constants';

type NavigationItemProps = NavItem;

const NavigationItem = (props: NavigationItemProps) => {
  const pathname = usePathname();

  const isCurrentPathname = pathname === props.href;

  return (
    <Link
      href={props.href}
      key={props.href}
      className={isCurrentPathname ? 'text-red-400' : 'text-gray-200'}
    >
      {props.title}
    </Link>
  );
};

export default NavigationItem;
