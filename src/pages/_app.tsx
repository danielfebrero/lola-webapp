// src/pages/_app.tsx
import { AppProps } from "next/app";
import Head from "next/head";

import "../index.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Fabularius</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
