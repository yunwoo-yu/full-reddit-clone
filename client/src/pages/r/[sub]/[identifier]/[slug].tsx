import { useAuthState } from '@/src/context/auth';
import { Comment, Post } from '@/src/types/types';
import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import useSWR from 'swr';

const PostPage = () => {
  const router = useRouter();
  const [newComment, setNewComment] = useState('');
  const { authenticated, user } = useAuthState();
  const { identifier, sub, slug } = router.query;
  const { data: post, mutate: postMutate } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );
  const { data: comments, mutate: commentMutate } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (newComment.trim() === '') {
      return;
    }

    try {
      await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
        body: newComment,
      });

      commentMutate();
      setNewComment('');
    } catch (error) {
      console.log(error);
    }
  };

  const vote = async (value: number, comment?: Comment) => {
    if (!authenticated) router.push('/login');

    // 클릭한 vote 일 경우 reset
    if (
      (!comment && value === post?.userVote) ||
      (comment && comment.userVote === value)
    ) {
      value = 0;
    }

    try {
      await axios.post('/votes', {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });

      commentMutate();
      postMutate();
    } catch (error) {}
  };

  console.log(post);

  return (
    <div className='mx-auto flex max-w-5xl px-4 pt-5'>
      <div className='w-full md:mr-3 md:w-8/12'>
        <div className='rounded bg-white'>
          {post && (
            <>
              <div className='flex'>
                {/* 좋아요 싫어요 부분 */}
                <div className='w-10 flex-shrink-0 rounded-l py-2 text-center'>
                  {/* 좋아요 */}
                  <div
                    className='mx-auto flex w-6 cursor-pointer justify-center rounded text-gray-400 hover:bg-gray-300 hover:text-red-500'
                    onClick={() => vote(1)}
                  >
                    {post.userVote === 1 ? (
                      <FaArrowUp className='text-red-500' />
                    ) : (
                      <FaArrowUp />
                    )}
                  </div>
                  <p className='text-xs font-bold'>{post.voteScore}</p>
                  {/* 싫어요 */}
                  <div
                    className='mx-auto flex w-6 cursor-pointer justify-center rounded text-gray-400 hover:bg-gray-300 hover:text-blue-500'
                    onClick={() => vote(-1)}
                  >
                    {post.userVote === -1 ? (
                      <FaArrowDown className='text-blue-500' />
                    ) : (
                      <FaArrowDown />
                    )}
                  </div>
                </div>
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
                  {/* 좋아요 싫어요 부분 */}
                  <div className='w-10 flex-shrink-0 rounded-l py-2 text-center'>
                    {/* 좋아요 */}
                    <div
                      className='mx-auto flex w-6 cursor-pointer justify-center rounded text-gray-400 hover:bg-gray-300 hover:text-red-500'
                      onClick={() => vote(1, comment)}
                    >
                      {comment.userVote === 1 ? (
                        <FaArrowUp className='text-red-500' />
                      ) : (
                        <FaArrowUp />
                      )}
                    </div>
                    <p className='text-xs font-bold'>{comment.voteScore}</p>
                    {/* 싫어요 */}
                    <div
                      className='mx-auto flex w-6 cursor-pointer justify-center rounded text-gray-400 hover:bg-gray-300 hover:text-blue-500'
                      onClick={() => vote(-1, comment)}
                    >
                      {comment.userVote === -1 ? (
                        <FaArrowDown className='text-blue-500' />
                      ) : (
                        <FaArrowDown />
                      )}
                    </div>
                  </div>
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
                    <p>{comment.body}</p>
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
