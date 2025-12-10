import React, { useState } from 'react';
import { Calendar, CheckSquare, Clock, Settings, GraduationCap } from 'lucide-react';
import { usePersistentState } from './hooks/usePersistentState';
import { Course, Task, Grade, UserProfile } from './types';
import ScheduleView from './components/ScheduleView';
import TasksView from './components/TasksView';
import FocusView from './components/FocusView';
import SettingsView from './components/SettingsView';
import GradeView from './components/GradeView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'focus' | 'grades' | 'settings'>('schedule');
  
  // Persistent State
  const [courses, setCourses] = usePersistentState<Course[]>('zju-courses', []);
  const [tasks, setTasks] = usePersistentState<Task[]>('zju-tasks', []);
  const [grades, setGrades] = usePersistentState<Grade[]>('zju-grades', []);
  const [user, setUser] = usePersistentState<UserProfile>('zju-user', { 
    isLoggedIn: false, 
    username: '', 
    studentId: '' 
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <ScheduleView courses={courses} setCourses={setCourses} />;
      case 'tasks':
        return <TasksView tasks={tasks} setTasks={setTasks} />;
      case 'focus':
        return <FocusView />;
      case 'grades':
        return <GradeView grades={grades} setGrades={setGrades} />;
      case 'settings':
        return (
            <SettingsView 
                courses={courses} 
                tasks={tasks} 
                grades={grades}
                user={user}
                setCourses={setCourses} 
                setTasks={setTasks} 
                setGrades={setGrades}
                setUser={setUser}
            />
        );
      default:
        return <ScheduleView courses={courses} setCourses={setCourses} />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 md:max-w-md md:mx-auto md:border-x md:border-slate-200 md:shadow-2xl font-sans">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-2 pb-safe z-50">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <NavButton 
            id="schedule" 
            label="Schedule" 
            icon={Calendar} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <NavButton 
            id="tasks" 
            label="Tasks" 
            icon={CheckSquare} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <NavButton 
            id="focus" 
            label="Focus" 
            icon={Clock} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <NavButton 
            id="grades" 
            label="Grades" 
            icon={GraduationCap} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          <NavButton 
            id="settings" 
            label="Me" 
            icon={Settings} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        </div>
      </nav>
    </div>
  );
};

// Helper Component for Nav
const NavButton = ({ id, label, icon: Icon, activeTab, setActiveTab }: any) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 min-w-[60px] ${
      activeTab === id ? 'text-zju-blue -translate-y-1' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 2} />
    <span className="text-[10px] font-medium mt-1">{label}</span>
  </button>
);

export default App;