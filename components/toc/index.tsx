'use client';

import Link from 'next/link';
import { Heading } from './toc.type';
import { cn } from '@/lib/cn';
import { useGetCurrentHeadingID } from './use-get-current-heading-id';

type TOCProps = {
  headings: Heading[];
};

export function TOC({ headings }: TOCProps) {
  const { currentHeadingID } = useGetCurrentHeadingID({ headings });

  return (
    <ul
      className={cn(
        'fixed top-28 right-8 xl:!col-start-4 xl:row-span-6 xl:row-start-3',
        'hidden space-y-2 font-sans xl:block',
      )}
    >
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={cn(
            'hover:text-red-400 ',
            currentHeadingID === heading.id ? 'text-red-400' : 'text-gray-500',
          )}
        >
          <Link href={`#${heading.id}`}>{heading.content}</Link>
        </li>
      ))}
    </ul>
  );
}
