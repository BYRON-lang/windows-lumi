import { useState, useEffect, useCallback } from 'react';
import { localSettingsService } from '../services/LocalSettingsService';
import { settingsSyncService } from '../services/SettingsSyncService';
import { useProfile } from './useProfile';

interface UseSettingsReturn {
  settings: Record<string, any>;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  getSetting: (key: string, defaultValue?: any) => any;
  updateSetting: (key: string, value: any) => Promise<void>;
  deleteSetting: (key: string) => Promise<void>;
  refreshSettings: () => Promise<void>;
  forceSync: () => Promise<void>;
}

export const useSettings = (category: string): UseSettingsReturn => {
  const { user } = useProfile();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get setting value with fallback
  const getSetting = useCallback((key: string, defaultValue?: any) => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }, [settings]);

  // Update setting value
  const updateSetting = useCallback(async (key: string, value: any) => {
    if (!user) {
      setError('No authenticated user');
      return;
    }

    try {
      setError(null);
      
      // Update local database immediately
      await localSettingsService.setSetting(user.id, category, key, value);
      
      // Update local state immediately for instant UI feedback
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));

      console.log(`Updated setting ${category}.${key}:`, value);
    } catch (err) {
      console.error('Error updating setting:', err);
      setError('Failed to update setting');
    }
  }, [user, category]);

  // Delete setting
  const deleteSetting = useCallback(async (key: string) => {
    if (!user) {
      setError('No authenticated user');
      return;
    }

    try {
      setError(null);
      
      // Delete from local database
      await localSettingsService.deleteSetting(user.id, category, key);
      
      // Update local state
      setSettings(prev => {
        const newSettings = { ...prev };
        delete newSettings[key];
        return newSettings;
      });

      console.log(`Deleted setting ${category}.${key}`);
    } catch (err) {
      console.error('Error deleting setting:', err);
      setError('Failed to delete setting');
    }
  }, [user, category]);

  // Refresh settings from local database
  const refreshSettings = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const categorySettings = await localSettingsService.getSettingsByCategory(user.id, category);
      setSettings(categorySettings);
      
    } catch (err) {
      console.error('Error refreshing settings:', err);
      setError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, [user, category]);

  // Force sync with backend
  const forceSync = useCallback(async () => {
    try {
      setIsSyncing(true);
      setError(null);
      
      await settingsSyncService.forceSync();
      await refreshSettings();
      
    } catch (err) {
      console.error('Error force syncing:', err);
      setError('Failed to sync settings');
    } finally {
      setIsSyncing(false);
    }
  }, [refreshSettings]);

  // Load settings on mount and when user changes
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Start background sync when user is available
  useEffect(() => {
    if (user) {
      settingsSyncService.startBackgroundSync();
      
      // Register current device
      localSettingsService.registerDevice(user.id, {
        name: 'Lumi Windows App',
        type: 'desktop',
        os: 'Windows',
        browser: 'Electron',
        is_current: true
      });
    }

    return () => {
      settingsSyncService.stopBackgroundSync();
    };
  }, [user]);

  return {
    settings,
    isLoading,
    isSyncing,
    error,
    getSetting,
    updateSetting,
    deleteSetting,
    refreshSettings,
    forceSync,
  };
};

// Hook for device management
export const useDevices = () => {
  const { user } = useProfile();
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDevices = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const userDevices = await localSettingsService.getDevices(user.id);
      setDevices(userDevices);
      
    } catch (err) {
      console.error('Error refreshing devices:', err);
      setError('Failed to load devices');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const logoutAllDevices = useCallback(async () => {
    if (!user) return;

    try {
      setError(null);
      
      await localSettingsService.logoutAllDevices(user.id);
      await refreshDevices();
      
      console.log('Logged out all devices');
    } catch (err) {
      console.error('Error logging out all devices:', err);
      setError('Failed to logout all devices');
    }
  }, [user, refreshDevices]);

  const updateDeviceLastActive = useCallback(async (deviceId: string) => {
    try {
      await localSettingsService.updateDeviceLastActive(deviceId);
      await refreshDevices();
    } catch (err) {
      console.error('Error updating device last active:', err);
    }
  }, [refreshDevices]);

  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  return {
    devices,
    isLoading,
    error,
    refreshDevices,
    logoutAllDevices,
    updateDeviceLastActive,
  };
};
