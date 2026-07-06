import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, FileText, CheckCircle, Clock, Zap, AlertTriangle, 
  ArrowRight, Eye, ChevronRight, X, ShieldCheck, 
  CheckSquare, MessageSquare, Briefcase, FileBadge
} from 'lucide-react';
import { subscribeToManagerTeamProducts, updateProductStatus } from '../../services/productService';

const MetricCard = ({ title, value, icon: Icon, colorClass, gradient, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all group"
  >
    <div className={`absolute -right-12 -top-12 w-40 h-40 ${gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
    <div className="p-6 relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
          <Icon size={24} />
        </div>
        <span className="text-3xl font-black text-white tracking-tight">{value}</span>
      </div>
      <h3 className="font-bold text-slate-300 text-sm">{title}</h3>
    </div>
  </motion.div>
);

const ProductReviewCenter = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [managerComments, setManagerComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Mock Manager ID
  const managerId = 'MGR98765';

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToManagerTeamProducts(managerId, (data) => {
      setProducts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAction = async (actionType) => {
    if (!selectedProduct) return;
    setSubmitting(true);

    let newStatus = '';
    let managerStatus = '';
    
    if (actionType === 'Approve') {
      newStatus = 'Waiting for CEO Review';
      managerStatus = 'Approved';
    } else if (actionType === 'Reject') {
      newStatus = 'Changes Requested';
      managerStatus = 'Rejected';
    }

    const auditEntry = {
      action: `Manager ${actionType}`,
      timestamp: new Date().toISOString(),
      actor: 'Admin User',
      role: 'Manager',
      ip: '10.0.0.5',
      device: 'Manager Workstation'
    };

    const newHistory = [...(selectedProduct.auditHistory || []), auditEntry];

    await updateProductStatus(selectedProduct.id, {
      status: newStatus,
      managerStatus: managerStatus,
      managerComments: managerComments,
      auditHistory: newHistory
    });

    setSubmitting(false);
    setDrawerOpen(false);
    setSelectedProduct(null);
    setManagerComments('');
  };

  const pendingCount = products.filter(p => p.status === 'Submitted to Manager').length;

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <CheckSquare className="text-[#F59E0B]" />
          Product Review Center
        </h1>
        <p className="text-slate-400 mt-1">Evaluate team product submissions and forward to Executive Office.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Pending Reviews" value={pendingCount} icon={Clock} colorClass="bg-amber-900/30 text-amber-500" gradient="bg-amber-500" delay={0.1} />
        <MetricCard title="Forwarded to CEO" value={products.filter(p => p.managerStatus === 'Approved').length} icon={Rocket} colorClass="bg-blue-900/30 text-blue-500" gradient="bg-blue-500" delay={0.2} />
        <MetricCard title="Rejected" value={products.filter(p => p.managerStatus === 'Rejected').length} icon={AlertTriangle} colorClass="bg-red-900/30 text-red-500" gradient="bg-red-500" delay={0.3} />
        <MetricCard title="Average Time" value="4h" icon={Zap} colorClass="bg-emerald-900/30 text-emerald-500" gradient="bg-emerald-500" delay={0.4} />
      </div>

      <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-white">Team Submissions</h2>
        
        {loading ? (
          <div className="text-center py-10 text-slate-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No active product submissions.</div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div 
                key={product.id}
                onClick={() => { setSelectedProduct(product); setDrawerOpen(true); }}
                className="p-5 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 cursor-pointer transition-all flex justify-between items-center group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#F59E0B] transition-colors">{product.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">
                      v{product.version}
                    </span>
                    {product.status === 'Submitted to Manager' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{product.requesterName} • {product.department} • {product.type}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    product.managerStatus === 'Approved' ? 'bg-blue-500/20 text-blue-400' :
                    product.managerStatus === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {product.status}
                  </span>
                  <ChevronRight className="text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedProduct && (
          <React.Fragment>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0F172A] border-l border-slate-700 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white">{selectedProduct.name}</h2>
                    <p className="text-slate-400 mt-1">{selectedProduct.type} • Requested by {selectedProduct.requesterName}</p>
                  </div>
                  <button onClick={() => setDrawerOpen(false)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {/* AI Score */}
                {selectedProduct.aiScore && (
                  <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/50">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                      <Zap className="text-yellow-400" size={16} /> AI Validation Score: {selectedProduct.aiScore.overall}%
                    </h3>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="text-center bg-black/20 p-2 rounded-lg">
                        <span className="block text-[10px] text-blue-200">Security</span>
                        <span className="font-bold text-emerald-400">{selectedProduct.aiScore.security}%</span>
                      </div>
                      <div className="text-center bg-black/20 p-2 rounded-lg">
                        <span className="block text-[10px] text-blue-200">Perf</span>
                        <span className="font-bold text-emerald-400">{selectedProduct.aiScore.performance}%</span>
                      </div>
                      <div className="text-center bg-black/20 p-2 rounded-lg">
                        <span className="block text-[10px] text-blue-200">Compl</span>
                        <span className="font-bold text-emerald-400">{selectedProduct.aiScore.compliance}%</span>
                      </div>
                      <div className="text-center bg-black/20 p-2 rounded-lg">
                        <span className="block text-[10px] text-blue-200">Code</span>
                        <span className="font-bold text-emerald-400">{selectedProduct.aiScore.codeQuality}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-200 bg-blue-950/50 p-2 rounded-lg">
                      <ShieldCheck size={12} className="inline mr-1" /> {selectedProduct.aiScore.recommendation}
                    </p>
                  </div>
                )}

                <div className="space-y-6 mb-8">
                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Business Purpose</span>
                    <p className="text-sm text-slate-300 bg-slate-800/50 p-4 rounded-xl leading-relaxed">
                      {selectedProduct.businessPurpose}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Impact</span>
                      <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-xl">{selectedProduct.expectedImpact}</p>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tech Stack</span>
                      <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-xl">{selectedProduct.techStack}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attachments</span>
                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <FileBadge className="text-amber-500" size={20} />
                      <span className="text-sm text-slate-300 font-medium">source_code_v1.zip</span>
                      <span className="text-xs text-slate-500 ml-auto">Mocked File</span>
                    </div>
                  </div>
                </div>

                {selectedProduct.status === 'Submitted to Manager' ? (
                  <div className="border-t border-slate-800 pt-8">
                    <h3 className="text-lg font-bold text-white mb-4">Manager Decision</h3>
                    <textarea 
                      value={managerComments}
                      onChange={(e) => setManagerComments(e.target.value)}
                      placeholder="Add internal notes or feedback for the CEO / Employee..."
                      className="w-full h-24 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-[#F59E0B] outline-none mb-4"
                    />
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleAction('Reject')}
                        disabled={submitting}
                        className="flex-1 py-3 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-white rounded-xl font-bold transition-all border border-slate-700 hover:border-red-500/50 disabled:opacity-50"
                      >
                        Request Changes
                      </button>
                      <button 
                        onClick={() => handleAction('Approve')}
                        disabled={submitting || !managerComments}
                        className="flex-1 py-3 bg-[#F59E0B] hover:bg-yellow-500 text-slate-900 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                      >
                        Approve & Forward to CEO
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-slate-800 pt-8">
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                      <p className="text-sm text-slate-400">This request has been processed.</p>
                      <p className="font-bold text-white mt-1">Current Status: {selectedProduct.status}</p>
                    </div>
                  </div>
                )}
                
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductReviewCenter;
