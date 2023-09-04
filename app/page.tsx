import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';

const HomePage = () => {
  return (
    <main className="w-screen flex justify-center items-center">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1
          className={cn(
            'animate-typing overflow-hidden whitespace-nowrap',
            'border-r-4 border-r-white pr-5 text-5xl text-white font-bold',
          )}
        >
          {siteConfig.name}🔥
        </h1>
      </div>
    </main>
  );
};

export default HomePage;
