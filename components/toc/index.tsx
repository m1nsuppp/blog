import Link from 'next/link';
import { Heading } from './toc.type';
import { cn } from '@/lib/cn';

type TOCProps = {
  headings: Heading[];
};

const TOC = ({ headings }: TOCProps) => {
  return (
    <ul
      className={cn(
        'fixed top-20 right-48 xl:!col-start-4 xl:row-span-6 xl:row-start-3',
        'hidden space-y-2 font-sans xl:block',
      )}
    >
      {headings.map((heading) => (
        <li
          key={heading.slug}
          className="hover:text-red-400 text-gray-500"
        >
          <Link href={`#${heading.slug}`}>{heading.content}</Link>
        </li>
      ))}
    </ul>
  );
};

export default TOC;
