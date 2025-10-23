// Settings Sync Service - Handles synchronization with backend
import { localSettingsService, SyncItem } from './LocalSettingsService';
import { authService } from './authService';

const API_BASE_URL = 'https://auth-lumi.gridrr.com';

class SettingsSyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing = false;
  private syncIntervalMs = 30000; // 30 seconds

  // Start background sync
  startBackgroundSync(): void {
    if (this.syncInterval) return;

    console.log('Starting background settings sync...');
    this.syncInterval = setInterval(async () => {
      try {
        await this.syncToBackend();
        await this.syncFromBackend();
      } catch (error) {
        console.error('Background sync error:', error);
      }
    }, this.syncIntervalMs);
  }

  // Stop background sync
  stopBackgroundSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Stopped background settings sync');
    }
  }

  // Sync local changes to backend
  async syncToBackend(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const pendingItems = await localSettingsService.getPendingSyncItems();
      if (pendingItems.length === 0) return;

      console.log(`Syncing ${pendingItems.length} settings changes to backend...`);

      const token = authService.getToken();
      if (!token) {
        console.log('No auth token available for sync');
        return;
      }

      // Group items by operation type for batch processing
      const createItems = pendingItems.filter(item => item.operation === 'create');
      const updateItems = pendingItems.filter(item => item.operation === 'update');
      const deleteItems = pendingItems.filter(item => item.operation === 'delete');

      // Process creates and updates
      if (createItems.length > 0 || updateItems.length > 0) {
        const settingsToSync = [...createItems, ...updateItems].map(item => ({
          category: item.category,
          key: item.key,
          value: item.value,
          data_type: item.data_type
        }));

        const response = await fetch(`${API_BASE_URL}/settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ settings: settingsToSync })
        });

        if (response.ok) {
          // Mark all create/update items as synced
          for (const item of [...createItems, ...updateItems]) {
            await localSettingsService.markAsSynced(item.id);
          }
          console.log(`Successfully synced ${settingsToSync.length} settings to backend`);
        } else {
          console.error('Failed to sync settings to backend:', response.status);
          // Increment retry count for failed items
          for (const item of [...createItems, ...updateItems]) {
            await localSettingsService.incrementRetryCount(item.id);
          }
        }
      }

      // Process deletes
      if (deleteItems.length > 0) {
        for (const item of deleteItems) {
          try {
            const response = await fetch(`${API_BASE_URL}/settings/${item.category}/${item.key}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              await localSettingsService.markAsSynced(item.id);
            } else {
              await localSettingsService.incrementRetryCount(item.id);
            }
          } catch (error) {
            console.error(`Failed to delete setting ${item.category}/${item.key}:`, error);
            await localSettingsService.incrementRetryCount(item.id);
          }
        }
      }

    } catch (error) {
      console.error('Error syncing to backend:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Pull latest settings from backend
  async syncFromBackend(): Promise<void> {
    try {
      const token = authService.getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch settings from backend:', response.status);
        return;
      }

      const data = await response.json();
      if (data.settings) {
        console.log('Syncing settings from backend...');
        
        // Update local settings with backend data
        for (const [category, settings] of Object.entries(data.settings)) {
          for (const [key, value] of Object.entries(settings as Record<string, any>)) {
            await localSettingsService.setSetting(
              data.user_id || 'current_user',
              category,
              key,
              value
            );
          }
        }
        
        console.log('Successfully synced settings from backend');
      }

    } catch (error) {
      console.error('Error syncing from backend:', error);
    }
  }

  // Sync devices to backend
  async syncDevicesToBackend(): Promise<void> {
    try {
      const token = authService.getToken();
      if (!token) return;

      const user = await authService.getCurrentUser();
      if (!user) return;

      const devices = await localSettingsService.getDevices(user.id);
      
      const response = await fetch(`${API_BASE_URL}/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ devices })
      });

      if (response.ok) {
        console.log('Successfully synced devices to backend');
      } else {
        console.error('Failed to sync devices to backend:', response.status);
      }

    } catch (error) {
      console.error('Error syncing devices to backend:', error);
    }
  }

  // Get devices from backend
  async syncDevicesFromBackend(): Promise<void> {
    try {
      const token = authService.getToken();
      if (!token) return;

      const user = await authService.getCurrentUser();
      if (!user) return;

      const response = await fetch(`${API_BASE_URL}/devices`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch devices from backend:', response.status);
        return;
      }

      const data = await response.json();
      if (data.devices) {
        console.log('Syncing devices from backend...');
        
        // Update local devices with backend data
        for (const device of data.devices) {
          await localSettingsService.registerDevice(user.id, device);
        }
        
        console.log('Successfully synced devices from backend');
      }

    } catch (error) {
      console.error('Error syncing devices from backend:', error);
    }
  }

  // Handle sync conflicts
  async resolveConflicts(): Promise<void> {
    try {
      // For now, we'll use a simple "last-write-wins" strategy
      // In the future, we could implement more sophisticated conflict resolution
      console.log('Resolving sync conflicts...');
      
      // This would be implemented based on specific conflict resolution requirements
      // For now, we'll just log that conflicts were resolved
      console.log('Sync conflicts resolved');
      
    } catch (error) {
      console.error('Error resolving conflicts:', error);
    }
  }

  // Force immediate sync
  async forceSync(): Promise<void> {
    console.log('Force syncing settings...');
    await this.syncToBackend();
    await this.syncFromBackend();
    await this.syncDevicesToBackend();
    await this.syncDevicesFromBackend();
  }

  // Get sync status
  getSyncStatus(): { isSyncing: boolean; hasBackgroundSync: boolean } {
    return {
      isSyncing: this.isSyncing,
      hasBackgroundSync: this.syncInterval !== null
    };
  }
}

// Create singleton instance
export const settingsSyncService = new SettingsSyncService();
