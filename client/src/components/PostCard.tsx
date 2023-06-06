import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { Post } from '../types/types';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import { useAuthState } from '../context/auth';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Props {
  post: Post;
  subMutate?: () => void;
  mutate?: () => void;
}

const PostCard = ({ post, subMutate, mutate }: Props) => {
  const {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  } = post;
  const { authenticated } = useAuthState();
  const router = useRouter();
  const isInSubPage = router.pathname === '/r/[sub]';

  const vote = async (value: number) => {
    if (!authenticated) router.push('/login');

    if (value === userVote) value = 0;

    try {
      await axios.post('/votes', {
        identifier,
        slug,
        value,
      });
      if (mutate) mutate();
      if (subMutate) subMutate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='mb-4 flex rounded bg-white' id={identifier}>
      {' '}
      <div className='w-10 flex-shrink-0 rounded-l py-2 text-center'>
        {/* 좋아요 */}
        <div
          className='mx-auto flex w-6 cursor-pointer justify-center rounded text-gray-400 hover:bg-gray-300 hover:text-red-500'
          onClick={() => vote(1)}
        >
          {userVote === 1 ? (
            <FaArrowUp className='text-red-500' />
          ) : (
            <FaArrowUp />
          )}
        </div>
        <p className='text-xs font-bold'>{voteScore}</p>
        {/* 싫어요 */}
        <div
          className='mx-auto flex w-6 cursor-pointer justify-center rounded text-gray-400 hover:bg-gray-300 hover:text-blue-500'
          onClick={() => vote(-1)}
        >
          {userVote === -1 ? (
            <FaArrowDown className='text-blue-500' />
          ) : (
            <FaArrowDown />
          )}
        </div>
      </div>
      {/* 포스트 데이터 */}
      <div className='w-full p-2 '>
        {!isInSubPage && (
          <div className='flex items-center'>
            <Link href={`/r/${subName}`}>
              <Image
                src={sub!.imageUrl}
                alt='sub'
                className='cursor-pointer rounded-full'
                width={18}
                height={18}
              />
            </Link>
            <Link
              href={`/r/${subName}`}
              className='ml-2 cursor-pointer text-xs font-bold hover:underline'
            >
              /r/{subName}
            </Link>
            <span className='mx-1 text-xs text-gray-400'>•</span>
          </div>
        )}
        <p className='text-xs text-gray-400'>
          Posted by
          <Link href={`/r/${username}`} className='mx-1 hover:underline'>
            /u/{username}
          </Link>
          <Link href={url} className='mx-1 hover:underline'>
            {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
          </Link>
        </p>

        <Link href={url} className='my-1 text-lg font-medium'>
          {title}
        </Link>
        {body && <p className='my-1 text-sm'>{body}</p>}
        <div className='flex'>
          <Link href={url}>
            <i className='fas fa-comment-alt fa-xs mr-1' />
            <span>{commentCount}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
