import * as React from 'react';

interface Goal {
  id: string;
  title: string;
  status: 'not started' | 'in progress' | 'completed';
  date: Date;
  endDate?: Date;
  createdBy?: string;
}

const GoalTableList: React.FC = () => {
  // Sample goals data
  const [goals] = React.useState<Goal[]>([
    {
      id: '1',
      title: 'Learn React Development',
      status: 'in progress',
      date: new Date('2024-10-16'),
      endDate: new Date('2024-12-15'),
      createdBy: 'User'
    },
    {
      id: '2',
      title: 'Complete TypeScript Course',
      status: 'not started',
      date: new Date('2024-10-15'),
      endDate: new Date('2024-11-30'),
      createdBy: 'Lumi AI'
    },
    {
      id: '3',
      title: 'Build Portfolio Website',
      status: 'completed',
      date: new Date('2024-10-10'),
      endDate: new Date('2024-10-25'),
      createdBy: 'User'
    },
    {
      id: '4',
      title: 'Master Advanced JavaScript Concepts and ES6+ Features',
      status: 'in progress',
      date: new Date('2024-10-12'),
      endDate: new Date('2025-01-20'),
      createdBy: 'Lumi AI'
    },
    {
      id: '5',
      title: 'Launch Mobile App',
      status: 'completed',
      date: new Date('2024-10-08'),
      endDate: new Date('2024-10-22'),
      createdBy: 'User'
    },
    {
      id: '6',
      title: 'Learn Docker and Kubernetes for DevOps',
      status: 'not started',
      date: new Date('2024-10-20'),
      endDate: new Date('2025-02-15'),
      createdBy: 'Lumi AI'
    },
    {
      id: '7',
      title: 'Write Technical Blog Posts',
      status: 'in progress',
      date: new Date('2024-10-14'),
      endDate: new Date('2024-12-31'),
      createdBy: 'User'
    }
  ]);

  // Format date function
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Status configuration
  const statusConfig = {
    'not started': { color: '#6b7280', bgColor: '#374151', text: 'Not Started' },
    'in progress': { color: '#3b82f6', bgColor: '#1e40af', text: 'In Progress' },
    'completed': { color: '#10b981', bgColor: '#059669', text: 'Completed' }
  };
  return (
    <div style={{
      flex: 1,
      padding: '16px 72px',
      paddingTop: '0',
      marginTop: '24px',
      overflow: 'auto'
    }}>
      {/* Table Headers */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#202020',
        borderRadius: '8px',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#e5e5e5'
      }}>
        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024" style={{ color: '#e5e5e5' }}>
            <path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"/>
          </svg>
          Status
        </div>
        
        {/* Goal Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" style={{ color: '#e5e5e5' }}>
            <path fill="currentColor" d="m292.6 407.78l-120-320a22 22 0 0 0-41.2 0l-120 320a22 22 0 0 0 41.2 15.44l36.16-96.42a2 2 0 0 1 1.87-1.3h122.74a2 2 0 0 1 1.87 1.3l36.16 96.42a22 22 0 0 0 41.2-15.44Zm-185.84-129l43.37-115.65a2 2 0 0 1 3.74 0l43.37 115.67a2 2 0 0 1-1.87 2.7h-86.74a2 2 0 0 1-1.87-2.7ZM400.77 169.5c-41.72-.3-79.08 23.87-95 61.4a22 22 0 0 0 40.5 17.2c8.88-20.89 29.77-34.44 53.32-34.6c32.32-.22 58.41 26.5 58.41 58.85a1.5 1.5 0 0 1-1.45 1.5c-21.92.61-47.92 2.07-71.12 4.8c-54.75 6.44-87.43 36.29-87.43 79.85c0 23.19 8.76 44 24.67 58.68C337.6 430.93 358 438.5 380 438.5c31 0 57.69-8 77.94-23.22h.06a22 22 0 1 0 44 .19v-143c0-56.18-45-102.56-101.23-102.97ZM380 394.5c-17.53 0-38-9.43-38-36c0-10.67 3.83-18.14 12.43-24.23c8.37-5.93 21.2-10.16 36.14-11.92c21.12-2.49 44.82-3.86 65.14-4.47a2 2 0 0 1 2 2.1C455 370.1 429.46 394.5 380 394.5Z"/>
          </svg>
          Goal Title
        </div>
        
        {/* Date Created */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}>
            <path fill="currentColor" d="M19.5 4h-3V2.5a.5.5 0 0 0-1 0V4h-7V2.5a.5.5 0 0 0-1 0V4h-3A2.503 2.503 0 0 0 2 6.5v13A2.503 2.503 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 19.5 4M21 19.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5V11h18zm0-9.5H3V6.5C3 5.672 3.67 5 4.5 5h3v1.5a.5.5 0 0 0 1 0V5h7v1.5a.5.5 0 0 0 1 0V5h3A1.5 1.5 0 0 1 21 6.5z"/>
          </svg>
          Date Created
        </div>
        
        {/* Ending Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}>
            <path fill="currentColor" d="M19.5 4h-3V2.5a.5.5 0 0 0-1 0V4h-7V2.5a.5.5 0 0 0-1 0V4h-3A2.503 2.503 0 0 0 2 6.5v13A2.503 2.503 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 19.5 4M21 19.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5V11h18zm0-9.5H3V6.5C3 5.672 3.67 5 4.5 5h3v1.5a.5.5 0 0 0 1 0V5h7v1.5a.5.5 0 0 0 1 0V5h3A1.5 1.5 0 0 1 21 6.5z"/>
          </svg>
          Ending Date
        </div>
        
        {/* Created By */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}>
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinejoin="round" d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/>
              <circle cx="12" cy="7" r="3"/>
            </g>
          </svg>
          Created By
        </div>
      </div>
      
      {/* Table rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {goals.map((goal) => {
          const currentStatus = statusConfig[goal.status];
          return (
            <TableRow key={goal.id} goal={goal} currentStatus={currentStatus} formatDate={formatDate} />
          );
        })}
      </div>
    </div>
  );
};

// TableRow component with inline editing
const TableRow: React.FC<{ goal: Goal; currentStatus: any; formatDate: (date: Date) => string }> = ({ goal, currentStatus, formatDate }) => {
  const [editing, setEditing] = React.useState(false);
  const [goalTitle, setGoalTitle] = React.useState(goal.title);
  const [draftTitle, setDraftTitle] = React.useState(goal.title);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitEdit = () => {
    setGoalTitle(draftTitle.trim() || goalTitle);
    setEditing(false);
  };
  const cancelEdit = () => {
    setDraftTitle(goalTitle);
    setEditing(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#191919',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#e5e5e5',
        transition: 'background-color 150ms ease'
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#202020'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#191919'; }}
    >
      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: currentStatus.bgColor,
          borderRadius: '12px',
          padding: '4px 8px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#ffffff'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: currentStatus.color
          }} />
          {currentStatus.text}
        </div>
      </div>
      
      {/* Goal Title with inline editing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: 0 }}>
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
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e5e5e5',
              fontSize: '14px',
              fontWeight: '500',
              width: '100%'
            }}
          />
        ) : (
          <div
            style={{
              fontWeight: '500',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              padding: '2px 0',
              width: '100%'
            }}
            onClick={() => { setDraftTitle(goalTitle); setEditing(true); }}
          >
            {goalTitle}
          </div>
        )}
      </div>
      
      {/* Date Created */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1' }}>
        <span style={{ color: '#a3a3a3' }}>{formatDate(goal.date)}</span>
      </div>
      
      {/* Ending Date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1' }}>
        <span style={{ color: '#a3a3a3' }}>{goal.endDate ? formatDate(goal.endDate) : '-'}</span>
      </div>
      
      {/* Created By */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1' }}>
        <span style={{ color: '#a3a3a3' }}>{goal.createdBy || '-'}</span>
      </div>
    </div>
  );
};

export default GoalTableList;