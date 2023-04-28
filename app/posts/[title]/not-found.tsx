import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="mt-20 w-full flex flex-col justify-center items-center gap-y-10">
      <h1 className="text-white sm:text-4xl text-2xl">
        존재하지 않는 페이지입니다.
      </h1>
      <Link
        href="/"
        className="text-sm font-medium text-red-400 group active:text-red-500 focus:outline-none focus:ring"
      >
        <span className="relative block px-8 py-3 bg-slate-700/95 border border-current">
          홈으로 이동
        </span>
      </Link>
    </main>
  );
}
