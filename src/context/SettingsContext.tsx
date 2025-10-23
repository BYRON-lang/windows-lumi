import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SettingsContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  markAsChanged: () => void;
  markAsSaved: () => void;
  pendingChanges: Record<string, any>;
  addPendingChange: (key: string, value: any) => void;
  clearPendingChanges: () => void;
  getPendingChanges: () => Record<string, any>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});

  console.log('SettingsProvider rendered - hasUnsavedChanges:', hasUnsavedChanges);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
    setPendingChanges({});
  }, []);

  const addPendingChange = useCallback((key: string, value: any) => {
    console.log('Adding pending change:', key, value);
    setPendingChanges(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
    console.log('Has unsaved changes set to true');
  }, []);

  const clearPendingChanges = useCallback(() => {
    setPendingChanges({});
    setHasUnsavedChanges(false);
  }, []);

  const getPendingChanges = useCallback(() => {
    return pendingChanges;
  }, [pendingChanges]);

  const value: SettingsContextType = {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    markAsChanged,
    markAsSaved,
    pendingChanges,
    addPendingChange,
    clearPendingChanges,
    getPendingChanges,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};
