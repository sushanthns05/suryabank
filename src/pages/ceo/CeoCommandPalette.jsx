import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, X, FileText, Calendar, Shield, Users, Target, Info, Sparkles, MessageSquare, Award } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const CeoCommandPalette = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [dbItems, setDbItems] = useState([]);
  const inputRef = useRef(null);

  const commandItems = [
    { name: 'Executive Home', desc: 'Go to CEO Main Dashboard', icon: Sparkles, section: 'Home', action: 'home' },
    { name: 'Executive Biography', desc: 'Read Sushanth NS journey & details', icon: Info, section: 'About', action: 'about' },
    { name: 'Timeline of Achievements', desc: 'View career and bank milestones', icon: Award, section: 'About', action: 'timeline' },
    { name: 'Chairman\'s Annual Letter', desc: 'Expand letter & PDF export option', icon: FileText, section: 'Message', action: 'message' },
    { name: 'Strategic Vision Pillars', desc: 'Check the 8 major innovation priorities', icon: Target, section: 'Vision', action: 'vision' },
    { name: 'Banking Divisions Strategy', desc: 'View Retail, Corporate and SME details', icon: Target, section: 'Strategy', action: 'strategy' },
    { name: 'Technology & AI Labs', desc: 'Explore fraud models and blockchain ledgers', icon: Sparkles, section: 'Innovation', action: 'innovation' },
    { name: 'Board Committees org-chart', desc: 'Examine governance and board structures', icon: Shield, section: 'Governance', action: 'governance' },
    { name: 'ESG Metrics & Carbon reduction', desc: 'View community and green commitments', icon: Users, section: 'ESG', action: 'esg' },
    { name: 'Investor Portal Highlights', desc: 'Browse financial reports and dividends', icon: FileText, section: 'Investors', action: 'investors' },
    { name: 'Newsroom & Speeches transcript', desc: 'Search press updates and media streams', icon: MessageSquare, section: 'Media', action: 'media' },
    { name: 'Events Calendar RSVP', desc: 'Browse board schedules and webcasts', icon: Calendar, section: 'Events', action: 'events' },
    { name: 'Publications & Research library', desc: 'Download whitepapers and audits', icon: FileText, section: 'Publications', action: 'publications' },
    { name: 'Official Contact Form', desc: 'Send inquiries directly to the executive office', icon: MessageSquare, section: 'Contact', action: 'contact' },
    { name: 'Secure Admin Dashboard', desc: 'Authorized updates to portal databases', icon: Shield, section: 'Admin', action: 'admin' },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Load searchable items from Firestore
  useEffect(() => {
    if (!isOpen) return;

    const fetchSearchIndex = async () => {
      try {
        const list = [];

        // 1. Fetch Users
        const usersSnap = await getDocs(collection(db, 'ceo_users'));
        usersSnap.forEach(docSnap => {
          const data = docSnap.data();
          list.push({
            name: `User Profile: ${data.email}`,
            desc: `Security clearance role: ${data.role}`,
            icon: Users,
            section: 'Security',
            action: 'admin'
          });
        });

        // 2. Fetch Vault Documents
        const vaultSnap = await getDocs(collection(db, 'ceo_vault'));
        vaultSnap.forEach(docSnap => {
          const data = docSnap.data();
          list.push({
            name: `Document: ${data.title}`,
            desc: `Confidential Vault File [${data.category}] - Clearance Level: ${data.clearance || 'CEO'} (${data.size || 'TBD'})`,
            icon: FileText,
            section: 'Documents',
            action: 'vault'
          });
        });

        // 3. Fetch Calendar Events
        const calendarSnap = await getDocs(collection(db, 'ceo_calendar'));
        calendarSnap.forEach(docSnap => {
          const data = docSnap.data();
          list.push({
            name: `Event: ${data.title}`,
            desc: `Corporate Calendar [${data.category || 'Meeting'}] - Scheduled: ${data.date} at ${data.time}`,
            icon: Calendar,
            section: 'Calendar',
            action: 'calendar'
          });
        });

        setDbItems(list);
      } catch (err) {
        console.error("Failed to build search index:", err);
      }
    };

    fetchSearchIndex();
  }, [isOpen]);

  if (!isOpen) return null;

  const allItems = [...commandItems, ...dbItems];

  const filteredItems = allItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase()) ||
    item.section.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
          <Search size={22} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search section..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-white placeholder-slate-400 focus:outline-none focus:ring-0 text-lg"
          />
          <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 text-xs text-slate-400 bg-slate-800 border border-slate-700 rounded select-none shadow">
            <span className="text-sm">Esc</span>
          </kbd>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {filteredItems.length > 0 ? (
            <div className="space-y-1 px-2">
              {filteredItems.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigate(item.action);
                      onClose();
                    }}
                    className="w-full text-left flex items-center justify-between gap-4 px-3 py-3 rounded-xl hover:bg-slate-800 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-ceo-gold/20 text-slate-400 group-hover:text-ceo-gold transition-colors">
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-100 text-sm group-hover:text-white transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-450 group-hover:text-slate-350 leading-relaxed max-w-[420px] truncate">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 border border-slate-700/50 text-slate-450 uppercase select-none group-hover:border-ceo-gold/30 group-hover:text-ceo-gold transition-all shrink-0">
                      {item.section}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-4 text-slate-400">
              <Command className="mx-auto mb-3 opacity-30" size={32} />
              <p>No results found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try typing 'esg', 'board', 'letter', or 'about'</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="font-bold text-slate-400">↑↓</span> to navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="font-bold text-slate-400">Enter</span> to select
            </span>
          </div>
          <span>Surya Bank Executive Office</span>
        </div>
      </div>
    </div>
  );
};

export default CeoCommandPalette;
