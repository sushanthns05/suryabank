import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  // Keeping socket as null so we don't break legacy components depending on it
  const [socket] = useState(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    // Listen to Firebase Firestore instead of Socket.io
    const maintenanceRef = doc(db, 'system', 'maintenance');
    
    const unsubscribe = onSnapshot(maintenanceRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.active) {
          const startTime = new Date(data.timestamp).getTime();
          const now = Date.now();
          const timeSinceStart = now - startTime;
          const durationMs = data.duration * 1000;

          if (timeSinceStart < durationMs) {
            const completedUpdate = localStorage.getItem('completed_update');
            if (completedUpdate === data.timestamp) {
              setIsMaintenance(false);
            } else {
              const remainingDuration = timeSinceStart < 0 ? data.duration : Math.ceil((durationMs - timeSinceStart) / 1000);
              setUpdateInfo({ ...data.updateDetails, duration: data.duration, remainingDuration, timestamp: data.timestamp });
              setIsMaintenance(true);
            }
          } else {
            setIsMaintenance(false);
          }
        } else if (data.scheduledFor) {
          // If not active yet, but scheduled for the future
          const scheduledTime = new Date(data.scheduledFor).getTime();
          const now = Date.now();
          const timeUntilUpdate = scheduledTime - now;

          if (timeUntilUpdate > 0) {
            // Client-side cron job: wait until the scheduled time, then activate
            const timer = setTimeout(() => {
              const completedUpdate = localStorage.getItem('completed_update');
              if (completedUpdate !== data.timestamp) {
                setUpdateInfo({ ...data.updateDetails, duration: data.duration, remainingDuration: data.duration, timestamp: data.timestamp });
                setIsMaintenance(true);
              }
            }, timeUntilUpdate);
            
            // Clean up the timer if the component unmounts or data changes
            return () => clearTimeout(timer);
          } else if (timeUntilUpdate > -data.duration * 1000) {
            // We are currently INSIDE the scheduled window!
            const completedUpdate = localStorage.getItem('completed_update');
            if (completedUpdate === data.timestamp) {
              setIsMaintenance(false);
            } else {
              const remainingDuration = Math.ceil((data.duration * 1000 + timeUntilUpdate) / 1000);
              setUpdateInfo({ ...data.updateDetails, duration: data.duration, remainingDuration, timestamp: data.timestamp });
              setIsMaintenance(true);
            }
          } else {
            setIsMaintenance(false);
          }
        } else {
          // Add small delay before hiding to ensure UI matches
          setTimeout(() => {
            setIsMaintenance(false);
          }, 2000);
        }
      } else {
        setIsMaintenance(false);
      }
    }, (error) => {
      console.error("Firebase maintenance listener error:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isMaintenance, updateInfo }}>
      {children}
    </SocketContext.Provider>
  );
};
