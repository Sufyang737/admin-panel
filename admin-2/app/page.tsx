// page.tsx
"use client"; // Si necesitas usar hooks como useRouter o useEffect

import { useEffect } from 'react';
import { auth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { userId } = auth();
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
    } else {
      router.push('/dashboard');
    }
  }, [userId, router]);
}
