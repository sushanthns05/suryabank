import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    // Connect to the backend server
    const backendUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : 'https://suryabank.onrender.com';
      
    const newSocket = io(backendUrl);
    setSocket(newSocket);

    // Initial status check
    fetch(`${backendUrl}/api/updates/status`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsMaintenance(data.maintenanceMode);
          if (data.latestUpdate) setUpdateInfo(data.latestUpdate);
        }
      })
      .catch(err => console.error("Failed to fetch initial status", err));

    // Listen for maintenance events
    newSocket.on('maintenance_started', (data) => {
      setUpdateInfo({ ...data.update, duration: data.duration });
      setIsMaintenance(true);
    });

    newSocket.on('maintenance_completed', () => {
      // Simulate a small delay before hiding the screen or letting the MaintenanceScreen handle the reload
      setTimeout(() => {
        setIsMaintenance(false);
      }, 2000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isMaintenance, updateInfo }}>
      {children}
    </SocketContext.Provider>
  );
};
