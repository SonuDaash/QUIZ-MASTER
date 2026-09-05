'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/client';
import { getUserProfile, createUserProfile } from '@/lib/firebase/firestore';
import { Shield, GraduationCap, ArrowRight, AlertCircle, Loader2, BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function LoginForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSuccessfulRedirect = (role: 'student' | 'admin') => {
    if (nextParam && nextParam.startsWith('/')) {
      router.push(nextParam);
    } else {
      router.push('/admin');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profile = await getUserProfile(user.uid);

      if (!profile) {
        await createUserProfile(user.uid, {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Admin',
          email: user.email || email,
          role: 'admin',
          avatar_url: user.photoURL,
        });
        profile = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Admin',
          email: user.email || email,
          role: 'admin',
          avatar_url: user.photoURL,
          created_at: new Date().toISOString(),
        };
      }

      handleSuccessfulRedirect(profile.role as any || 'admin');
    } catch (err: any) {
      console.error('Login error:', err);
      let message = 'An error occurred during admin login.';
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        message = 'Invalid email or password. Please verify your admin credentials.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please try again in a few moments.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await createUserProfile(user.uid, {
        id: user.uid,
        name: user.displayName || 'Admin User',
        email: user.email || '',
        role: 'admin',
        avatar_url: user.photoURL,
      });

      handleSuccessfulRedirect('admin');
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed popup
      } else if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        setError('Firebase Web API Key is missing or invalid.');
      } else {
        setError(err.message || 'Google Sign-In failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-4 group">
          <div className="w-11 h-11 rounded-xl bg-[#1e3a5f] flex items-center justify-center text-white shadow-md group-hover:bg-[#152840] transition-colors">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-[#1e3a5f]">SMART MIND</span>
        </Link>
        <h1 className="text-center text-2xl sm:text-3xl font-black text-slate-900">
          Admin & Coordinator Portal
        </h1>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-500">
          Question Bank Management • Stage Competition • Analytics
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 space-y-4">
        {/* STUDENT NOTICE BANNER */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <GraduationCap className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-emerald-900">Are you a student?</p>
            <p className="text-xs text-emerald-800 leading-relaxed">
              You do <strong>not</strong> need to log in! You can practice all questions freely with instant solutions directly on the homepage.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-black text-emerald-900 hover:text-emerald-950 underline mt-1"
            >
              Go to Home Practice (No Login Required) →
            </Link>
          </div>
        </div>

        {/* ADMIN LOGIN CARD */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" /> Authorized Admin Sign In
            </span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              Admin Only
            </span>
          </div>

          {/* Intended Destination Notice */}
          {nextParam && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Please sign in with administrator credentials to access: <code className="font-mono">{nextParam}</code></span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google 1-Click Sign-In */}
          <Button
            type="button"
            variant="outline"
            disabled={googleLoading || loading}
            onClick={handleGoogleSignIn}
            className="w-full min-h-[44px] h-11 border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-3 font-semibold text-xs sm:text-sm text-slate-700 shadow-xs cursor-pointer"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            )}
            Sign in as Admin with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Or email sign in</span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.edu.np"
                className="min-h-[44px] h-11 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Password
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="min-h-[44px] h-11 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] h-11 bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold text-sm shadow-md cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
              Access Admin Dashboard
            </Button>
          </form>

          {/* Back to Home Practice */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Return to Student Practice (Home)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
