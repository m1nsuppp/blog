import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="w-full flex flex-col justify-center items-center">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">
        404
      </h1>
      <div className="bg-red-400 px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <div className="mt-5">
        <Link
          href="/"
          className="relative inline-block text-sm font-medium text-red-400 group active:text-red-500 focus:outline-none focus:ring"
        >
          <span className="relative block px-8 py-3 bg-slate-700/95 border border-current">
            Go Home
          </span>
        </Link>
      </div>
    </main>
  );
}
