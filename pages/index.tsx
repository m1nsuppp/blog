import { Montserrat_Alternates } from 'next/font/google';

const font = Montserrat_Alternates({
  weight: '300',
  style: 'normal',
  preload: true,
  fallback: ['system-ui'],
  subsets: ['latin'],
});

export default function Home() {
  return (
    <main
      className={`${font.className} w-screen h-screen bg-green-700 text-white flex justify-center items-center`}
    >
      <h1 className="px-2 text-6xl">Welcome to m1nsuppp's UI LAB👨‍💻</h1>
    </main>
  );
}
