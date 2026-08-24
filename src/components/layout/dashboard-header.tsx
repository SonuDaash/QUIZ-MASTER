'use client';

import { useAuth } from '@/components/auth-provider';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  User as UserIcon, 
  LogOut,
  ChevronDown,
  Shield,
  GraduationCap,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { soundFx } from '@/lib/audio';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminSidebar } from './admin-sidebar';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function DashboardHeader({ isAdmin }: { isAdmin: boolean }) {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setIsMuted(soundFx.isMuted());
  }, []);

  const isActuallyAdmin = user?.role === 'admin';
  const isOnAdminRoute = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        {isActuallyAdmin && isOnAdminRoute && (
          <Sheet>
            <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "md:hidden" })}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-r-0">
              <AdminSidebar className="w-full border-none" />
            </SheetContent>
          </Sheet>
        )}

        <div className="hidden md:flex relative w-64 max-w-sm items-center">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search questions, topics..." 
            className="w-full pl-9 bg-muted/50 focus-visible:bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Quick Portal Switcher ONLY for Admin users */}
        {isActuallyAdmin && (
          isOnAdminRoute ? (
            <Link href="/student">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1.5 text-xs text-blue-600 border-blue-200 hover:bg-blue-50">
                <GraduationCap className="w-3.5 h-3.5" />
                Student View
              </Button>
            </Link>
          ) : (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                <Shield className="w-3.5 h-3.5" />
                Admin Portal
              </Button>
            </Link>
          )
        )}

        {/* Audio Mute/Unmute Quick Switcher */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const muted = soundFx.toggleMute();
              setIsMuted(muted);
            }}
            title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            className="text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-red-500" />
            ) : (
              <Volume2 className="h-5 w-5 text-emerald-600" />
            )}
            <span className="sr-only">Toggle sound</span>
          </Button>
        )}

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "flex items-center gap-2 pl-2 pr-1 h-auto py-1 cursor-pointer" })}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isActuallyAdmin ? 'bg-indigo-100 text-indigo-900' : 'bg-blue-100 text-blue-900'}`}>
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="hidden flex-col items-start text-sm sm:flex">
              <span className="font-medium leading-none">{user?.name || 'User'}</span>
              <span className="text-xs text-muted-foreground capitalize mt-1">
                {user?.role || 'Student'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
                <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-semibold w-fit uppercase ${isActuallyAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                  {user?.role || 'Student'}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* ONLY Admins have link to Admin Dashboard in dropdown */}
            {isActuallyAdmin && (
              <Link href="/admin">
                <DropdownMenuItem className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4 text-indigo-600" />
                  <span>Admin Dashboard</span>
                </DropdownMenuItem>
              </Link>
            )}

            <Link href="/student">
              <DropdownMenuItem className="cursor-pointer">
                <GraduationCap className="mr-2 h-4 w-4 text-blue-600" />
                <span>Student Dashboard</span>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
