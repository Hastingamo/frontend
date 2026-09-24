// app/auth/callback/page.tsx
import { Suspense } from 'react';
import AuthCallbackClient from './clentss';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p>Signing you in…</p>}>
      <AuthCallbackClient />
    </Suspense>
  );
}