import * as React from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import SearchModal from '../components/SearchModal';
import { useAuthService } from '../services/authService';
import { useProfile } from '../hooks/useProfile';

interface HomeProps {
  onLogout: () => void;
}

export default function Home({ onLogout }: HomeProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [welcomeHover, setWelcomeHover] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const authService = useAuthService();
  const { user, isLoading: profileLoading } = useProfile();

  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      onLogout(); // Force logout even if there's an error
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#191919',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '0',
      position: 'relative'
    }}>
      <TopBar background="#202020" borderBottom="1px solid #2a2a2a" hideBorderLeftPx={collapsed ? 0 : 230} onToggleSidebar={setCollapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', padding: '0' }}>
        <Sidebar 
          collapsed={collapsed} 
          onOpenSearch={() => setSearchOpen(true)} 
          onLogout={handleLogout}
        />
        <div style={{ flex: 1, padding: '0', position: 'relative' }}>
          {/* Top Left Welcome to Lumi Icon */}
          <div 
            onMouseEnter={() => setWelcomeHover(true)}
            onMouseLeave={() => setWelcomeHover(false)}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 10,
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: welcomeHover ? '#2a2a2a' : 'transparent',
              transition: 'background-color 150ms ease',
              cursor: 'pointer'
            }}>
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <g fill="none">
                <path fill="#2859c5" fillRule="evenodd" d="M30.306 5.791a2 2 0 0 1 1.779-3.582c4.12 2.046 7.444 6.69 8.37 11.168a2 2 0 1 1-3.917.81c-.702-3.393-3.316-6.947-6.232-8.396m10.553-.368a2 2 0 1 1 3.192-2.41c1.965 2.602 2.978 6.376 2.484 9.318a2 2 0 0 1-3.945-.663c.293-1.742-.355-4.422-1.731-6.245M7.267 24.044a2 2 0 0 0-3.998.13c.15 4.598 2.992 9.55 6.68 12.254a2 2 0 1 0 2.365-3.226c-2.795-2.048-4.941-5.903-5.047-9.158M4.46 34.398a2 2 0 0 0-3.458 2.011c1.64 2.819 4.728 5.213 7.633 5.895a2 2 0 0 0 .914-3.894c-1.72-.404-3.941-2.038-5.09-4.012" clipRule="evenodd"/>
                <path fill="#8fbffa" d="M31.46 10.493c-.86-1.49-2.663-2.565-4.415-1.758a6 6 0 0 0-.494.255a8 8 0 0 0-.813.534c-1.383 1.029-1.284 2.834-.534 4.132l3.694 6.4a1.247 1.247 0 0 1-2.163 1.24a1661 1661 0 0 0-4.585-7.96c-.606-1.042-1.775-1.952-3.15-1.53a6.6 6.6 0 0 0-1.376.606q-.508.295-.902.588c-1.339.986-1.344 2.708-.61 4a707 707 0 0 0 4.79 8.236c.35.596.15 1.363-.449 1.708a1.24 1.24 0 0 1-1.694-.454l-2.916-5.05c-.597-1.035-1.773-1.957-3.14-1.452a7.4 7.4 0 0 0-1.139.541c-.34.197-.645.403-.915.608c-1.419 1.078-1.355 2.96-.565 4.327l4.923 8.528c1.433 2.494 3.616 5.507 5.853 8.03c3.14 3.537 8.078 4.016 12.192 1.84a74 74 0 0 0 2.392-1.324c2.379-1.373 4.068-2.509 5.22-3.356c1.496-1.1 2.614-2.603 3.303-4.312c1.94-4.818 2.896-10.203 3.294-12.986c.19-1.326-.037-2.806-1.069-3.84a8.7 8.7 0 0 0-1.473-1.18c-.933-.596-1.968-.598-2.852-.199c-.873.394-1.596 1.173-1.977 2.143a122 122 0 0 0-1.425 3.817z"/>
                <path fill="#2859c5" d="M37.278 20.57a1 1 0 0 0-.126.029c-3.898 1.13-7.886 5.091-6.69 10.472a1.25 1.25 0 1 0 2.44-.543c-.817-3.677 1.86-6.633 4.946-7.528c.246-.071.453-.211.606-.393z"/>
              </g>
            </svg>
            <span style={{
              color: '#e5e5e5',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Welcome to Lumi
            </span>
          </div>

          
          {/* Tutorial Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 100px)',
            padding: '0 40px'
          }}>
            {/* Wave Emoji */}
            <div style={{
              fontSize: '64px',
              marginBottom: '24px'
            }}>
              👋
            </div>
            
            {/* Main Title */}
            <h1 style={{
              color: '#e5e5e5',
              fontSize: '48px',
              fontWeight: '700',
              margin: '0 0 32px 0',
              textAlign: 'center'
            }}>
              Welcome to Lumi!
            </h1>
            
            {/* Checklist Items */}
            <div style={{
              maxWidth: '600px',
              width: '100%'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
                color: '#e5e5e5',
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                <span style={{
                  color: '#3b82f6',
                  fontSize: '18px',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>☑</span>
                <span>
                  <strong>Start with Lumi AI</strong> - Click <strong>Lumi AI</strong> in the sidebar to chat with your personal assistant
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
                color: '#a3a3a3',
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                <span style={{
                  fontSize: '18px',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>☐</span>
                <span>
                  Ask Lumi to <strong>"Create a goal to exercise 3 times this week"</strong> to get started with goal tracking
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
                color: '#a3a3a3',
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                <span style={{
                  fontSize: '18px',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>☐</span>
                <span>
                  Try <strong>"Set a reminder to call mom tomorrow at 3 PM"</strong> to never miss important tasks
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '32px',
                color: '#a3a3a3',
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                <span style={{
                  fontSize: '18px',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>☐</span>
                <span>
                  Use <strong>"Write a note about today's meeting"</strong> to capture and organize your thoughts
                </span>
              </div>
              
              {/* Toggle Block */}
              <div style={{
                color: '#a3a3a3',
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer'
                }}>
                  <span style={{
                    fontSize: '14px'
                  }}>▶</span>
                  <span>
                    <strong>More ways to use Lumi</strong> - Click to see additional features and tips!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
