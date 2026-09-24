// app/auth/callback/AuthCallbackClient.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');

    if (token && refreshToken) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      router.push('/Profile');
    } else {
      router.push('/login?error=oauth_failed');
    }
  }, [searchParams, router]);

  return <p>Signing you in…</p>;
}