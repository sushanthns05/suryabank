import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, Paperclip, Search, MoreVertical, 
  Phone, Video, ShieldCheck, CheckCheck, Clock, User
} from 'lucide-react';

const MOCK_CONTACTS = [
  { id: 0, name: 'Surya AI Assistant', role: 'Virtual Branch Manager', status: 'online', avatar: '🤖', unread: 0 },
  { id: 1, name: 'Rahul Sharma', role: 'Loan Officer', status: 'online', avatar: 'R', unread: 2 },
  { id: 2, name: 'Priya Patel', role: 'Head Cashier', status: 'online', avatar: 'P', unread: 0 },
  { id: 3, name: 'Head Office IT', role: 'Tech Support', status: 'offline', avatar: 'H', unread: 0 },
  { id: 4, name: 'Amit Kumar', role: 'Customer Service', status: 'away', avatar: 'A', unread: 0 },
  { id: 5, name: 'Neha Gupta', role: 'Regional Manager', status: 'online', avatar: 'N', unread: 0 },
];

const INITIAL_MESSAGES = {
  0: [
    { id: 1, sender: 'them', text: 'Hello Manager! I am Surya AI. I am securely connected to the core banking system. Ask me about loans, transactions, or employee status!', time: '09:00 AM' }
  ],
  1: [
    { id: 101, sender: 'them', text: 'Sir, I have forwarded 3 new loan applications for your final approval.', time: '10:30 AM' },
    { id: 102, sender: 'me', text: 'Thank you Rahul, I will review them after the branch meeting.', time: '10:35 AM' },
    { id: 103, sender: 'them', text: 'Understood. Let me know if you need any additional documents for the C-1045 file.', time: '10:36 AM' },
  ],
  2: [
    { id: 201, sender: 'them', text: 'Vault cash has been reconciled for the morning shift.', time: '11:00 AM' },
  ],
  5: [
    { id: 501, sender: 'them', text: 'Sushanth, please ensure the weekly compliance report is submitted by EOD.', time: '09:15 AM' },
    { id: 502, sender: 'me', text: 'Working on it now. Will send it shortly.', time: '09:20 AM' },
  ]
};

const AUTO_REPLIES = [
  "Understood. I will look into it immediately.",
  "Noted, sir. Is there anything else you need?",
  "I am on it. I'll update you once it's done.",
  "Will do. Please give me a few minutes.",
  "Yes, sir. Forwarding the details to you now."
];

const ManagerCommunication = () => {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [activeContact, setActiveContact] = useState(MOCK_CONTACTS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeContact, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: Date.now(),
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsgObj]
    }));

    setNewMessage('');

    // Simulate auto-responder / AI logic
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      let replyText = "";
      
      if (activeContact.id === 0) {
        // AI Chatbot Logic
        const lowerMsg = newMessage.toLowerCase();
        if (lowerMsg.includes('loan')) {
          replyText = "We currently have 45 active loan applications in the system. 3 of them require your final approval in the 'Loan Operations' portal.";
        } else if (lowerMsg.includes('employee') || lowerMsg.includes('attendance') || lowerMsg.includes('staff')) {
          replyText = "Today's attendance shows 24/25 employees present. All critical counters are fully staffed. Would you like me to pull up the complete attendance roster?";
        } else if (lowerMsg.includes('transaction') || lowerMsg.includes('volume') || lowerMsg.includes('money')) {
          replyText = "Total transaction volume today is ₹4.2M across 342 transactions. Our fraud detection systems report zero suspicious activities in the last 24 hours.";
        } else if (lowerMsg.includes('report') || lowerMsg.includes('export') || lowerMsg.includes('audit')) {
          replyText = "You can generate detailed analytical reports from the 'Reports & Analytics' tab. I can also quickly summarize today's numbers if you need them right now.";
        } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
          replyText = "Hello! I am Surya AI, your virtual banking assistant. I can fetch metrics on loans, transactions, branch operations, and employee attendance. How can I help you today?";
        } else if (lowerMsg.includes('open') || lowerMsg.includes('close') || lowerMsg.includes('branch')) {
          replyText = "You can manage the global Branch status from the 'Branch Management' tab. Changing the status there instantly updates the Customer Dashboard.";
        } else {
          replyText = "I've analyzed your query. As an AI assistant, I am best equipped to provide real-time updates on branch operations, employee status, or transaction metrics. What specific data do you need?";
        }
      } else {
        // Normal contact logic
        replyText = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      }

      const replyObj = {
        id: Date.now() + 1,
        sender: 'them',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), replyObj]
      }));
    }, 2500);
  };

  const activeChat = messages[activeContact.id] || [];

  return (
    <div className="h-[calc(100vh-8rem)] min-h-[600px] animate-in fade-in duration-500 pb-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Secure Internal Communication</h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> End-to-End Encrypted Network
          </p>
        </div>
      </div>

      <div className="bg-[#1E293B]/80 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden h-full flex">
        
        {/* Left Sidebar - Contacts */}
        <div className="w-80 border-r border-slate-700/50 flex flex-col bg-[#0F172A]/30">
          <div className="p-4 border-b border-slate-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search staff..." 
                className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all text-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {contacts.map(contact => (
              <div 
                key={contact.id}
                onClick={() => {
                  setActiveContact(contact);
                  // clear unread
                  setContacts(contacts.map(c => c.id === contact.id ? { ...c, unread: 0 } : c));
                }}
                className={`p-4 border-b border-slate-700/30 cursor-pointer transition-colors flex items-center gap-3 ${activeContact.id === contact.id ? 'bg-[#0F172A] border-l-4 border-l-[#F59E0B]' : 'hover:bg-[#0F172A]/50 border-l-4 border-l-transparent'}`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${activeContact.id === contact.id ? 'bg-gradient-to-br from-[#F59E0B] to-yellow-600 text-white' : contact.id === 0 ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-purple-500/30' : 'bg-slate-700 text-slate-300'}`}>
                    {contact.avatar}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#1E293B] rounded-full ${contact.status === 'online' ? 'bg-emerald-500' : contact.status === 'away' ? 'bg-yellow-500' : 'bg-slate-500'}`}></span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`font-bold truncate ${activeContact.id === contact.id ? 'text-white' : 'text-slate-300'}`}>{contact.name}</h3>
                    {contact.unread > 0 && (
                      <span className="bg-[#F59E0B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{contact.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Chat Window */}
        <div className="flex-1 flex flex-col bg-[#0F172A]/10">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-700/50 bg-[#0F172A]/80 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${activeContact.id === 0 ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-purple-500/20' : 'bg-gradient-to-br from-[#F59E0B] to-yellow-600'}`}>
                {activeContact.avatar}
              </div>
              <div>
                <h2 className="font-bold text-white">{activeContact.name}</h2>
                <p className="text-xs text-slate-400">{activeContact.role} • <span className={activeContact.status === 'online' ? 'text-emerald-400' : 'text-slate-500'}>{activeContact.status}</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-slate-400">
              <button className="hover:text-white transition-colors"><Phone size={18} /></button>
              <button className="hover:text-white transition-colors"><Video size={18} /></button>
              <button className="hover:text-white transition-colors"><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div className="text-center text-xs text-slate-500 my-4 flex items-center justify-center gap-2">
              <ShieldCheck size={12} className="text-[#F59E0B]" /> Messages to this chat and calls are now secured with end-to-end encryption.
            </div>

            {activeChat.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                <MessageSquare size={48} className="mb-4 text-slate-600" />
                <p>Start a secure conversation with {activeContact.name}</p>
              </div>
            ) : (
              activeChat.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.sender === 'me' ? 'bg-[#F59E0B] text-white rounded-tr-sm shadow-md shadow-[#F59E0B]/10' : 'bg-[#1E293B] text-slate-200 rounded-tl-sm border border-slate-700 shadow-md'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                    <Clock size={10} /> {msg.time}
                    {msg.sender === 'me' && <CheckCheck size={12} className="text-emerald-500 ml-1" />}
                  </div>
                </div>
              ))
            )}
            
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-[#1E293B] border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{activeContact.name} is typing...</p>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Composer */}
          <div className="p-4 border-t border-slate-700/50 bg-[#0F172A]/80">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <button type="button" className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                <Paperclip size={20} />
              </button>
              
              <div className="flex-1 relative">
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={`Securely message ${activeContact.name}...`}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] resize-none min-h-[48px] max-h-32 custom-scrollbar"
                  rows="1"
                />
              </div>
              
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className={`p-3 rounded-xl flex items-center justify-center transition-all ${newMessage.trim() ? 'bg-gradient-to-r from-[#F59E0B] to-yellow-600 text-white shadow-lg shadow-[#F59E0B]/20 hover:scale-105' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
              >
                <Send size={20} className={newMessage.trim() ? 'translate-x-0.5' : ''} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerCommunication;
