"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 1000); // 1 second delay

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <h1>31. Redirecting to login...</h1>
    </div>
  );
};

export default HomePage;
