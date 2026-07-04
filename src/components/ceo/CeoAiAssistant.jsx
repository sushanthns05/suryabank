import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, CornerDownLeft, Sparkles, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCeoAuth } from '../../context/CeoAuthContext';

const CeoAiAssistant = () => {
  const navigate = useNavigate();
  const { user, role } = useCeoAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Greetings, Chairman Sushanth. I am your Executive AI Assistant. You can ask questions or execute direct commands like:\n\n• /approve [approval-id]\n• /reject [approval-id]\n• /nav [board|vault|strategy|calendar|admin]\n• /clear\n• /help', date: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const executeCommand = async (command, arg) => {
    if (command === 'approve' || command === 'reject') {
      if (!arg) {
        return `Please specify an approval ID. Example: /${command} loan-101`;
      }
      
      try {
        const appRef = doc(db, 'ceo_approvals', arg);
        const appSnap = await getDoc(appRef);

        if (appSnap.exists()) {
          const statusVal = command === 'approve' ? 'Approved' : 'Rejected';
          const comments = appSnap.data().comments || [];
          comments.push({
            user: `Executive AI (${role || 'CEO'})`,
            text: `Authorized sign-off via chat interface command.`,
            time: new Date().toLocaleTimeString()
          });

          await updateDoc(appRef, {
            status: statusVal,
            comments: comments
          });

          // Log security log
          await addDoc(collection(db, 'ceo_notifications'), {
            title: `Document ${statusVal}`,
            message: `Executive AI Command executed by ${user?.email}. Resolution ID ${arg} set to ${statusVal}.`,
            type: statusVal === 'Approved' ? 'info' : 'warning',
            read: false,
            timestamp: new Date().toISOString(),
            role: role || 'CEO'
          });

          return `Command Executed: Clearance action successfully finalized. Approval ID "${arg}" has been set to "${statusVal}".`;
        } else {
          return `Record Registry Error: No approval document found with ID "${arg}" in the secure vault database.`;
        }
      } catch (err) {
        console.error(err);
        return `Access Denied: Cryptographic handshake failed. Unable to write changes.`;
      }
    }

    if (command === 'nav' || command === 'go') {
      const pageMap = {
        board: '/ceo/board',
        vault: '/ceo/vault',
        strategy: '/ceo/strategy',
        calendar: '/ceo/calendar',
        admin: '/ceo/admin',
        dashboard: '/ceo/dashboard',
        message: '/ceo/message'
      };

      const path = pageMap[arg.toLowerCase()];
      if (path) {
        navigate(path);
        return `Navigating to ${arg.toUpperCase()} dashboard console...`;
      } else {
        return `Invalid target: Choose from board, vault, strategy, calendar, admin, message, or dashboard.`;
      }
    }

    return `Command not recognized: Type /help to see all executable capabilities.`;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      date: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Check for Command execution
    if (userText.startsWith('/')) {
      const parts = userText.substring(1).split(' ');
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');

      if (cmd === 'clear') {
        setMessages([
          { id: 1, sender: 'bot', text: 'Chat console records cleared.', date: new Date().toLocaleTimeString() }
        ]);
        return;
      }

      if (cmd === 'help') {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: "Executable Commands Guide:\n\n• /approve [id] - Sign off an active approval item\n• /reject [id] - Deny an active approval item\n• /nav [page] - Navigate directly to board, vault, strategy, calendar, admin, dashboard\n• /clear - Wipe terminal logs",
          date: new Date().toLocaleTimeString()
        }]);
        return;
      }

      // Execute Firestore-backed action
      const responseText = await executeCommand(cmd, arg);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 2,
          sender: 'bot',
          text: responseText,
          date: new Date().toLocaleTimeString()
        }]);
      }, 500);
      return;
    }

    // Standard AI QA Search Fallbacks
    const query = userText.toLowerCase();
    setTimeout(() => {
      let reply = '';
      if (query.includes('calendar') || query.includes('schedule') || query.includes('meeting')) {
        reply = 'You have a Board of Directors meeting scheduled at 2:00 PM IST today in Conference Room A. You also have pending visitor appointments awaiting authorization in your dashboard.';
      } else if (query.includes('esg') || query.includes('carbon') || query.includes('green')) {
        reply = 'Surya Bank is on track to reduce scope 1 & 2 carbon emissions by 42% by Q4. The executive ESG board has published the updated carbon ledger in the Investor Portal (/ceo/investors).';
      } else if (query.includes('board') || query.includes('paper') || query.includes('vote')) {
        reply = 'Confidential Board Papers (Q3 Budget Review, Audits Committee Report) have been securely cataloged in the Document Vault. Active Board voting is live on the Board Portal (/ceo/board).';
      } else if (query.includes('speech') || query.includes('address') || query.includes('letter')) {
        reply = 'Your annual Chairman Letter is compiled and accessible in the Message Office (/ceo/message). You can download the signed PDF compilation directly from that page.';
      } else if (query.includes('strategy') || query.includes('pillar') || query.includes('growth')) {
        reply = 'The 9 strategy pillars (Retail Banking, Green Finance, SME development) are listed in the Strategy Hub (/ceo/strategy) along with active financial charts.';
      } else if (query.includes('navigate') || query.includes('go to') || query.includes('page')) {
        reply = 'To navigate the portal, you can press Ctrl+K at any time to open the Command Palette, or use the Biography and Relations headers.';
      } else {
        reply = "I've searched your executive archives. I recommend viewing the Strategy and Innovation dashboards for detailed statistics on trade network growths.";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply,
        date: new Date().toLocaleTimeString()
      }]);
    }, 850);
  };

  return (
    <div className="fixed bottom-24 right-6 z-[9990]">
      
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-ceo-gold to-yellow-500 text-ceo-navy flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
        title="Executive Office AI Assistant"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-[480px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-ceo-navy to-slate-950 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-ceo-gold/10 text-ceo-gold">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Executive Assistant AI</span>
                <span className="block text-[8px] text-emerald-400 font-mono">Secured & Active</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.sender === 'bot' 
                    ? 'bg-ceo-gold/15 border-ceo-gold/30 text-ceo-gold' 
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </div>

                {/* Bubble */}
                <div className={`p-3 rounded-2xl max-w-[75%] space-y-1 ${
                  msg.sender === 'user' 
                    ? 'bg-ceo-gold text-ceo-navy rounded-tr-none' 
                    : 'bg-slate-950 text-slate-300 rounded-tl-none border border-slate-850 text-left'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className="block text-[8px] opacity-60 text-right">{msg.date}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-855 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask questions or type commands like /nav board..."
              className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-ceo-gold/60 focus:ring-0"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy transition-colors shrink-0"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};

export default CeoAiAssistant;
