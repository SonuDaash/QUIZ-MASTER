'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Dumbbell,
  BookOpen,
  Trophy,
  Zap,
  BellRing,
  Headphones,
  AlertTriangle,
  LineChart,
  Brain
} from 'lucide-react';

const desktopNavItems = [
  { title: 'Home', href: '/student', icon: Home },
  { title: 'Practice', href: '/student/practice', icon: Dumbbell },
  { title: 'Subjects', href: '/student/subjects', icon: BookOpen },
  { title: 'Mock Quiz', href: '/student/mock', icon: Trophy },
  { title: 'Rapid Fire', href: '/student/rapid-fire', icon: Zap },
  { title: 'Buzzer', href: '/student/buzzer', icon: BellRing },
  { title: 'Audio Visual', href: '/student/audio-visual', icon: Headphones },
  { title: 'My Mistakes', href: '/student/mistakes', icon: AlertTriangle },
  { title: 'Progress', href: '/student/progress', icon: LineChart },
];

const mobileNavItems = [
  { title: 'Home', href: '/student', icon: Home },
  { title: 'Practice', href: '/student/practice', icon: Dumbbell },
  { title: 'Mock', href: '/student/mock', icon: Trophy },
  { title: 'Mistakes', href: '/student/mistakes', icon: AlertTriangle },
  { title: 'Progress', href: '/student/progress', icon: LineChart },
];

export function StudentNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r bg-slate-900 text-slate-100">
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6 font-bold text-lg tracking-tight">
          <Brain className="h-6 w-6 text-blue-500" />
          <span className="text-white">SMART MIND</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {desktopNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white",
                  isActive ? "bg-slate-800 text-blue-400" : "text-slate-300"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 py-1 transition-colors",
                isActive ? "text-blue-600 dark:text-blue-500" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-blue-50/50")} />
              <span className="text-[10px] font-medium leading-none">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
