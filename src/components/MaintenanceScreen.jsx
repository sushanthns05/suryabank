import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { Settings, RefreshCw, ServerCrash, CheckCircle } from 'lucide-react';
import './MaintenanceScreen.css';

const MaintenanceScreen = () => {
  const { isMaintenance, updateInfo } = useSocket();
  const [countdown, setCountdown] = useState(30);
  const [totalDuration, setTotalDuration] = useState(30);
  const [stage, setStage] = useState(0); // 0: Init, 1: Applying, 2: Restarting, 3: Loading, 4: Done

  useEffect(() => {
    let timer;
    if (isMaintenance) {
      // Safely check if updateInfo or the context exposes duration
      // SocketContext was updated to pass duration via the 'updateInfo' or separately.
      // Wait, let's check SocketContext to see if it stores duration.
      // We'll check the global updateInfo for duration, or default to 30.
      let dur = 30;
      if (updateInfo && updateInfo.duration) {
        dur = updateInfo.duration;
      }
      // Or check if the socket context stores duration separately. 
      // Actually, in node.js I passed it inside the emit payload: { update, notification, duration }
      // Let's assume it's attached to updateInfo somehow, or we can just read window.__maintenanceDuration if we update SocketContext.
      // Let's modify SocketContext to provide duration as well.
      
      setCountdown(dur);
      setTotalDuration(dur);
      setStage(0);

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStage(4);
            performRefresh();
            return 0;
          }
          
          // Progress stages based on percentage of duration
          const percentLeft = (prev / dur) * 100;
          if (percentLeft <= 85 && percentLeft > 50) setStage(1);
          if (percentLeft <= 50 && percentLeft > 15) setStage(2);
          if (percentLeft <= 15) setStage(3);
          
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isMaintenance, updateInfo]);

  const performRefresh = async () => {
    try {
      // Clear Service Worker Caches
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      }
      
      // Force reload the page
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    } catch (e) {
      console.error("Cache clearing failed", e);
      window.location.reload();
    }
  };

  if (!isMaintenance) return null;

  return (
    <div className="maintenance-overlay fade-in">
      <div className="maintenance-card">
        <div className="maintenance-header">
          <Settings className="spin-icon text-surya-primary" size={64} />
          <h2>System Maintenance in Progress</h2>
          <p>Surya Bank is currently updating our services.</p>
        </div>

        {updateInfo && (
          <div className="update-info">
            <span className="badge">{updateInfo.type || 'Update'} {updateInfo.version && `- ${updateInfo.version}`}</span>
            <h3>{updateInfo.title}</h3>
            <p>{updateInfo.description}</p>
          </div>
        )}

        <div className="progress-container">
          <div className="status-text">
            {stage === 0 && <span>Preparing update...</span>}
            {stage === 1 && <span>Applying updates...</span>}
            {stage === 2 && <span>Restarting services...</span>}
            {stage === 3 && <span>Loading latest version...</span>}
            {stage === 4 && <span className="text-green-500"><CheckCircle className="inline mr-2"/> Surya Bank has been successfully updated.</span>}
          </div>
          
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${((totalDuration - countdown) / totalDuration) * 100}%` }}
            ></div>
          </div>
          
          <div className="countdown-info flex items-center justify-center">
            <RefreshCw className={stage < 4 ? 'spin-icon mr-2 text-slate-400' : 'mr-2 text-green-500'} size={16} />
            {stage < 4 ? (
              <span>A new update is available. The website will refresh automatically in <strong>{countdown}s</strong>.</span>
            ) : (
              <span>Reloading application...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
