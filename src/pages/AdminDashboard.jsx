import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Users, Shield, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import './CustomerDashboard.css'; // Reuse dashboard styles

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic Security Check
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }

    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header bg-gradient-blue">
        <div className="container">
          <div className="header-content">
            <div className="welcome-section">
              <Shield size={40} style={{ color: 'var(--primary-gold)' }} />
              <div>
                <h1 className="welcome-text">Admin Portal</h1>
                <p className="date-text">Manage system users and access roles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-content">
        <Card className="full-width-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={24} /> Registered Users
            </h2>
            <span style={{ background: 'var(--bg-card-hover)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>
              Total: {users.length}
            </span>
          </div>

          {loading ? (
            <p>Loading users database...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Role</th>
                    <th style={{ padding: '12px' }}>Balance</th>
                    <th style={{ padding: '12px' }}>Joined Date</th>
                    <th style={{ padding: '12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{user.fullName}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{user.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '0.8rem',
                          textTransform: 'uppercase',
                          background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : user.role === 'employee' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                          color: user.role === 'admin' ? '#ef4444' : user.role === 'employee' ? '#3b82f6' : '#22c55e'
                        }}>
                          {user.role || 'customer'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>${parseFloat(user.balance || 0).toFixed(2)}</td>
                      <td style={{ padding: '12px' }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td style={{ padding: '12px' }}>
                        <CheckCircle size={18} color="#22c55e" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
