import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import { Sub } from '../types/types';
import axios from 'axios';
import Image from 'next/image';
import { useAuthState } from '../context/auth';

const Home: NextPage = () => {
  const fetcher = async (url: string) => (await axios.get(url)).data;

  const { authenticated } = useAuthState();
  const address = 'http://localhost:4000/api/subs/sub/topSubs';

  const { data: topSubs } = useSWR<Sub[]>(address, fetcher);

  return (
    <div className='mx-auto flex max-w-5xl px-4 pt-5'>
      {/* 포스트 리스트 */}
      <div className='w-full md:mr-3 md:w-8/12'></div>
      {/* 사이드 바 */}
      <div className='ml-3 hidden w-4/12 md:block'>
        <div className='rounded border bg-white'>
          <div className='border-b p-4'>
            <p className='text-center text-lg font-semibold'>상위 커뮤니티</p>
          </div>
          {/* 커뮤니티 리스트 */}
          <div>
            {topSubs?.map((sub) => (
              <div
                key={sub.name}
                className='flex items-center border-b px-4 py-2 text-xs'
              >
                <Link href={`/r/${sub.name}`}>
                  <Image
                    src={sub.imageUrl}
                    className='h-[24px] cursor-pointer rounded-full'
                    alt='Sub'
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href={`/r/${sub.name}`} className='font ml-2'>
                  {sub.name}
                </Link>
                <p className='ml-auto font-medium'>{sub.postCount}</p>
              </div>
            ))}
          </div>
          {authenticated && (
            <div className='w-full py-6 text-center'>
              <Link
                href='/subs/create'
                className='w-full rounded bg-gray-400 p-2 text-center text-white'
              >
                커뮤니티 만들기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
