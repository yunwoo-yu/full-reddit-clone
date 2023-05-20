import axios from 'axios';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import AuthContextProvider from '../context/auth';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';
  axios.defaults.withCredentials = true;

  return (
    <AuthContextProvider>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
