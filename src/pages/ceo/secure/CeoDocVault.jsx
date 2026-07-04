import React, { useState, useEffect } from 'react';
import { Shield, Lock, FileText, Download, Upload, Search, Trash2, Loader2, Clock, History, FileDown, CheckCircle2 } from 'lucide-react';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useCeoAuth } from '../../../context/CeoAuthContext';
import { z } from 'zod';

// Zod Schema enforcement for document uploads
const DocSchema = z.object({
  title: z.string().min(3, "Document Title must be at least 3 characters."),
  category: z.enum(['Speeches', 'Board Papers', 'Annual Letters', 'Investor Reports', 'Governance Documents', 'Media Assets']),
  clearance: z.enum(['Public', 'Investor Only', 'Board Only', 'CEO & Assistant Only']),
  description: z.string().max(250, "Description cannot exceed 250 characters.")
});

const CeoDocVault = () => {
  const { user, role } = useCeoAuth();
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Detail Modal & Logs state
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [accessLogs, setAccessLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Speeches');
  const [clearance, setClearance] = useState('Public');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Version Upload State
  const [newVersionNote, setNewVersionNote] = useState('');
  const [uploadingVersion, setUploadingVersion] = useState(false);

  const fetchVault = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'ceo_vault'));
      const list = [];
      querySnapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Insert baseline confidential mock documents if vault is empty
      if (list.length === 0) {
        const defaults = [
          { 
            title: "Q3 Asset Liquidations Analysis", 
            category: "Board Papers", 
            clearance: "Board Only", 
            description: "Audit reports for board member allocation grids.", 
            version: 1, 
            date: "2026-07-02", 
            size: "4.8 MB",
            versions: [{ version: 1, date: "2026-07-02", size: "4.8 MB", note: "Initial audit draft", author: "Executive Assistant" }]
          },
          { 
            title: "Quantum Threat Mitigation Brief", 
            category: "Governance Documents", 
            clearance: "CEO & Assistant Only", 
            description: "Strategic post-quantum cryptographical timelines.", 
            version: 2, 
            date: "2026-06-28", 
            size: "12.1 MB",
            versions: [
              { version: 1, date: "2026-06-20", size: "11.8 MB", note: "Baseline parameters", author: "Dr. Roy" },
              { version: 2, date: "2026-06-28", size: "12.1 MB", note: "Appended cryptography details", author: "CEO Office" }
            ]
          },
          { 
            title: "Green Banking Dividend Estimates", 
            category: "Investor Reports", 
            clearance: "Investor Only", 
            description: "Q2 dividend payouts matching carbon thresholds.", 
            version: 1, 
            date: "2026-07-01", 
            size: "2.4 MB",
            versions: [{ version: 1, date: "2026-07-01", size: "2.4 MB", note: "ESG Committee final print", author: "Secretary" }]
          }
        ];

        for (let docItem of defaults) {
          const docRef = await addDoc(collection(db, 'ceo_vault'), docItem);
          list.push({ id: docRef.id, ...docItem });
        }
      }

      setDocuments(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, []);

  // Sync access log history when a document is selected
  useEffect(() => {
    if (!selectedDoc) {
      setAccessLogs([]);
      return;
    }
    setLoadingLogs(true);
    const q = query(
      collection(db, 'ceo_download_logs'),
      where('docId', '==', selectedDoc.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = [];
      snapshot.forEach(docSnap => {
        logs.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort logs by date descending
      logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setAccessLogs(logs);
      setLoadingLogs(false);
    }, (err) => {
      console.error(err);
      setLoadingLogs(false);
    });

    return () => unsubscribe();
  }, [selectedDoc]);

  // Filter based on roles and clearance levels
  const canAccessClearance = (clearanceLevel) => {
    if (role === 'CEO' || role === 'Administrator') return true;
    if (clearanceLevel === 'Public') return true;
    
    if (clearanceLevel === 'Investor Only') {
      return ['Investor', 'Board Member', 'Executive Assistant'].includes(role);
    }
    if (clearanceLevel === 'Board Only') {
      return ['Board Member', 'Executive Assistant'].includes(role);
    }
    if (clearanceLevel === 'CEO & Assistant Only') {
      return ['Executive Assistant'].includes(role);
    }
    return false;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validate with Zod
    const dataObj = { title, category, clearance, description };
    const validationResult = DocSchema.safeParse(dataObj);
    
    if (!validationResult.success) {
      const errMap = {};
      validationResult.error.errors.forEach(err => {
        errMap[err.path[0]] = err.message;
      });
      setErrors(errMap);
      return;
    }

    setSaving(true);
    try {
      const newDoc = {
        ...dataObj,
        version: 1,
        date: new Date().toISOString().split('T')[0],
        size: "1.2 MB",
        fileUrl: fileUrl || "https://ceo-suryabank.web.app/mock-confidential-paper.pdf",
        versions: [{ version: 1, date: new Date().toISOString().split('T')[0], size: "1.2 MB", note: "Initial Upload", author: role || 'Staff' }]
      };

      await addDoc(collection(db, 'ceo_vault'), newDoc);
      setShowUploadModal(false);
      
      // Reset
      setTitle('');
      setDescription('');
      setFileUrl('');
      
      fetchVault();
    } catch (err) {
      console.error(err);
      alert("Document saving failed.");
    } finally {
      setSaving(false);
    }
  };

  // Upload New Version of Selected Document
  const handleUploadNewVersion = async (e) => {
    e.preventDefault();
    if (!newVersionNote.trim() || !selectedDoc) return;

    setUploadingVersion(true);
    try {
      const nextVerNum = (selectedDoc.version || 1) + 1;
      const newVerObj = {
        version: nextVerNum,
        date: new Date().toISOString().split('T')[0],
        size: "1.4 MB",
        note: newVersionNote.trim(),
        author: role || 'Staff'
      };

      const updatedVersions = [...(selectedDoc.versions || []), newVerObj];
      const docRef = doc(db, 'ceo_vault', selectedDoc.id);
      
      await updateDoc(docRef, {
        version: nextVerNum,
        date: newVerObj.date,
        size: newVerObj.size,
        versions: updatedVersions
      });

      setSelectedDoc(prev => ({
        ...prev,
        version: nextVerNum,
        date: newVerObj.date,
        size: newVerObj.size,
        versions: updatedVersions
      }));

      // Add Notification
      await addDoc(collection(db, 'ceo_notifications'), {
        title: 'New File Version Archived',
        message: `Version ${nextVerNum} created for: ${selectedDoc.title}.`,
        type: 'info',
        read: false,
        timestamp: new Date().toISOString(),
        role: 'CEO'
      });

      setNewVersionNote('');
      fetchVault();
    } catch (err) {
      console.error(err);
      alert("Failed to submit version draft.");
    } finally {
      setUploadingVersion(false);
    }
  };

  const handleDownload = async (docItem) => {
    if (!canAccessClearance(docItem.clearance)) {
      alert("Security Violation: You do not possess the required clearance role to export this document.");
      return;
    }

    try {
      // 1. Audit Download Log in Firestore
      await addDoc(collection(db, 'ceo_download_logs'), {
        docId: docItem.id,
        docTitle: docItem.title,
        userEmail: user?.email || 'unknown@suryabank.com',
        userRole: role || 'Unknown',
        timestamp: new Date().toISOString(),
        clearanceEnforced: docItem.clearance,
        ipAddress: '198.51.100.82 (VPN Enforced)'
      });

      // 2. Alert Notification
      await addDoc(collection(db, 'ceo_notifications'), {
        title: 'Secure File Exported',
        message: `${role || 'User'} (${user?.email}) downloaded: "${docItem.title}".`,
        type: 'security',
        read: false,
        timestamp: new Date().toISOString(),
        role: 'Administrator'
      });

      alert(`Audited Download Started. Watermark stamped: "PROPERTY OF SURYA BANK - EXPORTED BY ${user?.email}."`);
    } catch (err) {
      console.error("Audit log creation failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this document from the vault?")) return;
    try {
      await deleteDoc(doc(db, 'ceo_vault', id));
      setSelectedDoc(null);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
    const matchesAccess = canAccessClearance(doc.clearance);
    
    return matchesSearch && matchesCategory && matchesAccess;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-ceo-gold">Cryptographic Archives</span>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-1">Secure Document Vault</h1>
          <p className="text-xs text-slate-400">Classified digital filing repository enforcing strict corporate clearance regulations.</p>
        </div>

        {['CEO', 'Executive Assistant', 'Administrator'].includes(role) && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
          >
            <Upload size={16} /> Archive Document
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-805 p-4 rounded-2xl shadow-md text-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vault indexes..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
          >
            <option value="All">All Categories</option>
            <option value="Speeches">Speeches</option>
            <option value="Board Papers">Board Papers</option>
            <option value="Annual Letters">Annual Letters</option>
            <option value="Investor Reports">Investor Reports</option>
            <option value="Governance Documents">Governance Documents</option>
            <option value="Media Assets">Media Assets</option>
          </select>
        </div>

        <div className="flex items-center gap-2 px-2 text-slate-400">
          <Shield size={14} className="text-ceo-gold" />
          <span>Active Session Clearance: <strong className="text-white">{role}</strong></span>
        </div>
      </div>

      {/* Main vault content split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Document Grid */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="py-24 text-center text-slate-550 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-ceo-gold" size={24} />
              <span className="text-xs">Decrypting folder listings...</span>
            </div>
          ) : filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDocs.map((docItem) => (
                <div 
                  key={docItem.id} 
                  onClick={() => setSelectedDoc(docItem)}
                  className={`bg-slate-900 border rounded-2xl p-4 flex gap-4 shadow-lg items-start transition-all cursor-pointer text-xs text-left ${
                    selectedDoc?.id === docItem.id 
                      ? 'border-ceo-gold bg-slate-900' 
                      : 'border-slate-805 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-ceo-gold shrink-0">
                    <FileText size={24} />
                  </div>

                  <div className="flex-grow space-y-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-white truncate max-w-[120px]">{docItem.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        docItem.clearance === 'Public' ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-900' :
                        docItem.clearance === 'Investor Only' ? 'bg-cyan-950/45 text-cyan-400 border border-cyan-900' :
                        'bg-rose-950/45 text-rose-400 border border-rose-900'
                      }`}>
                        {docItem.clearance}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{docItem.description}</p>
                    <div className="flex justify-between items-center text-[9px] text-slate-500 pt-2 border-t border-slate-850/50">
                      <span>V{docItem.version} | {docItem.size}</span>
                      <span>{docItem.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
              <p>No accessible papers found matching filters.</p>
            </div>
          )}
        </div>

        {/* Selected Document Details & Watermarked Preview Desk */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-805 p-6 rounded-3xl space-y-6">
          {selectedDoc ? (
            <div className="space-y-6 text-left text-xs">
              
              {/* Document Header */}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-mono text-ceo-gold font-bold">DIGITAL SHIELD PREVIEW</span>
                  {['CEO', 'Administrator'].includes(role) && (
                    <button
                      onClick={() => handleDelete(selectedDoc.id)}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 font-bold text-[10px]"
                    >
                      <Trash2 size={12} /> Wipe File
                    </button>
                  )}
                </div>
                <h3 className="text-base font-serif font-bold text-white leading-normal">{selectedDoc.title}</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed">{selectedDoc.description}</p>
              </div>

              {/* Watermarked Document Preview Representation */}
              <div className="relative border border-slate-800 rounded-2xl bg-slate-950 h-44 overflow-hidden flex flex-col justify-between p-4 select-none">
                {/* Diagonal Watermark Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.06] rotate-[-25deg] text-[10px] font-mono font-bold whitespace-nowrap text-white">
                  SURYA BANK SECURITY VAULT • {user?.email} • CL: {selectedDoc.clearance} • {new Date().toISOString().split('T')[0]}
                </div>
                
                <div className="flex justify-between items-start z-10">
                  <FileText size={44} className="text-slate-700" />
                  <span className="text-[9px] font-mono text-slate-500">PREVIEW ONLY</span>
                </div>
                <div className="z-10 space-y-1">
                  <div className="h-2 w-2/3 bg-slate-800 rounded-full" />
                  <div className="h-2 w-full bg-slate-800 rounded-full" />
                  <div className="h-2 w-1/2 bg-slate-800 rounded-full" />
                </div>
                
                {/* Secure Download trigger */}
                <button
                  onClick={() => handleDownload(selectedDoc)}
                  className="w-full mt-2 py-2 bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all text-[11px]"
                >
                  <Download size={14} /> Export Stamped PDF
                </button>
              </div>

              {/* Version History Tab */}
              <div className="space-y-3 pt-3 border-t border-slate-850">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <History size={14} className="text-ceo-gold" /> Version History Controls
                </h4>
                
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedDoc.versions && selectedDoc.versions.length > 0 ? (
                    selectedDoc.versions.map((ver, idx) => (
                      <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 flex justify-between items-center text-[10px]">
                        <div>
                          <strong className="text-white font-mono block">Version {ver.version}</strong>
                          <span className="text-slate-400 block text-[9px] mt-0.5">{ver.note}</span>
                        </div>
                        <div className="text-right text-[8px] text-slate-500 space-y-0.5">
                          <span className="block font-mono">{ver.date}</span>
                          <span className="block">{ver.author}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-550 block">No version drafts uploaded yet.</span>
                  )}
                </div>

                {/* Upload New Version Draft Form */}
                {['CEO', 'Executive Assistant', 'Administrator'].includes(role) && (
                  <form onSubmit={handleUploadNewVersion} className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Draft log description for version..."
                      value={newVersionNote}
                      onChange={(e) => setNewVersionNote(e.target.value)}
                      className="flex-grow px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-white focus:outline-none focus:border-ceo-gold"
                    />
                    <button
                      type="submit"
                      disabled={uploadingVersion}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center gap-1 shrink-0"
                    >
                      {uploadingVersion ? <Loader2 className="animate-spin" size={10} /> : <Upload size={10} />} Commit V{selectedDoc.version + 1}
                    </button>
                  </form>
                )}
              </div>

              {/* Real-time audit logs */}
              <div className="space-y-3 pt-3 border-t border-slate-850">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Shield size={14} className="text-ceo-gold" /> Access & Audit Logs
                </h4>
                
                {loadingLogs ? (
                  <div className="py-4 text-center text-slate-500">Loading audit feed...</div>
                ) : accessLogs.length > 0 ? (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {accessLogs.map((log) => (
                      <div key={log.id} className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-850 text-[9px] space-y-1">
                        <div className="flex justify-between font-bold text-slate-400">
                          <span>{log.userEmail} ({log.userRole})</span>
                          <span className="text-slate-500 font-mono">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}</span>
                        </div>
                        <p className="text-slate-500 font-mono">Secured from IP: {log.ipAddress}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-550 block">No access logs verified in database registry.</span>
                )}
              </div>

            </div>
          ) : (
            <div className="py-32 text-center text-slate-550">
              <Lock className="mx-auto mb-3 opacity-20" size={32} />
              <p>Select a cryptographic file card to open watermarked reviews, versions control, and download registries.</p>
            </div>
          )}
        </div>

      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-805 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-serif font-bold text-white">Archive Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3 text-xs text-left">
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-550">Document Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Auditing Guidelines"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
                {errors.title && <span className="text-[9px] text-red-400 block">{errors.title}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="Speeches">Speeches</option>
                    <option value="Board Papers">Board Papers</option>
                    <option value="Annual Letters">Annual Letters</option>
                    <option value="Investor Reports">Investor Reports</option>
                    <option value="Governance Documents">Governance Documents</option>
                    <option value="Media Assets">Media Assets</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-550">Access Clearance</label>
                  <select
                    value={clearance}
                    onChange={(e) => setClearance(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none"
                  >
                    <option value="Public">Public Access</option>
                    <option value="Investor Only">Investor Only</option>
                    <option value="Board Only">Board Only</option>
                    <option value="CEO & Assistant Only">CEO & Assistant Only</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-550">Description Summary</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize document scope..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white resize-none"
                />
                {errors.description && <span className="text-[9px] text-red-400 block">{errors.description}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-550">File Mock URL (Optional)</label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/file.pdf"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-lg bg-ceo-gold hover:bg-ceo-gold-hover text-ceo-navy font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {saving ? <Loader2 className="animate-spin" size={14} /> : 'Save Secure Record'}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default CeoDocVault;
