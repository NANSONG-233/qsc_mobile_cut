export type Category = string;

export interface Course {
  id: string;
  name: string;
  location: string;
  teacher: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startPeriod: number; // 1-13
  endPeriod: number; // 1-13
  color: string;
  // New: Precise time overrides
  customStartTime?: string; // HH:MM
  customEndTime?: string; // HH:MM
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: Category;
  createdAt: number;
}

export interface Grade {
  id: string;
  courseName: string;
  credit: number;
  score: number; // 0-100 or 4.0 scale
  term?: string;
}

export interface UserProfile {
  isLoggedIn: boolean;
  username: string;
  studentId: string;
  avatar?: string;
}

export interface AppData {
  courses: Course[];
  tasks: Task[];
  grades: Grade[];
  user: UserProfile;
}

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const PERIODS = [
  { id: 1, label: '1 (8:00)', startTime: '08:00' },
  { id: 2, label: '2 (8:50)', startTime: '08:50' },
  { id: 3, label: '3 (9:50)', startTime: '09:50' },
  { id: 4, label: '4 (10:40)', startTime: '10:40' },
  { id: 5, label: '5 (11:30)', startTime: '11:30' },
  { id: 6, label: '6 (13:15)', startTime: '13:15' },
  { id: 7, label: '7 (14:05)', startTime: '14:05' },
  { id: 8, label: '8 (14:55)', startTime: '14:55' },
  { id: 9, label: '9 (15:55)', startTime: '15:55' },
  { id: 10, label: '10 (16:45)', startTime: '16:45' },
  { id: 11, label: '11 (18:30)', startTime: '18:30' },
  { id: 12, label: '12 (19:20)', startTime: '19:20' },
  { id: 13, label: '13 (20:10)', startTime: '20:10' },
];

export const DEFAULT_CATEGORIES = ['Study', 'Life', 'Sports', 'Other'];

export const CATEGORY_COLORS: Record<string, string> = {
  Study: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Life: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Sports: 'bg-orange-100 text-orange-700 border-orange-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
  // Fallback for custom
  Default: 'bg-blue-50 text-blue-600 border-blue-100',
};

export const COURSE_COLORS = [
  'bg-blue-100 border-blue-200 text-blue-800',
  'bg-indigo-100 border-indigo-200 text-indigo-800',
  'bg-teal-100 border-teal-200 text-teal-800',
  'bg-rose-100 border-rose-200 text-rose-800',
  'bg-amber-100 border-amber-200 text-amber-800',
  'bg-violet-100 border-violet-200 text-violet-800',
  'bg-fuchsia-100 border-fuchsia-200 text-fuchsia-800',
  'bg-lime-100 border-lime-200 text-lime-800',
];