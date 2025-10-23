import * as React from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import SearchModal from '../components/SearchModal';
import LumiAI from './LumiAI';

export default function LumiAIPage() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

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
        <Sidebar 
          collapsed={collapsed} 
          onOpenSearch={() => setSearchOpen(true)} 
        />
        <div style={{ flex: 1, padding: '0' }}>
          <LumiAI />
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
