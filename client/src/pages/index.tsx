import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import useSWRInfinity from 'swr/infinite';
import { useAuthState } from '../context/auth';
import { Post, Sub } from '../types/types';
import PostCard from '../components/PostCard';
import { useEffect, useState } from 'react';

const address = '/subs/sub/topSubs';

const getKey = (pageIndex: number, previousPageData: Post[]) => {
  if (previousPageData && !previousPageData.length) return null;

  return `/posts?page=${pageIndex}`;
};

const Home = () => {
  const { authenticated } = useAuthState();
  const { data: topSubs } = useSWR<Sub[]>(address);
  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    mutate,
  } = useSWRInfinity<Post[]>(getKey);
  const [observedPost, setObservedPost] = useState('');
  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];

  const observeElement = (element: Element | null) => {
    if (!element) return;
    // 브라우저 뷰포트와 설정한 요소의 교차점을 관찰

    const observer = new IntersectionObserver(
      // entries는 IntersectionObserverEntry 인스턴스의 배열
      (entries) => {
        // isIntersectiong: 관찰 대상의 교차 상태
        if (entries[0].isIntersecting === true) {
          console.log('마지막 포스트 도착');
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );

    observer.observe(element);
  };

  useEffect(() => {
    // 포스트 없으면 return
    if (!posts || posts.length === 0) return;

    // posts 배열안에 마지막 post에 id 가져오기
    const id = posts[posts.length - 1].identifier;

    // posts 배열에 post가 추가돼서 마지막 post가 바뀌었다면
    // 바뀐 post 중 마지막 post를 obsevedPost로 변경

    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  return (
    <div className='mx-auto flex max-w-5xl px-4 pt-5'>
      {/* 포스트 리스트 */}
      <div className='w-full md:mr-3 md:w-8/12'>
        {isInitialLoading && (
          <p className='text-center text-lg'>로딩 중 입니다...</p>
        )}
        {posts?.map((post) => (
          <PostCard key={post.identifier} post={post} mutate={mutate} />
        ))}
      </div>
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
