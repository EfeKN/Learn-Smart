"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 1000); // 1 second delay

    // Clean up the timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <h1>Redirecting to login...</h1>
    </div>
  );
}
