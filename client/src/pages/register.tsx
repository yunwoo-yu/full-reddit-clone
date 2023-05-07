import { FormEvent, useState } from 'react';
import Link from 'next/link';
import InputGroup from '../components/InputGroup';
import axios from 'axios';
import { useRouter } from 'next/router';

function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
  });

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post('/auth/register', {
        email,
        password,
        username,
      });

      console.log(res);
      router.push('/login');
    } catch (err: any) {
      console.log(err);
      setErrors(err.response.data || {});
    }
  };

  return (
    <div className='bg-white'>
      <div className='flex h-screen flex-col items-center justify-center p-6'>
        <div className='mx-auto w-10/12 md:w-96'>
          <h1 className='mb-2 text-lg font-medium'>회원가입</h1>
          <form onSubmit={onSubmitHandler}>
            <InputGroup
              placeholder='Email'
              value={email}
              setValue={setEmail}
              error={errors.email}
            />
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
              회원 가입
            </button>
          </form>
          <small>
            이미 가입하셨나요?
            <Link href='/login' className='ml-1 uppercase text-blue-500'>
              로그인
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Register;
