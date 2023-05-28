import Link from 'next/link';
import { useAuthState } from '../context/auth';
import { Sub } from '../types/types';
import dayjs from 'dayjs';

type Props = {
  sub: Sub;
};

const SideBar = ({ sub }: Props) => {
  const { authenticated } = useAuthState();

  return (
    <div className='ml-3 hidden w-4/12 md:block'>
      <div className='rounded border bg-white'>
        <div className='rounded-t bg-gray-400 p-3'>
          <p className='font-semibold text-white'>커뮤니티에 대해서</p>
        </div>
        <div className='p-3'>
          <p className='mb-3 text-base'>{sub?.description}</p>
          <div className='mb-3 flex text-sm font-medium'>
            <div className='w-1/2'>
              <p>100</p>
              <p>멤버</p>
            </div>
          </div>
          <p className='my-3'>{dayjs(sub?.createdAt).format('MM-DD-YYYY')}</p>
          {authenticated && (
            <div className='mx-0 my-2'>
              <Link
                href={`/r/${sub.name}/create`}
                className='w-full rounded bg-gray-400 p-2 text-sm text-white'
              >
                포스트 생성
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
