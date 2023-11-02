import Link from 'next/link';

export default function NotFound() {
  return (
    <section
      id="not-found"
      className="flex flex-col justify-center items-center gap-y-10 mt-[30vh]"
    >
      <h2 className="font-bold text-2xl">존재하지 않는 페이지입니다.</h2>
      <Link
        href="/"
        className="p-3 bg-red-400 rounded font-semibold"
      >
        메인으로 돌아가기
      </Link>
    </section>
  );
}
