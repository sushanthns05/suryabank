import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCeoAuth } from './CeoAuthContext';

const CeoCMSContext = createContext();

export const useCeoCMS = () => {
  return useContext(CeoCMSContext);
};

export const CeoCMSProvider = ({ children }) => {
  const { role } = useCeoAuth();
  
  // Only the CEO can truly activate edit mode. 
  // We allow the state to exist, but enforce role === 'CEO' everywhere.
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSavingGlobal, setIsSavingGlobal] = useState(false);

  const toggleEditMode = () => {
    if (role === 'CEO') {
      setIsEditMode(!isEditMode);
    }
  };

  // Enable global document editing when in Executive Edit Mode
  useEffect(() => {
    if (role === 'CEO' && isEditMode) {
      document.designMode = 'on';
      // Add a visual cue to the body
      document.body.classList.add('border-[5px]', 'border-rose-500/30', 'transition-all', 'duration-500');
    } else {
      document.designMode = 'off';
      document.body.classList.remove('border-[5px]', 'border-rose-500/30', 'transition-all', 'duration-500');
    }
    
    return () => {
      document.designMode = 'off';
      document.body.classList.remove('border-[5px]', 'border-rose-500/30');
    };
  }, [isEditMode, role]);

  const value = {
    isEditMode: role === 'CEO' && isEditMode,
    toggleEditMode,
    isSavingGlobal,
    setIsSavingGlobal
  };

  return (
    <CeoCMSContext.Provider value={value}>
      {children}
    </CeoCMSContext.Provider>
  );
};
