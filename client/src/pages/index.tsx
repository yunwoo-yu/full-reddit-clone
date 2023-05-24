import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import { Sub } from '../types/types';
import axios from 'axios';

const Home: NextPage = () => {
  const fetcher = async (url: string) => (await axios.get(url)).data;

  const address = 'http://localhost:4000/api/subs/sub/topSubs';

  const { data: topSubs } = useSWR<Sub[]>(address, fetcher);

  console.log(topSubs);

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
          <div></div>
          <div className='w-full py-6 text-center'>
            <Link
              href='/subs/create'
              className='w-full rounded bg-gray-400 p-2 text-center text-white'
            >
              커뮤니티 만들기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
