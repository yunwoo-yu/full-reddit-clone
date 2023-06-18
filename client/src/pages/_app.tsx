import axios from 'axios';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';
import Navbar from '../components/Navbar';
import AuthContextProvider from '../context/auth';
import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';
  axios.defaults.withCredentials = true;

  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);

      return res.data;
    } catch (error: any) {
      throw error.respnse.data;
    }
  };

  return (
    <>
      <Head>
        <script
          defer
          src='https://use.fontawesome.com/releases/v6.1.1/js/all.js'
          integrity='sha384-xBXmu0dk1bEoiwd71wOonQLyH+VpgR1XcDH3rtxrLww5ajNTuMvBdL5SOiFZnNdp'
          crossOrigin='anonymous'
        ></script>
      </Head>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <AuthContextProvider>
          {!authRoute && <Navbar />}
          <div className={authRoute ? '' : 'min-h-screen bg-gray-200 pt-16'}>
            <Component {...pageProps} />
          </div>
        </AuthContextProvider>
      </SWRConfig>
    </>
  );
}
