import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import packageJson from '../../package.json';
import SettingsModal from './SettingsModal';
import { useProfile } from '../hooks/useProfile';

interface SidebarProps {
  collapsed?: boolean;
  onOpenSearch?: () => void;
  onLogout?: () => void;
  // Optional overrides for user data (if not provided, will use profile hook)
  userFullName?: string;
  userProfilePicture?: string;
  subscriptionPlan?: string;
}

function Tooltip({ label }: { label: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '100%',
        marginLeft: '8px',
        padding: '4px 8px',
        backgroundColor: '#252525',
        color: '#808080',
        fontSize: '12px',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {label}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '100%',
          width: '8px',
          height: '8px',
          transform: 'translateY(-50%) rotate(45deg)',
          backgroundColor: '#252525',
        }}
      />
    </div>
  );
}

function ItemContainer({ children, isExpanded }: { children: React.ReactNode; isExpanded: boolean }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      style={{ position: 'relative', marginBottom: '4px', paddingLeft: isExpanded ? '8px' : 0, paddingRight: isExpanded ? '8px' : 0, display: isExpanded ? 'block' : 'flex', justifyContent: isExpanded ? undefined : 'center' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child as any, { __hover: hover }) : child
      )}
    </div>
  );
}

function NavLinkItem({
  to,
  label,
  icon,
  isExpanded,
  active,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  active: boolean;
  __hover?: boolean;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {!isExpanded && hover && <Tooltip label={label} />}
      <Link
        to={to}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'flex-start' : 'center',
          padding: isExpanded ? '6px' : '4px',
          width: '100%',
          boxSizing: 'border-box',
          borderRadius: '8px',
          backgroundColor: active ? '#2a2a2a' : hover ? '#2a2a2a' : 'transparent',
          color: '#808080',
          textDecoration: 'none',
          transition: 'background-color 150ms ease',
          cursor: 'pointer',
        }}
      >
        <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
        {isExpanded && (
          <span style={{ color: '#808080', fontSize: '14px', fontWeight: 500, marginLeft: '8px' }}>{label}</span>
        )}
      </Link>
    </div>
  );
}

function ButtonItem({
  onClick,
  label,
  icon,
  isExpanded,
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  isExpanded: boolean;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {!isExpanded && hover && <Tooltip label={label} />}
      <button
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'flex-start' : 'center',
          padding: isExpanded ? '6px' : '4px',
          width: '100%',
          boxSizing: 'border-box',
          borderRadius: '8px',
          backgroundColor: hover ? '#2a2a2a' : 'transparent',
          color: '#808080',
          transition: 'background-color 150ms ease',
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
        }}
      >
        <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
        {isExpanded && (
          <span style={{ color: '#808080', fontSize: '14px', fontWeight: 500, marginLeft: '8px' }}>{label}</span>
        )}
      </button>
    </div>
  );
}

function TransparentHoverRow({ isExpanded, userFullName, userProfilePicture, onAction }: { isExpanded: boolean; userFullName?: string; userProfilePicture?: string; onAction?: () => void }) {
  const [hover, setHover] = React.useState(false);
  const initial = (userFullName?.trim()?.[0] || 'U').toUpperCase();
  return (
    <div style={{ paddingLeft: isExpanded ? 6 : 0, paddingRight: isExpanded ? 6 : 0, marginBottom: 4 }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          height: 32,
          width: '100%',
          borderRadius: 8,
          backgroundColor: hover ? '#2a2a2a' : 'transparent',
          transition: 'background-color 150ms ease',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 6,
          paddingRight: 6,
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          {userProfilePicture ? (
            <img
              src={userProfilePicture}
              alt={userFullName || 'User'}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0
              }}
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#2a2a2a',
              border: '1px solid #404040',
              color: '#ffffff',
              display: userProfilePicture ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0
            }}
          >
            {initial}
          </div>
          {isExpanded && (
            <span
              style={{
                color: '#808080',
                fontSize: 13,
                fontWeight: 600,
                marginLeft: 8,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              title={userFullName || 'User'}
            >
              {userFullName || 'User'}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onAction && onAction()}
          title="Open"
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            color: '#808080',
            background: 'transparent',
            border: 'none',
            padding: 4,
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="m12 19.164l6.207-6.207l-1.414-1.414L12 16.336l-4.793-4.793l-1.414 1.414L12 19.164Zm0-5.65l6.207-6.207l-1.414-1.414L12 10.686L7.207 5.893L5.793 7.307L12 13.514Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ collapsed = false, onOpenSearch, onLogout, userFullName, userProfilePicture, subscriptionPlan }: SidebarProps) {
  const isExpanded = !collapsed;
  const location = useLocation();
  const { user, isLoading } = useProfile();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [hoverUpdate, setHoverUpdate] = React.useState(false);
  const [hoverUpgrade, setHoverUpgrade] = React.useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const appVersion = (packageJson as any)?.version || '';

  // Use props if provided, otherwise fall back to profile data
  // Don't show "User" fallback while loading to prevent flickering
  const displayName = userFullName || user?.full_name || user?.email || (isLoading ? '' : 'User');
  const displayPicture = userProfilePicture || user?.profile_picture;
  const displayPlan = subscriptionPlan || 'Free';


  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
        `}
      </style>
    <aside
      style={{
        width: isExpanded ? '230px' : '40px',
        backgroundColor: '#202020',
        height: '100%',
        transition: 'width 150ms ease',
        boxSizing: 'border-box',
        paddingTop: '6px',
        borderRight: '1px solid #2a2a2a',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible'
      }}
> 
      {/* Hover container above Lumi AI */}
      {!isLoading || userFullName ? (
        <TransparentHoverRow isExpanded={isExpanded} userFullName={displayName} userProfilePicture={displayPicture} onAction={() => setUserMenuOpen((v) => !v)} />
      ) : (
        <div style={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          margin: '0 4px',
          borderRadius: 6,
          backgroundColor: 'transparent'
        }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: '#2a2a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#404040'
            }} />
          </div>
          {isExpanded && (
            <div style={{
              marginLeft: 8,
              width: 100,
              height: 16,
              backgroundColor: '#2a2a2a',
              borderRadius: 4,
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
          )}
        </div>
      )}

      {/* Inline user modal below profile row */}
      {isExpanded && userMenuOpen && (
        <>
          {/* Backdrop to handle clicks outside */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 19,
              backgroundColor: 'transparent'
            }}
            onClick={() => setUserMenuOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: 44,
              left: 6,
              width: 320,
              backgroundColor: '#202020',
              border: '1px solid #2a2a2a',
              borderRadius: 8,
              height: 'auto',
              zIndex: 20,
              boxSizing: 'border-box',
              overflow: 'visible'
            }}
          >
          <div style={{ display: 'flex', alignItems: 'center', padding: 8, gap: 8, borderBottom: '1px solid #2a2a2a' }}>
            {displayPicture ? (
              <img
                src={displayPicture}
                alt={displayName}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0
                }}
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#2a2a2a',
                border: '1px solid #404040',
                color: '#ffffff',
                display: displayPicture ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0
              }}
            >
              {(displayName?.trim()?.[0] || 'U').toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ color: '#e5e5e5', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={displayName}>
                {displayName}
              </span>
              <span style={{ color: '#808080', fontSize: 12, fontWeight: 500, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={displayPlan}>
                {displayPlan}
              </span>
            </div>
          </div>
          <div style={{ padding: 8, display: 'flex', gap: 8 }}>
            <button
              type="button"
              style={{
                flex: 1,
                height: 32,
                background: 'transparent',
                color: '#e5e5e5',
                border: '1px solid #2a2a2a',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
            >
              Settings
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                height: 32,
                background: 'transparent',
                color: '#e5e5e5',
                border: '1px solid #2a2a2a',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
            >
              Invite members
            </button>
          </div>
          <div style={{ padding: '0 8px 8px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              style={{
                height: 32,
                background: 'transparent',
                color: '#e5e5e5',
                border: '1px solid #2a2a2a',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
            >
              Create work account
            </button>
            <button
              type="button"
              style={{
                height: 32,
                background: 'transparent',
                color: '#e5e5e5',
                border: '1px solid #2a2a2a',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
            >
              Add another account
            </button>
            <button
              type="button"
              style={{
                height: 32,
                background: 'transparent',
                color: '#e5e5e5',
                border: '1px solid #2a2a2a',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
              onClick={() => {
                setUserMenuOpen(false);
                onLogout?.();
              }}
            >
              Log out
            </button>
          </div>
          </div>
        </>
      )}

      {/* Spacer below profile container */}
      <div style={{ height: 8 }} />

      {/* Lumi AI */}
      <ItemContainer isExpanded={isExpanded}>
        <NavLinkItem
          to="/lumi-ai"
          label="Lumi AI"
          isExpanded={isExpanded}
          active={location.pathname === '/lumi-ai'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: '#808080' }}>
              <g fill="none">
                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                <path fill="currentColor" d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"/>
              </g>
            </svg>
          }
        />
      </ItemContainer>

      {/* Search */}
      <ItemContainer isExpanded={isExpanded}>
        <ButtonItem
          onClick={() => onOpenSearch?.()}
          label="Search"
          isExpanded={isExpanded}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" style={{ color: '#808080' }}>
              <path fill="currentColor" d="M8.195 0c4.527 0 8.196 3.62 8.196 8.084a7.989 7.989 0 0 1-1.977 5.267l5.388 5.473a.686.686 0 0 1-.015.98a.71.71 0 0 1-.993-.014l-5.383-5.47a8.23 8.23 0 0 1-5.216 1.849C3.67 16.169 0 12.549 0 8.084C0 3.62 3.67 0 8.195 0Zm0 1.386c-3.75 0-6.79 2.999-6.79 6.698c0 3.7 3.04 6.699 6.79 6.699s6.791-3 6.791-6.699c0-3.7-3.04-6.698-6.79-6.698Z" />
            </svg>
          }
        />
      </ItemContainer>

      {/* Chat History */}
      <ItemContainer isExpanded={isExpanded}>
        <NavLinkItem
          to="/chat-history"
          label="Chat History"
          isExpanded={isExpanded}
          active={location.pathname === '/chat-history'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ color: '#808080' }}>
              <g fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"/>
              </g>
            </svg>
          }
        />
      </ItemContainer>

      {/* Notes */}
      <ItemContainer isExpanded={isExpanded}>
        <NavLinkItem
          to="/notes"
          label="Notes"
          isExpanded={isExpanded}
          active={location.pathname === '/notes'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ color: '#808080' }}>
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                <path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"/>
                <path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"/>
              </g>
            </svg>
          }
        />
      </ItemContainer>

      {/* Goals */}
      <ItemContainer isExpanded={isExpanded}>
        <NavLinkItem
          to="/goals"
          label="Goals"
          isExpanded={isExpanded}
          active={location.pathname === '/goals'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ color: '#808080' }}>
              <path fill="currentColor" d="M20.172 6.75h-1.861l-4.566 4.564a1.874 1.874 0 1 1-1.06-1.06l4.565-4.565V3.828a.94.94 0 0 1 .275-.664l1.73-1.73a.249.249 0 0 1 .25-.063c.089.026.155.1.173.191l.46 2.301l2.3.46c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.731 1.73a.937.937 0 0 1-.663.275Z"/>
              <path fill="currentColor" d="M2.625 12A9.375 9.375 0 0 0 12 21.375A9.375 9.375 0 0 0 21.375 12c0-.898-.126-1.766-.361-2.587A.75.75 0 0 1 22.455 9c.274.954.42 1.96.42 3c0 6.006-4.869 10.875-10.875 10.875S1.125 18.006 1.125 12S5.994 1.125 12 1.125c1.015-.001 2.024.14 3 .419a.75.75 0 1 1-.413 1.442A9.39 9.39 0 0 0 12 2.625A9.375 9.375 0 0 0 2.625 12Z"/>
              <path fill="currentColor" d="M7.125 12a4.874 4.874 0 1 0 9.717-.569a.748.748 0 0 1 1.047-.798c.251.112.42.351.442.625a6.373 6.373 0 0 1-10.836 5.253a6.376 6.376 0 0 1 5.236-10.844a.75.75 0 1 1-.17 1.49A4.876 4.876 0 0 0 7.125 12Z"/>
            </svg>
          }
        />
      </ItemContainer>

      {/* Reminders */}
      <ItemContainer isExpanded={isExpanded}>
        <NavLinkItem
          to="/reminders"
          label="Reminders"
          isExpanded={isExpanded}
          active={location.pathname === '/reminders'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" style={{ color: '#808080' }}>
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M37.275 32.678V21.47A13.27 13.27 0 0 0 27.08 8.569v-.985a3.102 3.102 0 0 0-6.203 0v.996a13.27 13.27 0 0 0-10.152 12.89v11.208L6.52 36.883v1.942h34.96v-1.942Zm-17.948 6.147a4.65 4.65 0 0 0 9.301.048v-.048"/>
            </svg>
          }
        />
      </ItemContainer>

      {/* Spacer after Reminders */}
      <div style={{ height: 8 }} />

      {/* Private section */}
      {isExpanded && (
        <div style={{ padding: '4px 8px', color: '#808080', fontSize: 11, fontWeight: 600, letterSpacing: 0.3 }}>
          Private
        </div>
      )}
      <ItemContainer isExpanded={isExpanded}>
        <NavLinkItem
          to="/home"
          label="Welcome to Lumi"
          isExpanded={isExpanded}
          active={location.pathname === '/home' || location.pathname === '/'}
          icon={
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <g fill="none">
                <path fill="#2859c5" fillRule="evenodd" d="M30.306 5.791a2 2 0 0 1 1.779-3.582c4.12 2.046 7.444 6.69 8.37 11.168a2 2 0 1 1-3.917.81c-.702-3.393-3.316-6.947-6.232-8.396m10.553-.368a2 2 0 1 1 3.192-2.41c1.965 2.602 2.978 6.376 2.484 9.318a2 2 0 0 1-3.945-.663c.293-1.742-.355-4.422-1.731-6.245M7.267 24.044a2 2 0 0 0-3.998.13c.15 4.598 2.992 9.55 6.68 12.254a2 2 0 1 0 2.365-3.226c-2.795-2.048-4.941-5.903-5.047-9.158M4.46 34.398a2 2 0 0 0-3.458 2.011c1.64 2.819 4.728 5.213 7.633 5.895a2 2 0 0 0 .914-3.894c-1.72-.404-3.941-2.038-5.09-4.012" clipRule="evenodd"/>
                <path fill="#8fbffa" d="M31.46 10.493c-.86-1.49-2.663-2.565-4.415-1.758a6 6 0 0 0-.494.255a8 8 0 0 0-.813.534c-1.383 1.029-1.284 2.834-.534 4.132l3.694 6.4a1.247 1.247 0 0 1-2.163 1.24a1661 1661 0 0 0-4.585-7.96c-.606-1.042-1.775-1.952-3.15-1.53a6.6 6.6 0 0 0-1.376.606q-.508.295-.902.588c-1.339.986-1.344 2.708-.61 4a707 707 0 0 0 4.79 8.236c.35.596.15 1.363-.449 1.708a1.24 1.24 0 0 1-1.694-.454l-2.916-5.05c-.597-1.035-1.773-1.957-3.14-1.452a7.4 7.4 0 0 0-1.139.541c-.34.197-.645.403-.915.608c-1.419 1.078-1.355 2.96-.565 4.327l4.923 8.528c1.433 2.494 3.616 5.507 5.853 8.03c3.14 3.537 8.078 4.016 12.192 1.84a74 74 0 0 0 2.392-1.324c2.379-1.373 4.068-2.509 5.22-3.356c1.496-1.1 2.614-2.603 3.303-4.312c1.94-4.818 2.896-10.203 3.294-12.986c.19-1.326-.037-2.806-1.069-3.84a8.7 8.7 0 0 0-1.473-1.18c-.933-.596-1.968-.598-2.852-.199c-.873.394-1.596 1.173-1.977 2.143a122 122 0 0 0-1.425 3.817z"/>
                <path fill="#2859c5" d="M37.278 20.57a1 1 0 0 0-.126.029c-3.898 1.13-7.886 5.091-6.69 10.472a1.25 1.25 0 1 0 2.44-.543c-.817-3.677 1.86-6.633 4.946-7.528c.246-.071.453-.211.606-.393z"/>
              </g>
            </svg>
          }
        />
      </ItemContainer>

      {/* Spacer below Insights */}
      <div style={{ height: 8 }} />

      {/* Settings */}
      <ItemContainer isExpanded={isExpanded}>
        <ButtonItem
          onClick={() => setSettingsModalOpen(true)}
          label="Settings"
          isExpanded={isExpanded}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
<path fill="#808080" fillRule="evenodd" d="M5.93 5.35A9 9 0 0 0 3.8 8.28L.9 7.34l-.62 1.9l2.9.95a9 9 0 0 0 0 3.62l-2.9.95l.62 1.9l2.9-.94a9 9 0 0 0 2.13 2.93l-1.8 2.47l1.63 1.18l1.8-2.47c1.03.59 2.2.98 3.44 1.12V24h2v-3.05a8.9 8.9 0 0 0 3.45-1.12l1.8 2.47l1.61-1.18l-1.8-2.47a9 9 0 0 0 2.14-2.93l2.9.94l.62-1.9l-2.9-.95a9 9 0 0 0 0-3.62l2.9-.95l-.62-1.9l-2.9.94a9 9 0 0 0-2.13-2.93l1.8-2.47l-1.63-1.18l-1.8 2.47A8.9 8.9 0 0 0 13 3.05V0h-2v3.05a8.9 8.9 0 0 0-3.45 1.12L5.75 1.7l-1.6 1.18l1.8 2.47zM12 19a7 7 0 1 1 0-14a7 7 0 0 1 0 14m4-7a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-6 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0" clipRule="evenodd"/>
            </svg>
          }
        />
      </ItemContainer>

      <div style={{ flex: 1 }} />

      {/* Bottom icons */}
      {isExpanded && (
      <div style={{ padding: '6px 6px 8px 6px' }}>
        {/* Upgrade to premium */}
        <div
          onMouseEnter={() => setHoverUpgrade(true)}
          onMouseLeave={() => setHoverUpgrade(false)}
          style={{ width: 'auto', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: 6, borderRadius: 8, backgroundColor: hoverUpgrade ? '#2a2a2a' : 'transparent', cursor: 'pointer', marginLeft: -6, marginRight: -6 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 32 32">
            <path fill="#808080" d="M21 24H11a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 4H11v-2h10zm7.707-13.707l-12-12a1 1 0 0 0-1.414 0l-12 12A1 1 0 0 0 4 16h5v4a2.002 2.002 0 0 0 2 2h10a2.003 2.003 0 0 0 2-2v-4h5a1 1 0 0 0 .707-1.707zM21 14v6H11v-6H6.414L16 4.414L25.586 14z"/>
          </svg>
          <span style={{ color: '#e5e5e5', fontSize: 14, fontWeight: 700 }}>Upgrade to premium</span>
        </div>

        {/* Check for updates (with text) */}
        <div
          onMouseEnter={() => setHoverUpdate(true)}
          onMouseLeave={() => setHoverUpdate(false)}
          style={{ width: 'auto', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: 6, borderRadius: 8, backgroundColor: hoverUpdate ? '#2a2a2a' : 'transparent', cursor: 'pointer', marginLeft: -6, marginRight: -6 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16">
            <path fill="#808080" d="M7.46 2a5.52 5.52 0 0 0-3.91 1.61a5.44 5.44 0 0 0-1.54 2.97a.503.503 0 0 1-.992-.166a6.514 6.514 0 0 1 6.44-5.41a6.55 6.55 0 0 1 4.65 1.93l1.89 2.21v-2.64a.502.502 0 0 1 1.006 0v4a.5.5 0 0 1-.503.5h-3.99a.5.5 0 0 1-.503-.5c0-.275.225-.5.503-.5h2.91l-2.06-2.4a5.53 5.53 0 0 0-3.9-1.6zm1.09 12a5.52 5.52 0 0 0 3.91-1.61A5.44 5.44 0 0 0 14 9.42a.504.504 0 0 1 .992.166a6.514 6.514 0 0 1-6.44 5.41a6.55 6.55 0 0 1-4.65-1.93l-1.89-2.21v2.64a.501.501 0 0 1-.858.353a.5.5 0 0 1-.148-.354v-4c0-.276.225-.5.503-.5H5.5c.278 0 .503.224.503.5s-.225.5-.503.5H2.59l2.06 2.4a5.53 5.53 0 0 0 3.9 1.6z"/>
          </svg>
          <span style={{ color: '#808080', fontSize: 14, fontWeight: 600 }}>Check for updates</span>
          <span style={{ marginLeft: 'auto', color: '#808080', fontSize: 12 }}>v{appVersion}</span>
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            alignItems: 'center',
            gap: isExpanded ? '12px' : '8px',
            borderRadius: '8px',
            padding: isExpanded ? '6px' : '4px',
            cursor: 'default'
          }}
        >
          {/* Help */}
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" style={{ color: '#808080' }}>
              <g fill="currentColor">
                <path d="M8 15c-3.86 0-7-3.14-7-7s3.14-7 7-7s7 3.14 7 7s-3.14 7-7 7ZM8 2C4.69 2 2 4.69 2 8s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6Z"/>
                <path d="M8 4.5c-1.11 0-2 .89-2 2h1c0-.55.45-1 1-1s1 .45 1 1c0 1-1.5.88-1.5 2.5h1c0-1.12 1.5-1.25 1.5-2.5c0-1.11-.89-2-2-2Z"/>
                <circle cx="8" cy="11" r=".62"/>
                <circle cx="6.5" cy="6.5" r=".5"/>
                <circle cx="8" cy="9" r=".5"/>
              </g>
            </svg>
          </div>

          {/* Changelog */}
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" style={{ color: '#808080' }}>
              <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
                <path d="M13 10h28v34H13z"/>
                <path strokeLinecap="round" d="M35 10V4H8a1 1 0 0 0-1 1v33h6m8-16h12m-12 8h12"/>
              </g>
            </svg>
          </div>

        </div>
      </div>
      )}
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)} 
      />
    </aside>
    </>
  );
}
