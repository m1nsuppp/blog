import Navbar from '@/components/common/navbar';
import './globals.css';
import { ReactNode } from 'react';

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-neutral-800">
        <Navbar />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
