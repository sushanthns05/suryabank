import React from 'react';
import { Megaphone, Crown, Clock, AlertTriangle } from 'lucide-react';
import { useCeoDirectives, getDirectivePriorityStyles } from '../../hooks/useCeoDirectives';

const CeoDirectiveBanner = ({ portal = 'managers', variant = 'manager', limit = 3, className = '' }) => {
  const { directives, loading } = useCeoDirectives(portal, { limit });

  if (loading || directives.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {directives.map((directive) => {
        const isCritical = directive.priority === 'critical';
        const isUrgent = directive.priority === 'urgent';
        const styles = getDirectivePriorityStyles(directive.priority, variant);

        if (variant === 'employee') {
          return (
            <div
              key={directive.id}
              className={`p-4 rounded-xl border flex items-start gap-4 shadow-md ${styles} ${isCritical ? 'animate-pulse' : ''}`}
            >
              <div className={`p-2 rounded-full shrink-0 ${isCritical ? 'bg-red-100 dark:bg-red-900/40 text-red-600' : isUrgent ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600'}`}>
                <Crown size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm uppercase tracking-wide text-slate-800 dark:text-white flex items-center gap-2">
                    CEO Office — {directive.title}
                  </h3>
                  <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                    <Clock size={12} />
                    {new Date(directive.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{directive.message}</p>
                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">{directive.author}</p>
              </div>
            </div>
          );
        }

        return (
          <div
            key={directive.id}
            className={`p-4 rounded-xl border flex items-start gap-4 ${styles} ${isCritical ? 'animate-pulse' : ''}`}
          >
            <div className={`p-2.5 rounded-full shrink-0 ${isCritical ? 'bg-red-500/20 text-red-400' : isUrgent ? 'bg-amber-500/20 text-amber-400' : 'bg-[#D4AF37]/20 text-[#D4AF37]'}`}>
              {isCritical ? <AlertTriangle size={20} /> : <Crown size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Megaphone size={14} className="text-[#D4AF37]" />
                  CEO Directive — {directive.title}
                </h3>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(directive.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{directive.message}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {directive.type}
                </span>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${isCritical ? 'bg-red-950 text-red-400 border-red-900' : isUrgent ? 'bg-amber-950 text-amber-400 border-amber-900' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {directive.priority}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CeoDirectiveBanner;
