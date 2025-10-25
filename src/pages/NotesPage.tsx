import * as React from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import NotesList from '../components/NotesList';
import NewNotes from '../components/NewNotes';

const NotesPage: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'all' | 'recent'>('all');
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [showNewNotes, setShowNewNotes] = React.useState(false);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#191919',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '0',
    }}>
      <TopBar background="#202020" borderBottom="1px solid #2a2a2a" hideBorderLeftPx={collapsed ? 0 : 230} onToggleSidebar={setCollapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', padding: '0' }}>
        <Sidebar collapsed={collapsed} />
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
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Notes</span>
            </div>
          </div>
          <div style={{ padding: '0 12px' }}>
            <div style={{ marginTop: 40, marginLeft: 72, color: '#e5e5e5', fontSize: 46, fontWeight: 700 }}>
              Notes
            </div>
            <div style={{ marginTop: 4, marginLeft: 72, color: '#ffffff', fontSize: 14, lineHeight: 1.5, maxWidth: 760 }}>
              Capture ideas, meeting notes, and important information in one place.<br />
              Keep your thoughts organized and easily searchable.
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
                  <span style={{ fontSize: 14, fontWeight: 600 }}>All Notes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('recent')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 9999,
                    backgroundColor: activeTab === 'recent' ? '#2a2a2a' : 'transparent',
                    border: activeTab === 'recent' ? '1px solid #333' : '1px solid transparent',
                    color: activeTab === 'recent' ? '#e5e5e5' : '#808080',
                    cursor: 'pointer'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: activeTab === 'recent' ? '#e5e5e5' : '#808080' }}>
                    <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3Z"/>
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Recent</span>
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
                  title="Sort"
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
                    placeholder="Search notes"
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
                <button
                  type="button"
                  onClick={() => setShowNewNotes(true)}
                  style={{
                    marginLeft: '12px',
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background-color 150ms ease'
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563eb'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3b82f6'; }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                  </svg>
                  New
                </button>
              </div>
            </div>
          </div>
          
          {/* Content area - ready for notes functionality */}
          <div style={{ padding: '0 12px 12px 0', flex: 1 }}>
            <NotesList />
          </div>
        </div>
      </div>
      <NewNotes isOpen={showNewNotes} onClose={() => setShowNewNotes(false)} />
    </div>
  );
};

export default NotesPage;