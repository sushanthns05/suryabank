import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const PORTAL_AUDIENCES = {
  managers: ['managers', 'all_staff'],
  employees: ['employees', 'all_staff'],
  customers: ['customers'],
};

export function useCeoDirectives(portal, { limit = null, activeOnly = true } = {}) {
  const [directives, setDirectives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const audiences = PORTAL_AUDIENCES[portal];
    if (!audiences) {
      setDirectives([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'ceo_directives'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let list = [];
        snapshot.forEach((docSnap) => {
          const data = { id: docSnap.id, ...docSnap.data() };
          if (activeOnly && data.status !== 'active') return;
          if (audiences.includes(data.audience)) list.push(data);
        });
        if (limit) list = list.slice(0, limit);
        setDirectives(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [portal, limit, activeOnly]);

  return { directives, loading };
}

export function getDirectivePriorityStyles(priority, variant = 'manager') {
  const isCritical = priority === 'critical';
  const isUrgent = priority === 'urgent';

  if (variant === 'employee') {
    if (isCritical) return 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-500/50';
    if (isUrgent) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-500/40';
    return 'bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-500/30';
  }

  if (variant === 'customer') {
    if (isCritical) return 'bg-red-600 text-white border-red-700';
    if (isUrgent) return 'bg-amber-500 text-white border-amber-600';
    return 'bg-surya-primary text-white border-blue-800';
  }

  if (isCritical) return 'bg-red-500/10 border-red-500/40';
  if (isUrgent) return 'bg-amber-500/10 border-amber-500/40';
  return 'bg-[#D4AF37]/10 border-[#D4AF37]/30';
}
