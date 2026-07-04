import React, { useState } from 'react';
import { Megaphone, X, Crown } from 'lucide-react';
import { useCeoDirectives, getDirectivePriorityStyles } from '../../hooks/useCeoDirectives';

const CustomerAnnouncementBanner = () => {
  const { directives, loading } = useCeoDirectives('customers', { limit: 1 });
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('dismissed_ceo_announcements') || '[]');
    } catch {
      return [];
    }
  });

  const visible = directives.find((d) => !dismissedIds.includes(d.id));
  if (loading || !visible) return null;

  const handleDismiss = () => {
    const updated = [...dismissedIds, visible.id];
    setDismissedIds(updated);
    sessionStorage.setItem('dismissed_ceo_announcements', JSON.stringify(updated));
  };

  const styles = getDirectivePriorityStyles(visible.priority, 'customer');

  return (
    <div className={`relative z-[60] border-b ${styles}`}>
      <div className="container mx-auto px-4 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Crown size={16} className="opacity-90" />
          <Megaphone size={16} className="opacity-90" />
        </div>
        <div className="flex-1 min-w-0 text-sm">
          <strong className="font-bold mr-2">{visible.title}</strong>
          <span className="opacity-95">{visible.message}</span>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full hover:bg-white/20 transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default CustomerAnnouncementBanner;
