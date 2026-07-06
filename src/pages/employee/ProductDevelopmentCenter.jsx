import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, FileText, CheckCircle, Clock, Zap, UploadCloud, 
  ShieldCheck, AlertTriangle, ArrowRight, Eye, ChevronRight, X, User
} from 'lucide-react';
import { requestProductLaunch, subscribeToUserProducts } from '../../services/productService';

const MetricCard = ({ title, value, icon: Icon, colorClass, gradient, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all group"
  >
    <div className={`absolute -right-12 -top-12 w-40 h-40 ${gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
    <div className="p-6 relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
          <Icon size={24} />
        </div>
        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
      </div>
      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{title}</h3>
    </div>
  </motion.div>
);

const PipelineVisualizer = ({ status }) => {
  const stages = [
    { id: 'draft', label: 'Draft', statuses: ['Draft'] },
    { id: 'submitted', label: 'Submitted', statuses: ['Submitted to Manager'] },
    { id: 'manager', label: 'Manager Review', statuses: ['Manager Reviewing', 'Changes Requested', 'Manager Approved'] },
    { id: 'ceo', label: 'CEO Review', statuses: ['Waiting for CEO Review', 'CEO Reviewing', 'CEO Rejected', 'CEO Approved'] },
    { id: 'live', label: 'Production Live', statuses: ['Live', 'Production Ready', 'Launching'] }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(s => s.statuses.includes(status)) || 0;
  };

  const currentIndex = getCurrentStageIndex();

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full z-0 transition-all duration-1000 ease-out"
          style={{ width: `${(Math.max(0, currentIndex) / (stages.length - 1)) * 100}%` }}
        ></div>

        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isRejected = (status === 'CEO Rejected' || status === 'Changes Requested') && isCurrent;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              <motion.div 
                initial={false}
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isRejected ? '#ef4444' : isCompleted || isCurrent ? '#10b981' : '#cbd5e1'
                }}
                className={`w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-md`}
              >
                {isCompleted ? <CheckCircle size={14} /> : (isRejected ? <X size={14}/> : <span className="text-[10px] font-bold">{index + 1}</span>)}
              </motion.div>
              <span className={`absolute top-10 text-[10px] md:text-xs font-bold whitespace-nowrap ${isCurrent ? (isRejected ? 'text-red-500' : 'text-emerald-500 dark:text-emerald-400') : 'text-slate-500 dark:text-slate-400'}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProductDevelopmentCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAI, setShowAI] = useState(false);

  // Mock User
  const currentUser = {
    name: 'Ravi Kumar',
    employeeId: 'EMP12345',
    managerId: 'MGR98765',
    department: 'Digital Banking',
  };

  const [formData, setFormData] = useState({
    name: '',
    type: 'Website',
    description: '',
    businessPurpose: '',
    techStack: '',
    targetUsers: '',
    launchDate: '',
    expectedImpact: '',
    securityNotes: '',
    version: '1.0.0',
    files: []
  });

  const [aiScore, setAiScore] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToUserProducts(currentUser.employeeId, (data) => {
      setProducts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const generateAIScore = () => {
    setShowAI(true);
    setTimeout(() => {
      setAiScore({
        overall: 92,
        security: 95,
        performance: 88,
        compliance: 94,
        codeQuality: 91,
        recommendation: 'Ready for Manager Review. High business value detected.'
      });
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = {
      ...formData,
      requesterId: currentUser.employeeId,
      requesterName: currentUser.name,
      managerId: currentUser.managerId,
      department: currentUser.department,
      aiScore: aiScore || { overall: 85, recommendation: 'Auto-evaluated' }
    };

    const res = await requestProductLaunch(payload);
    if (res.success) {
      setActiveTab('dashboard');
      setFormData({
        name: '', type: 'Website', description: '', businessPurpose: '',
        techStack: '', targetUsers: '', launchDate: '', expectedImpact: '',
        securityNotes: '', version: '1.0.0', files: []
      });
      setAiScore(null);
      setShowAI(false);
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Rocket className="text-blue-500" />
            Product Development Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Enterprise Lifecycle Management</p>
        </div>
        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-700 text-surya-primary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            My Projects
          </button>
          <button 
            onClick={() => setActiveTab('new')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'new' ? 'bg-white dark:bg-slate-700 text-surya-primary shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Create Project
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard title="Total Projects" value={products.length} icon={FileText} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30" gradient="bg-blue-500" delay={0.1} />
            <MetricCard title="In Review" value={products.filter(p => p.status.includes('Review')).length} icon={Clock} colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30" gradient="bg-amber-500" delay={0.2} />
            <MetricCard title="Live Products" value={products.filter(p => p.status === 'Live').length} icon={Zap} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" gradient="bg-emerald-500" delay={0.3} />
            <MetricCard title="Rejected" value={products.filter(p => p.status.includes('Rejected')).length} icon={AlertTriangle} colorClass="bg-red-100 text-red-600 dark:bg-red-900/30" gradient="bg-red-500" delay={0.4} />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Recent Projects</h2>
            {loading ? (
              <div className="text-center py-10 text-slate-500">Loading...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-10 text-slate-500">No projects found. Create one to get started.</div>
            ) : (
              <div className="space-y-6">
                {products.map(product => (
                  <div key={product.id} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{product.name}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            v{product.version}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{product.type} • {product.department}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block mb-1">Current Status</span>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                          product.status === 'Live' ? 'bg-emerald-100 text-emerald-700' :
                          product.status.includes('Rejected') ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                      <PipelineVisualizer status={product.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Initiate Project Launch</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Submit your product through the enterprise pipeline.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Surya Mobile App 2.0" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Product Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500">
                  <option>Website</option>
                  <option>Android App</option>
                  <option>AI Product</option>
                  <option>Banking Feature</option>
                  <option>Internal Software</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Business Purpose</label>
                <textarea required value={formData.businessPurpose} onChange={e => setFormData({...formData, businessPurpose: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 h-24" placeholder="Detail the business justification..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tech Stack</label>
                <input required type="text" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500" placeholder="React, Node.js, Firebase..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Expected Impact</label>
                <input required type="text" value={formData.expectedImpact} onChange={e => setFormData({...formData, expectedImpact: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 20% increase in retention" />
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
              <UploadCloud size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Upload Attachments (Mock)</p>
              <p className="text-xs text-slate-500 mt-1">ZIP, APK, Source Code, Documentation</p>
              <button type="button" className="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-bold">Select Files</button>
            </div>

            {/* AI Evaluation Section */}
            {aiScore ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  <Zap className="text-yellow-400" /> AI Readiness Evaluation
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
                  <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-center">
                    <span className="block text-xs text-blue-200 mb-1 uppercase tracking-wider">Security</span>
                    <span className="text-2xl font-black text-emerald-400">{aiScore.security}%</span>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-center">
                    <span className="block text-xs text-blue-200 mb-1 uppercase tracking-wider">Performance</span>
                    <span className="text-2xl font-black text-emerald-400">{aiScore.performance}%</span>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-center">
                    <span className="block text-xs text-blue-200 mb-1 uppercase tracking-wider">Compliance</span>
                    <span className="text-2xl font-black text-emerald-400">{aiScore.compliance}%</span>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-center">
                    <span className="block text-xs text-blue-200 mb-1 uppercase tracking-wider">Quality</span>
                    <span className="text-2xl font-black text-emerald-400">{aiScore.codeQuality}%</span>
                  </div>
                </div>
                
                <div className="bg-black/30 p-4 rounded-xl border border-white/10 relative z-10 flex items-start gap-3">
                  <ShieldCheck className="text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-sm font-bold text-white mb-1">Overall Recommendation: {aiScore.overall}%</span>
                    <p className="text-xs text-blue-200">{aiScore.recommendation}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-blue-800 dark:text-blue-400 text-sm">Automated Pipeline Check</h3>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">Run AI evaluation before submitting to Manager.</p>
                </div>
                <button 
                  type="button" 
                  onClick={generateAIScore} 
                  disabled={showAI}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {showAI ? <span className="animate-pulse">Analyzing...</span> : <><Zap size={16} /> Evaluate Project</>}
                </button>
              </div>
            )}

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button 
                type="submit" 
                disabled={submitting || !aiScore}
                className="px-8 py-3 bg-surya-primary hover:bg-surya-primary/90 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit for Manager Review'} <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDevelopmentCenter;
