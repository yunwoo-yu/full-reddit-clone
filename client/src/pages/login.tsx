import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';
import axios from 'axios';
import { useAuthDispatch, useAuthState } from '../context/auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { authenticated } = useAuthState();
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const router = useRouter();
  const dispatch = useAuthDispatch();

  if (authenticated) router.push('/');

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'auth/login',
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch('LOGIN', res.data?.user);

      router.replace('/');
    } catch (err: any) {
      console.log(err);
      setErrors(err.response.data || {});
    }
  };

  return (
    <div className='bg-white'>
      <div className='flex h-screen flex-col items-center justify-center p-6'>
        <div className='mx-auto w-10/12 md:w-96'>
          <h1 className='mb-2 text-lg font-medium'>로그인</h1>
          <form onSubmit={onSubmitHandler}>
            <InputGroup
              placeholder='Username'
              value={username}
              setValue={setUsername}
              error={errors.username}
            />
            <InputGroup
              placeholder='Password'
              value={password}
              setValue={setPassword}
              error={errors.password}
            />

            <button className='mb-1 w-full rounded border border-gray-400 bg-gray-400 py-2 text-xs font-bold uppercase text-white'>
              로그인
            </button>
          </form>
          <small>
            아직 아이디가 없나요?
            <Link href='/register' className='ml-1 uppercase text-blue-500'>
              회원가입
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
