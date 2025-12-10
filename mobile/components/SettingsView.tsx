import React, { useRef, useState } from 'react';
import { Download, Upload, ShieldCheck, Database, FileJson, CheckCircle, AlertCircle, UserCircle, LogOut, Save } from 'lucide-react';
import { Course, Task, Grade, UserProfile } from '../types';
import { login } from '../api';

interface SettingsViewProps {
  courses: Course[];
  tasks: Task[];
  grades: Grade[];
  user: UserProfile;
  setCourses: (c: Course[]) => void;
  setTasks: (t: Task[]) => void;
  setGrades: (g: Grade[]) => void;
  setUser: (u: UserProfile) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ courses, tasks, grades, user, setCourses, setTasks, setGrades, setUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', studentId: '', password: '' });

  const handleExport = () => {
    const data = {
      courses,
      tasks,
      grades,
      user,
      exportDate: new Date().toISOString(),
      version: 'v5-director'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zju-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus({ type: 'success', msg: 'Data exported successfully!' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.courses && Array.isArray(json.courses)) setCourses(json.courses);
        if (json.tasks && Array.isArray(json.tasks)) setTasks(json.tasks);
        if (json.grades && Array.isArray(json.grades)) setGrades(json.grades);
        if (json.user) setUser(json.user);

        setStatus({ type: 'success', msg: 'Backup restored successfully!' });
      } catch (err) {
        setStatus({ type: 'error', msg: 'Invalid JSON file.' });
      }
      setTimeout(() => setStatus(null), 3000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if(authForm.studentId && authForm.password) {
          setStatus({ type: 'success', msg: 'Logging in...' });
          const result = await login(authForm.studentId, authForm.password);
          
          if (result.success) {
            setUser({
                isLoggedIn: true,
                username: authForm.username || authForm.studentId,
                studentId: authForm.studentId,
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${authForm.username || authForm.studentId}`
            });
            setIsLoginMode(false);
            setStatus({ type: 'success', msg: 'Login successful!' });
          } else {
            setStatus({ type: 'error', msg: result.message || 'Login failed' });
          }
          setTimeout(() => setStatus(null), 3000);
      }
  };

  const handleLogout = () => {
      setUser({ isLoggedIn: false, username: '', studentId: '' });
      setStatus({ type: 'success', msg: 'Logged out.' });
      setTimeout(() => setStatus(null), 3000);
  }

  return (
    <div className="h-full p-6 flex flex-col bg-slate-50 overflow-y-auto no-scrollbar pb-24">
      <h2 className="text-3xl font-bold text-zju-blue mb-8">Settings</h2>

      <div className="space-y-6">

        {/* User Profile Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                <UserCircle size={16} className="mr-2"/> User Profile
            </h3>
            
            {!user.isLoggedIn ? (
                !isLoginMode ? (
                    <div className="text-center py-4">
                        <p className="text-slate-600 mb-4">Sign in to personalize your experience.</p>
                        <button 
                            onClick={() => setIsLoginMode(true)}
                            className="w-full py-3 bg-zju-blue text-white rounded-xl font-bold shadow-md hover:bg-zju-light transition-colors"
                        >
                            Register / Login
                        </button>
                        <p className="text-xs text-slate-400 mt-2">Stored locally on device</p>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-3 animate-in fade-in">
                        <input 
                            type="text" 
                            placeholder="Student Name"
                            required
                            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200"
                            value={authForm.username}
                            onChange={e => setAuthForm({...authForm, username: e.target.value})}
                        />
                        <input 
                            type="text" 
                            placeholder="Student ID (e.g. 319010xxxx)"
                            required
                            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200"
                            value={authForm.studentId}
                            onChange={e => setAuthForm({...authForm, studentId: e.target.value})}
                        />
                        <input 
                            type="password" 
                            placeholder="Password"
                            required
                            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200"
                            value={authForm.password}
                            onChange={e => setAuthForm({...authForm, password: e.target.value})}
                        />
                        <div className="flex space-x-3">
                            <button type="button" onClick={() => setIsLoginMode(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold">Cancel</button>
                            <button type="submit" className="flex-1 py-3 bg-zju-blue text-white rounded-xl font-bold shadow-md">Save Profile</button>
                        </div>
                    </form>
                )
            ) : (
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-full bg-slate-100" />
                        <div>
                            <p className="font-bold text-lg text-slate-800">{user.username}</p>
                            <p className="text-xs text-slate-500 font-mono">ID: {user.studentId}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            )}
        </div>
        
        {/* Data Management */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                <Database size={16} className="mr-2"/> Data Sovereignty
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
                <button 
                    onClick={handleExport}
                    className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                    <div className="flex items-center">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-zju-blue group-hover:scale-110 transition-transform">
                            <Download size={20} />
                        </div>
                        <div className="ml-3 text-left">
                            <span className="block font-semibold text-slate-700">Export Backup</span>
                            <span className="block text-xs text-slate-500">Save detailed JSON file</span>
                        </div>
                    </div>
                </button>

                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors group cursor-pointer"
                >
                    <div className="flex items-center">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
                            <Upload size={20} />
                        </div>
                        <div className="ml-3 text-left">
                            <span className="block font-semibold text-slate-700">Import Data</span>
                            <span className="block text-xs text-slate-500">Restore from JSON backup</span>
                        </div>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImport} 
                        accept=".json" 
                        className="hidden" 
                    />
                </div>
            </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">
            <div className="flex items-center space-x-3 text-slate-800">
                <div className="p-2 bg-blue-50 rounded-lg text-zju-blue">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Director's Cut v5.1</h3>
                    <p className="text-sm text-slate-500">Offline-first & Privacy focused</p>
                </div>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
                This app runs entirely in your browser. No servers, no tracking. Your schedule, tasks, and grades are stored in your device's LocalStorage.
            </p>
        </div>

        {status && (
            <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm p-4 rounded-xl flex items-center shadow-lg animate-in fade-in slide-in-from-bottom-4 z-50 ${status.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {status.type === 'success' ? <CheckCircle size={20} className="mr-2"/> : <AlertCircle size={20} className="mr-2"/>}
                <span className="font-medium text-sm">{status.msg}</span>
            </div>
        )}
      </div>

      <div className="mt-auto text-center py-6 text-slate-300 text-xs">
         Designed with <span className="text-red-300">♥</span> for ZJU
      </div>
    </div>
  );
};

export default SettingsView;