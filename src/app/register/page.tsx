'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    router.replace(qs ? `/auth/register?${qs}` : '/auth/register');
  }, [router, searchParams]);

  return null;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RedirectContent />
    </Suspense>
  );
}

