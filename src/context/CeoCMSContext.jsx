import React, { createContext, useContext, useState } from 'react';
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
