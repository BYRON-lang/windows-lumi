import * as React from 'react';

interface CommandCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function CommandCard({ title, icon, onClick }: CommandCardProps) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        height: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'flex-start',
        padding: '0 14px',
        borderRadius: 9999,
        background: hover ? '#2a2a2a' : 'linear-gradient(180deg, #232323 0%, #1f1f1f 100%)',
        border: '1px solid #2a2a2a',
        color: '#e5e5e5',
        cursor: 'pointer',
        transition: 'background-color 150ms ease, border-color 150ms ease'
      }}
      title={title}
    >
      <span style={{ display: 'inline-flex', color: '#a3a3a3' }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
    </button>
  );
}
