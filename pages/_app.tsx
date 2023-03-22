import Header from '@/components/Header';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>{`m1nsuppp's blog`}</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  );
};

export default App;
