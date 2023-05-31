import axios from 'axios';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';
import Navbar from '../components/Navbar';
import AuthContextProvider from '../context/auth';
import '../styles/globals.css';

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
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <AuthContextProvider>
        {!authRoute && <Navbar />}
        <div className={authRoute ? '' : 'pt-16'}>
          <Component {...pageProps} />
        </div>
      </AuthContextProvider>
    </SWRConfig>
  );
}
