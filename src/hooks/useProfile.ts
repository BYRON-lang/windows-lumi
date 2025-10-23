import { useState, useEffect, useCallback } from 'react';
import { authService, User } from '../services/authService';

interface UseProfileReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setError('Failed to load profile data');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      setError(null);
      // Here you would typically make an API call to update the profile
      // For now, we'll just update the local state
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        
        // Update stored user data in Electron
        if (window.electronAPI?.setUserData) {
          await window.electronAPI.setUserData(updatedUser);
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  }, [user]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return {
    user,
    isLoading,
    error,
    refreshProfile,
    updateProfile,
  };
};
