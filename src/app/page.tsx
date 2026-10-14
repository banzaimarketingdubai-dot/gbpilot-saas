'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingPage from './onboarding/page';

export default function Home() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('gbpilot_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user && user.loggedIn) {
            router.replace('/dashboard');
            return;
          }
        }
      } catch (e) {
        console.error('Auth check error on home route:', e);
      }
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-google-bg flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-google-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <OnboardingPage />;
}
