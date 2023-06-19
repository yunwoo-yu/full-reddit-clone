import PostCard from '@/src/components/PostCard';
import { Comment, Post } from '@/src/types/types';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const UserPage = () => {
  const router = useRouter();
  const username = router.query.username;

  const { data, error } = useSWR(username ? `/users/${username}` : null);
  console.log(data);

  if (!data) return null;

  return (
    <div className='mx-auto flex max-w-5xl px-4 pt-5'>
      {/* 유저 포스트 댓글 리스트 */}
      <div className='w-full md:mr-3 md:w-8/12'>
        {data.userData.map((data: any) => {
          if (data.type === 'Post') {
            const post: Post = data;
            return <PostCard key={post.identifier} post={post} />;
          } else {
            const comment: Comment = data;
            return (
              <div
                key={comment.identifier}
                className='my-4 flex rounded bg-white'
              >
                <div className='w-10 flex-shrink-0 rounded-l border-r bg-white py-10 text-center'>
                  <i className='fas fa-comment-alt fa-xs text-gray-500' />
                </div>
                <div className='w-full p-2'>
                  <p className='mb-2 text-xs text-gray-500'>
                    <Link
                      href={`/u/${comment.username}`}
                      className='cursor-pointer hover:underline'
                    >
                      {comment.username}
                    </Link>{' '}
                    <span>commented on</span>{' '}
                    <Link
                      href={`${comment.post?.url}`}
                      className='cursor-pointer font-semibold hover:underline'
                    >
                      {comment.post?.title}
                    </Link>{' '}
                    <span>•</span>{' '}
                    <Link
                      href={`/r/${comment.post?.subName}`}
                      className='cursor-pointer text-black hover:underline'
                    >
                      /r/{comment.post?.subName}
                    </Link>
                  </p>
                  <hr />
                  <p className='p-1'>{comment.body}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
      {/* 유저 정보 */}
      <div className='ml-3 hidden w-4/12 md:block'>
        <div className='flex items-center rounded-t bg-gray-400 p-3'>
          <Image
            src='https://www.gravatar.com/avatar/0000?d=mp&f=y'
            alt='user profile'
            className='rounded-full border border-white'
            width={40}
            height={40}
          />
          <p className='text-md pl-2'>{data.user.username}</p>
        </div>
        <div className='rounded-b bg-white p-2'>
          <p>{dayjs(data.user.createdAt).format('YYYY.MM.DD')} 가입</p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
