import * as React from 'react';

interface ListRowProps {
  title: string;
  date?: Date | string | number;
}

function formatDate(d?: Date | string | number) {
  const date = d ? new Date(d) : new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = days[date.getDay()];
  const dd = date.getDate();
  const mon = months[date.getMonth()];
  const yyyy = date.getFullYear();
  return `${day} ${dd} ${mon} ${yyyy}`;
}

function ListRow({ title, date }: ListRowProps) {
  const [hover, setHover] = React.useState(false); // controls left action icons and row background
  const [contentHover, setContentHover] = React.useState(false); // controls mid hover only
  const [editing, setEditing] = React.useState(false);
  const [currentTitle, setCurrentTitle] = React.useState(title);
  const [draftTitle, setDraftTitle] = React.useState(title);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitEdit = () => {
    setCurrentTitle(draftTitle.trim() || currentTitle);
    setEditing(false);
  };
  const cancelEdit = () => {
    setDraftTitle(currentTitle);
    setEditing(false);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        height: 48,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 38,
        paddingRight: 8,
        color: '#e5e5e5',
        backgroundColor: hover ? '#1a1a1a' : 'transparent',
        transition: 'background-color 150ms ease',
        borderRadius: 6
      }}
    >
      {/* Left hover action icons */}
      <div
        style={{
          position: 'absolute',
          left: 6,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          opacity: hover ? 1 : 0,
          transition: 'opacity 150ms ease',
          pointerEvents: hover ? 'auto' : 'none'
        }}
      >
        <button
          type="button"
          title="Delete"
          style={{
            width: 28,
            height: 28,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" style={{ color: '#e5e5e5' }}>
            <path fill="currentColor" d="m9.129 0l1.974.005c.778.094 1.46.46 2.022 1.078c.459.504.7 1.09.714 1.728h5.475a.69.69 0 0 1 .686.693a.689.689 0 0 1-.686.692l-1.836-.001v11.627c0 2.543-.949 4.178-3.041 4.178H5.419c-2.092 0-3.026-1.626-3.026-4.178V4.195H.686A.689.689 0 0 1 0 3.505c0-.383.307-.692.686-.692h5.47c.014-.514.205-1.035.554-1.55C7.23.495 8.042.074 9.129 0Zm6.977 4.195H3.764v11.627c0 1.888.52 2.794 1.655 2.794h9.018c1.139 0 1.67-.914 1.67-2.794l-.001-11.627ZM6.716 6.34c.378 0 .685.31.685.692v8.05a.689.689 0 0 1-.686.692a.689.689 0 0 1-.685-.692v-8.05c0-.382.307-.692.685-.692Zm2.726 0c.38 0 .686.31.686.692v8.05a.689.689 0 0 1-.686.692a.689.689 0 0 1-.685-.692v-8.05c0-.382.307-.692.685-.692Zm2.728 0c.378 0 .685.31.685.692v8.05a.689.689 0 0 1-.685.692a.689.689 0 0 1-.686-.692v-8.05a.69.69 0 0 1 .686-.692ZM9.176 1.382c-.642.045-1.065.264-1.334.662c-.198.291-.297.543-.313.768l4.938-.001c-.014-.291-.129-.547-.352-.792c-.346-.38-.73-.586-1.093-.635l-1.846-.002Z"/>
          </svg>
        </button>
        <button
          type="button"
          title="Archive"
          style={{
            width: 28,
            height: 28,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" style={{ color: '#e5e5e5' }}>
            <path fill="currentColor" d="M13 14a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-6ZM3 6a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v2a2.99 2.99 0 0 1-1 2.236V23.5a5.5 5.5 0 0 1-5.5 5.5h-13A5.5 5.5 0 0 1 4 23.5V10.236C3.386 9.686 3 8.888 3 8V6Zm3 5v12.5A3.5 3.5 0 0 0 9.5 27h13a3.5 3.5 0 0 0 3.5-3.5V11H6Zm0-6a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6Z"/>
          </svg>
        </button>
        <button
          type="button"
          title="Lock"
          style={{
            width: 28,
            height: 28,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}>
            <path fill="currentColor" d="M17 9V7c0-2.8-2.2-5-5-5S7 4.2 7 7v2c-1.7 0-3 1.3-3 3v7c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3v-7c0-1.7-1.3-3-3-3zM9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9V7z"/>
          </svg>
        </button>
      </div>
      {/* Mid content hover area (does not affect left controls) */}
      <div
        onMouseEnter={() => setContentHover(true)}
        onMouseLeave={() => setContentHover(false)}
        style={{
          flex: 1,
          minWidth: 0,
          marginLeft: 64,
          marginRight: 72,
          padding: '6px 8px',
          borderRadius: 8,
          backgroundColor: contentHover ? '#2a2a2a' : 'transparent',
          transition: 'background-color 150ms ease',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {editing ? (
            <input
              ref={inputRef}
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              style={{
                maxWidth: '60%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e5e5e5',
                fontSize: 14,
                fontWeight: 600
              }}
              placeholder="Edit title"
            />
          ) : (
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e5e5e5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentTitle}
            </div>
          )}
          <button
            type="button"
            title="Rename"
            style={{ width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: 6, flexShrink: 0, cursor: 'pointer', padding: 0, opacity: contentHover || editing ? 1 : 0, pointerEvents: contentHover || editing ? 'auto' : 'none', transition: 'opacity 150ms ease, background-color 150ms ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3a3a3a'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
            onClick={() => { setDraftTitle(currentTitle); setEditing(true); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}>
              <path fill="currentColor" d="M3.548 20.938h16.9a.5.5 0 0 0 0-1h-16.9a.5.5 0 0 0 0 1ZM9.71 17.18a2.587 2.587 0 0 0 1.12-.65l9.54-9.54a1.75 1.75 0 0 0 0-2.47l-.94-.93a1.788 1.788 0 0 0-2.47 0l-9.54 9.53a2.473 2.473 0 0 0-.64 1.12L6.04 17a.737.737 0 0 0 .19.72a.767.767 0 0 0 .53.22Zm.41-1.36a1.468 1.468 0 0 1-.67.39l-.97.26l-1-1l.26-.97a1.521 1.521 0 0 1 .39-.67l.38-.37l1.99 1.99Zm1.09-1.08l-1.99-1.99l6.73-6.73l1.99 1.99Zm8.45-8.45L18.65 7.3l-1.99-1.99l1.01-1.02a.748.748 0 0 1 1.06 0l.93.94a.754.754 0 0 1 0 1.06Z"/>
            </svg>
          </button>
        </div>
        <div style={{ marginLeft: 'auto', color: '#a3a3a3', fontSize: 12, fontWeight: 500 }}>
          {formatDate(date)}
        </div>
      </div>
    </div>
  );
}

interface ChatItem { id: string; title: string; date?: Date | string | number }
interface ChatHistoryListProps { items?: ChatItem[] }

export default function ChatHistoryList({ items }: ChatHistoryListProps) {
  const list: ChatItem[] = items && items.length > 0 ? items : [{ id: '1', title: 'Chat title', date: new Date() }];
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {list.map((it) => (
        <ListRow key={it.id} title={it.title} date={it.date} />
      ))}
    </div>
  );
}
