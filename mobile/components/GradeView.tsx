import React, { useState, useMemo } from 'react';
import { Plus, Trash2, GraduationCap, Calculator } from 'lucide-react';
import { Grade } from '../types';

interface GradeViewProps {
  grades: Grade[];
  setGrades: React.Dispatch<React.SetStateAction<Grade[]>>;
}

const GradeView: React.FC<GradeViewProps> = ({ grades, setGrades }) => {
  const [newGrade, setNewGrade] = useState<Partial<Grade>>({ credit: 1.0 });

  const addGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrade.courseName || newGrade.score === undefined) return;

    const grade: Grade = {
      id: Date.now().toString(),
      courseName: newGrade.courseName,
      credit: newGrade.credit || 1.0,
      score: newGrade.score,
    };

    setGrades([...grades, grade]);
    setNewGrade({ courseName: '', credit: 1.0, score: undefined });
  };

  const deleteGrade = (id: string) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  // ZJU Common 4.0/5.0 Calculation Logic (Simplified for general use)
  // Converting score (0-100) to GPA
  const calculateGPA = useMemo(() => {
    if (grades.length === 0) return { gpa4: 0, gpa5: 0, totalCredits: 0, weightedAvg: 0 };

    let totalPoints4 = 0;
    let totalPoints5 = 0;
    let totalCredits = 0;
    let weightedScoreSum = 0;

    grades.forEach(g => {
        let gp4 = 0;
        let gp5 = 0;

        // Standard 4.0 scale approximation
        if (g.score >= 85) gp4 = 4.0;
        else if (g.score >= 75) gp4 = 3.0;
        else if (g.score >= 60) gp4 = 2.0;
        else gp4 = 0;

        // Standard 5.0 scale (ZJU common formula often varies, using standard linear mapping for demo)
        // ZJU: >85 = 4.0, 60-85 linear? Let's use a simpler mapping: score / 20.
        // Or strictly: 
        if (g.score >= 95) gp5 = 5.0;
        else if (g.score >= 90) gp5 = 4.5;
        else if (g.score >= 85) gp5 = 4.0;
        else if (g.score >= 80) gp5 = 3.5;
        else if (g.score >= 70) gp5 = 3.0;
        else if (g.score >= 60) gp5 = 2.5;
        else gp5 = 0;

        totalPoints4 += gp4 * g.credit;
        totalPoints5 += gp5 * g.credit;
        totalCredits += g.credit;
        weightedScoreSum += g.score * g.credit;
    });

    return {
        gpa4: (totalPoints4 / totalCredits).toFixed(2),
        gpa5: (totalPoints5 / totalCredits).toFixed(2),
        totalCredits,
        weightedAvg: (weightedScoreSum / totalCredits).toFixed(1)
    };
  }, [grades]);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white/80 backdrop-blur-md p-4 sticky top-0 z-10 border-b border-slate-200">
         <h2 className="text-2xl font-bold text-zju-blue mb-4">Grades & GPA</h2>
         
         {/* Stats Card */}
         <div className="bg-gradient-to-r from-zju-blue to-blue-600 rounded-2xl p-4 text-white shadow-lg mb-4 flex justify-between items-center">
            <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Weighted Avg</p>
                <p className="text-3xl font-mono font-bold">{calculateGPA.weightedAvg}</p>
            </div>
            <div className="text-right">
                 <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">GPA (4.0 / 5.0)</p>
                 <div className="flex items-baseline justify-end space-x-2">
                    <span className="text-2xl font-bold">{calculateGPA.gpa4}</span>
                    <span className="text-sm opacity-60">/</span>
                    <span className="text-xl opacity-90">{calculateGPA.gpa5}</span>
                 </div>
                 <p className="text-[10px] opacity-70 mt-1">{calculateGPA.totalCredits} Credits</p>
            </div>
         </div>

         {/* Add Grade Form */}
         <form onSubmit={addGrade} className="flex space-x-2 items-end">
            <div className="flex-1">
                <input 
                    className="w-full p-2 rounded-xl border border-slate-200 text-sm bg-white"
                    placeholder="Course Name"
                    value={newGrade.courseName || ''}
                    onChange={e => setNewGrade({...newGrade, courseName: e.target.value})}
                    required
                />
            </div>
            <div className="w-16">
                 <input 
                    type="number" step="0.5"
                    className="w-full p-2 rounded-xl border border-slate-200 text-sm bg-white text-center"
                    placeholder="Cred"
                    value={newGrade.credit}
                    onChange={e => setNewGrade({...newGrade, credit: parseFloat(e.target.value)})}
                    required
                />
            </div>
            <div className="w-16">
                 <input 
                    type="number"
                    className="w-full p-2 rounded-xl border border-slate-200 text-sm bg-white text-center"
                    placeholder="Score"
                    value={newGrade.score !== undefined ? newGrade.score : ''}
                    onChange={e => setNewGrade({...newGrade, score: parseFloat(e.target.value)})}
                    required
                />
            </div>
            <button type="submit" className="bg-zju-blue text-white p-2.5 rounded-xl shadow-md">
                <Plus size={20} />
            </button>
         </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
         {grades.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <Calculator size={48} className="mb-4 opacity-50" />
                <p>Add grades to calculate GPA</p>
             </div>
         ) : (
             grades.map((grade) => (
                <div key={grade.id} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                    <div className="flex-1">
                        <p className="font-bold text-slate-800">{grade.courseName}</p>
                        <p className="text-xs text-slate-500">{grade.credit} Credits</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`font-mono font-bold text-lg ${grade.score >= 90 ? 'text-emerald-600' : grade.score >= 60 ? 'text-zju-blue' : 'text-red-500'}`}>
                            {grade.score}
                        </span>
                        <button onClick={() => deleteGrade(grade.id)} className="text-slate-300 hover:text-red-500">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
             ))
         )}
      </div>
    </div>
  );
};

export default GradeView;