import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, CheckCircle, Clock, Zap, AlertTriangle, 
  X, ShieldCheck, Activity, BarChart3, Star,
  TrendingUp, Download, Building, FileBadge, Lock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { subscribeToCEOProducts, updateProductStatus } from '../../../services/productService';

const MetricCard = ({ title, value, icon: Icon, colorClass, gradient, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0F172A]/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-all group"
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

const revenueData = [
  { name: 'Jan', revenue: 400, target: 240 },
  { name: 'Feb', revenue: 300, target: 139 },
  { name: 'Mar', revenue: 200, target: 980 },
  { name: 'Apr', revenue: 278, target: 390 },
  { name: 'May', revenue: 189, target: 480 },
  { name: 'Jun', revenue: 239, target: 380 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const ExecutiveLaunchControl = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCEOProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAction = async (actionType) => {
    if (!selectedProduct) return;
    setSubmitting(true);

    let newStatus = '';
    
    if (actionType === 'Launch') {
      newStatus = 'Live';
    } else if (actionType === 'Reject') {
      newStatus = 'CEO Rejected';
    }

    const auditEntry = {
      action: `CEO ${actionType}`,
      timestamp: new Date().toISOString(),
      actor: 'CEO Office',
      role: 'CEO',
      ip: '10.0.0.1',
      device: 'CEO Secure Terminal',
      digitalSignature: 'SIG-XYZ-12345'
    };

    const newHistory = [...(selectedProduct.auditHistory || []), auditEntry];

    await updateProductStatus(selectedProduct.id, {
      status: newStatus,
      auditHistory: newHistory
    });

    setSubmitting(false);
    setDrawerOpen(false);
    setSelectedProduct(null);
  };

  const pendingCount = products.filter(p => p.status === 'Waiting for CEO Review').length;
  const liveCount = products.filter(p => p.status === 'Live').length;

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <Rocket className="text-surya-primary" size={36} />
          Executive Launch Control
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Final production authorization & release analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Awaiting CEO Authorization" value={pendingCount} icon={ShieldCheck} colorClass="bg-amber-900/30 text-amber-500" gradient="bg-amber-500" delay={0.1} />
        <MetricCard title="Products Live" value={liveCount} icon={Activity} colorClass="bg-emerald-900/30 text-emerald-500" gradient="bg-emerald-500" delay={0.2} />
        <MetricCard title="Success Rate" value="98%" icon={Star} colorClass="bg-blue-900/30 text-blue-500" gradient="bg-blue-500" delay={0.3} />
        <MetricCard title="Proj. Revenue Impact" value="$12.4M" icon={TrendingUp} colorClass="bg-purple-900/30 text-purple-500" gradient="bg-purple-500" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-[#0F172A] rounded-3xl p-6 border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-surya-primary" /> Projected Revenue Lift
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748B" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0F172A] rounded-3xl p-6 border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-white">Pending Executive Reviews</h2>
          {loading ? (
            <div className="text-center py-10 text-slate-500">Loading...</div>
          ) : products.filter(p => p.status === 'Waiting for CEO Review').length === 0 ? (
            <div className="text-center py-10 text-slate-500">No pending releases.</div>
          ) : (
            <div className="space-y-4">
              {products.filter(p => p.status === 'Waiting for CEO Review').map((product) => (
                <div 
                  key={product.id}
                  onClick={() => { setSelectedProduct(product); setDrawerOpen(true); }}
                  className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 cursor-pointer transition-all flex justify-between items-center group"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-surya-primary transition-colors">{product.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{product.department}</p>
                  </div>
                  <ChevronRight className="text-slate-500 group-hover:text-white transition-colors" size={18} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0F172A] rounded-3xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-white">Release History (Live)</h2>
        <div className="space-y-4">
          {products.filter(p => p.status === 'Live').map((product) => (
            <div key={product.id} className="p-4 rounded-xl border border-slate-700 bg-slate-800/30 flex justify-between items-center">
              <div>
                <h3 className="text-md font-bold text-emerald-400">{product.name} <span className="text-xs text-slate-500 ml-2">v{product.version}</span></h3>
                <p className="text-sm text-slate-400 mt-1">{product.requesterName} • {product.department}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                <CheckCircle size={12}/> LIVE
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedProduct && (
          <React.Fragment>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-3xl bg-[#0B1120] border-l border-slate-800 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
                  <div>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">Final Authorization</span>
                    <h2 className="text-3xl font-black text-white">{selectedProduct.name}</h2>
                    <p className="text-slate-400 mt-2">{selectedProduct.type} • Requested by {selectedProduct.requesterName} ({selectedProduct.department})</p>
                  </div>
                  <button onClick={() => setDrawerOpen(false)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  {/* Manager Endorsement */}
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-500 mb-4">
                      <FileBadge size={16} /> Manager Endorsement
                    </h3>
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                      "{selectedProduct.managerComments || 'Approved by Manager. No specific comments provided.'}"
                    </p>
                  </div>

                  {/* AI Score */}
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-500 mb-4">
                      <Zap size={16} /> AI Validation: {selectedProduct.aiScore?.overall}%
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selectedProduct.aiScore?.recommendation}
                    </p>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Business Purpose</span>
                    <p className="text-sm text-slate-300 bg-slate-900 p-4 rounded-xl leading-relaxed border border-slate-800">
                      {selectedProduct.businessPurpose}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Impact</span>
                      <p className="text-sm text-slate-300 bg-slate-900 p-4 rounded-xl border border-slate-800">{selectedProduct.expectedImpact}</p>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tech Stack</span>
                      <p className="text-sm text-slate-300 bg-slate-900 p-4 rounded-xl border border-slate-800">{selectedProduct.techStack}</p>
                    </div>
                  </div>
                </div>

                {/* Audit Log */}
                {selectedProduct.auditHistory && (
                  <div className="mb-8">
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-800 pb-2">
                      <ShieldCheck size={16} /> Enterprise Audit Trail
                    </h3>
                    <div className="space-y-3">
                      {selectedProduct.auditHistory.map((log, i) => (
                        <div key={i} className="text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-white">{log.action}</span> by {log.actor} ({log.role})
                          </div>
                          <div className="text-right text-slate-500">
                            <div>{new Date(log.timestamp).toLocaleString()}</div>
                            <div className="text-[10px] uppercase">IP: {log.ip}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.status === 'Waiting for CEO Review' && (
                  <div className="border-t border-slate-800 pt-8 mt-auto">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleAction('Reject')}
                        disabled={submitting}
                        className="flex-1 py-4 bg-slate-900 hover:bg-red-500/20 hover:text-red-400 text-white rounded-xl font-bold transition-all border border-slate-800 hover:border-red-500/50 disabled:opacity-50"
                      >
                        Veto Launch
                      </button>
                      <button 
                        onClick={() => handleAction('Launch')}
                        disabled={submitting}
                        className="flex-[2] py-4 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white rounded-xl font-black transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] disabled:opacity-50 flex justify-center items-center gap-3 text-lg"
                      >
                        <Lock size={20} /> LAUNCH PRODUCT TO PRODUCTION
                      </button>
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

export default ExecutiveLaunchControl;
