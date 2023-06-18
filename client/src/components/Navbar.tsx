import axios from 'axios';
import { useAuthDispatch, useAuthState } from '../context/auth';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';

const Navbar = () => {
  const { loading, authenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLogout = () => {
    axios
      .post('/auth/logout')
      .then(() => {
        dispatch('LOGOUT');
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='h-13 fixed inset-x-0 top-0 z-10 flex items-center justify-between bg-white px-5'>
      <span className='text-2xl font-semibold text-gray-400'>
        <Link href='/'>
          <Image
            src='/reddit-name-logo.png'
            alt='logo'
            width={80}
            height={45}
          />
        </Link>
      </span>
      <div className='max-w-full px-4'>
        <div className='relative flex items-center rounded border bg-gray-100 hover:border-gray-700 hover:bg-white'>
          <FaSearch className='ml-2 text-gray-400' />
          <input
            type='text'
            placeholder='Search Reddit'
            className='h-7 rounded bg-transparent px-3 py-1 focus:outline-none'
          />
        </div>
      </div>

      <div className='flex'>
        {!loading &&
          (authenticated ? (
            <button
              className='mr-2 h-7 w-20 rounded bg-gray-400 px-2 text-center text-sm text-white'
              onClick={handleLogout}
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link
                href='/login'
                className='mr-2 h-7 w-20 rounded border border-blue-500 px-2 pt-1 text-center text-sm text-blue-500'
              >
                로그인
              </Link>
              <Link
                href='/register'
                className='h-7 w-20 rounded bg-gray-400 px-2 pt-1 text-center text-sm text-white'
              >
                회원가입
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
