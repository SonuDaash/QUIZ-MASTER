'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Database,
  FileQuestion,
  PlusCircle,
  UploadCloud,
  CheckSquare,
  BookOpen,
  List,
  Users,
  FileText,
  FileEdit,
  CalendarClock,
  Swords,
  BarChart3,
  TrendingUp,
  BrainCircuit,
  Target,
  PieChart,
  Headphones,
  Settings,
  Brain,
} from 'lucide-react';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Question Bank',
    items: [
      { title: 'All Questions', href: '/admin/questions', icon: Database },
      { title: 'Add Question', href: '/admin/questions/new', icon: PlusCircle },
      { title: 'Import Questions', href: '/admin/questions/import', icon: UploadCloud },
      { title: 'Print / Export PDF', href: '/admin/questions/export', icon: FileText },
      { title: 'Review Queue', href: '/admin/questions/review', icon: CheckSquare },
    ],
  },
  {
    title: 'Live Competition',
    items: [
      { title: 'Stage Projector Mode', href: '/admin/stage', icon: Swords },
    ],
  },
  {
    title: 'Organization',
    items: [
      { title: 'Subjects', href: '/admin/subjects', icon: BookOpen },
      { title: 'Topics', href: '/admin/topics', icon: List },
      { title: 'Students', href: '/admin/students', icon: Users },
    ],
  },
  {
    title: 'Tests',
    items: [
      { title: 'Create Test', href: '/admin/tests/create', icon: FileEdit },
      { title: 'Scheduled Tests', href: '/admin/tests/scheduled', icon: CalendarClock },
      { title: 'Mock Competitions', href: '/admin/tests/mock', icon: Swords },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { title: 'Student Performance', href: '/admin/analytics/students', icon: TrendingUp },
      { title: 'Topic Mastery', href: '/admin/analytics/topics', icon: BrainCircuit },
      { title: 'Weak Areas', href: '/admin/analytics/weak-areas', icon: Target },
      { title: 'Question Analytics', href: '/admin/analytics/questions', icon: PieChart },
    ],
  },
  {
    title: 'Tools',
    items: [
      { title: 'Audio Visual', href: '/admin/av', icon: Headphones },
      { title: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-slate-900 text-slate-100", className)}>
      <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6 font-bold text-lg tracking-tight">
        <Brain className="h-6 w-6 text-blue-500" />
        <span className="text-white">SMART MIND</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {navGroups.map((group, i) => (
          <div key={i} className="mb-6 px-4">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white",
                      isActive ? "bg-slate-800 text-blue-400" : "text-slate-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
