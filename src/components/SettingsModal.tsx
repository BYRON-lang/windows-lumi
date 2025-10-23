import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useProfile } from '../hooks/useProfile';
import { useSettings, useDevices } from '../hooks/useSettings';
import { SettingsProvider, useSettingsContext } from '../context/SettingsContext';

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3a3a3a;
    border-radius: 3px;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #4a4a4a;
    border-color: #525252;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:active {
    background: #555555;
  }
  
  .custom-scrollbar::-webkit-scrollbar-corner {
    background: transparent;
  }
  
  /* Enhanced styling for different containers */
  .custom-scrollbar.sidebar-scroll::-webkit-scrollbar-thumb {
    background: #333333;
  }
  
  .custom-scrollbar.sidebar-scroll::-webkit-scrollbar-thumb:hover {
    background: #404040;
  }
  
  .custom-scrollbar.dropdown-scroll::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scrollbar.dropdown-scroll::-webkit-scrollbar-thumb {
    background: #2a2a2a;
    border-radius: 2px;
  }
  
  .custom-scrollbar.dropdown-scroll::-webkit-scrollbar-thumb:hover {
    background: #363636;
  }
  
  /* Firefox scrollbar styling */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #3a3a3a transparent;
  }
  
  .custom-scrollbar.sidebar-scroll {
    scrollbar-color: #333333 transparent;
  }
  
  .custom-scrollbar.dropdown-scroll {
    scrollbar-color: #2a2a2a transparent;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('custom-scrollbar-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'custom-scrollbar-styles';
  styleSheet.textContent = scrollbarStyles;
  document.head.appendChild(styleSheet);
}

interface User {
  id: string;
  email: string;
  full_name: string;
  profile_picture?: string;
  email_verified: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Placeholder components for each settings section
const ProfileSettings = ({ user, onUpdate, updateProfile }: { user?: User; onUpdate: (user: any) => void; updateProfile: (updates: Partial<User>) => Promise<void> }) => {
  const { devices, isLoading: devicesLoading, logoutAllDevices } = useDevices();
  
  return (
    <div>
      <h2 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Account</h2>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* User Avatar and Field */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        {user?.profile_picture ? (
          <img 
            src={user.profile_picture} 
            alt="Profile"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#191919',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#808080',
            fontWeight: '500',
            fontSize: '24px'
          }}>
            {user?.full_name 
              ? user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
              : user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <div style={{ marginLeft: '16px' }}>
          <label style={{ display: 'block', color: '#808080', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Preferred name</label>
          <input 
            style={{
              width: '200px',
              padding: '4px',
              backgroundColor: '#262626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              outline: 'none'
            }}
            placeholder="Enter preferred name"
            defaultValue={user?.full_name || ''}
            onChange={(e) => {
              if (user) {
                updateProfile({ full_name: e.target.value });
              }
            }}
          />
        </div>
      </div>
      
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '40px' }}>Account Security</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Email</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>{user?.email || 'No email'}</p>
        </div>
        <button style={{
          border: '1px solid #808080',
          color: '#808080',
          backgroundColor: 'transparent',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background-color 150ms ease'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }}>
          Change email
        </button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Password</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Set a permanent password</p>
        </div>
        <button style={{
          border: '1px solid #808080',
          color: '#808080',
          backgroundColor: 'transparent',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background-color 150ms ease'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }}>
          {user ? 'Change password' : 'Add password'}
        </button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Add passkeys</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Enhance security with passkeys for passwordless sign-in.</p>
        </div>
        <button style={{
          border: '1px solid #808080',
          color: '#808080',
          backgroundColor: 'transparent',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background-color 150ms ease'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }}>
          Add passkey
        </button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Add recovery email</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Add a recovery email for account recovery and security alerts.</p>
        </div>
        <button style={{
          border: '1px solid #808080',
          color: '#808080',
          backgroundColor: 'transparent',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background-color 150ms ease'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }}>
          Add email
        </button>
      </div>
      
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Support</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          cursor: 'pointer',
          transition: 'background-color 150ms ease',
          padding: '8px',
          borderRadius: '4px'
        }}
        onClick={() => alert('Delete account functionality would be implemented here')}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = '#2a2a2a';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
        }}
      >
        <div>
          <h4 style={{ color: '#ef4444', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Delete my Account</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Permanently delete the account and remove access from all workspaces</p>
        </div>
        <div style={{ color: '#808080', fontSize: '18px' }}>→</div>
      </div>
      
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '24px' }}>Devices</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Logout of all devices</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Log out of all other active sessions on other devices besides this one.</p>
        </div>
        <button 
          style={{
          border: '1px solid #808080',
          color: '#808080',
          backgroundColor: 'transparent',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background-color 150ms ease'
        }}
          onClick={logoutAllDevices}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          Logout of all devices
        </button>
      </div>
      
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Device List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
          <div style={{ color: '#808080' }}>Device name</div>
          <div style={{ color: '#808080' }}>Last active</div>
          <div style={{ color: '#808080' }}>Location</div>
        </div>
        
        <div style={{ borderTop: '1px solid #303030' }} />
        
        {devicesLoading ? (
          <div style={{ color: '#808080', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            Loading devices...
        </div>
        ) : devices.length === 0 ? (
          <div style={{ color: '#808080', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            No devices found
        </div>
        ) : (
          devices.map((device: any) => (
            <div key={device.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
              <div style={{ color: device.is_current ? '#ffffff' : '#808080', fontWeight: device.is_current ? '600' : '400' }}>
                {device.name} {device.is_current && '(Current)'}
              </div>
              <div style={{ color: '#808080' }}>
                {new Date(device.last_active).toLocaleDateString()} {new Date(device.last_active).toLocaleTimeString()}
              </div>
              <div style={{ color: '#808080' }}>
                {device.location || 'Unknown'}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div style={{ borderTop: '1px solid #303030', marginTop: '16px' }} />
      
      <p style={{ color: '#808080', fontSize: '14px', marginTop: '8px', margin: 0 }}>All devices are shown</p>
    </div>
  );
};

const PreferencesSettings = ({ user, onUpdate }: { user?: User; onUpdate: (user: any) => void }) => {
  const { getSetting, updateSetting, isLoading } = useSettings('preferences');
  
  // State for dropdown management
  const [dropdownType, setDropdownType] = useState<'theme' | 'language' | 'timezone' | 'cookies' | 'data-retention' | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  // Get current settings with defaults
  const selectedTheme = getSetting('theme', 'Dark mode');
  const selectedLanguage = getSetting('language', 'English (UK)');
  const isTimezoneAuto = getSetting('timezone_auto', true);
  const selectedTimezone = getSetting('timezone', 'London, United Kingdom');
  const startWithWindows = getSetting('start_with_windows', false);
  const minimizeToTray = getSetting('minimize_to_tray', true);
  const showNotifications = getSetting('show_notifications', true);
  const autoUpdate = getSetting('auto_update', true);
  const cookieSettings = getSetting('cookie_settings', 'strictly-necessary');
  const strictlyNecessary = getSetting('strictly_necessary', true);
  const functional = getSetting('functional', false);
  const analytics = getSetting('analytics', false);
  const collectUsageData = getSetting('collect_usage_data', false);
  const shareCrashReports = getSetting('share_crash_reports', true);
  const encryptLocalData = getSetting('encrypt_local_data', true);
  const autoDeleteHistory = getSetting('auto_delete_history', false);
  const dataRetention = getSetting('data_retention', '30-days');

  const themes = ['Use system setting', 'Dark mode', 'Light mode'];
  const languages = [
    { main: 'English (UK)', subtitle: 'English (UK)' },
    { main: 'Dansk', subtitle: 'Danish' },
    { main: 'Suomi', subtitle: 'Finnish' },
    { main: 'Deutsch', subtitle: 'German' },
    { main: 'Français', subtitle: 'French' },
    { main: 'Español', subtitle: 'Spanish' },
    { main: 'Italiano', subtitle: 'Italian' },
    { main: 'Nederlands', subtitle: 'Dutch' }
  ];
  const timezones = [
    { location: 'Midway Island', offset: 'GMT-11' },
    { location: 'Honolulu, Hawaii', offset: 'GMT-10' },
    { location: 'Anchorage, Alaska', offset: 'GMT-9' },
    { location: 'Los Angeles, California', offset: 'GMT-8' },
    { location: 'Denver, Colorado', offset: 'GMT-7' },
    { location: 'Chicago, Illinois', offset: 'GMT-6' },
    { location: 'New York, New York', offset: 'GMT-5' },
    { location: 'Caracas, Venezuela', offset: 'GMT-4' },
    { location: 'Buenos Aires, Argentina', offset: 'GMT-3' },
    { location: 'South Georgia Island', offset: 'GMT-2' },
    { location: 'Azores, Portugal', offset: 'GMT-1' },
    { location: 'London, United Kingdom', offset: 'GMT+0' },
    { location: 'Paris, France', offset: 'GMT+1' },
    { location: 'Athens, Greece', offset: 'GMT+2' },
    { location: 'Moscow, Russia', offset: 'GMT+3' },
    { location: 'Dubai, UAE', offset: 'GMT+4' },
    { location: 'Karachi, Pakistan', offset: 'GMT+5' },
    { location: 'Dhaka, Bangladesh', offset: 'GMT+6' },
    { location: 'Bangkok, Thailand', offset: 'GMT+7' },
    { location: 'Shanghai, China', offset: 'GMT+8' },
    { location: 'Tokyo, Japan', offset: 'GMT+9' },
    { location: 'Sydney, Australia', offset: 'GMT+10' },
    { location: 'Norfolk Island', offset: 'GMT+11' },
    { location: 'Auckland, New Zealand', offset: 'GMT+12' }
  ];
  
  const cookieOptions = [
    { 
      value: 'strictly-necessary', 
      label: 'Strictly Necessary',
      subtitle: 'Essential cookies required for basic functionality.',
      enabled: strictlyNecessary,
      onToggle: () => {
        addPendingChange('strictly_necessary', !strictlyNecessary);
        updateSetting('strictly_necessary', !strictlyNecessary);
      }
    },
    { 
      value: 'functional', 
      label: 'Functional',
      subtitle: 'Cookies that enhance user experience and functionality.',
      enabled: functional,
      onToggle: () => {
        addPendingChange('functional', !functional);
        updateSetting('functional', !functional);
      }
    },
    { 
      value: 'analytics', 
      label: 'Analytics',
      subtitle: 'Cookies used to analyze website usage and performance.',
      enabled: analytics,
      onToggle: () => {
        addPendingChange('analytics', !analytics);
        updateSetting('analytics', !analytics);
      }
    }
  ];
  
  const dataRetentionOptions = [
    { value: '1-day', label: '1 Day' },
    { value: '7-days', label: '7 Days' },
    { value: '30-days', label: '30 Days' },
    { value: '90-days', label: '90 Days' },
    { value: 'forever', label: 'Forever' }
  ];

  const handleThemeChange = (theme: string) => {
    updateSetting('theme', theme);
    setDropdownType(null);
  };

  const handleLanguageChange = (language: any) => {
    updateSetting('language', language.main);
    setDropdownType(null);
  };

  const handleTimezoneChange = (timezone: any) => {
    updateSetting('timezone', timezone.location);
    setDropdownType(null);
  };

  const handleDataRetentionChange = (retention: any) => {
    updateSetting('data_retention', retention.value);
    setDropdownType(null);
  };

  const openDropdown = (type: 'theme' | 'language' | 'timezone' | 'cookies' | 'data-retention', triggerElement?: HTMLElement) => {
    const element = triggerElement || triggerRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Different heights for different dropdown types
      let dropdownHeight = 200; // Default for theme
      if (type === 'language') dropdownHeight = 300;
      if (type === 'timezone') dropdownHeight = 450;
      if (type === 'cookies') dropdownHeight = 300;
      if (type === 'data-retention') dropdownHeight = 200;
      
      // Check if dropdown would go off-screen and adjust position
      let top = rect.bottom + window.scrollY + 5;
      if (top + dropdownHeight > viewportHeight + window.scrollY) {
        top = rect.top + window.scrollY - dropdownHeight - 5;
      }
      
      // Special positioning for cookies dropdown - align with content
      if (type === 'cookies') {
        top = rect.top + window.scrollY - 10; // Position slightly above the trigger
      }
      
      // Special positioning for data retention dropdown - align with content
      if (type === 'data-retention') {
        top = rect.top + window.scrollY - 10; // Position slightly above the trigger
      }
      
      setDropdownPosition({ top, left: rect.left + window.scrollX });
    }
    setDropdownType(type);
    setSearchTerm('');
  };

  const closeDropdown = () => {
    setDropdownType(null);
    setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Also check if the click is not on any trigger element
        const target = event.target as HTMLElement;
        const isTriggerClick = target.closest('[data-dropdown-trigger]');
        if (!isTriggerClick) {
          closeDropdown();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (dropdownType) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [dropdownType]);

  const getFilteredOptions = () => {
    switch (dropdownType) {
      case 'theme':
        return themes.filter(theme => theme.toLowerCase().includes(searchTerm.toLowerCase()));
      case 'language':
        return languages.filter(language => language.main.toLowerCase().includes(searchTerm.toLowerCase()) || language.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
      case 'timezone':
        return timezones.filter(timezone => timezone.location.toLowerCase().includes(searchTerm.toLowerCase()) || timezone.offset.toLowerCase().includes(searchTerm.toLowerCase()));
      case 'cookies':
        return cookieOptions.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
      case 'data-retention':
        return dataRetentionOptions.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
      default:
        return [];
    }
  };

  const DropdownModal = () => {
    if (!dropdownType) return null;

    const options = getFilteredOptions();

    return createPortal(
      <div
        ref={dropdownRef}
        style={{
          position: 'fixed',
          backgroundColor: '#262626',
          border: '1px solid #333',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          overflow: 'hidden',
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownType === 'timezone' ? '340px' : dropdownType === 'language' ? '200px' : dropdownType === 'cookies' ? '350px' : dropdownType === 'data-retention' ? '200px' : '250px',
          maxHeight: dropdownType === 'timezone' ? '450px' : dropdownType === 'language' ? '300px' : dropdownType === 'cookies' ? '300px' : dropdownType === 'data-retention' ? '200px' : '200px',
        }}
      >
        {/* Search input for timezone dropdown */}
        {dropdownType === 'timezone' && (
          <div style={{ padding: '8px', borderBottom: '1px solid #333' }}>
            <input
              type="text"
              placeholder="Search timezone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#333',
                color: '#ffffff',
                border: '1px solid #444',
                borderRadius: '4px',
                fontSize: '14px',
                outline: 'none'
              }}
              autoFocus
            />
          </div>
        )}
        
        {/* Options list */}
        <div className="custom-scrollbar dropdown-scroll" style={{
          overflowY: 'auto',
          maxHeight: dropdownType === 'timezone' ? '410px' : 
                    dropdownType === 'language' ? '260px' : 
                    dropdownType === 'cookies' ? '260px' :
                    dropdownType === 'data-retention' ? '160px' :
                    '160px'
        }}>
          {options.length === 0 ? (
            <div style={{ padding: '12px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
              No options found
            </div>
          ) : (
            options.map((option) => (
              <div
                key={dropdownType === 'language' ? (option as any).main : dropdownType === 'timezone' ? (option as any).location : dropdownType === 'cookies' ? (option as any).value : dropdownType === 'data-retention' ? (option as any).value : option}
                style={{
                  padding: '12px',
                  fontSize: '14px',
                  color: '#e0e0e0',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                }}
                onClick={() => {
                  if (dropdownType === 'theme') handleThemeChange(option as string);
                  else if (dropdownType === 'language') handleLanguageChange(option);
                  else if (dropdownType === 'timezone') handleTimezoneChange(option);
                  else if (dropdownType === 'data-retention') handleDataRetentionChange(option);
                  // Cookie options don't close dropdown on click - handled by individual toggles
                }}
              >
                {dropdownType === 'language' ? (
                  <div>
                    <div style={{ fontWeight: '500', color: '#ffffff' }}>{(option as { main: string; subtitle: string }).main}</div>
                    <div style={{ fontSize: '12px', color: '#808080' }}>{(option as { main: string; subtitle: string }).subtitle}</div>
                  </div>
                ) : dropdownType === 'timezone' ? (
                  <div>
                    <div style={{ fontWeight: '500', color: '#ffffff' }}>{(option as { location: string; offset: string }).location}</div>
                    <div style={{ fontSize: '12px', color: '#808080' }}>{(option as { location: string; offset: string }).offset}</div>
                  </div>
                ) : dropdownType === 'cookies' ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', color: '#ffffff' }}>{(option as any).label}</div>
                      <div style={{ fontSize: '12px', color: '#808080' }}>{(option as any).subtitle}</div>
                    </div>
                    <button 
                      style={{
                        position: 'relative',
                        display: 'inline-flex',
                        height: '20px',
                        width: '36px',
                        alignItems: 'center',
                        borderRadius: '9999px',
                        transition: 'background-color 150ms ease',
                        marginLeft: '12px',
                        backgroundColor: (option as any).enabled ? '#2563eb' : '#6b7280',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        (option as any).onToggle();
                      }}
                    >
                      <span style={{
                        display: 'inline-block',
                        height: '12px',
                        width: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        transform: (option as any).enabled ? 'translateX(20px)' : 'translateX(4px)',
                        transition: 'transform 150ms ease'
                      }} />
                    </button>
                  </div>
                ) : dropdownType === 'data-retention' ? (
                  <div style={{ color: '#ffffff' }}>{(option as { value: string; label: string }).label}</div>
                ) : (
                  <div style={{ color: '#ffffff' }}>{option as string}</div>
                )}
              </div>
            ))
          )}
          
          {/* Add bottom padding for timezone dropdown */}
          {dropdownType === 'timezone' && (
            <div style={{ height: '12px' }}></div>
          )}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <h2 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Preference</h2>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Appearance</h3>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Customise how Lumi Looks on your device</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            ref={triggerRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('theme', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>{selectedTheme}</span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Language and Time</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Language</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Change the language used in the user interface.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('language', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>{selectedLanguage === 'English(us)' ? 'English(US)' : selectedLanguage}</span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Set timezone automatically using your location</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Reminders, notifications are delivered based on your time zone.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: isTimezoneAuto ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => updateSetting('timezone_auto', !isTimezoneAuto)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: isTimezoneAuto ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Timezone</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Current timezone setting.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('timezone', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>{selectedTimezone}</span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Windows App Section */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Windows App</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Start with Windows */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Start with Windows</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Automatically launch Lumi when Windows starts.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: startWithWindows ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => updateSetting('start_with_windows', !startWithWindows)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: startWithWindows ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Minimize to System Tray */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Minimize to System Tray</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Keep Lumi running in the background when minimized.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: minimizeToTray ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => updateSetting('minimize_to_tray', !minimizeToTray)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: minimizeToTray ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Show Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Show Notifications</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Display system notifications for reminders and updates.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: showNotifications ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => {
            addPendingChange('show_notifications', !showNotifications);
            updateSetting('show_notifications', !showNotifications);
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: showNotifications ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Auto Update */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Auto Update</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Automatically download and install updates.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: autoUpdate ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => {
            addPendingChange('auto_update', !autoUpdate);
            updateSetting('auto_update', !autoUpdate);
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: autoUpdate ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Privacy Section */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Privacy</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Cookie Settings */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Cookie Settings</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Customize cookies. See cookies notice for more details.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('cookies', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>
              {cookieOptions.find(opt => opt.value === cookieSettings)?.label || 'Strictly Necessary'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Data Privacy Settings */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Data Privacy</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Collect Usage Data */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Collect Usage Data</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Help improve Lumi by sharing anonymous usage statistics.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: collectUsageData ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => {
            addPendingChange('collect_usage_data', !collectUsageData);
            updateSetting('collect_usage_data', !collectUsageData);
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: collectUsageData ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Share Crash Reports */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Share Crash Reports</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Automatically send crash reports to help fix issues.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: shareCrashReports ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => {
            addPendingChange('share_crash_reports', !shareCrashReports);
            updateSetting('share_crash_reports', !shareCrashReports);
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: shareCrashReports ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Encrypt Local Data */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Encrypt Local Data</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Encrypt all data stored locally on your device.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: encryptLocalData ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => {
            addPendingChange('encrypt_local_data', !encryptLocalData);
            updateSetting('encrypt_local_data', !encryptLocalData);
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: encryptLocalData ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Auto Delete History */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Auto Delete History</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Automatically delete old conversation history.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: autoDeleteHistory ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => {
            addPendingChange('auto_delete_history', !autoDeleteHistory);
            updateSetting('auto_delete_history', !autoDeleteHistory);
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: autoDeleteHistory ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Data Retention Period */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Data Retention Period</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>How long to keep your data before automatic deletion.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('data-retention', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>
              {dataRetentionOptions.find(opt => opt.value === dataRetention)?.label || '30 Days'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <DropdownModal />
    </div>
  );
};

const NotificationSettings = ({ user, onUpdate }: { user?: User; onUpdate: (user: any) => void }) => {
  const { getSetting, updateSetting, isLoading } = useSettings('notifications');
  const { addPendingChange } = useSettingsContext();
  
  // Get current settings with defaults
  const pushNotifications = getSetting('push_notifications', true);
  const soundNotifications = getSetting('sound_notifications', true);
  const desktopNotifications = getSetting('desktop_notifications', true);
  const notificationFrequency = getSetting('notification_frequency', 'immediate');
  const quietHours = getSetting('quiet_hours', false);
  const quietStartTime = getSetting('quiet_start_time', '22:00');
  const quietEndTime = getSetting('quiet_end_time', '08:00');
  const showPreview = getSetting('show_preview', true);
  const notificationPosition = getSetting('notification_position', 'top-right');
  
  // Dropdown state
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownType, setDropdownType] = useState<'frequency' | 'position' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'batched', label: 'Batched (Every 5 minutes)' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily Summary' }
  ];

  const positionOptions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' }
  ];

  const handleFrequencyChange = (frequency: any) => {
    addPendingChange('notification_frequency', frequency.value);
    updateSetting('notification_frequency', frequency.value);
    setDropdownType(null);
  };

  const handlePositionChange = (position: any) => {
    addPendingChange('notification_position', position.value);
    updateSetting('notification_position', position.value);
    setDropdownType(null);
  };

  const openDropdown = (type: 'frequency' | 'position', triggerElement?: HTMLElement) => {
    const element = triggerElement || triggerRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 200;
      
      let top = rect.bottom + window.scrollY + 5;
      if (top + dropdownHeight > viewportHeight + window.scrollY) {
        top = rect.top + window.scrollY - dropdownHeight - 5;
      }
      
      setDropdownPosition({ top, left: rect.left + window.scrollX });
    }
    setDropdownType(type);
  };

  const closeDropdown = () => {
    setDropdownType(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        const isTriggerClick = target.closest('[data-dropdown-trigger]');
        if (!isTriggerClick) {
          closeDropdown();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (dropdownType) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [dropdownType]);

  const getFilteredOptions = () => {
    switch (dropdownType) {
      case 'frequency':
        return frequencyOptions;
      case 'position':
        return positionOptions;
      default:
        return [];
    }
  };

  const DropdownModal = () => {
    if (!dropdownType) return null;

    const options = getFilteredOptions();

    return createPortal(
      <div
        ref={dropdownRef}
        style={{
          position: 'fixed',
          backgroundColor: '#262626',
          border: '1px solid #333',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          overflow: 'hidden',
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: '200px',
          maxHeight: '200px',
        }}
      >
        <div className="custom-scrollbar dropdown-scroll" style={{ maxHeight: '160px', overflowY: 'auto' }}>
          {options.map((option) => (
            <div
              key={option.value}
              style={{
                padding: '12px',
                fontSize: '14px',
                color: '#e0e0e0',
                cursor: 'pointer',
                transition: 'background-color 150ms ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                if (dropdownType === 'frequency') handleFrequencyChange(option);
                else if (dropdownType === 'position') handlePositionChange(option);
              }}
            >
              <div style={{ color: '#ffffff' }}>{option.label}</div>
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <h2 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Notifications</h2>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Push Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Push Notifications</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Receive push notifications for new messages and updates.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: pushNotifications ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => {
            addPendingChange('push_notifications', !pushNotifications);
            updateSetting('push_notifications', !pushNotifications);
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: pushNotifications ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Sound Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Sound Notifications</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Play sound when receiving notifications.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: soundNotifications ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => {
            addPendingChange('sound_notifications', !soundNotifications);
            updateSetting('sound_notifications', !soundNotifications);
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: soundNotifications ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Desktop Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Desktop Notifications</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Show system desktop notifications.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: desktopNotifications ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => {
            addPendingChange('desktop_notifications', !desktopNotifications);
            updateSetting('desktop_notifications', !desktopNotifications);
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: desktopNotifications ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Show Preview */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Show Preview</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Show message preview in notifications.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: showPreview ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => {
            addPendingChange('show_preview', !showPreview);
            updateSetting('show_preview', !showPreview);
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: showPreview ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Notification Frequency */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Notification Frequency</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>How often to receive notifications.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('frequency', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>
              {frequencyOptions.find(opt => opt.value === notificationFrequency)?.label || 'Immediate'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Notification Position */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Notification Position</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Where to display notifications on screen.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('position', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>
              {positionOptions.find(opt => opt.value === notificationPosition)?.label || 'Top Right'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Quiet Hours */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Quiet Hours</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Enable Quiet Hours</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Disable notifications during specified hours.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: quietHours ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => {
            addPendingChange('quiet_hours', !quietHours);
            updateSetting('quiet_hours', !quietHours);
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: quietHours ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Quiet Hours Time Settings */}
      {quietHours && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Start Time</h4>
              <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>When quiet hours begin.</p>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="time"
                value={quietStartTime}
                onChange={(e) => {
                  addPendingChange('quiet_start_time', e.target.value);
                  updateSetting('quiet_start_time', e.target.value);
                }}
                style={{
                  backgroundColor: '#333',
                  color: '#ffffff',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  padding: '4px 12px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>End Time</h4>
              <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>When quiet hours end.</p>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="time"
                value={quietEndTime}
                onChange={(e) => {
                  addPendingChange('quiet_end_time', e.target.value);
                  updateSetting('quiet_end_time', e.target.value);
                }}
                style={{
                  backgroundColor: '#333',
                  color: '#ffffff',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  padding: '4px 12px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </>
      )}
      
      <DropdownModal />
    </div>
  );
};

const AIModelsSettings = ({ user, onUpdate }: { user?: User; onUpdate: (user: any) => void }) => {
  // AI & Models settings state
  const [activeModel, setActiveModel] = useState('lumi-default');
  const [responseStyle, setResponseStyle] = useState('balanced');
  const [personalityTone, setPersonalityTone] = useState('friendly');
  const [rememberUserInfo, setRememberUserInfo] = useState(true);
  const [experimentalModels, setExperimentalModels] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  
  // Dropdown state
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownType, setDropdownType] = useState<'model' | 'personality' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const modelOptions = [
    { 
      value: 'lumi-default', 
      label: 'Lumi Default',
      tagline: 'Balanced and friendly for daily use'
    },
    { 
      value: 'lumi-pro', 
      label: 'Lumi Pro',
      tagline: 'Smarter and more detailed responses'
    },
    { 
      value: 'lumi-coder', 
      label: 'Lumi Coder',
      tagline: 'Specialized for coding help'
    },
    { 
      value: 'lumi-therapist', 
      label: 'Lumi Therapist',
      tagline: 'Calming and empathy-based responses'
    }
  ];

  const personalityOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'calm', label: 'Calm' },
    { value: 'motivational', label: 'Motivational' },
    { value: 'neutral', label: 'Neutral' }
  ];

  const responseStyleOptions = [
    { value: 'concise', label: 'Concise' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'detailed', label: 'Detailed' }
  ];

  const handleModelChange = (model: any) => {
    setActiveModel(model.value);
    setDropdownType(null);
  };

  const handlePersonalityChange = (personality: any) => {
    setPersonalityTone(personality.value);
    setDropdownType(null);
  };

  const openDropdown = (type: 'model' | 'personality', triggerElement?: HTMLElement) => {
    const element = triggerElement || triggerRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = type === 'model' ? 300 : 200;
      
      let top = rect.bottom + window.scrollY + 5;
      if (top + dropdownHeight > viewportHeight + window.scrollY) {
        top = rect.top + window.scrollY - dropdownHeight - 5;
      }
      
      setDropdownPosition({ top, left: rect.left + window.scrollX });
    }
    setDropdownType(type);
  };

  const closeDropdown = () => {
    setDropdownType(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        const isTriggerClick = target.closest('[data-dropdown-trigger]');
        if (!isTriggerClick) {
          closeDropdown();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (dropdownType) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [dropdownType]);

  const getFilteredOptions = () => {
    switch (dropdownType) {
      case 'model':
        return modelOptions;
      case 'personality':
        return personalityOptions;
      default:
        return [];
    }
  };

  const handleResetSettings = () => {
    setActiveModel('lumi-default');
    setResponseStyle('balanced');
    setPersonalityTone('friendly');
    setRememberUserInfo(true);
    setExperimentalModels(false);
  };

  const DropdownModal = () => {
    if (!dropdownType) return null;

    const options = getFilteredOptions();

    return createPortal(
      <div
        ref={dropdownRef}
        style={{
          position: 'fixed',
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownType === 'model' ? '350px' : '200px',
          maxHeight: dropdownType === 'model' ? '300px' : '200px',
          backgroundColor: '#262626',
          border: '1px solid #333',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          overflow: 'hidden'
        }}
      >
        <div className="custom-scrollbar dropdown-scroll" style={{
          overflowY: 'auto',
          maxHeight: dropdownType === 'model' ? '260px' : '160px'
        }}>
          {options.map((option) => (
            <div
              key={option.value}
              style={{
                padding: '12px',
                fontSize: '14px',
                color: '#e0e0e0',
                cursor: 'pointer',
                transition: 'background-color 150ms ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                if (dropdownType === 'model') handleModelChange(option);
                else if (dropdownType === 'personality') handlePersonalityChange(option);
              }}
            >
              {dropdownType === 'model' ? (
                <div>
                  <div style={{ fontWeight: '500', color: '#ffffff', marginBottom: '2px' }}>{option.label}</div>
                  <div style={{ fontSize: '12px', color: '#808080' }}>{(option as any).tagline}</div>
                </div>
              ) : (
                <div style={{ color: '#ffffff' }}>{option.label}</div>
              )}
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  const MemoryModal = () => {
    if (!showMemoryModal) return null;

    return createPortal(
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }} 
          onClick={() => setShowMemoryModal(false)} 
        />
        <div style={{
          position: 'relative',
          backgroundColor: '#202020',
          border: '1px solid #262626',
          borderRadius: '8px',
          width: '600px',
          height: '400px',
          padding: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Stored Memory Data</h3>
            <button
              onClick={() => setShowMemoryModal(false)}
              style={{
                color: '#808080',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                transition: 'color 150ms ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#808080';
              }}
            >
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div style={{ color: '#ffffff', fontSize: '14px', marginBottom: '16px' }}>
            <p style={{ margin: 0 }}>Here you can view and manage the information Lumi remembers about you.</p>
          </div>
          
          <div className="custom-scrollbar" style={{
            backgroundColor: '#262626',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            height: '200px',
            overflowY: 'auto'
          }}>
            <div style={{ color: '#808080', fontSize: '14px' }}>
              <p style={{ margin: '0 0 8px 0' }}>• Your preferred communication style: Friendly</p>
              <p style={{ margin: '0 0 8px 0' }}>• Favorite topics: Technology, Productivity</p>
              <p style={{ margin: '0 0 8px 0' }}>• Goals: Learn new programming languages</p>
              <p style={{ margin: '0 0 8px 0' }}>• Recurring questions: Help with React development</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={() => {/* Clear memory logic */}}
              style={{
                border: '1px solid #ef4444',
                color: '#ef4444',
                backgroundColor: 'transparent',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.backgroundColor = '#ef4444';
                btn.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.backgroundColor = 'transparent';
                btn.style.color = '#ef4444';
              }}
            >
              Clear Memory
            </button>
            <button
              onClick={() => setShowMemoryModal(false)}
              style={{
                border: '1px solid #808080',
                color: '#808080',
                backgroundColor: 'transparent',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 150ms ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      <h2 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>AI & Models</h2>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Active Model */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Active Model</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Choose which AI model Lumi uses for responses.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('model', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>
              {modelOptions.find(opt => opt.value === activeModel)?.label || 'Lumi Default'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Response Style */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Response Style</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Controls how long Lumi's replies are.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {responseStyleOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setResponseStyle(option.value)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                backgroundColor: responseStyle === option.value ? '#3b82f6' : '#333',
                color: responseStyle === option.value ? '#ffffff' : '#808080'
              }}
              onMouseEnter={(e) => {
                if (responseStyle !== option.value) {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.backgroundColor = '#444';
                  btn.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (responseStyle !== option.value) {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.backgroundColor = '#333';
                  btn.style.color = '#808080';
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Personality & Tone */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Personality & Tone</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Choose how Lumi's tone feels in chats.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('personality', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px', textTransform: 'capitalize' }}>
              {personalityOptions.find(opt => opt.value === personalityTone)?.label || 'Friendly'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Memory & Context */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Memory & Context</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Remember user info</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>When enabled, Lumi remembers your preferences, goals, and recurring topics.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: rememberUserInfo ? '#3b82f6' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setRememberUserInfo(!rememberUserInfo)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: rememberUserInfo ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>View Stored Data</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>View and manage remembered facts about you.</p>
        </div>
        <button
          onClick={() => setShowMemoryModal(true)}
          style={{
            border: '1px solid #808080',
            color: '#808080',
            backgroundColor: 'transparent',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          View Data
        </button>
      </div>
      
      {/* Experimental Settings */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Experimental Settings</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Enable experimental models</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Access to beta and experimental AI models like Lumi Next.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: experimentalModels ? '#3b82f6' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setExperimentalModels(!experimentalModels)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: experimentalModels ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Reset */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Reset</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Reset AI preferences</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Reset all model, tone, and style options to defaults.</p>
        </div>
        <button
          onClick={handleResetSettings}
          style={{
            border: '1px solid #ef4444',
            color: '#ef4444',
            backgroundColor: 'transparent',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.backgroundColor = '#ef4444';
            btn.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.backgroundColor = 'transparent';
            btn.style.color = '#ef4444';
          }}
        >
          Reset Settings
        </button>
      </div>
      
      <DropdownModal />
      <MemoryModal />
    </div>
  );
};

const PersonalAssistantSettings = ({ user, onUpdate }: { user?: User; onUpdate: (user: any) => void }) => {
  // Personal Assistant settings state
  const [responseStyle, setResponseStyle] = useState('conversational');
  const [personality, setPersonality] = useState('friendly');
  const [communicationTone, setCommunicationTone] = useState('mixed');
  const [proactiveLevel, setProactiveLevel] = useState('moderate');
  const [autoSuggestTasks, setAutoSuggestTasks] = useState(true);
  const [taskCategories, setTaskCategories] = useState(['work', 'personal']);
  const [reminderFrequency, setReminderFrequency] = useState('daily');
  const [learningPreferences, setLearningPreferences] = useState(['productivity', 'technology']);
  const [memoryRetention, setMemoryRetention] = useState('30-days');
  const [patternRecognition, setPatternRecognition] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [dataSharing, setDataSharing] = useState('limited');
  const [suggestionFrequency, setSuggestionFrequency] = useState('moderate');
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '17:00' });
  const [weeklyReports, setWeeklyReports] = useState(true);
  
  // Dropdown state
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownType, setDropdownType] = useState<'response-style' | 'personality' | 'tone' | 'proactive' | 'reminder' | 'memory' | 'sharing' | 'frequency' | 'task-categories' | 'learning-preferences' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const responseStyleOptions = [
    { value: 'quick', label: 'Quick', description: 'Brief and to-the-point responses' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive and thorough answers' },
    { value: 'conversational', label: 'Conversational', description: 'Natural and engaging dialogue' }
  ];

  const personalityOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'casual', label: 'Casual' },
    { value: 'motivational', label: 'Motivational' }
  ];

  const toneOptions = [
    { value: 'formal', label: 'Formal' },
    { value: 'informal', label: 'Informal' },
    { value: 'mixed', label: 'Mixed' }
  ];

  const proactiveOptions = [
    { value: 'low', label: 'Low', description: 'Only suggest when directly asked' },
    { value: 'moderate', label: 'Moderate', description: 'Suggest helpful actions occasionally' },
    { value: 'high', label: 'High', description: 'Actively suggest actions and improvements' }
  ];

  const reminderOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'daily', label: 'Daily Summary' },
    { value: 'weekly', label: 'Weekly Summary' }
  ];

  const memoryOptions = [
    { value: '7-days', label: '7 Days' },
    { value: '30-days', label: '30 Days' },
    { value: '90-days', label: '90 Days' },
    { value: 'forever', label: 'Forever' }
  ];

  const sharingOptions = [
    { value: 'minimal', label: 'Minimal', description: 'Only basic conversation context' },
    { value: 'limited', label: 'Limited', description: 'Conversation patterns and preferences' },
    { value: 'comprehensive', label: 'Comprehensive', description: 'Full context for better assistance' }
  ];

  const frequencyOptions = [
    { value: 'low', label: 'Low', description: 'Suggestions only when needed' },
    { value: 'moderate', label: 'Moderate', description: 'Regular helpful suggestions' },
    { value: 'high', label: 'High', description: 'Frequent proactive suggestions' }
  ];

  const taskCategoryOptions = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'health', label: 'Health' },
    { value: 'learning', label: 'Learning' },
    { value: 'finance', label: 'Finance' },
    { value: 'social', label: 'Social' }
  ];

  const learningTopicOptions = [
    { value: 'productivity', label: 'Productivity' },
    { value: 'technology', label: 'Technology' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'education', label: 'Education' },
    { value: 'business', label: 'Business' },
    { value: 'creativity', label: 'Creativity' }
  ];

  const handleDropdownChange = (type: string, value: any) => {
    switch (type) {
      case 'response-style':
        setResponseStyle(value.value);
        break;
      case 'personality':
        setPersonality(value.value);
        break;
      case 'tone':
        setCommunicationTone(value.value);
        break;
      case 'proactive':
        setProactiveLevel(value.value);
        break;
      case 'reminder':
        setReminderFrequency(value.value);
        break;
      case 'memory':
        setMemoryRetention(value.value);
        break;
      case 'sharing':
        setDataSharing(value.value);
        break;
      case 'frequency':
        setSuggestionFrequency(value.value);
        break;
      case 'task-categories':
        toggleTaskCategory(value.value);
        break;
      case 'learning-preferences':
        toggleLearningPreference(value.value);
        break;
    }
    setDropdownType(null);
  };

  const openDropdown = (type: 'response-style' | 'personality' | 'tone' | 'proactive' | 'reminder' | 'memory' | 'sharing' | 'frequency' | 'task-categories' | 'learning-preferences', triggerElement?: HTMLElement) => {
    const element = triggerElement || triggerRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 250;
      
      let top = rect.bottom + window.scrollY + 5;
      if (top + dropdownHeight > viewportHeight + window.scrollY) {
        top = rect.top + window.scrollY - dropdownHeight - 5;
      }
      
      setDropdownPosition({ top, left: rect.left + window.scrollX });
    }
    setDropdownType(type);
  };

  const closeDropdown = () => {
    setDropdownType(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        const isTriggerClick = target.closest('[data-dropdown-trigger]');
        if (!isTriggerClick) {
          closeDropdown();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (dropdownType) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [dropdownType]);

  const getFilteredOptions = () => {
    switch (dropdownType) {
      case 'response-style':
        return responseStyleOptions;
      case 'personality':
        return personalityOptions;
      case 'tone':
        return toneOptions;
      case 'proactive':
        return proactiveOptions;
      case 'reminder':
        return reminderOptions;
      case 'memory':
        return memoryOptions;
      case 'sharing':
        return sharingOptions;
      case 'frequency':
        return frequencyOptions;
      case 'task-categories':
        return taskCategoryOptions;
      case 'learning-preferences':
        return learningTopicOptions;
      default:
        return [];
    }
  };

  const toggleTaskCategory = (category: string) => {
    setTaskCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLearningPreference = (topic: string) => {
    setLearningPreferences(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const DropdownModal = () => {
    if (!dropdownType) return null;

    const options = getFilteredOptions();

    return createPortal(
      <div
        ref={dropdownRef}
        style={{
          position: 'fixed',
          backgroundColor: '#262626',
          border: '1px solid #333',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          overflow: 'hidden',
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: '300px',
          maxHeight: '250px',
        }}
      >
        <div className="custom-scrollbar dropdown-scroll" style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {options.map((option) => (
            <div
              key={option.value}
              style={{
                padding: '12px',
                fontSize: '14px',
                color: '#e0e0e0',
                cursor: 'pointer',
                transition: 'background-color 150ms ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                if (dropdownType === 'task-categories') {
                  toggleTaskCategory(option.value);
                } else if (dropdownType === 'learning-preferences') {
                  toggleLearningPreference(option.value);
                } else {
                  handleDropdownChange(dropdownType, option);
                }
              }}
            >
              {dropdownType === 'task-categories' || dropdownType === 'learning-preferences' ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: '500', color: '#ffffff' }}>{option.label}</div>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '2px solid',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: ((dropdownType === 'task-categories' && taskCategories.includes(option.value)) ||
                    (dropdownType === 'learning-preferences' && learningPreferences.includes(option.value)))
                      ? '#2563eb' 
                      : '#666',
                    backgroundColor: ((dropdownType === 'task-categories' && taskCategories.includes(option.value)) ||
                    (dropdownType === 'learning-preferences' && learningPreferences.includes(option.value)))
                      ? '#2563eb' 
                      : 'transparent'
                  }}>
                    {((dropdownType === 'task-categories' && taskCategories.includes(option.value)) ||
                      (dropdownType === 'learning-preferences' && learningPreferences.includes(option.value))) && (
                      <svg style={{ width: '12px', height: '12px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: '500', color: '#ffffff' }}>{option.label}</div>
                  {(option as any).description && (
                    <div style={{ fontSize: '12px', color: '#808080' }}>{(option as any).description}</div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      {/* Assistant Behavior */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Assistant Behavior</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Response Style */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Response Style</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>How Lumi structures and delivers responses.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('response-style', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px', textTransform: 'capitalize' }}>
              {responseStyleOptions.find(opt => opt.value === responseStyle)?.label || 'Conversational'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Personality */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Personality</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Choose Lumi's personality traits.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('personality', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px', textTransform: 'capitalize' }}>
              {personalityOptions.find(opt => opt.value === personality)?.label || 'Friendly'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Communication Tone */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Communication Tone</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>The formality level of Lumi's communication.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('tone', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px', textTransform: 'capitalize' }}>
              {toneOptions.find(opt => opt.value === communicationTone)?.label || 'Mixed'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Proactive Level */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Proactive Level</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>How often Lumi suggests actions and improvements.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('proactive', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px', textTransform: 'capitalize' }}>
              {proactiveOptions.find(opt => opt.value === proactiveLevel)?.label || 'Moderate'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Task Management */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Task Management</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Auto-suggest Tasks */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Auto-suggest Tasks</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Automatically suggest tasks based on conversations and patterns.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: autoSuggestTasks ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setAutoSuggestTasks(!autoSuggestTasks)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: autoSuggestTasks ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Task Categories */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Task Categories</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Select which categories Lumi should focus on for task suggestions.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('task-categories', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>
              {taskCategories.length > 0 
                ? `${taskCategories.length} selected` 
                : 'Select categories'
              }
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Reminder Frequency */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Reminder Frequency</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>How often to receive task reminders and summaries.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('reminder', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>
              {reminderOptions.find(opt => opt.value === reminderFrequency)?.label || 'Daily Summary'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Learning & Memory */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Learning & Memory</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Learning Preferences */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Learning Preferences</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>What topics should Lumi focus on learning about.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('learning-preferences', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>
              {learningPreferences.length > 0 
                ? `${learningPreferences.length} selected` 
                : 'Select topics'
              }
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Memory Retention */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Memory Retention</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>How long Lumi remembers conversations and patterns.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('memory', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>
              {memoryOptions.find(opt => opt.value === memoryRetention)?.label || '30 Days'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Pattern Recognition */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Pattern Recognition</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Learn from your habits and preferences to provide better assistance.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: patternRecognition ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setPatternRecognition(!patternRecognition)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: patternRecognition ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Productivity Features */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Productivity Features</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Focus Mode */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Focus Mode</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Enable distraction-free assistance for deep work sessions.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: focusMode ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setFocusMode(!focusMode)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: focusMode ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Privacy & Control */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Privacy & Control</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Data Sharing */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Data Sharing</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Control what information Lumi can access for better assistance.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('sharing', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px', textTransform: 'capitalize' }}>
              {sharingOptions.find(opt => opt.value === dataSharing)?.label || 'Limited'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Suggestion Frequency */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Suggestion Frequency</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>How often Lumi provides proactive suggestions.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('frequency', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px', textTransform: 'capitalize' }}>
              {frequencyOptions.find(opt => opt.value === suggestionFrequency)?.label || 'Moderate'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Working Hours */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Working Hours</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>When Lumi should be most active with suggestions.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="time"
            value={workingHours.start}
            onChange={(e) => setWorkingHours(prev => ({ ...prev, start: e.target.value }))}
            style={{
              backgroundColor: '#333',
              color: '#ffffff',
              border: '1px solid #444',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <span style={{ color: '#808080', fontSize: '14px' }}>to</span>
          <input
            type="time"
            value={workingHours.end}
            onChange={(e) => setWorkingHours(prev => ({ ...prev, end: e.target.value }))}
            style={{
              backgroundColor: '#333',
              color: '#ffffff',
              border: '1px solid #444',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>
      
      {/* Analytics & Insights */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Analytics & Insights</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Weekly Reports */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Weekly Reports</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Receive weekly summaries of assistant activity and productivity insights.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: weeklyReports ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setWeeklyReports(!weeklyReports)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: weeklyReports ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      <DropdownModal />
    </div>
  );
};

const PrivacyDataSettings = ({ user, onUpdate }: { user?: User; onUpdate: (user: any) => void }) => {
  // Privacy & Data settings state
  const [messageEncryption, setMessageEncryption] = useState(true);
  const [searchHistory, setSearchHistory] = useState(true);
  const [conversationPrivacy, setConversationPrivacy] = useState('encrypted');
  const [locationServices, setLocationServices] = useState(false);
  const [ipAddressCollection, setIpAddressCollection] = useState(false);
  const [deviceFingerprinting, setDeviceFingerprinting] = useState(false);
  const [crossSiteTracking, setCrossSiteTracking] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(true);
  const [ccpaRights, setCcpaRights] = useState(true);
  const [dataProcessingBasis, setDataProcessingBasis] = useState('consent');
  const [dataBreachNotifications, setDataBreachNotifications] = useState(true);
  
  // Dropdown state
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownType, setDropdownType] = useState<'conversation-privacy' | 'data-basis' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const conversationPrivacyOptions = [
    { value: 'encrypted', label: 'End-to-End Encrypted', description: 'Maximum security for conversations' },
    { value: 'standard', label: 'Standard Encryption', description: 'Basic encryption for conversations' },
    { value: 'unencrypted', label: 'No Encryption', description: 'No encryption (not recommended)' }
  ];

  const dataBasisOptions = [
    { value: 'consent', label: 'Consent', description: 'Based on your explicit consent' },
    { value: 'contract', label: 'Contract', description: 'Necessary for service provision' },
    { value: 'legitimate', label: 'Legitimate Interest', description: 'For legitimate business purposes' },
    { value: 'legal', label: 'Legal Obligation', description: 'Required by law' }
  ];

  const handleDropdownChange = (type: string, value: any) => {
    switch (type) {
      case 'conversation-privacy':
        setConversationPrivacy(value.value);
        break;
      case 'data-basis':
        setDataProcessingBasis(value.value);
        break;
    }
    setDropdownType(null);
  };

  const openDropdown = (type: 'conversation-privacy' | 'data-basis', triggerElement?: HTMLElement) => {
    const element = triggerElement || triggerRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 250;
      
      let top = rect.bottom + window.scrollY + 5;
      if (top + dropdownHeight > viewportHeight + window.scrollY) {
        top = rect.top + window.scrollY - dropdownHeight - 5;
      }
      
      setDropdownPosition({ top, left: rect.left + window.scrollX });
    }
    setDropdownType(type);
  };

  const closeDropdown = () => {
    setDropdownType(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        const isTriggerClick = target.closest('[data-dropdown-trigger]');
        if (!isTriggerClick) {
          closeDropdown();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (dropdownType) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [dropdownType]);

  const getFilteredOptions = () => {
    switch (dropdownType) {
      case 'conversation-privacy':
        return conversationPrivacyOptions;
      case 'data-basis':
        return dataBasisOptions;
      default:
        return [];
    }
  };

  const handleDataExport = () => {
    // Data export functionality
    console.log('Exporting user data...');
  };

  const handleDataPortability = () => {
    // Data portability functionality
    console.log('Preparing data for portability...');
  };

  const handleRightToErasure = () => {
    // Right to erasure functionality
    console.log('Processing right to erasure request...');
  };

  const handleDataRectification = () => {
    // Data rectification functionality
    console.log('Opening data rectification form...');
  };

  const DropdownModal = () => {
    if (!dropdownType) return null;

    const options = getFilteredOptions();

    return createPortal(
      <div
        ref={dropdownRef}
        style={{
          position: 'fixed',
          backgroundColor: '#262626',
          border: '1px solid #333',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          overflow: 'hidden',
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: '300px',
          maxHeight: '250px',
        }}
      >
        <div className="custom-scrollbar dropdown-scroll" style={{ maxHeight: '210px', overflowY: 'auto' }}>
          {options.map((option) => (
            <div
              key={option.value}
              style={{
                padding: '12px',
                fontSize: '14px',
                color: '#e0e0e0',
                cursor: 'pointer',
                transition: 'background-color 150ms ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }}
              onClick={() => handleDropdownChange(dropdownType, option)}
            >
              <div style={{ fontWeight: '500', color: '#ffffff' }}>{option.label}</div>
              <div style={{ fontSize: '12px', color: '#808080' }}>{option.description}</div>
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div>
      {/* Data Management */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Data Management</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Data Export */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Data Export</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Download all your data in a portable format.</p>
        </div>
        <button
          onClick={handleDataExport}
          style={{
            border: '1px solid #808080',
            color: '#808080',
            backgroundColor: 'transparent',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          Export Data
        </button>
      </div>
      
      {/* Data Portability */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Data Portability</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Export your data in different formats for easy transfer.</p>
        </div>
        <button
          onClick={handleDataPortability}
          style={{
            border: '1px solid #808080',
            color: '#808080',
            backgroundColor: 'transparent',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          Export Formats
        </button>
      </div>
      
      {/* Right to Erasure */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Right to Erasure</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Request deletion of specific data types.</p>
        </div>
        <button
          onClick={handleRightToErasure}
          style={{
            border: '1px solid #ef4444',
            color: '#ef4444',
            backgroundColor: 'transparent',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.backgroundColor = '#ef4444';
            btn.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.backgroundColor = 'transparent';
            btn.style.color = '#ef4444';
          }}
        >
          Delete Data
        </button>
      </div>
      
      {/* Data Rectification */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Data Rectification</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Correct inaccurate or incomplete information.</p>
        </div>
        <button
          onClick={handleDataRectification}
          style={{
            border: '1px solid #808080',
            color: '#808080',
            backgroundColor: 'transparent',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          Correct Data
        </button>
      </div>
      
      {/* Content Privacy */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Content Privacy</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Message Encryption */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Message Encryption</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Enable end-to-end encryption for all messages.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: messageEncryption ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setMessageEncryption(!messageEncryption)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: messageEncryption ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Search History */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Search History</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Save and use search history to improve results.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: searchHistory ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setSearchHistory(!searchHistory)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: searchHistory ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Conversation Privacy */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Conversation Privacy</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Control privacy level for chat conversations.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('conversation-privacy', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px' }}>
              {conversationPrivacyOptions.find(opt => opt.value === conversationPrivacy)?.label || 'End-to-End Encrypted'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Location & Tracking */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Location & Tracking</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Location Services */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Location Services</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Allow Lumi to access your location for better services.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: locationServices ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setLocationServices(!locationServices)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: locationServices ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* IP Address Collection */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>IP Address Collection</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Collect IP addresses for security and analytics.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: ipAddressCollection ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setIpAddressCollection(!ipAddressCollection)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: ipAddressCollection ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Device Fingerprinting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Device Fingerprinting</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Use device characteristics for identification and security.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: deviceFingerprinting ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setDeviceFingerprinting(!deviceFingerprinting)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: deviceFingerprinting ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Cross-site Tracking */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Cross-site Tracking</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Prevent tracking across different websites.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: crossSiteTracking ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setCrossSiteTracking(!crossSiteTracking)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: crossSiteTracking ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Compliance & Legal */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Compliance & Legal</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* GDPR Consent */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>GDPR Consent</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Manage your consent for data processing under GDPR.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: gdprConsent ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setGdprConsent(!gdprConsent)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: gdprConsent ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* CCPA Rights */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>CCPA Rights</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Exercise your California Consumer Privacy Act rights.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: ccpaRights ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setCcpaRights(!ccpaRights)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: ccpaRights ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Data Processing Basis */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Data Processing Basis</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Legal basis for processing your personal data.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#808080',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 150ms ease'
            }}
            data-dropdown-trigger
            onClick={(e) => openDropdown('data-basis', e.currentTarget)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '14px', marginRight: '8px', textTransform: 'capitalize' }}>
              {dataBasisOptions.find(opt => opt.value === dataProcessingBasis)?.label || 'Consent'}
            </span>
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Data Breach Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Data Breach Notifications</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Receive notifications about data breaches affecting your account.</p>
        </div>
        <button 
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: dataBreachNotifications ? '#2563eb' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onClick={() => setDataBreachNotifications(!dataBreachNotifications)}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: dataBreachNotifications ? 'translateX(24px)' : 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Transparency */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Transparency</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Privacy Policy */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Privacy Policy</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Read our current privacy policy and data practices.</p>
        </div>
        <button style={{
          border: '1px solid #808080',
          color: '#808080',
          backgroundColor: 'transparent',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background-color 150ms ease'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }}>
          View Policy
        </button>
      </div>
      
      {/* Data Processing Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Data Processing Information</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Learn what data we process and why.</p>
        </div>
        <button style={{
          border: '1px solid #808080',
          color: '#808080',
          backgroundColor: 'transparent',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background-color 150ms ease'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }}>
          View Details
        </button>
      </div>
      
      {/* Third-party Sharing */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Third-party Sharing</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>See who we share your data with and why.</p>
        </div>
        <button style={{
          border: '1px solid #808080',
          color: '#808080',
          backgroundColor: 'transparent',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background-color 150ms ease'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }}>
          View Partners
        </button>
      </div>
      
      <DropdownModal />
    </div>
  );
};

const SystemSettings = ({ user, onUpdate }: { user?: User; onUpdate: (user: any) => void }) => {
  // Windows desktop app information
  const appInfo = {
    version: '2.1.4',
    buildNumber: '20241015.1',
    architecture: 'x64',
    installPath: 'C:\\Program Files\\Lumi',
    updateChannel: 'stable'
  };

  return (
    <div>
      {/* Application Information */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Application</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* App Version */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Version</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Current Lumi desktop application version.</p>
        </div>
        <div style={{ color: '#808080', fontSize: '14px' }}>
          {appInfo.version}
        </div>
      </div>
      
      {/* Build Number */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Build</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Internal build identifier.</p>
        </div>
        <div style={{ color: '#808080', fontSize: '14px' }}>
          {appInfo.buildNumber}
        </div>
      </div>
      
      {/* Architecture */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Architecture</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Application architecture type.</p>
        </div>
        <div style={{ color: '#808080', fontSize: '14px' }}>
          {appInfo.architecture}
        </div>
      </div>
      
      {/* Install Path */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Install Location</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Application installation directory.</p>
        </div>
        <div style={{ 
          color: '#808080', 
          fontSize: '14px', 
          maxWidth: '300px', 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }} title={appInfo.installPath}>
          {appInfo.installPath}
        </div>
      </div>
      
      {/* Update Channel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Update Channel</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Release channel for updates.</p>
        </div>
        <div style={{ 
          color: '#ffffff', 
          fontSize: '14px',
          backgroundColor: appInfo.updateChannel === 'stable' ? '#22c55e' : '#eab308',
          padding: '2px 8px',
          borderRadius: '4px',
          textTransform: 'capitalize'
        }}>
          {appInfo.updateChannel}
        </div>
      </div>
    </div>
  );
};

const SubscriptionPlanSettings = ({ user, onUpdate }: { user?: User; onUpdate: (user: any) => void }) => {
  // Subscription plan state
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [planStatus, setPlanStatus] = useState('active');
  const [renewalDate, setRenewalDate] = useState('2024-02-15');
  const [paymentMethod, setPaymentMethod] = useState('visa-****1234');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);
  const [apiUsage, setApiUsage] = useState({ used: 8500, limit: 10000 });
  const [storageUsage, setStorageUsage] = useState({ used: 2.3, limit: 5.0 });

  const handleChangeBilling = () => {
    console.log('Changing billing method');
    // Handle billing method change
  };

  const handleDownloadInvoice = () => {
    console.log('Downloading invoice');
    // Handle invoice download
  };

  const handleCancelSubscription = () => {
    console.log('Cancelling subscription');
    // Handle subscription cancellation
  };

  const getCurrentPlan = () => {
    return {
      name: 'Pro',
      price: '$19',
      period: 'month',
      popular: true
    };
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  return (
    <div>
      {/* Current Plan */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Current Plan</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ backgroundColor: '#262626', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: 0 }}>{getCurrentPlan().name} Plan</h4>
            <p style={{ color: '#808080', fontSize: '14px', margin: '4px 0 0 0', display: 'flex', alignItems: 'center' }}>
              {getCurrentPlan().price}/{getCurrentPlan().period}
              {getCurrentPlan().popular && (
                <span style={{
                  marginLeft: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>Most Popular</span>
              )}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#808080', fontSize: '14px' }}>Status</div>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: planStatus === 'active' ? '#22c55e' : 
                     planStatus === 'trial' ? '#eab308' : 
                     '#ef4444'
            }}>
              {planStatus.charAt(0).toUpperCase() + planStatus.slice(1)}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
          <div>
            <div style={{ color: '#808080' }}>Renewal Date</div>
            <div style={{ color: '#ffffff' }}>{renewalDate}</div>
          </div>
          <div>
            <div style={{ color: '#808080' }}>Payment Method</div>
            <div style={{ color: '#ffffff' }}>{paymentMethod}</div>
          </div>
        </div>
        
        {trialDaysRemaining > 0 && (
          <div style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: 'rgba(234, 179, 8, 0.2)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '4px',
            color: '#fde047',
            fontSize: '14px'
          }}>
            Trial expires in {trialDaysRemaining} days
          </div>
        )}
      </div>
      
      {/* Usage Tracking */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Usage Tracking</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* API Usage */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>API Calls</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Monthly API call usage</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>
            {apiUsage.used.toLocaleString()} / {apiUsage.limit.toLocaleString()}
          </div>
          <div style={{ color: '#808080', fontSize: '12px' }}>
            {getUsagePercentage(apiUsage.used, apiUsage.limit)}% used
          </div>
        </div>
      </div>
      
      {/* Storage Usage */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Storage</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>File and data storage usage</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>
            {storageUsage.used}GB / {storageUsage.limit}GB
          </div>
          <div style={{ color: '#808080', fontSize: '12px' }}>
            {getUsagePercentage(storageUsage.used, storageUsage.limit)}% used
          </div>
        </div>
      </div>
      
      
      {/* Plan Management */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Plan Management</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Change Billing */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Change Billing Method</h4>
            <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Update your payment method or billing cycle.</p>
          </div>
          <button
            onClick={handleChangeBilling}
            style={{
              border: '1px solid #808080',
              color: '#808080',
              backgroundColor: 'transparent',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 150ms ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Change
          </button>
        </div>
        
        {/* Download Invoice */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Download Invoice</h4>
            <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Download your latest billing invoice.</p>
          </div>
          <button
            onClick={handleDownloadInvoice}
            style={{
              border: '1px solid #808080',
              color: '#808080',
              backgroundColor: 'transparent',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 150ms ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Download
          </button>
        </div>
        
        {/* Cancel Subscription */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Cancel Subscription</h4>
            <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Cancel your current subscription plan.</p>
          </div>
          <button
            onClick={handleCancelSubscription}
            style={{
              border: '1px solid #ef4444',
              color: '#ef4444',
              backgroundColor: 'transparent',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.backgroundColor = '#ef4444';
              btn.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.backgroundColor = 'transparent';
              btn.style.color = '#ef4444';
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      
      {/* Billing Information */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Billing Information</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ backgroundColor: '#262626', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px' }}>
          <div>
            <div style={{ color: '#808080', marginBottom: '4px' }}>Payment Method</div>
            <div style={{ color: '#ffffff' }}>{paymentMethod}</div>
          </div>
          <div>
            <div style={{ color: '#808080', marginBottom: '4px' }}>Billing Cycle</div>
            <div style={{ color: '#ffffff', textTransform: 'capitalize' }}>{billingCycle}</div>
          </div>
          <div>
            <div style={{ color: '#808080', marginBottom: '4px' }}>Next Billing Date</div>
            <div style={{ color: '#ffffff' }}>{renewalDate}</div>
          </div>
          <div>
            <div style={{ color: '#808080', marginBottom: '4px' }}>Plan Status</div>
            <div style={{
              fontWeight: '500',
              color: planStatus === 'active' ? '#22c55e' : 
                     planStatus === 'trial' ? '#eab308' : 
                     '#ef4444'
            }}>
              {planStatus.charAt(0).toUpperCase() + planStatus.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpgradeToPremiumSettings = ({ user, onUpdate }: { user?: User; onUpdate: (user: any) => void }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '50 messages per day',
        'Basic AI responses',
        'Community support',
        '1GB storage',
        'Basic features'
      ],
      popular: false,
      current: true
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        'Unlimited messages',
        'Advanced AI responses',
        'Priority support',
        '10GB storage',
        'API access'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'Dedicated support',
        'Team management',
        'Custom integrations'
      ],
      popular: false
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleBillingCycleChange = (cycle: string) => {
    setBillingCycle(cycle);
  };

  const handleUpgrade = () => {
    console.log(`Upgrading to ${selectedPlan} plan (${billingCycle})`);
    // Handle upgrade logic
  };

  const getSelectedPlan = () => {
    return plans.find(plan => plan.id === selectedPlan) || plans[0];
  };

  const getPrice = (plan: any) => {
    return billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: any) => {
    if (billingCycle === 'yearly') {
      const monthlyTotal = plan.monthlyPrice * 12;
      const savings = monthlyTotal - plan.yearlyPrice;
      return Math.round((savings / monthlyTotal) * 100);
    }
    return 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#333',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <svg style={{ width: '32px', height: '32px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Upgrade to Premium</h2>
        <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Unlock advanced features and unlimited access</p>
      </div>

      {/* Billing Cycle Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#333', borderRadius: '8px', padding: '4px', display: 'flex' }}>
          <button
            onClick={() => handleBillingCycleChange('monthly')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              backgroundColor: billingCycle === 'monthly' ? '#262626' : 'transparent',
              color: billingCycle === 'monthly' ? '#ffffff' : '#808080'
            }}
            onMouseEnter={(e) => {
              if (billingCycle !== 'monthly') {
                (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (billingCycle !== 'monthly') {
                (e.currentTarget as HTMLButtonElement).style.color = '#808080';
              }
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => handleBillingCycleChange('yearly')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              backgroundColor: billingCycle === 'yearly' ? '#262626' : 'transparent',
              color: billingCycle === 'yearly' ? '#ffffff' : '#808080',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              if (billingCycle !== 'yearly') {
                (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (billingCycle !== 'yearly') {
                (e.currentTarget as HTMLButtonElement).style.color = '#808080';
              }
            }}
          >
            Yearly
            {billingCycle === 'yearly' && (
              <span style={{
                marginLeft: '4px',
                backgroundColor: '#333',
                color: '#ffffff',
                fontSize: '12px',
                padding: '2px 4px',
                borderRadius: '4px'
              }}>
                Save {getSavings(getSelectedPlan())}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Plan Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              backgroundColor: selectedPlan === plan.id ? '#2a2a2a' : '#262626',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${selectedPlan === plan.id ? '#808080' : '#333'}`,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onClick={() => handlePlanSelect(plan.id)}
            onMouseEnter={(e) => {
              if (selectedPlan !== plan.id) {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#444';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPlan !== plan.id) {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#333';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#333',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg style={{ width: '20px', height: '20px', color: '#ffffff' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: 0 }}>{plan.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {plan.popular && (
                      <span style={{
                        backgroundColor: '#333',
                        color: '#ffffff',
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        Popular
                      </span>
                    )}
                    {plan.current && (
                      <span style={{
                        backgroundColor: '#22c55e',
                        color: '#ffffff',
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}>
                        Current
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700' }}>
                  {plan.monthlyPrice === 0 ? 'Free' : `$${getPrice(plan)}`}
                </span>
                {plan.monthlyPrice > 0 && (
                  <span style={{ color: '#808080', fontSize: '14px', marginLeft: '4px' }}>
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                )}
              </div>
              {billingCycle === 'yearly' && plan.monthlyPrice > 0 && (
                <div style={{ color: '#808080', fontSize: '12px', marginTop: '4px' }}>
                  Save ${(plan.monthlyPrice * 12) - plan.yearlyPrice}/year
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {plan.features.map((feature, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <svg style={{ width: '12px', height: '12px', color: '#808080', marginRight: '8px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span style={{ color: '#e0e0e0' }}>{feature}</span>
                </div>
              ))}
            </div>

            <div style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center',
              transition: 'colors 150ms ease',
              backgroundColor: '#333',
              color: selectedPlan === plan.id ? '#ffffff' : '#808080'
            }}>
              {selectedPlan === plan.id 
                ? (plan.current ? 'Current Plan' : 'Selected') 
                : (plan.current ? 'Downgrade' : 'Select')
              }
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Button */}
      <div style={{ textAlign: 'center' }}>
        {getSelectedPlan().monthlyPrice === 0 ? (
          <div>
            <div style={{
              backgroundColor: '#333',
              color: '#ffffff',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              display: 'inline-block'
            }}>
              You're on the Free plan
            </div>
            <p style={{ color: '#808080', fontSize: '12px', marginTop: '12px', margin: '12px 0 0 0' }}>
              Upgrade to unlock more features and unlimited access
            </p>
          </div>
        ) : (
          <div>
            <button
              onClick={handleUpgrade}
              style={{
                backgroundColor: '#333',
                color: '#ffffff',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 150ms ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#444';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
              }}
            >
              Upgrade to {getSelectedPlan().name} - ${getPrice(getSelectedPlan())}
              {billingCycle === 'yearly' ? '/year' : '/month'}
            </button>
            <p style={{ color: '#808080', fontSize: '12px', marginTop: '12px', margin: '12px 0 0 0' }}>
              Cancel anytime. No hidden fees.
            </p>
          </div>
        )}
      </div>

      {/* Trust Indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', color: '#808080', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg style={{ width: '12px', height: '12px', marginRight: '4px' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg style={{ width: '12px', height: '12px', marginRight: '4px' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          30-Day Refund
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg style={{ width: '12px', height: '12px', marginRight: '4px' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Instant Access
        </div>
      </div>
    </div>
  );
};

const BackupSettings = ({ user, onUpdate }: { user?: User; onUpdate: (user: any) => void }) => {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [lastBackupDate, setLastBackupDate] = useState('2024-01-15 14:30');
  const [backupSize, setBackupSize] = useState('2.3 MB');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);

    // Simulate backup creation process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setBackupProgress(i);
    }

    // Simulate file download
    const backupData = {
      user: user,
      settings: {},
      conversations: [] as any[],
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumi-backup-${new Date().toISOString().split('T')[0]}.lumi`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setLastBackupDate(new Date().toLocaleString());
    setBackupSize('2.3 MB');
    setIsCreatingBackup(false);
    setBackupProgress(0);
  };

  const handleRestoreBackup = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.lumi')) {
      alert('Please select a valid Lumi backup file (.lumi)');
      return;
    }

    setIsRestoring(true);
    setRestoreProgress(0);

    try {
      // Simulate file reading and restoration
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setRestoreProgress(i);
      }

      const text = await file.text();
      const backupData = JSON.parse(text);

      // Validate backup data
      if (!backupData.user || !backupData.timestamp) {
        throw new Error('Invalid backup file format');
      }

      // Simulate data restoration
      console.log('Restoring backup:', backupData);
      
      // Here you would actually restore the data
      // onUpdate(backupData.user);
      
      alert('Backup restored successfully!');
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Failed to restore backup. Please check the file format.');
    } finally {
      setIsRestoring(false);
      setRestoreProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAutoBackupToggle = () => {
    console.log('Auto backup toggled');
    // Handle auto backup toggle
  };

  const handleCloudBackupToggle = () => {
    console.log('Cloud backup toggled');
    // Handle cloud backup toggle
  };

  return (
    <div>
      {/* Recent Backups */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Recent Backups</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Backup Table */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
          <div style={{ color: '#808080' }}>Backup name</div>
          <div style={{ color: '#808080' }}>Date created</div>
          <div style={{ color: '#808080' }}>Size</div>
          <div style={{ color: '#808080' }}>Status</div>
        </div>
        
        <div style={{ borderTop: '1px solid #303030', marginBottom: '8px' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
          <div style={{ color: '#ffffff' }}>lumi-backup-2024-01-15.lumi</div>
          <div style={{ color: '#808080' }}>Jan 15, 2024 2:30 PM</div>
          <div style={{ color: '#808080' }}>2.3 MB</div>
          <div style={{ color: '#22c55e' }}>✓ Complete</div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
          <div style={{ color: '#ffffff' }}>lumi-backup-2024-01-08.lumi</div>
          <div style={{ color: '#808080' }}>Jan 8, 2024 10:15 AM</div>
          <div style={{ color: '#808080' }}>2.1 MB</div>
          <div style={{ color: '#22c55e' }}>✓ Complete</div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
          <div style={{ color: '#ffffff' }}>lumi-backup-2024-01-01.lumi</div>
          <div style={{ color: '#808080' }}>Jan 1, 2024 6:45 PM</div>
          <div style={{ color: '#808080' }}>1.9 MB</div>
          <div style={{ color: '#22c55e' }}>✓ Complete</div>
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <p style={{ color: '#808080', fontSize: '14px', marginBottom: '24px', margin: 0 }}>All backups are encrypted and stored locally</p>

      {/* Backup Actions */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Backup Actions</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Create Backup */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Create Backup</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Download an encrypted backup of your data.</p>
        </div>
        <button
          onClick={handleCreateBackup}
          disabled={isCreatingBackup}
          style={{
            border: isCreatingBackup ? '1px solid #666' : '1px solid #808080',
            color: isCreatingBackup ? '#666' : '#808080',
            backgroundColor: 'transparent',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: isCreatingBackup ? 'not-allowed' : 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onMouseEnter={(e) => {
            if (!isCreatingBackup) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
            }
          }}
          onMouseLeave={(e) => {
            if (!isCreatingBackup) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }
          }}
        >
          {isCreatingBackup ? 'Creating...' : 'Create Backup'}
        </button>
      </div>

      {/* Backup Progress */}
      {isCreatingBackup && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#808080', fontSize: '14px' }}>Creating backup...</span>
            <span style={{ color: '#808080', fontSize: '14px' }}>{backupProgress}%</span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#333', borderRadius: '9999px', height: '8px' }}>
            <div 
              style={{
                backgroundColor: '#3b82f6',
                height: '8px',
                borderRadius: '9999px',
                transition: 'width 300ms ease',
                width: `${backupProgress}%`
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Restore Backup */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Restore Backup</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Upload and restore data from a backup file.</p>
        </div>
        <button
          onClick={handleRestoreBackup}
          disabled={isRestoring}
          style={{
            border: isRestoring ? '1px solid #666' : '1px solid #808080',
            color: isRestoring ? '#666' : '#808080',
            backgroundColor: 'transparent',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: isRestoring ? 'not-allowed' : 'pointer',
            transition: 'background-color 150ms ease'
          }}
          onMouseEnter={(e) => {
            if (!isRestoring) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333';
            }
          }}
          onMouseLeave={(e) => {
            if (!isRestoring) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }
          }}
        >
          {isRestoring ? 'Restoring...' : 'Restore Backup'}
        </button>
      </div>

      {/* Restore Progress */}
      {isRestoring && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#808080', fontSize: '14px' }}>Restoring backup...</span>
            <span style={{ color: '#808080', fontSize: '14px' }}>{restoreProgress}%</span>
          </div>
          <div style={{ width: '100%', backgroundColor: '#333', borderRadius: '9999px', height: '8px' }}>
            <div 
              style={{
                backgroundColor: '#22c55e',
                height: '8px',
                borderRadius: '9999px',
                transition: 'width 300ms ease',
                width: `${restoreProgress}%`
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".lumi"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Backup Settings */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>Backup Settings</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      {/* Auto Backup */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Auto Backup</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Automatically create backups weekly.</p>
        </div>
        <button
          onClick={handleAutoBackupToggle}
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>
      
      {/* Cloud Backup */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Cloud Backup</h4>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Store backups in secure cloud storage.</p>
        </div>
        <button
          onClick={handleCloudBackupToggle}
          style={{
            position: 'relative',
            display: 'inline-flex',
            height: '24px',
            width: '44px',
            alignItems: 'center',
            borderRadius: '9999px',
            backgroundColor: '#6b7280',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 150ms ease'
          }}
        >
          <span style={{
            display: 'inline-block',
            height: '16px',
            width: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: 'translateX(4px)',
            transition: 'transform 150ms ease'
          }} />
        </button>
      </div>

      {/* Backup Details */}
      <h3 style={{ color: '#ffffff', fontSize: '13px', fontWeight: '600', marginBottom: '8px', marginTop: '48px' }}>What's Included</h3>
      <div style={{ borderTop: '1px solid #303030', marginBottom: '16px' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          <svg style={{ width: '12px', height: '12px', color: '#808080', marginRight: '8px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span style={{ color: '#e0e0e0' }}>User profile and settings</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          <svg style={{ width: '12px', height: '12px', color: '#808080', marginRight: '8px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span style={{ color: '#e0e0e0' }}>Chat history and conversations</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          <svg style={{ width: '12px', height: '12px', color: '#808080', marginRight: '8px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span style={{ color: '#e0e0e0' }}>Personalized preferences</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          <svg style={{ width: '12px', height: '12px', color: '#808080', marginRight: '8px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span style={{ color: '#e0e0e0' }}>AI model settings and customizations</span>
        </div>
      </div>
    </div>
  );
};

const ConnectionSettings = ({ user, onUpdate }: { user?: User; onUpdate: (user: any) => void }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Connection Settings</h3>
        <p style={{ color: '#808080', fontSize: '14px', marginBottom: '24px', margin: 0 }}>
          Manage your external service connections and integrations.
        </p>
      </div>

      {/* Integrations Section */}
      <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: '500', fontSize: '16px', marginBottom: '4px' }}>Integrations</h4>
            <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>
              Connect external services to enhance your Lumi experience
            </p>
          </div>
          <div style={{ padding: '4px 12px', backgroundColor: '#2a2a2a', border: '1px solid #404040', borderRadius: '9999px' }}>
            <span style={{ color: '#808080', fontSize: '12px', fontWeight: '500' }}>Coming Soon</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Google Services */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#2a2a2a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontWeight: '500', margin: 0 }}>Google Services</h5>
                <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Gmail, Calendar, Drive, and more</p>
              </div>
            </div>
            <div style={{ padding: '4px 12px', backgroundColor: '#2a2a2a', border: '1px solid #404040', borderRadius: '9999px' }}>
              <span style={{ color: '#808080', fontSize: '12px' }}>Coming Soon</span>
            </div>
          </div>

          {/* Microsoft Services */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#2a2a2a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#00BCF2"/>
                </svg>
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontWeight: '500', margin: 0 }}>Microsoft 365</h5>
                <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Outlook, Teams, OneDrive, and more</p>
              </div>
            </div>
            <div style={{ padding: '4px 12px', backgroundColor: '#2a2a2a', border: '1px solid #404040', borderRadius: '9999px' }}>
              <span style={{ color: '#808080', fontSize: '12px' }}>Coming Soon</span>
            </div>
          </div>

          {/* Slack */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#2a2a2a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
                </svg>
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontWeight: '500', margin: 0 }}>Slack</h5>
                <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Team communication and collaboration</p>
              </div>
            </div>
            <div style={{ padding: '4px 12px', backgroundColor: '#2a2a2a', border: '1px solid #404040', borderRadius: '9999px' }}>
              <span style={{ color: '#808080', fontSize: '12px' }}>Coming Soon</span>
            </div>
          </div>

          {/* Notion */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#2a2a2a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4.459 4.208c.155-.32.48-.52.84-.52h13.402c.36 0 .685.2.84.52.155.32.155.72 0 1.04l-6.701 13.402c-.155.32-.48.52-.84.52s-.685-.2-.84-.52L4.459 5.248c-.155-.32-.155-.72 0-1.04z" fill="#000000"/>
                </svg>
              </div>
              <div>
                <h5 style={{ color: '#ffffff', fontWeight: '500', margin: 0 }}>Notion</h5>
                <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>Notes, docs, and workspace management</p>
              </div>
            </div>
            <div style={{ padding: '4px 12px', backgroundColor: '#2a2a2a', border: '1px solid #404040', borderRadius: '9999px' }}>
              <span style={{ color: '#808080', fontSize: '12px' }}>Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626', borderRadius: '8px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: '500', fontSize: '16px', marginBottom: '4px' }}>API Keys</h4>
            <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>
              Manage your API keys for external services
            </p>
          </div>
          <div style={{ padding: '4px 12px', backgroundColor: '#2a2a2a', border: '1px solid #404040', borderRadius: '9999px' }}>
            <span style={{ color: '#808080', fontSize: '12px', fontWeight: '500' }}>Coming Soon</span>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#2a2a2a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: '#808080' }}>
              <path d="M12 15l3-3h-2V9h-2v3H9l3 3z" fill="currentColor"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
          </div>
          <p style={{ color: '#808080', fontSize: '14px', margin: 0 }}>API key management will be available soon</p>
        </div>
      </div>
    </div>
  );
};

// Internal component that uses the settings context
function SettingsModalContent({ isOpen, onClose }: SettingsModalProps) {
  // Use centralized profile hook
  const { user, isLoading, error, updateProfile } = useProfile();
  const { hasUnsavedChanges, markAsSaved, getPendingChanges } = useSettingsContext();
  
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Debug logging
  console.log('SettingsModalContent - hasUnsavedChanges:', hasUnsavedChanges);
  console.log('SettingsModalContent - pendingChanges:', getPendingChanges());
  
  // Save handler
  const handleSave = async () => {
    if (!hasUnsavedChanges) return;
    
    setIsSaving(true);
    try {
      // Get all pending changes
      const pendingChanges = getPendingChanges();
      
      // Here you would typically sync with backend
      // For now, we'll just mark as saved
      console.log('Saving changes:', pendingChanges);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      markAsSaved();
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Backdrop with proper styling */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        style={{
          position: 'relative',
          backgroundColor: '#202020',
          border: '1px solid #262626',
          borderRadius: '8px',
          width: '1200px',
          height: '720px',
          display: 'flex',
          flexDirection: 'row',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sidebar Nav */}
        <div className="custom-scrollbar sidebar-scroll" style={{ width: '240px', overflowY: 'auto' }}>
          <div style={{ padding: '12px' }}>
            <h2 style={{ color: '#808080', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Accounts</h2>
            
            {/* Avatar and Name */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '4px',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: activeTab === 'profile' ? '#2a2a2a' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 150ms ease'
              }}
              onClick={() => setActiveTab('profile')}
              onMouseEnter={(e) => {
                if (activeTab !== 'profile') {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = '#2a2a2a';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'profile') {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid #666'
                  }}
                />
              ) : (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#191919',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#808080',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {user?.full_name 
                    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                    : user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <span style={{ color: '#e5e5e5', fontWeight: '500', fontSize: '14px' }}>
                {user?.full_name || 'User Name'}
              </span>
            </div>
            
            {/* Navigation Items */}
            {[
              { key: 'preferences', label: 'Preferences', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/></svg> },
              { key: 'notifications', label: 'Notifications', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M2.53 14.77c-.213 1.394.738 2.361 1.902 2.843c4.463 1.85 10.673 1.85 15.136 0c1.164-.482 2.115-1.45 1.902-2.843c-.13-.857-.777-1.57-1.256-2.267c-.627-.924-.689-1.931-.69-3.003C19.525 5.358 16.157 2 12 2S4.475 5.358 4.475 9.5c0 1.072-.062 2.08-.69 3.003c-.478.697-1.124 1.41-1.255 2.267"/><path d="M8 19c.458 1.725 2.076 3 4 3c1.925 0 3.541-1.275 4-3"/></g></svg> }
            ].map(item => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginLeft: '4px',
                  marginBottom: item.key === 'notifications' ? '32px' : '4px',
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: activeTab === item.key ? '#2a2a2a' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease'
                }}
                onClick={() => setActiveTab(item.key)}
                onMouseEnter={(e) => {
                  if (activeTab !== item.key) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = '#2a2a2a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.key) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.icon}
                <span style={{ color: '#e5e5e5', fontWeight: '500', fontSize: '14px' }}>{item.label}</span>
              </div>
            ))}
            
            {/* AI & Personalization Section */}
            <h2 style={{ color: '#808080', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>AI & Personalization</h2>
            
            {[
              { key: 'ai-models', label: 'AI & Models', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"/></g></svg> },
              { key: 'personal-assistant', label: 'Personal Assistant', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}><path fill="currentColor" d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3l3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 16h-4.83l-.59.59L12 20.17l-1.59-1.59l-.58-.58H5V4h14v14zm-7-1l1.88-4.12L18 11l-4.12-1.88L12 5l-1.88 4.12L6 11l4.12 1.88z"/></svg> },
              { key: 'privacy-data', label: 'Privacy & Data', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}><path fill="currentColor" d="M17 17q.625 0 1.063-.438T18.5 15.5q0-.625-.438-1.063T17 14q-.625 0-1.063.438T15.5 15.5q0 .625.438 1.063T17 17Zm0 3q.794 0 1.435-.353q.64-.353 1.06-.953q-.57-.344-1.195-.519Q17.675 18 17 18t-1.3.175q-.625.175-1.194.52q.419.6 1.06.952Q16.205 20 17 20Zm-5 .962q-3.013-.895-5.007-3.651Q5 14.554 5 11.1V5.692l7-2.615l7 2.615v5.656q-.225-.085-.494-.15q-.27-.067-.506-.123V6.381L12 4.15L6 6.38v4.72q0 1.483.438 2.84q.437 1.358 1.192 2.498q.755 1.139 1.785 1.99t2.198 1.299l.058-.02q.121.3.302.583q.18.283.41.531q-.102.039-.192.07t-.191.07ZM17 21q-1.671 0-2.836-1.164T13 17q0-1.671 1.164-2.836T17 13q1.671 0 2.836 1.164T21 17q0 1.671-1.164 2.836T17 21Zm-5-9.062Z"/></svg> }
            ].map(item => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginLeft: '4px',
                  marginBottom: item.key === 'privacy-data' ? '16px' : '4px',
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: activeTab === item.key ? '#2a2a2a' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease'
                }}
                onClick={() => setActiveTab(item.key)}
                onMouseEnter={(e) => {
                  if (activeTab !== item.key) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = '#2a2a2a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.key) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.icon}
                <span style={{ color: '#e5e5e5', fontWeight: '500', fontSize: '14px' }}>{item.label}</span>
              </div>
            ))}
            
            {/* Divider */}
            <div style={{ borderTop: '1px solid #303030', margin: '8px 0' }} />
            
            {/* Other Settings */}
            {[
              { key: 'connection', label: 'Connection', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Zm10 6h-4m0 0v4m0-4l4 4"/></svg> },
              { key: 'backup', label: 'Backup', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" style={{ color: '#e5e5e5' }}><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"><path d="M 239.98507,55.993592 A 111.98507,39.994664 0 0 1 128,95.988256 111.98507,39.994664 0 0 1 16.01493,55.993592 111.98507,39.994664 0 0 1 128,15.998927 111.98507,39.994664 0 0 1 239.98507,55.993592 Z"/><path d="m 239.98507,199.97441 a 111.98507,39.994664 0 0 1 -55.99253,34.63639 111.98507,39.994664 0 0 1 -111.985079,0 111.98507,39.994664 0 0 1 -55.992531,-34.6364"/><path d="m 239.98507,151.9808 a 111.98507,39.994664 0 0 1 -55.99253,34.6364 111.98507,39.994664 0 0 1 -111.985079,-1e-5 A 111.98507,39.994664 0 0 1 16.01493,151.9808"/><path d="m 239.98507,103.9872 a 111.98507,39.994664 0 0 1 -55.99253,34.6364 111.98507,39.994664 0 0 1 -111.985079,0 111.98507,39.994664 0 0 1 -55.992531,-34.6364"/><path d="M 16.01493,55.99377 V 199.97441"/><path d="M 239.98507,55.993592 V 199.97441"/></g></svg> },
              { key: 'subscription-plan', label: 'Subscription Plan', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" style={{ color: '#e5e5e5' }}><path fill="currentColor" d="M224 48H32a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16Zm0 16v24H32V64Zm0 128H32v-88h192v88Zm-16-24a8 8 0 0 1-8 8h-32a8 8 0 0 1 0-16h32a8 8 0 0 1 8 8Zm-64 0a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8Z"/></svg> },
              { key: 'system', label: 'System', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}><path fill="currentColor" d="M1 1h22v17H1V1Zm2 2v13h18V3H3Zm7.406 3.844L8.28 9.5l2.125 2.656l-1.562 1.25L5.719 9.5l3.125-3.906l1.562 1.25Zm4.75-1.25L18.281 9.5l-3.125 3.906l-1.562-1.25L15.72 9.5l-2.125-2.656l1.562-1.25ZM3.222 21h17.556v2H3.222v-2Z"/></svg> },
              { key: 'upgrade-premium', label: 'Upgrade to Premium', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" style={{ color: '#808080' }}><path fill="currentColor" d="M21 24H11a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 4H11v-2h10zm7.707-13.707l-12-12a1 1 0 0 0-1.414 0l-12 12A1 1 0 0 0 4 16h5v4a2.002 2.002 0 0 0 2 2h10a2.003 2.003 0 0 0 2-2v-4h5a1 1 0 0 0 .707-1.707zM21 14v6H11v-6H6.414L16 4.414L25.586 14z"/></svg>, isUpgrade: true }
            ].map(item => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginLeft: '4px',
                  marginBottom: '4px',
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: activeTab === item.key ? '#2a2a2a' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease'
                }}
                onClick={() => setActiveTab(item.key)}
                onMouseEnter={(e) => {
                  if (activeTab !== item.key) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = '#2a2a2a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.key) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.icon}
                <span style={{ 
                  color: item.isUpgrade ? '#808080' : '#e5e5e5', 
                  fontWeight: '500', 
                  fontSize: '14px' 
                }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Content Area */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#202020', 
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Scrollable Content */}
          <div className="custom-scrollbar" style={{ 
            flex: 1,
          padding: '24px', 
          overflowY: 'auto' 
        }}>
          {isLoading ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '200px',
              color: '#808080',
              fontSize: '14px'
            }}>
              Loading profile...
            </div>
          ) : error ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '200px',
              color: '#ef4444',
              fontSize: '14px'
            }}>
              Error: {error}
            </div>
          ) : (
            <>
              {activeTab === 'profile' && <ProfileSettings user={user} onUpdate={(updatedUser) => console.log('Updated user:', updatedUser)} updateProfile={updateProfile} />}
          {activeTab === 'preferences' && <PreferencesSettings user={user} onUpdate={(updatedUser) => console.log('Updated preferences:', updatedUser)} />}
          {activeTab === 'notifications' && <NotificationSettings user={user} onUpdate={(updatedUser) => console.log('Updated notifications:', updatedUser)} />}
          {activeTab === 'ai-models' && <AIModelsSettings user={user} onUpdate={(updatedUser) => console.log('Updated AI & Models:', updatedUser)} />}
          {activeTab === 'personal-assistant' && <PersonalAssistantSettings user={user} onUpdate={(updatedUser) => console.log('Updated Personal Assistant:', updatedUser)} />}
          {activeTab === 'privacy-data' && <PrivacyDataSettings user={user} onUpdate={(updatedUser) => console.log('Updated Privacy & Data:', updatedUser)} />}
          {activeTab === 'system' && <SystemSettings user={user} onUpdate={(updatedUser) => console.log('Updated System:', updatedUser)} />}
          {activeTab === 'subscription-plan' && <SubscriptionPlanSettings user={user} onUpdate={(updatedUser) => console.log('Updated Subscription:', updatedUser)} />}
          {activeTab === 'upgrade-premium' && <UpgradeToPremiumSettings user={user} onUpdate={(updatedUser) => console.log('Updated Premium:', updatedUser)} />}
          {activeTab === 'backup' && <BackupSettings user={user} onUpdate={(updatedUser) => console.log('Updated Backup:', updatedUser)} />}
          {activeTab === 'connection' && <ConnectionSettings user={user} onUpdate={(updatedUser) => console.log('Updated Connection:', updatedUser)} />}
            </>
          )}
        </div>
          
          {/* Save Button Area */}
          {hasUnsavedChanges ? (
            <div style={{
              borderTop: '1px solid #303030',
              padding: '16px 24px',
              backgroundColor: '#1a1a1a',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <div style={{ color: 'white', fontSize: '12px', marginRight: 'auto' }}>
                Debug: Save button should be visible
              </div>
              <button
                onClick={onClose}
                style={{
                  border: '1px solid #404040',
                  color: '#808080',
                  backgroundColor: 'transparent',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  border: 'none',
                  color: '#ffffff',
                  backgroundColor: isSaving ? '#404040' : '#007acc',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  transition: 'all 150ms ease',
                  opacity: isSaving ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#005a9e';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#007acc';
                  }
                }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div style={{
              borderTop: '1px solid #303030',
              padding: '16px 24px',
              backgroundColor: '#1a1a1a',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ color: '#808080', fontSize: '12px' }}>
                Debug: No unsaved changes - hasUnsavedChanges: {hasUnsavedChanges.toString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main export component that wraps with SettingsProvider
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <SettingsProvider>
      <SettingsModalContent isOpen={isOpen} onClose={onClose} />
    </SettingsProvider>
  );
}

export default SettingsModal;