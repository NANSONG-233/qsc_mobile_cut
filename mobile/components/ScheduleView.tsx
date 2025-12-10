import React, { useState } from 'react';
import { Plus, Trash2, MapPin, User, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Clock } from 'lucide-react';
import { Course, DAYS_OF_WEEK, PERIODS, COURSE_COLORS } from '../types';

interface ScheduleViewProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ courses, setCourses }) => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    dayOfWeek: new Date().getDay(),
    startPeriod: 1,
    endPeriod: 2,
    color: COURSE_COLORS[0],
    customStartTime: '',
    customEndTime: '',
  });
  const [useCustomTime, setUseCustomTime] = useState(false);

  // Day View Logic
  const dailyCourses = courses
    .filter((c) => c.dayOfWeek === selectedDay)
    .sort((a, b) => a.startPeriod - b.startPeriod);

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.location) return;
    
    const course: Course = {
      id: Date.now().toString(),
      name: newCourse.name,
      location: newCourse.location,
      teacher: newCourse.teacher || 'Unknown',
      dayOfWeek: newCourse.dayOfWeek ?? selectedDay,
      startPeriod: newCourse.startPeriod ?? 1,
      endPeriod: newCourse.endPeriod ?? 2,
      color: COURSE_COLORS[Math.floor(Math.random() * COURSE_COLORS.length)],
      customStartTime: useCustomTime ? newCourse.customStartTime : undefined,
      customEndTime: useCustomTime ? newCourse.customEndTime : undefined,
    };

    setCourses([...courses, course]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewCourse({
      dayOfWeek: selectedDay,
      startPeriod: 1,
      endPeriod: 2,
      color: COURSE_COLORS[0],
      customStartTime: '',
      customEndTime: '',
    });
    setUseCustomTime(false);
  };

  const deleteCourse = (id: string) => {
    if(window.confirm("Remove this course?")) {
        setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const nextDay = () => setSelectedDay((prev) => (prev + 1) % 7);
  const prevDay = () => setSelectedDay((prev) => (prev - 1 + 7) % 7);

  // Helper to render Week Grid Item
  const renderWeekItem = (course: Course) => {
    // Basic calculation for grid row placement
    const startRow = course.startPeriod;
    const span = (course.endPeriod - course.startPeriod) + 1;
    
    return (
      <div
        key={course.id}
        onClick={() => {
            if(window.confirm(`Delete ${course.name}?`)) deleteCourse(course.id);
        }}
        className={`absolute w-full p-1 rounded-md text-[9px] leading-tight font-medium overflow-hidden border border-white/20 shadow-sm cursor-pointer hover:brightness-95 transition-all ${course.color}`}
        style={{
          top: `${(startRow - 1) * 60}px`,
          height: `${span * 60 - 4}px`, // -4 for gap
        }}
      >
        <div className="font-bold truncate">{course.name}</div>
        <div className="truncate opacity-80">{course.location}</div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col relative bg-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 sticky top-0 z-10 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-zju-blue">Schedule</h2>
          <div className="flex space-x-2">
            <button
                onClick={() => setViewMode(viewMode === 'day' ? 'week' : 'day')}
                className="bg-slate-100 text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors"
            >
                {viewMode === 'day' ? <CalendarIcon size={20} /> : <List size={20} />}
            </button>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-zju-blue text-white p-2 rounded-full shadow-lg hover:bg-zju-light transition-colors active:scale-95"
            >
                <Plus size={20} />
            </button>
          </div>
        </div>

        {viewMode === 'day' && (
            <div className="flex items-center justify-between bg-slate-100 rounded-xl p-1">
                <button onClick={prevDay} className="p-2 text-slate-500 hover:text-zju-blue"><ChevronLeft size={20}/></button>
                <span className="font-semibold text-slate-700 w-24 text-center">{DAYS_OF_WEEK[selectedDay]}</span>
                <button onClick={nextDay} className="p-2 text-slate-500 hover:text-zju-blue"><ChevronRight size={20}/></button>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto relative no-scrollbar">
        {viewMode === 'day' ? (
          // DAY VIEW
          <div className="p-4 space-y-4 pb-24">
            {dailyCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">☕</span>
                </div>
                <p>No classes today. Enjoy!</p>
              </div>
            ) : (
              dailyCourses.map((course) => (
                <div
                  key={course.id}
                  className={`relative group p-4 rounded-2xl border ${course.color} shadow-sm transition-all hover:shadow-md`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{course.name}</h3>
                      <div className="flex items-center mt-2 text-sm opacity-80 space-x-3">
                        <span className="flex items-center"><MapPin size={14} className="mr-1" /> {course.location}</span>
                        <span className="flex items-center"><User size={14} className="mr-1" /> {course.teacher}</span>
                      </div>
                    </div>
                    <div className="text-right min-w-[4.5rem]">
                        {course.customStartTime ? (
                             <div className="flex flex-col items-end text-zju-blue font-mono">
                                <span className="text-lg font-bold">{course.customStartTime}</span>
                                <span className="text-xs opacity-70">to {course.customEndTime}</span>
                             </div>
                        ) : (
                            <>
                                <span className="block font-bold text-xl">{PERIODS.find(p => p.id === course.startPeriod)?.label.split(' ')[0]}</span>
                                <span className="text-xs opacity-70">to {PERIODS.find(p => p.id === course.endPeriod)?.label.split(' ')[0]}</span>
                            </>
                        )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="absolute top-2 right-2 p-2 bg-white/50 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          // WEEK GRID VIEW
          <div className="min-w-[120%] md:min-w-full pb-24 bg-white">
            <div className="grid grid-cols-[30px_repeat(7,1fr)] border-b border-slate-100 sticky top-0 bg-white z-10 shadow-sm">
                <div className="p-2 text-xs text-slate-400 border-r border-slate-50"></div>
                {DAYS_OF_WEEK.map((day, i) => (
                    <div key={i} className={`p-2 text-center text-xs font-bold uppercase ${i === new Date().getDay() ? 'text-zju-blue bg-blue-50' : 'text-slate-500'}`}>
                        {day}
                    </div>
                ))}
            </div>
            <div className="relative grid grid-cols-[30px_repeat(7,1fr)]">
                {/* Time Labels */}
                <div className="border-r border-slate-100 bg-slate-50/50">
                    {PERIODS.map((p) => (
                        <div key={p.id} className="h-[60px] text-[10px] text-slate-400 flex items-center justify-center border-b border-slate-100 relative">
                            {p.id}
                        </div>
                    ))}
                </div>
                
                {/* Columns for Days */}
                {DAYS_OF_WEEK.map((_, dayIndex) => (
                    <div key={dayIndex} className={`relative border-r border-slate-50 ${dayIndex === new Date().getDay() ? 'bg-blue-50/30' : ''}`}>
                         {/* Grid Lines */}
                        {PERIODS.map((p) => (
                            <div key={p.id} className="h-[60px] border-b border-slate-100" />
                        ))}
                        {/* Courses */}
                        {courses
                            .filter(c => c.dayOfWeek === dayIndex)
                            .map(c => renderWeekItem(c))}
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Add Course</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Course Name</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-zju-blue/20 focus:border-zju-blue transition-all"
                  placeholder="e.g. Advanced Mathematics"
                  value={newCourse.name || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Location</label>
                    <input
                    type="text"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-zju-blue"
                    placeholder="e.g. East 1-101"
                    value={newCourse.location || ''}
                    onChange={(e) => setNewCourse({ ...newCourse, location: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Teacher</label>
                    <input
                    type="text"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-zju-blue"
                    placeholder="Optional"
                    value={newCourse.teacher || ''}
                    onChange={(e) => setNewCourse({ ...newCourse, teacher: e.target.value })}
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Day of Week</label>
                <div className="flex justify-between bg-slate-50 p-1 rounded-xl">
                    {DAYS_OF_WEEK.map((d, i) => (
                        <button
                            key={i}
                            onClick={() => setNewCourse({...newCourse, dayOfWeek: i})}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${newCourse.dayOfWeek === i ? 'bg-zju-blue text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            {d.charAt(0)}
                        </button>
                    ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                     <label className="text-sm font-bold text-slate-700 flex items-center">
                        <Clock size={14} className="mr-1" /> Time Slot
                     </label>
                     <div className="flex items-center space-x-2">
                        <label className="text-xs text-slate-500">Exact Time</label>
                        <input 
                            type="checkbox" 
                            checked={useCustomTime} 
                            onChange={(e) => setUseCustomTime(e.target.checked)}
                            className="toggle-checkbox"
                        />
                     </div>
                  </div>

                  {!useCustomTime ? (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <span className="text-xs text-slate-400 block mb-1">Start Period</span>
                            <select
                                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-sm"
                                value={newCourse.startPeriod}
                                onChange={(e) => setNewCourse({ ...newCourse, startPeriod: Number(e.target.value) })}
                            >
                                {PERIODS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <span className="text-xs text-slate-400 block mb-1">End Period</span>
                            <select
                                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-sm"
                                value={newCourse.endPeriod}
                                onChange={(e) => setNewCourse({ ...newCourse, endPeriod: Number(e.target.value) })}
                            >
                                {PERIODS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                            </select>
                        </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 animate-in fade-in">
                        <div>
                             <span className="text-xs text-slate-400 block mb-1">Start Time</span>
                             <input 
                                type="time" 
                                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-sm"
                                value={newCourse.customStartTime || '08:00'}
                                onChange={(e) => setNewCourse({...newCourse, customStartTime: e.target.value})}
                             />
                        </div>
                        <div>
                             <span className="text-xs text-slate-400 block mb-1">End Time</span>
                             <input 
                                type="time" 
                                className="w-full p-2 rounded-lg bg-white border border-slate-200 text-sm"
                                value={newCourse.customEndTime || '09:35'}
                                onChange={(e) => setNewCourse({...newCourse, customEndTime: e.target.value})}
                             />
                        </div>
                        <p className="col-span-2 text-[10px] text-slate-400">
                            * Note: Calendar view will approximate position based on the nearest standard period.
                        </p>
                    </div>
                  )}
              </div>

              <button
                onClick={handleAddCourse}
                className="w-full py-3.5 bg-zju-blue hover:bg-zju-light text-white font-bold rounded-xl shadow-lg shadow-blue-900/10 mt-2 active:scale-95 transition-all"
              >
                Add to Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;