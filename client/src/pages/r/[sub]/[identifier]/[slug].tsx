import { Post } from '@/src/types/types';
import dayjs from 'dayjs';
import Link from 'next/link';

import { useRouter } from 'next/router';
import useSWR from 'swr';

const PostPage = () => {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  console.log(post);

  return (
    <div className='mx-auto flex max-w-5xl px-4 pt-5'>
      <div className='w-full md:mr-3 md:w-8/12'>
        <div className='rounded bg-white'>
          {post && (
            <>
              <div className='flex'>
                <div className='py-2 pr-2'>
                  <div className='flex items-center'>
                    <p className='text-xs text-gray-400'>
                      Posted by
                      <Link
                        href={`/u/${post.username}`}
                        className='mx-1 hover:underline'
                      >
                        /u/{post.username}
                      </Link>
                      <Link href={post.url} className='mx-1 hover:underline'>
                        {dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}
                      </Link>
                    </p>
                  </div>
                  <h1 className='my-1 text-xl font-medium'>{post.title}</h1>
                  <p className='my-3 text-sm'>{post.body}</p>
                  <div className='flex'>
                    <button>
                      <i className='fas fa-comment-alt fs-xs mr-1'></i>
                      <span className='font-bold'>
                        {post.commentCount} Comments
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
