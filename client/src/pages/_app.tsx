import axios from 'axios';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';

  return <Component {...pageProps} />;
}
