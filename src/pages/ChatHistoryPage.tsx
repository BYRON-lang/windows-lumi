import * as React from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ChatHistoryList from '../components/ChatHistoryList';
import SearchModal from '../components/SearchModal';

export default function ChatHistoryPage() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'all' | 'archive'>('all');
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [searchModalOpen, setSearchModalOpen] = React.useState(false);
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#191919',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '0'
    }}>
      <TopBar background="#202020" borderBottom="1px solid #2a2a2a" hideBorderLeftPx={collapsed ? 0 : 230} onToggleSidebar={setCollapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', padding: '0' }}>
        <Sidebar collapsed={collapsed} onOpenSearch={() => setSearchModalOpen(true)} />
        <div style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 9999,
                backgroundColor: '#2a2a2a',
                border: '1px solid #333',
                color: '#e5e5e5',
                userSelect: 'none'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}>
                <g fill="none">
                  <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
                  <path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10H4a2 2 0 0 1-2-2v-8C2 6.477 6.477 2 12 2Zm0 2a8 8 0 0 0-8 8v8h8a8 8 0 1 0 0-16Zm0 10a1 1 0 0 1 .117 1.993L12 16H9a1 1 0 0 1-.117-1.993L9 14h3Zm3-4a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h6Z"/>
                </g>
              </svg>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Chats History</span>
            </div>
          </div>
          <div style={{ padding: '0 12px' }}>
            <div style={{ marginTop: 40, marginLeft: 72, color: '#e5e5e5', fontSize: 46, fontWeight: 700 }}>
              Chats History
            </div>
            <div style={{ marginTop: 4, marginLeft: 72, color: '#ffffff', fontSize: 14, lineHeight: 1.5, maxWidth: 760 }}>
              Browse all your conversations—recent and old—in one place. Quickly revisit answers,<br />
              pick up where you left off, or find past reminders and notes without losing context.
            </div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 72px', color: '#e5e5e5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 9999,
                    backgroundColor: activeTab === 'all' ? '#2a2a2a' : 'transparent',
                    border: activeTab === 'all' ? '1px solid #333' : '1px solid transparent',
                    color: activeTab === 'all' ? '#e5e5e5' : '#808080',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: activeTab === 'all' ? '#e5e5e5' : '#808080' }}>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01"/>
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>All Chats</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('archive')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 9999,
                    backgroundColor: activeTab === 'archive' ? '#2a2a2a' : 'transparent',
                    border: activeTab === 'archive' ? '1px solid #333' : '1px solid transparent',
                    color: activeTab === 'archive' ? '#e5e5e5' : '#808080',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 472" style={{ color: activeTab === 'archive' ? '#e5e5e5' : '#808080' }}>
                    <path fill="currentColor" d="M469 3H43Q25 3 12.5 15.5T0 45v86q0 9 6 15t15 6h22v235q0 17 12.5 29.5T85 429h342q17 0 29.5-12.5T469 387V152h22q9 0 15-6t6-15V45q0-17-12.5-29.5T469 3zM85 387V152h342v235H85zm384-278H43V45h426v64zm-140 90q-32 24-73 24t-73-24q-6-5-15.5-3.5T154 203q-5 7-4 16.5t8 13.5q46 32 98 32t98-32q7-4 8-13.5t-4-16.5q-4-6-13.5-7.5T329 199z"/>
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Archive Chats</span>
                </button>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  title="List"
style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid transparent', cursor: 'pointer', borderRadius: 6 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 21 21" style={{ color: '#e5e5e5' }}>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h12m-10 3h8m-6 3h4"/>
                  </svg>
                </button>
                <button
                  type="button"
                  title="Move"
style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid transparent', cursor: 'pointer', borderRadius: 6 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}>
                    <path fill="currentColor" d="M6.293 4.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L8 7.414V19a1 1 0 1 1-2 0V7.414L3.707 9.707a1 1 0 0 1-1.414-1.414l4-4zM16 16.586V5a1 1 0 1 1 2 0v11.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L16 16.586z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  title="Search"
                  style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid transparent', cursor: 'pointer', borderRadius: 6 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                  onClick={() => setShowSearch((v) => !v)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"/>
                  </svg>
                </button>
                <div
                  style={{
                    width: showSearch ? 220 : 0,
                    marginLeft: 6,
                    overflow: 'hidden',
                    transition: 'width 200ms ease'
                  }}
                >
                  <input
                    autoFocus={showSearch}
                    placeholder="Search anything"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                      width: 220,
                      height: 24,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#e5e5e5',
                      fontSize: 14,
                      transform: showSearch ? 'translateX(0)' : 'translateX(8px)',
                      opacity: showSearch ? 1 : 0,
                      transition: 'opacity 180ms ease, transform 180ms ease'
                    }}
                  />
                </div>
                <button
                  type="button"
                  title="Filter"
style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid transparent', cursor: 'pointer', borderRadius: 6 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                >
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div style={{ padding: '12px 12px 12px 0' }}>
            <ChatHistoryList />
          </div>
        </div>
      </div>
      <SearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </div>
  );
}
