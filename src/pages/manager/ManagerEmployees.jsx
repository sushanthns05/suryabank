import React, { useState, useEffect } from 'react';
import { 
  UserCheck, Search, Plus, Edit2, Trash2, 
  X, AlertTriangle, RefreshCw, CheckCircle, MapPin, Eye
} from 'lucide-react';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../../services/api';
import EmployeeDetailsModal from './EmployeeDetailsModal';

const INITIAL_EMPLOYEES = [
  "Sushanth N S - Manager and Head of Bank",
  "Manjunath R - Senior Personal Bankers / Banking Associates",
  "Kumar G - Personal Bankers / Banking Associates",
  "Ramesh R - Personal Bankers / Banking Associates",
  "Satish H - Personal Bankers / Banking Associates",
  "Manish Shetty - Personal Bankers / Banking Associates",
  "Srinath J - Senior Bank Clerks / Tellers",
  "Jagdish R - Bank Clerks / Tellers",
  "Ramnath Kumar - Bank Clerks / Tellers",
  "Kushal R - Bank Clerks / Tellers",
  "Gagan S - Bank Clerks / Tellers",
  "Suresh S - Senior Relationship Manager",
  "Daranth S - Relationship Manager",
  "Krishna J - Relationship Manager",
  "Kushal N - Relationship Manager",
  "Likith Gowda - Relationship Manager",
  "Hemanth Patil - Senior Loan Officer",
  "Manjunath S R - Loan Officer",
  "Krishna Kumar - Loan Officer",
  "T Nagappa - Loan Officer",
  "Jagan Nath - Loan Officer",
  "Girish Yadav J - System Manager"
];

const generateEmployeeId = () => {
  return 'EMP' + Math.floor(10000 + Math.random() * 90000);
};

const ManagerEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', designation: '', branch: 'Kengeri Satellite Town', status: 'Active' });
  const [isSaving, setIsSaving] = useState(false);
  
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [detailsEmployee, setDetailsEmployee] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    const res = await getEmployees();
    if (res.success) {
      if (res.data.length === 0) {
        // Auto-seed the database if empty
        console.log("Database empty, auto-seeding initial Kengeri branch employees...");
        await autoSeedEmployees();
      } else {
        setEmployees(res.data);
      }
    }
    setLoading(false);
  };

  const autoSeedEmployees = async () => {
    const promises = INITIAL_EMPLOYEES.map(async (empStr) => {
      const [name, designation] = empStr.split(' - ');
      return addEmployee({
        employeeId: generateEmployeeId(),
        fullName: name,
        designation: designation,
        branch: 'Kengeri Satellite Town',
        status: 'Active'
      });
    });
    
    await Promise.all(promises);
    const res = await getEmployees();
    if (res.success) setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenModal = (mode, employee = null) => {
    setModalMode(mode);
    if (mode === 'edit' && employee) {
      setCurrentEmployee(employee);
      setFormData({
        fullName: employee.fullName,
        designation: employee.designation,
        branch: employee.branch || 'Kengeri Satellite Town',
        status: employee.status || 'Active'
      });
    } else {
      setCurrentEmployee(null);
      setFormData({ fullName: '', designation: '', branch: 'Kengeri Satellite Town', status: 'Active' });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (modalMode === 'add') {
      const newEmp = { ...formData, employeeId: generateEmployeeId() };
      const res = await addEmployee(newEmp);
      if (res.success) {
        setEmployees([{ id: res.id, ...newEmp }, ...employees]);
        setShowModal(false);
      } else {
        alert("Failed to add employee.");
      }
    } else {
      const res = await updateEmployee(currentEmployee.id, formData);
      if (res.success) {
        setEmployees(employees.map(emp => emp.id === currentEmployee.id ? { ...emp, ...formData } : emp));
        setShowModal(false);
      } else {
        alert("Failed to update employee.");
      }
    }
    setIsSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    const res = await deleteEmployee(deleteCandidate.id);
    if (res.success) {
      setEmployees(employees.filter(emp => emp.id !== deleteCandidate.id));
      setDeleteCandidate(null);
    } else {
      alert("Failed to delete employee.");
    }
    setIsDeleting(false);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Employee Directory</h1>
          <p className="text-slate-400 text-sm mt-1">Manage staff, designations, and system access.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal('add')}
            className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#F59E0B]/20 transition-all active:scale-95"
          >
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 shadow-lg">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID, or designation..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] transition-all text-sm"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#1E293B]/60 backdrop-blur-md rounded-xl border border-slate-700/50 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A]/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/50">
                <th className="p-4 font-medium whitespace-nowrap">Employee Info</th>
                <th className="p-4 font-medium whitespace-nowrap">Designation</th>
                <th className="p-4 font-medium whitespace-nowrap">Branch</th>
                <th className="p-4 font-medium whitespace-nowrap">Status</th>
                <th className="p-4 font-medium text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <RefreshCw size={24} className="animate-spin text-[#F59E0B] mx-auto mb-3" />
                    <p className="text-slate-400">Loading staff database...</p>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <UserCheck size={32} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-300 text-lg font-medium">No employees found</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => (
                  <tr key={emp.id} className="border-b border-slate-700/30 hover:bg-[#0F172A]/40 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-[#F59E0B] flex items-center justify-center font-bold shadow-inner">
                          {emp.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-[#F59E0B] transition-colors">{emp.fullName}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-300 font-medium">{emp.designation}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-slate-400 text-xs gap-1.5">
                        <MapPin size={12} className="text-[#F59E0B]" />
                        {emp.branch}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => setDetailsEmployee(emp)}
                          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="View Operations Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleOpenModal('edit', emp)}
                          className="p-2 text-slate-400 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded-lg transition-colors"
                          title="Edit Employee"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => setDeleteCandidate(emp)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove Employee"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-[#0F172A]/50">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {modalMode === 'add' ? <Plus size={18} className="text-[#F59E0B]"/> : <Edit2 size={18} className="text-[#F59E0B]"/>}
                {modalMode === 'add' ? 'Add New Employee' : 'Edit Employee Details'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                  className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Designation</label>
                <input 
                  type="text" 
                  value={formData.designation} 
                  onChange={(e) => setFormData({...formData, designation: e.target.value})} 
                  className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Branch</label>
                  <select 
                    value={formData.branch} 
                    onChange={(e) => setFormData({...formData, branch: e.target.value})} 
                    className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                  >
                    <option value="Kengeri Satellite Town">Kengeri Satellite Town</option>
                    <option value="Jayanagar">Jayanagar</option>
                    <option value="Indiranagar">Indiranagar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})} 
                    className="w-full p-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-transparent border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#F59E0B] to-yellow-600 text-white font-bold rounded-lg shadow-lg hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSaving && <RefreshCw size={16} className="animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertTriangle size={32} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Remove Employee?</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to remove <strong className="text-slate-200">{deleteCandidate.fullName}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteCandidate(null)}
                  className="flex-1 px-4 py-2.5 bg-transparent border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-800 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isDeleting && <RefreshCw size={16} className="animate-spin" />}
                  {isDeleting ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsEmployee && (
        <EmployeeDetailsModal 
          employee={detailsEmployee} 
          onClose={() => setDetailsEmployee(null)} 
        />
      )}
    </div>
  );
};

export default ManagerEmployees;
