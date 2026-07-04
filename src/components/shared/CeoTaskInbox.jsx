import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { CheckCircle } from 'lucide-react';

const PORTAL_AUDIENCES = {
  managers: ['managers', 'all_staff'],
  employees: ['employees', 'all_staff']
};

const CeoTaskInbox = ({ portal }) => {
  const [ceoTasks, setCeoTasks] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const employeeId = localStorage.getItem('employeeId') || '';
    const audiences = PORTAL_AUDIENCES[portal] || [];

    const qTasks = query(collection(db, 'ceo_tasks'), orderBy('timestamp', 'desc'));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        // Show tasks if it matches audience OR if explicitly assigned to this employee/manager
        if (data.status !== 'archived' && (audiences.includes(data.audience) || data.assignedEmployee === employeeId || data.assignedManager === employeeId)) {
          list.push({ id: docSnap.id, ...data });
        }
      });
      setCeoTasks(list);
    });

    return () => unsubTasks();
  }, [portal]);

  const handleUpdateTaskProgress = async (id, currentProgress) => {
    try {
      const newProgress = Math.min((currentProgress || 0) + 25, 100);
      const updates = { progress: newProgress };
      if (newProgress === 100) updates.status = 'Completed';
      else updates.status = 'In Progress';
      
      await updateDoc(doc(db, 'ceo_tasks', id), updates);
    } catch (err) {
      console.error("Failed to update task progress", err);
    }
  };

  if (ceoTasks.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-850 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm overflow-hidden mb-6 animate-in fade-in">
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-100 dark:border-indigo-800/50 flex items-center gap-3">
        <CheckCircle className="text-indigo-600 dark:text-indigo-400" size={20} />
        <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-300">Executive Task Inbox</h2>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {ceoTasks.map(task => (
          <div key={task.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-300 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-800 dark:text-white flex-1">{task.title}</h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ml-2 shrink-0 ${
                task.status === 'Completed' || task.status === 'CEO Approved' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' :
                'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
              }`}>
                {task.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 whitespace-pre-wrap">{task.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                  <span>Progress</span>
                  <span className={task.progress === 100 ? 'text-emerald-500' : ''}>{task.progress || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${task.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${task.progress || 0}%` }} />
                </div>
              </div>
              {(task.status === 'Pending' || task.status === 'In Progress') && (
                <button
                  onClick={() => handleUpdateTaskProgress(task.id, task.progress)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Update
                </button>
              )}
              {task.status === 'Completed' && (
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider text-right max-w-[80px]">Pending Approval</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CeoTaskInbox;
