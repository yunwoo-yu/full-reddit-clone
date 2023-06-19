import { Post } from '@/src/types/types';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

const PostCreate = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const router = useRouter();
  const { sub: subName } = router.query;

  const submitPost = async (e: FormEvent) => {
    e.preventDefault();

    if (title.trim() === '' || !subName) return;

    try {
      const { data: post } = await axios.post<Post>('/posts', {
        title: title.trim(),
        body,
        sub: subName,
      });

      router.push(`/r/${subName}/${post.identifier}/${post.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col justify-center pt-16'>
      <div className='mx-auto w-10/12 md:w-96'>
        <div className='rounded bg-white p-4'>
          <h1 className='mb-3 text-lg'>포스트 생성하기</h1>
          <form onSubmit={submitPost}>
            <div className='relative mb-2'>
              <input
                type='text'
                className='w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                placeholder='제목'
                maxLength={20}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                style={{ top: 10, right: 10 }}
                className='absolute mb-2 select-none text-sm text-gray-400'
              >
                {title.trim().length}/20
              </div>
            </div>
            <textarea
              rows={4}
              placeholder='설명'
              className='w-full rounded border border-gray-300 p-3 focus:border-blue-500 focus:outline-none'
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className='flex justify-end'>
              <button className='rounded border bg-gray-400 px-4 py-1 text-sm font-semibold text-white'>
                생성하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostCreate;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;

    if (!cookie) throw new Error('쿠키가 없습니다.');

    await axios.get(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/auth/me`, {
      headers: { cookie },
    });

    return { props: {} };
  } catch (error) {
    res.writeHead(307, { Location: '/login' }).end();

    return {
      props: {},
    };
  }
};
