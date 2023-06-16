import { useRouter } from 'next/router';
import useSWR from 'swr';
import React from 'react';

const UserPage = () => {
  const router = useRouter();
  const username = router.query.username;

  const { data, error } = useSWR(username ? `/users/${username}` : null);
  if (!data) return null;

  return <div>UserPage</div>;
};

export default UserPage;
