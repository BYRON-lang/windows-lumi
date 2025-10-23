// Local Settings Service - Uses localStorage for settings management
// This is a simplified version that works in the renderer process

export interface Setting {
  id: number;
  user_id: string;
  category: string;
  key: string;
  value: string;
  data_type: 'string' | 'boolean' | 'number' | 'object' | 'array';
  created_at: string;
  updated_at: string;
}

export interface SyncItem {
  id: number;
  user_id: string;
  operation: 'create' | 'update' | 'delete';
  category: string;
  key: string;
  value: string | null;
  data_type: 'string' | 'boolean' | 'number' | 'object' | 'array';
  created_at: string;
  synced_at: string | null;
  retry_count: number;
}

export interface Device {
  id: string;
  user_id: string;
  name: string;
  type: 'desktop';
  os: string;
  browser?: string;
  last_active: string;
  location?: string;
  ip_address?: string;
  is_current: boolean;
}

class LocalSettingsService {
  private isInitialized = false;
  private settingsKey = 'lumi_settings';
  private syncQueueKey = 'lumi_sync_queue';
  private devicesKey = 'lumi_devices';

  // Initialize the service
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize localStorage keys if they don't exist
      if (!localStorage.getItem(this.settingsKey)) {
        localStorage.setItem(this.settingsKey, JSON.stringify({}));
      }
      if (!localStorage.getItem(this.syncQueueKey)) {
        localStorage.setItem(this.syncQueueKey, JSON.stringify([]));
      }
      if (!localStorage.getItem(this.devicesKey)) {
        localStorage.setItem(this.devicesKey, JSON.stringify([]));
      }

      this.isInitialized = true;
      console.log('LocalSettingsService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize LocalSettingsService:', error);
      throw error;
    }
  }

  // Ensure database is initialized
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  // Get setting value
  async getSetting(userId: string, category: string, key: string): Promise<any> {
    await this.ensureInitialized();
    
    try {
      const settings = JSON.parse(localStorage.getItem(this.settingsKey) || '{}');
      const settingKey = `${userId}_${category}_${key}`;
      const setting = settings[settingKey];

      if (!setting) return null;

      // Parse value based on data type
      switch (setting.data_type) {
        case 'boolean':
          return setting.value === 'true';
        case 'number':
          return parseFloat(setting.value);
        case 'object':
        case 'array':
          return JSON.parse(setting.value);
        default:
          return setting.value;
      }
    } catch (error) {
      console.error('Error getting setting:', error);
      return null;
    }
  }

  // Set setting value
  async setSetting(userId: string, category: string, key: string, value: any): Promise<void> {
    await this.ensureInitialized();

    try {
      // Determine data type
      let dataType: 'string' | 'boolean' | 'number' | 'object' | 'array';
      let stringValue: string;

      if (typeof value === 'boolean') {
        dataType = 'boolean';
        stringValue = value.toString();
      } else if (typeof value === 'number') {
        dataType = 'number';
        stringValue = value.toString();
      } else if (Array.isArray(value)) {
        dataType = 'array';
        stringValue = JSON.stringify(value);
      } else if (typeof value === 'object' && value !== null) {
        dataType = 'object';
        stringValue = JSON.stringify(value);
      } else {
        dataType = 'string';
        stringValue = String(value);
      }

      const settings = JSON.parse(localStorage.getItem(this.settingsKey) || '{}');
      const settingKey = `${userId}_${category}_${key}`;
      
      const setting: Setting = {
        id: Date.now(),
        user_id: userId,
        category,
        key,
        value: stringValue,
        data_type: dataType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      settings[settingKey] = setting;
      localStorage.setItem(this.settingsKey, JSON.stringify(settings));

      // Add to sync queue
      await this.addToSyncQueue('update', userId, category, key, stringValue, dataType);
    } catch (error) {
      console.error('Error setting setting:', error);
      throw error;
    }
  }

  // Delete setting
  async deleteSetting(userId: string, category: string, key: string): Promise<void> {
    await this.ensureInitialized();

    try {
      const settings = JSON.parse(localStorage.getItem(this.settingsKey) || '{}');
      const settingKey = `${userId}_${category}_${key}`;
      delete settings[settingKey];
      localStorage.setItem(this.settingsKey, JSON.stringify(settings));

      await this.addToSyncQueue('delete', userId, category, key, null, 'string');
    } catch (error) {
      console.error('Error deleting setting:', error);
      throw error;
    }
  }

  // Get all settings by category
  async getSettingsByCategory(userId: string, category: string): Promise<Record<string, any>> {
    await this.ensureInitialized();

    try {
      const settings = JSON.parse(localStorage.getItem(this.settingsKey) || '{}');
      const categorySettings: Record<string, any> = {};

      for (const [key, setting] of Object.entries(settings)) {
        const settingObj = setting as Setting;
        if (settingObj.user_id === userId && settingObj.category === category) {
          let value: any;
          switch (settingObj.data_type) {
            case 'boolean':
              value = settingObj.value === 'true';
              break;
            case 'number':
              value = parseFloat(settingObj.value);
              break;
            case 'object':
            case 'array':
              value = JSON.parse(settingObj.value);
              break;
            default:
              value = settingObj.value;
          }
          categorySettings[settingObj.key] = value;
        }
      }

      return categorySettings;
    } catch (error) {
      console.error('Error getting settings by category:', error);
      return {};
    }
  }

  // Get all settings for user
  async getAllSettings(userId: string): Promise<Record<string, Record<string, any>>> {
    await this.ensureInitialized();

    try {
      const settings = JSON.parse(localStorage.getItem(this.settingsKey) || '{}');
      const userSettings: Record<string, Record<string, any>> = {};

      for (const [key, setting] of Object.entries(settings)) {
        const settingObj = setting as Setting;
        if (settingObj.user_id === userId) {
          if (!userSettings[settingObj.category]) {
            userSettings[settingObj.category] = {};
          }

          let value: any;
          switch (settingObj.data_type) {
            case 'boolean':
              value = settingObj.value === 'true';
              break;
            case 'number':
              value = parseFloat(settingObj.value);
              break;
            case 'object':
            case 'array':
              value = JSON.parse(settingObj.value);
              break;
            default:
              value = settingObj.value;
          }
          userSettings[settingObj.category][settingObj.key] = value;
        }
      }

      return userSettings;
    } catch (error) {
      console.error('Error getting all settings:', error);
      return {};
    }
  }

  // Sync queue operations
  async addToSyncQueue(
    operation: 'create' | 'update' | 'delete',
    userId: string,
    category: string,
    key: string,
    value: string | null,
    dataType: 'string' | 'boolean' | 'number' | 'object' | 'array'
  ): Promise<void> {
    await this.ensureInitialized();

    try {
      const syncQueue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
      const syncItem: SyncItem = {
        id: Date.now(),
        user_id: userId,
        operation,
        category,
        key,
        value,
        data_type: dataType,
        created_at: new Date().toISOString(),
        synced_at: null,
        retry_count: 0
      };

      syncQueue.push(syncItem);
      localStorage.setItem(this.syncQueueKey, JSON.stringify(syncQueue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  async getPendingSyncItems(): Promise<SyncItem[]> {
    await this.ensureInitialized();

    try {
      const syncQueue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
      return syncQueue.filter((item: SyncItem) => !item.synced_at);
    } catch (error) {
      console.error('Error getting pending sync items:', error);
      return [];
    }
  }

  async markAsSynced(syncId: number): Promise<void> {
    await this.ensureInitialized();

    try {
      const syncQueue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
      const item = syncQueue.find((item: SyncItem) => item.id === syncId);
      if (item) {
        item.synced_at = new Date().toISOString();
        localStorage.setItem(this.syncQueueKey, JSON.stringify(syncQueue));
      }
    } catch (error) {
      console.error('Error marking as synced:', error);
    }
  }

  async incrementRetryCount(syncId: number): Promise<void> {
    await this.ensureInitialized();

    try {
      const syncQueue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
      const item = syncQueue.find((item: SyncItem) => item.id === syncId);
      if (item) {
        item.retry_count += 1;
        localStorage.setItem(this.syncQueueKey, JSON.stringify(syncQueue));
      }
    } catch (error) {
      console.error('Error incrementing retry count:', error);
    }
  }

  // Device management
  async registerDevice(userId: string, deviceInfo: Partial<Device>): Promise<void> {
    await this.ensureInitialized();

    try {
      const deviceId = deviceInfo.id || this.generateDeviceId();
      const device: Device = {
        id: deviceId,
        user_id: userId,
        name: deviceInfo.name || this.getDeviceName(),
        type: 'desktop', // Always desktop for Windows app
        os: deviceInfo.os || this.getOSInfo(),
        browser: deviceInfo.browser || this.getBrowserInfo(),
        last_active: new Date().toISOString(),
        location: deviceInfo.location,
        ip_address: deviceInfo.ip_address,
        is_current: true
      };

      const devices = JSON.parse(localStorage.getItem(this.devicesKey) || '[]');
      
      // Mark all other devices as not current
      const updatedDevices = devices.map((d: Device) => ({
        ...d,
        is_current: d.user_id === userId ? false : d.is_current
      }));

      // Add or update current device
      const existingIndex = updatedDevices.findIndex((d: Device) => d.id === deviceId);
      if (existingIndex >= 0) {
        updatedDevices[existingIndex] = device;
      } else {
        updatedDevices.push(device);
      }

      localStorage.setItem(this.devicesKey, JSON.stringify(updatedDevices));
    } catch (error) {
      console.error('Error registering device:', error);
      throw error;
    }
  }

  async getDevices(userId: string): Promise<Device[]> {
    await this.ensureInitialized();

    try {
      const devices = JSON.parse(localStorage.getItem(this.devicesKey) || '[]');
      return devices.filter((device: Device) => device.user_id === userId)
        .sort((a: Device, b: Device) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime());
    } catch (error) {
      console.error('Error getting devices:', error);
      return [];
    }
  }

  async updateDeviceLastActive(deviceId: string): Promise<void> {
    await this.ensureInitialized();

    try {
      const devices = JSON.parse(localStorage.getItem(this.devicesKey) || '[]');
      const device = devices.find((d: Device) => d.id === deviceId);
      if (device) {
        device.last_active = new Date().toISOString();
        localStorage.setItem(this.devicesKey, JSON.stringify(devices));
      }
    } catch (error) {
      console.error('Error updating device last active:', error);
    }
  }

  async logoutAllDevices(userId: string): Promise<void> {
    await this.ensureInitialized();

    try {
      const devices = JSON.parse(localStorage.getItem(this.devicesKey) || '[]');
      const filteredDevices = devices.filter((device: Device) => 
        !(device.user_id === userId && !device.is_current)
      );
      localStorage.setItem(this.devicesKey, JSON.stringify(filteredDevices));
    } catch (error) {
      console.error('Error logging out all devices:', error);
    }
  }

  // Helper methods for device detection
  private generateDeviceId(): string {
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows PC';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux PC';
    return 'Unknown Device';
  }

  private getOSInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows NT 10.0')) return 'Windows 10';
    if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
    if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
    if (userAgent.includes('Mac OS X')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown OS';
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Electron';
  }

  // Close database connection
  async close(): Promise<void> {
    this.isInitialized = false;
  }
}

// Create singleton instance
export const localSettingsService = new LocalSettingsService();