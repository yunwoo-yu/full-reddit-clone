import { useAuthState } from '@/src/context/auth';
import { Comment, Post } from '@/src/types/types';
import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import useSWR from 'swr';

const PostPage = () => {
  const router = useRouter();
  const [newComment, setNewComment] = useState('');
  const { authenticated, user } = useAuthState();
  const { identifier, sub, slug } = router.query;
  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );
  const { data: comments } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  console.log(comments);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (newComment.trim() === '') {
      return;
    }

    try {
      await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
        body: newComment,
      });

      setNewComment('');
    } catch (error) {
      console.log(error);
    }
  };

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
              {/* 댓글 작성 구간 */}
              <div className='mb-4  pr-6'>
                {authenticated ? (
                  <div>
                    <p className='mb-1 text-xs'>
                      <Link
                        href={`/u/${user?.username}`}
                        className='font-semibold text-blue-500'
                      >
                        {user?.username}
                      </Link>{' '}
                      으로 댓글 작성
                    </p>
                    <form onSubmit={handleSubmit}>
                      <textarea
                        className='w-full rounded border border-gray-300 p-3 focus:border-gray-600 focus:outline-none'
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                      ></textarea>
                      <div className='flex justify-end'>
                        <button
                          className='rounded bg-gray-400 px-3 py-1 text-white'
                          disabled={newComment.trim() === ''}
                        >
                          댓글 작성
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className='flex items-center justify-between rounded border border-gray-200 px-2 py-4'>
                    <p className='font-semibold text-gray-400'>
                      댓글 작성을 위해서 로그인 해주세요.
                    </p>
                    <div>
                      <Link
                        href={`/login`}
                        className='rounded bg-gray-400 px-3 py-1 text-white'
                      >
                        로그인
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {/* 댓글 리스트 부분 */}
              {comments?.map((comment) => (
                <div className='flex' key={comment.identifier}>
                  <div className='py-2 pr-2'>
                    <p className='mb-1 text-xs leading-none'>
                      <Link
                        href={`/u/${comment.username}`}
                        className='mr-1 font-bold hover:underline'
                      >
                        {comment.username}
                      </Link>
                      <span className='text-gray-600'>
                        {`${comment.voteScore}
                        posts
                        ${dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}
                        `}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
