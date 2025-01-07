// src/pages/_app.tsx
import { AppProps } from "next/app";
import "../index.css"; // Adjust the path as necessary

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
