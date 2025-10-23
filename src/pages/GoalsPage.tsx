import * as React from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import GoalBoardList from '../components/GoalBoardList';
import GoalTableList from '../components/GoalTableList';
import SearchModal from '../components/SearchModal';

const GoalsPage: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'board' | 'all'>('board');
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
                <path fill="currentColor" d="M20.172 6.75h-1.861l-4.566 4.564a1.874 1.874 0 1 1-1.06-1.06l4.565-4.565V3.828a.94.94 0 0 1 .275-.664l1.73-1.73a.249.249 0 0 1 .25-.063c.089.026.155.1.173.191l.46 2.301l2.3.46c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.731 1.73a.937.937 0 0 1-.663.275Z"/>
                <path fill="currentColor" d="M2.625 12A9.375 9.375 0 0 0 12 21.375A9.375 9.375 0 0 0 21.375 12c0-.898-.126-1.766-.361-2.587A.75.75 0 0 1 22.455 9c.274.954.42 1.96.42 3c0 6.006-4.869 10.875-10.875 10.875S1.125 18.006 1.125 12S5.994 1.125 12 1.125c1.015-.001 2.024.14 3 .419a.75.75 0 1 1-.413 1.442A9.39 9.39 0 0 0 12 2.625A9.375 9.375 0 0 0 2.625 12Z"/>
                <path fill="currentColor" d="M7.125 12a4.874 4.874 0 1 0 9.717-.569a.748.748 0 0 1 1.047-.798c.251.112.42.351.442.625a6.373 6.373 0 0 1-10.836 5.253a6.376 6.376 0 0 1 5.236-10.844a.75.75 0 1 1-.17 1.49A4.876 4.876 0 0 0 7.125 12Z"/>
              </svg>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Goals</span>
            </div>
          </div>
          <div style={{ padding: '0 12px' }}>
            <div style={{ marginTop: 40, marginLeft: 72, color: '#e5e5e5', fontSize: 46, fontWeight: 700 }}>
              Goals
            </div>
            <div style={{ marginTop: 4, marginLeft: 72, color: '#ffffff', fontSize: 14, lineHeight: 1.5, maxWidth: 760 }}>
              Set and track your personal and professional goals. Stay organized and motivated<br />
              as you work towards achieving your objectives and milestones.
            </div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 72px', color: '#e5e5e5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('board')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 9999,
                    backgroundColor: activeTab === 'board' ? '#2a2a2a' : 'transparent',
                    border: activeTab === 'board' ? '1px solid #333' : '1px solid transparent',
                    color: activeTab === 'board' ? '#e5e5e5' : '#808080',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: activeTab === 'board' ? '#e5e5e5' : '#808080' }}>
                    <path fill="currentColor" d="M4 5v13h17V5H4m10 2v9h-3V7h3M6 7h3v9H6V7m13 9h-3V7h3v9Z"/>
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Goal Board</span>
                </button>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" style={{ color: activeTab === 'all' ? '#e5e5e5' : '#808080' }}>
                    <path fill="currentColor" d="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8ZM40 112h40v32H40Zm56 0h120v32H96Zm120-48v32H40V64ZM40 160h40v32H40Zm176 32H96v-32h120v32Z"/>
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>All Goals</span>
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
                    placeholder="Search goals"
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
          
          <div style={{ padding: '0 12px 12px 0', flex: 1 }}>
            {activeTab === 'board' ? <GoalBoardList /> : <GoalTableList />}
          </div>
        </div>
      </div>
      <SearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </div>
  );
};

export default GoalsPage;
