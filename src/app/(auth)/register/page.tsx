'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/client';
import { createUserProfile, createStudentProfile } from '@/lib/firebase/firestore';
import { Shield, GraduationCap, ArrowRight, AlertCircle, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function RegisterForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [grade, setGrade] = useState('9');
  const [schoolName, setSchoolName] = useState('');
  const [coordinatorKey, setCoordinatorKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSuccessfulRedirect = (userRole: 'student' | 'admin') => {
    if (nextParam && nextParam.startsWith('/')) {
      router.push(nextParam);
    } else if (userRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/student');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Admin approval key check (if choosing admin)
    if (role === 'admin' && coordinatorKey.trim() !== 'PABSON2083' && coordinatorKey.trim() !== 'ADMIN') {
      setError('Invalid Coordinator Registration Code. Leave as Student if you are a contestant.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await createUserProfile(user.uid, {
        id: user.uid,
        name,
        email,
        role,
        avatar_url: null,
      });

      if (role === 'student') {
        await createStudentProfile(user.uid, {
          id: user.uid,
          name,
          grade: parseInt(grade, 10) || 9,
        });
      }

      handleSuccessfulRedirect(role);
    } catch (err: any) {
      console.error('Registration error:', err);
      let message = 'An error occurred during registration.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already in use. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await createUserProfile(user.uid, {
        id: user.uid,
        name: user.displayName || name || 'Google User',
        email: user.email || '',
        role,
        avatar_url: user.photoURL,
      });

      if (role === 'student') {
        await createStudentProfile(user.uid, {
          id: user.uid,
          name: user.displayName || 'Google User',
          grade: parseInt(grade, 10) || 9,
        });
      }

      handleSuccessfulRedirect(role);
    } catch (err: any) {
      console.error('Google Sign-Up Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed popup
      } else {
        setError(err.message || 'Google Sign-Up failed.');
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
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-[#1e3a5f]">SMART MIND</span>
        </Link>
        <h1 className="text-center text-2xl sm:text-3xl font-black text-slate-900">
          Create Contestant Account
        </h1>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-600">
          PABSON Smart Mind Inter-School Quiz 2083
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200 space-y-6">
          {/* Accessible Role Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              Select Account Type
            </label>
            <div
              role="radiogroup"
              aria-label="Account Role Selection"
              className="grid grid-cols-2 gap-3"
            >
              <button
                type="button"
                role="radio"
                aria-checked={role === 'student'}
                onClick={() => setRole('student')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all min-h-[56px] cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  role === 'student'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <GraduationCap className={`w-4 h-4 ${role === 'student' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-xs">Student Contestant</span>
                </div>
                {role === 'student' && (
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.2 rounded-full font-bold">Selected</span>
                )}
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={role === 'admin'}
                onClick={() => setRole('admin')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all min-h-[56px] cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  role === 'admin'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Shield className={`w-4 h-4 ${role === 'admin' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="text-xs">School Coordinator</span>
                </div>
                {role === 'admin' && (
                  <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.2 rounded-full font-bold">Selected</span>
                )}
              </button>
            </div>
          </div>

          {/* Error Message with aria-live */}
          <div aria-live="polite" aria-atomic="true">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Google 1-Click Sign-Up */}
          <Button
            type="button"
            variant="outline"
            disabled={googleLoading || loading}
            onClick={handleGoogleSignUp}
            className="w-full min-h-[44px] h-11 border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-3 font-semibold text-xs sm:text-sm text-slate-700 shadow-sm cursor-pointer"
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
            Sign up with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Or register with email</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="min-h-[44px] h-11 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@school.edu.np"
                className="min-h-[44px] h-11 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password *
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="min-h-[44px] h-11 text-sm"
              />
            </div>

            {/* Student Grade Selector */}
            {role === 'student' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / Class</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full min-h-[44px] h-11 border border-slate-200 rounded-md px-3 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="8">Grade 8</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">School Name</label>
                  <Input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Little Angels"
                    className="min-h-[44px] h-11 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Coordinator Verification Key */}
            {role === 'admin' && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-indigo-900">
                  Coordinator Verification Code *
                </label>
                <Input
                  type="text"
                  required
                  value={coordinatorKey}
                  onChange={(e) => setCoordinatorKey(e.target.value)}
                  placeholder="Enter PABSON2083"
                  className="min-h-[44px] h-11 text-sm bg-white"
                />
                <p className="text-[11px] text-indigo-700 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Use coordinator key <code>PABSON2083</code> or <code>ADMIN</code>
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] h-11 bg-[#1e3a5f] hover:bg-[#152840] text-white font-bold text-sm shadow-md cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
              Complete Registration
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Already have an account? Sign in
            </Link>
            <Link href="/demo" className="text-emerald-600 hover:underline font-bold">
              Try Demo Quiz →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
