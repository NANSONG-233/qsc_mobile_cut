import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings } from 'lucide-react';

const DEFAULT_FOCUS_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;

const FocusView: React.FC = () => {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [isEditing, setIsEditing] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  // Load saved duration preferences if available (could add persistence here)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Optional: Play sound or notification here
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const saveSettings = () => {
      setIsEditing(false);
      resetTimer(); // Apply changes
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? focusDuration * 60 : breakDuration * 60;
  const progress = (totalTime - timeLeft) / totalTime * 100;

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-slate-100 relative">
      
      {/* Settings Toggle */}
      <button 
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-zju-blue transition-colors"
      >
        <Settings size={24} />
      </button>

      {/* Mode Switcher */}
      <div className="mb-8 flex bg-white rounded-full p-1 shadow-sm border border-slate-200">
        <button
          onClick={() => switchMode('focus')}
          className={`px-6 py-2 rounded-full text-sm font-bold flex items-center transition-all ${
            mode === 'focus' ? 'bg-zju-blue text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Brain size={16} className="mr-2" /> Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`px-6 py-2 rounded-full text-sm font-bold flex items-center transition-all ${
            mode === 'break' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Coffee size={16} className="mr-2" /> Break
        </button>
      </div>

      {!isEditing ? (
        <div className="relative w-72 h-72 flex items-center justify-center mb-12">
            {/* SVG Circle Progress */}
            <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                    cx="144"
                    cy="144"
                    r="130"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-200"
                />
                <circle
                    cx="144"
                    cy="144"
                    r="130"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 130}
                    strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
                    strokeLinecap="round"
                    className={`${mode === 'focus' ? 'text-zju-blue' : 'text-emerald-500'} transition-all duration-1000 ease-linear`}
                />
            </svg>
            <div className="text-center z-10">
                <div className={`text-6xl font-mono font-bold tracking-tighter ${mode === 'focus' ? 'text-zju-blue' : 'text-emerald-600'}`}>
                    {formatTime(timeLeft)}
                </div>
                <p className="text-slate-400 font-medium mt-2 uppercase tracking-widest text-xs">
                    {isActive ? 'Running' : 'Paused'}
                </p>
            </div>
        </div>
      ) : (
        <div className="w-72 h-72 flex flex-col items-center justify-center bg-white rounded-full shadow-inner border border-slate-100 mb-12 animate-in fade-in">
            <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-6">Timer Settings</h3>
            
            <div className="flex flex-col space-y-4 w-48">
                <div>
                    <label className="text-xs text-slate-400">Focus Duration (min)</label>
                    <input 
                        type="number" 
                        value={focusDuration}
                        onChange={(e) => setFocusDuration(Math.max(1, parseInt(e.target.value) || 25))}
                        className="w-full text-center text-2xl font-bold text-zju-blue border-b border-slate-200 focus:border-zju-blue focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-400">Break Duration (min)</label>
                    <input 
                        type="number" 
                        value={breakDuration}
                        onChange={(e) => setBreakDuration(Math.max(1, parseInt(e.target.value) || 5))}
                        className="w-full text-center text-2xl font-bold text-emerald-500 border-b border-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
                <button onClick={saveSettings} className="bg-slate-800 text-white text-xs py-2 rounded-full mt-2">
                    Save & Reset
                </button>
            </div>
        </div>
      )}

      {!isEditing && (
        <div className="flex space-x-6">
            <button
            onClick={resetTimer}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors shadow-sm"
            >
            <RotateCcw size={24} />
            </button>
            <button
            onClick={toggleTimer}
            className={`w-20 h-20 flex items-center justify-center rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all ${
                mode === 'focus' ? 'bg-zju-blue shadow-blue-900/20' : 'bg-emerald-500 shadow-emerald-900/20'
            }`}
            >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
        </div>
      )}
    </div>
  );
};

export default FocusView;