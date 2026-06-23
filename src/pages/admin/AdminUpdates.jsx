import React, { useState, useEffect } from 'react';
import { Send, AlertTriangle, CheckCircle, Clock, Trash2, Edit, Bell, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { doc, setDoc, addDoc, collection, onSnapshot, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminUpdates = () => {
  const [formData, setFormData] = useState({
    version: '',
    title: '',
    description: '',
    type: 'Feature',
    durationSeconds: 30
  });
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledFor, setScheduledFor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentUpdate, setCurrentUpdate] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [editingNotif, setEditingNotif] = useState(null);

  useEffect(() => {
    let timerId = null;
    const maintenanceRef = doc(db, 'system', 'maintenance');
    const unsubscribeMaintenance = onSnapshot(maintenanceRef, (docSnap) => {
      if (timerId) clearTimeout(timerId);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const nowTime = Date.now();
        const durationMs = (data.duration || 0) * 1000;

        if (data.active && !data.scheduledFor && data.timestamp) {
          const startTime = new Date(data.timestamp).getTime();
          const timeSinceStart = nowTime - startTime;
          
          if (timeSinceStart >= durationMs + 3000) {
            setCurrentUpdate(null);
            setDoc(maintenanceRef, { active: false }, { merge: true }).catch(e => {});
          } else {
            setCurrentUpdate(data);
            timerId = setTimeout(() => {
              setCurrentUpdate(null);
              setDoc(maintenanceRef, { active: false }, { merge: true }).catch(e => {});
            }, (durationMs + 3000) - timeSinceStart);
          }
        } else if (data.scheduledFor) {
          const scheduledTime = new Date(data.scheduledFor).getTime();
          
          if (nowTime >= scheduledTime + durationMs + 3000) {
            setCurrentUpdate(null);
            setDoc(maintenanceRef, { active: false, scheduledFor: null }, { merge: true }).catch(e => {});
          } else {
            setCurrentUpdate(data);
            timerId = setTimeout(() => {
              setCurrentUpdate(null);
              setDoc(maintenanceRef, { active: false, scheduledFor: null }, { merge: true }).catch(e => {});
            }, (scheduledTime + durationMs + 3000) - nowTime);
          }
        } else {
          setCurrentUpdate(null);
        }
      } else {
        setCurrentUpdate(null);
      }
    });

    const q = query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
    const unsubscribeNotifs = onSnapshot(q, (snapshot) => {
      const notifs = [];
      snapshot.forEach((doc) => {
        notifs.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(notifs);
    });

    return () => {
      unsubscribeMaintenance();
      unsubscribeNotifs();
    };
  }, []);

  const handleCancelUpdate = async () => {
    try {
      const maintenanceRef = doc(db, 'system', 'maintenance');
      await deleteDoc(maintenanceRef);
      setMessage({ type: 'success', text: 'Update cancelled successfully.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to cancel update.' });
    }
  };

  const handleModifyUpdate = () => {
    if (currentUpdate) {
      setFormData({
        version: currentUpdate.updateDetails?.version || '',
        title: currentUpdate.updateDetails?.title || '',
        description: currentUpdate.updateDetails?.description || '',
        type: currentUpdate.updateDetails?.type || 'Feature',
        durationSeconds: currentUpdate.duration || 30
      });
      if (currentUpdate.scheduledFor) {
        setIsScheduled(true);
        const localDate = new Date(currentUpdate.scheduledFor);
        localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
        setScheduledFor(localDate.toISOString().slice(0, 16));
      } else {
        setIsScheduled(false);
        setScheduledFor('');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification globally?")) {
      try {
        await deleteDoc(doc(db, 'notifications', id));
      } catch (e) {
        console.error("Error deleting notification", e);
      }
    }
  };

  const handleSaveNotification = async () => {
    try {
      if (editingNotif) {
        const notifRef = doc(db, 'notifications', editingNotif.id);
        await updateDoc(notifRef, {
          title: editingNotif.title,
          description: editingNotif.description
        });
        setEditingNotif(null);
      }
    } catch (e) {
      console.error("Error updating notification", e);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage(null);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload = { ...formData };
      const duration = parseInt(payload.durationSeconds) || 30;

      const maintenanceRef = doc(db, 'system', 'maintenance');
      
      const updateData = {
        active: !isScheduled, // If scheduled, it's not active YET
        duration: duration,
        timestamp: new Date().toISOString(),
        updateDetails: {
          version: payload.version,
          title: payload.title,
          description: payload.description,
          type: payload.type
        }
      };

      if (isScheduled && scheduledFor) {
        updateData.scheduledFor = new Date(scheduledFor).toISOString();
      }

      await setDoc(maintenanceRef, updateData);
      
      // Add a persistent notification record for the Customer Dashboard
      const notificationDesc = isScheduled 
        ? `Scheduled for: ${new Date(scheduledFor).toLocaleString()}. ${payload.description}` 
        : payload.description;

      await addDoc(collection(db, 'notifications'), {
        title: payload.title,
        description: notificationDesc,
        type: isScheduled ? 'Scheduled Maintenance' : payload.type,
        timestamp: new Date().toISOString(),
        is_read: false
      });
      
      // Auto-revert the global state after the duration finishes ONLY if it was active immediately
      if (!isScheduled) {
        setTimeout(async () => {
          await setDoc(maintenanceRef, { active: false }, { merge: true });
        }, duration * 1000 + 3000);
      }
      
      setMessage({ type: 'success', text: isScheduled ? 'Update scheduled successfully! Customers have been notified.' : 'Update published successfully! Maintenance mode activated globally.' });
      setFormData({ version: '', title: '', description: '', type: 'Feature', durationSeconds: 30 });
      setIsScheduled(false);
      setScheduledFor('');
    } catch (err) {
      console.error("Firestore write failed:", err);
      setMessage({ type: 'error', text: 'Failed to publish update. Check your Firebase permissions.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-updates p-6 max-w-4xl mx-auto fade-in" style={{ paddingTop: '100px' }}>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Website Updates & Maintenance</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Publish system updates and trigger maintenance mode across all customer portals in real-time.</p>

      {currentUpdate && (
        <Card className="p-8 glass bg-white dark:bg-slate-800 shadow-xl rounded-2xl mb-8 border border-blue-200 dark:border-blue-800">
          <h2 className="text-xl font-bold mb-4 flex items-center text-blue-700 dark:text-blue-500">
            {currentUpdate.scheduledFor ? <Clock className="mr-2" /> : <AlertTriangle className="mr-2" />}
            {currentUpdate.scheduledFor ? 'Currently Scheduled Update' : 'Active Maintenance Update'}
          </h2>
          <div className="mb-4">
            <p className="font-bold text-lg">{currentUpdate.updateDetails?.title} <span className="text-sm font-normal text-slate-500">({currentUpdate.updateDetails?.version})</span></p>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{currentUpdate.updateDetails?.description}</p>
            {currentUpdate.scheduledFor && (
              <p className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">Scheduled For: {new Date(currentUpdate.scheduledFor).toLocaleString()}</p>
            )}
            <p className="mt-1 text-sm font-medium text-slate-500">Duration: {currentUpdate.duration} seconds</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleModifyUpdate} type="button" variant="outline" className="flex items-center text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <Edit size={16} className="mr-2" /> Modify
            </Button>
            <Button onClick={handleCancelUpdate} type="button" variant="outline" className="flex items-center text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={16} className="mr-2" /> Cancel Update
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-8 glass bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center border-b pb-4">
          <Send className="mr-2 text-surya-primary" /> Publish New Update
        </h2>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="mr-2" /> : <AlertTriangle className="mr-2" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handlePublish}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Version Number</label>
              <input 
                type="text" 
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="e.g. v2.1.0"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-surya-primary outline-none dark:bg-slate-700 dark:border-slate-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Update Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-surya-primary outline-none dark:bg-slate-700 dark:border-slate-600"
              >
                <option value="Feature">New Feature</option>
                <option value="Maintenance">System Maintenance</option>
                <option value="Security">Security Patch</option>
                <option value="Upgrade">Major Upgrade</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Maintenance Duration (Seconds)</label>
              <input 
                type="number" 
                name="durationSeconds"
                value={formData.durationSeconds}
                onChange={handleChange}
                min="10"
                max="3600"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-surya-primary outline-none dark:bg-slate-700 dark:border-slate-600"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Update Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Introducing Recurring Deposits"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-surya-primary outline-none dark:bg-slate-700 dark:border-slate-600"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Detailed Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what is included in this update..."
              className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-surya-primary outline-none dark:bg-slate-700 dark:border-slate-600"
              required
            ></textarea>
          </div>

          <div className="mb-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700">
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                id="schedule-toggle"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="w-5 h-5 text-surya-primary border-gray-300 rounded focus:ring-surya-primary"
              />
              <label htmlFor="schedule-toggle" className="ml-2 block text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center">
                <Clock size={18} className="mr-2" /> Schedule this update for later
              </label>
            </div>
            
            {isScheduled && (
              <div className="ml-7 mt-2">
                <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-400">Select Date and Time</label>
                <input 
                  type="datetime-local" 
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="w-full md:w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-surya-primary outline-none dark:bg-slate-700 dark:border-slate-600"
                  required={isScheduled}
                />
              </div>
            )}
          </div>

          {!isScheduled && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-8">
              <h4 className="font-bold flex items-center text-amber-700 dark:text-amber-500 mb-2">
                <AlertTriangle size={18} className="mr-2" /> Warning: Maintenance Mode Activation
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-500">
                Publishing this update will instantly disconnect all active customers and display a full-screen maintenance countdown. The website will automatically refresh for them once the update completes.
              </p>
            </div>
          )}

          {isScheduled && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-8">
              <h4 className="font-bold flex items-center text-blue-700 dark:text-blue-500 mb-2">
                <Clock size={18} className="mr-2" /> Update Scheduled
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-500">
                This update will be automatically deployed at the scheduled time. Maintenance mode will not be triggered until then.
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSubmitting} className={`px-8 py-3 border-none text-white font-bold text-lg ${isScheduled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}>
              {isSubmitting ? 'Publishing...' : (isScheduled ? 'Schedule Update' : 'Publish Update & Trigger Maintenance')}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-8 glass bg-white dark:bg-slate-800 shadow-xl rounded-2xl mt-8">
        <h2 className="text-xl font-bold mb-6 flex items-center border-b pb-4">
          <Bell className="mr-2 text-surya-primary" /> Notification History
        </h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {notifications.map(notif => (
            <div key={notif.id} className="p-4 border rounded-xl dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-start transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80">
              <div className="flex-1 pr-4">
                <div className="flex items-center mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mr-2 ${notif.type?.includes('Maintenance') ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'}`}>
                    {notif.type || 'Notification'}
                  </span>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{notif.title}</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{notif.description}</p>
                <span className="text-xs font-medium text-slate-400 mt-3 block flex items-center">
                  <Clock size={12} className="mr-1" />
                  {new Date(notif.timestamp || notif.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button onClick={() => setEditingNotif(notif)} className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDeleteNotification(notif.id)} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Bell size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p>No notifications history found.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Edit Notification Modal */}
      {editingNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingNotif(null)}>
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Edit Notification</h3>
              <button onClick={() => setEditingNotif(null)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full text-slate-500 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Notification Title</label>
              <input 
                type="text" 
                value={editingNotif.title} 
                onChange={(e) => setEditingNotif({...editingNotif, title: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-surya-primary outline-none dark:bg-slate-700 dark:border-slate-600 text-slate-800 dark:text-white"
              />
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Detailed Description</label>
              <textarea 
                value={editingNotif.description} 
                onChange={(e) => setEditingNotif({...editingNotif, description: e.target.value})}
                className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-surya-primary outline-none dark:bg-slate-700 dark:border-slate-600 text-slate-800 dark:text-white"
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setEditingNotif(null)} className="px-5">Cancel</Button>
              <Button type="button" variant="primary" onClick={handleSaveNotification} className="px-5">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpdates;
