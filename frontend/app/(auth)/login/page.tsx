'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pyramid } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const GoogleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    className="mr-2 shrink-0 inline-block"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function LoginPage() {
  const { user, loading, guestLogin, demoLogin } = useAuth();
  const router = useRouter();

  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/tasks');
    }
  }, [user, loading, router]);

  const handleGuestLogin = async () => {
    try {
      setIsGuestLoading(true);
      await guestLogin();
      toast.success('Welcome!');
      router.push('/tasks');
    } catch (error: any) {
      toast.error('Failed to log in');
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsDemoLoading(true);
      toast.info('Google OAuth not required for this assessment. Logging in as Dexter (Demo)...');
      await demoLogin();
      toast.success('Welcome!');
      router.push('/tasks');
    } catch (error: any) {
      toast.error('Failed to log in');
    } finally {
      setIsDemoLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-neutral-950 flex flex-col items-center justify-center p-4 transition-colors">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-5 h-5 rounded-md bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
          <Pyramid className="w-3.5 h-3.5" />
        </div>
        <span className="font-semibold text-sm text-gray-900 dark:text-white tracking-tight">
          Pyramid
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[380px] bg-white dark:bg-neutral-900 border border-gray-200/80 dark:border-neutral-800 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-7 transition-colors">
        <h1 className="text-lg font-semibold text-center text-gray-900 dark:text-white tracking-tight">
          Let's get back on track
        </h1>
        <p className="text-xs text-gray-500 dark:text-neutral-400 text-center mt-1 mb-5">
          Enter your email below to login to your account.
        </p>

        <div className="space-y-2.5">
          <Button
            type="button"
            variant="primary"
            className="w-full h-10 text-xs rounded-full"
            loading={isGuestLoading}
            onClick={() => handleGuestLogin()}
          >
            Continue as Guest
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full h-10 text-xs rounded-full font-medium text-gray-700 dark:text-neutral-200"
            loading={isDemoLoading}
            onClick={() => handleDemoLogin()}
          >
            {!isDemoLoading && <GoogleIcon />}
            Login with Google
          </Button>
        </div>

        <p className="text-[11px] text-gray-400 dark:text-neutral-500 text-center mt-5 leading-relaxed">
          By clicking continue, you agree to
          <br />
          our{' '}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-neutral-400 transition-colors"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-neutral-400 transition-colors"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
