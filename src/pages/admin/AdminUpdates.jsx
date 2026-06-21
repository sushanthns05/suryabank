import React, { useState } from 'react';
import { Send, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

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
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://suryabank.onrender.com';
        
      const payload = { ...formData };
      if (isScheduled && scheduledFor) {
        payload.scheduledFor = scheduledFor;
      }

      const response = await fetch(`${backendUrl}/api/updates/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message || 'Update published successfully!');
        setFormData({ version: '', title: '', description: '', type: 'Feature', durationSeconds: 30 });
        setIsScheduled(false);
        setScheduledFor('');
      } else {
        setMessage('Failed to publish update.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error. Check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-updates p-6 max-w-4xl mx-auto fade-in" style={{ paddingTop: '100px' }}>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Website Updates & Maintenance</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Publish system updates and trigger maintenance mode across all customer portals in real-time.</p>

      <Card className="p-8 glass bg-white dark:bg-slate-800 shadow-xl rounded-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center border-b pb-4">
          <Send className="mr-2 text-surya-primary" /> Publish New Update
        </h2>

        {message && (
          <div className="mb-6 p-4 rounded-lg flex items-center bg-green-50 text-green-700 border border-green-200">
            <CheckCircle className="mr-2" /> {message}
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
    </div>
  );
};

export default AdminUpdates;
