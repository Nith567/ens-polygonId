import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import '../public/fonts/satoshi.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiConfig } from 'wagmi';
import { chains, wagmiConfig } from './providers';

function MyApp({ Component, pageProps }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  return (
    <>
    <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>
      <SessionProvider session={pageProps.session}>
      <Head>
        <title>Dock Verifiable Credentials Demo</title>
      </Head>
      {isMounted && <Component {...pageProps} />}
      </SessionProvider>
      </RainbowKitProvider>
    </WagmiConfig>
      </>
  );
}

export default MyApp;
