'use client';

import { useAuth } from '@/components/auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { StudentNav } from '@/components/layout/student-nav';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Loader2, ShieldAlert, ArrowLeft, ShieldCheck, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, updateUserRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && mounted) {
      const redirectUrl = `/login?next=${encodeURIComponent(pathname || '/student')}`;
      router.replace(redirectUrl);
    }
  }, [user, loading, mounted, pathname, router]);

  // Centered session checking state (No blank flashes)
  if (!mounted || loading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 p-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f] flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-slate-800">Checking your session...</h2>
            <p className="text-xs text-slate-500 mt-0.5">Verifying authentication with Smart Mind Portal</p>
          </div>
        </div>
      </div>
    );
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const isActualAdmin = user.role === 'admin';

  const handleGrantAdmin = async () => {
    setSwitching(true);
    try {
      await updateUserRole('admin');
      router.refresh();
    } catch (e) {
      console.error('Failed to update role:', e);
    } finally {
      setSwitching(false);
    }
  };

  // ACCESS CONTROL: If user is not admin and visits /admin, show explanation and 1-click admin promotion
  if (isAdminRoute && !isActualAdmin) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4 shadow-sm">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="max-w-md text-sm text-slate-600 mb-2">
          Your account (<strong>{user.email || user.name}</strong>) is currently set to role: <span className="font-bold text-red-600 uppercase text-xs bg-red-50 px-2 py-0.5 rounded border border-red-200">Student</span>.
        </p>
        <p className="max-w-md text-xs text-slate-400 mb-6">
          The Admin Portal is restricted to quiz coordinators and administrators.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/student">
            <Button variant="outline" className="flex items-center gap-2 cursor-pointer min-h-[44px]">
              <ArrowLeft className="w-4 h-4" />
              Back to Student Dashboard
            </Button>
          </Link>

          {/* 1-Click Promote to Admin */}
          <Button 
            onClick={handleGrantAdmin}
            disabled={switching}
            className="bg-[#1e3a5f] hover:bg-[#152840] text-white flex items-center gap-2 cursor-pointer font-bold shadow-md min-h-[44px]"
          >
            {switching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            )}
            Grant Admin Role to this Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isAdminRoute ? (
        <div className="flex min-h-screen">
          <AdminSidebar className="hidden md:flex" />
          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardHeader isAdmin={true} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <DashboardHeader isAdmin={false} />
          <StudentNav />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      )}
    </div>
  );
}
