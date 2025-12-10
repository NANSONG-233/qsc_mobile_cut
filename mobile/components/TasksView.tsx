import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Check, Circle, Tag } from 'lucide-react';
import { Task, Category, CATEGORY_COLORS, DEFAULT_CATEGORIES } from '../types';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, setTasks }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<string>('Study');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Derive all unique categories from existing tasks + defaults
  const availableCategories = useMemo(() => {
    const cats = new Set(DEFAULT_CATEGORIES);
    tasks.forEach(t => cats.add(t.category));
    return Array.from(cats);
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (isCustomCategory && !newTaskCategory.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      category: newTaskCategory.trim(),
      createdAt: Date.now(),
    };

    setTasks([task, ...tasks]);
    setNewTaskTitle('');
    // Reset custom category toggle after add
    if (isCustomCategory) {
        setIsCustomCategory(false);
        setNewTaskCategory('Study');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getCategoryColor = (cat: string) => {
    return CATEGORY_COLORS[cat] || CATEGORY_COLORS['Default'];
  };

  const filteredTasks = tasks.filter(t => filter === 'All' || t.category === filter);
  const activeTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white/80 backdrop-blur-md p-4 sticky top-0 z-10 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-zju-blue mb-4">Tasks</h2>
        
        {/* Quick Add Form */}
        <form onSubmit={addTask} className="mb-4 space-y-2">
          <div className="relative">
            <input
                type="text"
                placeholder="Add a new task..."
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-zju-blue focus:bg-white transition-all shadow-inner"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button 
                type="submit"
                className="absolute right-2 top-2 p-1.5 bg-zju-blue text-white rounded-xl hover:bg-zju-light shadow-md disabled:opacity-50"
                disabled={!newTaskTitle.trim()}
            >
                <Plus size={20} />
            </button>
          </div>
          
          {/* Category Selector */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
             <Tag size={16} className="text-slate-400 min-w-[16px]" />
             {!isCustomCategory ? (
                 <>
                    <select 
                        value={newTaskCategory}
                        onChange={(e) => {
                            if (e.target.value === 'custom_plus') {
                                setIsCustomCategory(true);
                                setNewTaskCategory('');
                            } else {
                                setNewTaskCategory(e.target.value);
                            }
                        }}
                        className="bg-transparent text-sm text-slate-600 font-medium focus:outline-none max-w-[150px]"
                    >
                        {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="custom_plus">+ Custom Tag</option>
                    </select>
                 </>
             ) : (
                <div className="flex items-center space-x-2 flex-1">
                    <input 
                        type="text" 
                        autoFocus
                        placeholder="Type tag name..."
                        className="bg-slate-100 px-2 py-1 rounded-md text-sm outline-none border border-zju-blue w-32"
                        value={newTaskCategory}
                        onChange={(e) => setNewTaskCategory(e.target.value)}
                        onBlur={() => {
                            if(!newTaskCategory.trim()) {
                                setIsCustomCategory(false);
                                setNewTaskCategory('Study');
                            }
                        }}
                    />
                    <button 
                        type="button" 
                        onClick={() => {
                            if (!newTaskCategory.trim()) {
                                setIsCustomCategory(false);
                                setNewTaskCategory('Study');
                            }
                        }}
                        className="text-xs text-slate-400"
                    >Cancel</button>
                </div>
             )}
          </div>
        </form>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
            <button
                onClick={() => setFilter('All')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filter === 'All'
                    ? 'bg-zju-blue text-white shadow-md' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
            >
                All
            </button>
            {availableCategories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        filter === cat 
                        ? 'bg-zju-blue text-white shadow-md' 
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Active Tasks */}
        <div className="space-y-3">
          {activeTasks.map(task => (
            <div key={task.id} className="group flex items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-2 duration-200">
              <button onClick={() => toggleTask(task.id)} className="text-slate-300 hover:text-zju-blue transition-colors">
                <Circle size={24} />
              </button>
              <div className="ml-3 flex-1">
                <p className="text-slate-800 font-medium">{task.title}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider font-bold mt-1 inline-block ${getCategoryColor(task.category)}`}>
                  {task.category}
                </span>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {activeTasks.length === 0 && filter === 'All' && tasks.length > 0 && (
             <div className="text-center py-8 text-slate-400 italic">All caught up! 🎉</div>
          )}
        </div>

        {/* Completed Tasks Accordion Style */}
        {completedTasks.length > 0 && (
            <div className="opacity-60 hover:opacity-100 transition-opacity">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Completed</h3>
                <div className="space-y-2">
                    {completedTasks.map(task => (
                        <div key={task.id} className="flex items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <button onClick={() => toggleTask(task.id)} className="text-zju-blue">
                            <Check size={20} />
                        </button>
                        <div className="ml-3 flex-1">
                            <p className="text-slate-500 line-through text-sm">{task.title}</p>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500">
                            <Trash2 size={16} />
                        </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl">📝</div>
                <p>No tasks yet. Stay productive!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TasksView;