import SideBar from '@/src/components/SideBar';
import { useAuthState } from '@/src/context/auth';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

const SubPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ownSub, setOwnSub] = useState(false);
  const { authenticated, user } = useAuthState();
  const router = useRouter();
  const subName = router.query.sub;
  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null);

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;

    const file = event.target.files[0];

    const formData = new FormData();

    formData.append('file', file);
    formData.append('type', fileInputRef.current!.name);

    try {
      await axios.post(`subs/${sub.name}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openFileInput = (type: string) => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (!sub || !user) return;

    setOwnSub(authenticated && sub.username === user.username);
  }, [sub, authenticated, user]);

  console.log(sub);

  return (
    <>
      {sub && (
        <>
          <div>
            <input
              type='file'
              hidden
              ref={fileInputRef}
              onChange={uploadImage}
            />
            {/* 배너 이미지 */}
            <div className='bg-gray-400'>
              {sub.bannerUrl ? (
                <div
                  className='h-56'
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  onClick={() => openFileInput('banner')}
                />
              ) : (
                <div
                  className='h-20 bg-gray-400'
                  onClick={() => openFileInput('banner')}
                ></div>
              )}
            </div>
            {/* 커뮤니티 메타 데이터 */}
            <div className='h-20 bg-white'>
              <div className='relative mx-auto flex max-w-5xl px-5'>
                <div className='absolute' style={{ top: -15 }}>
                  {sub.imageUrl && (
                    <Image
                      src={sub.imageUrl}
                      alt='커뮤니티 이미지'
                      width={70}
                      height={70}
                      className='h-[70px] rounded-full'
                      onClick={() => openFileInput('image')}
                    />
                  )}
                </div>
                <div className='pl-24 pt-1'>
                  <div className='flex items-center'>
                    <h1 className=' text-3xl font-bold'>{sub.title}</h1>
                  </div>
                  <p className='text-small font-bold text-gray-400'>
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* 포스트와 사이드바 */}
          <div className='mx-auto flex max-w-5xl px-4 pt-5'>
            <div className='w-full md:mr-3 md:w-8/12'></div>
            <SideBar sub={sub} />
          </div>
        </>
      )}
    </>
  );
};

export default SubPage;
