import * as React from 'react';

interface Goal {
  id: string;
  title: string;
  status: 'not started' | 'in progress' | 'completed';
  date: Date;
}

const GoalBoardList: React.FC = () => {
  // Sample goals data
  const [goals] = React.useState<Goal[]>([
    {
      id: '1',
      title: 'Learn React Development',
      status: 'in progress',
      date: new Date('2024-10-16')
    },
    {
      id: '2',
      title: 'Complete TypeScript Course',
      status: 'not started',
      date: new Date('2024-10-15')
    },
    {
      id: '3',
      title: 'Build Portfolio Website',
      status: 'completed',
      date: new Date('2024-10-10')
    },
    {
      id: '4',
      title: 'Master Advanced JavaScript Concepts and ES6+ Features',
      status: 'in progress',
      date: new Date('2024-10-12')
    },
    {
      id: '5',
      title: 'Launch Mobile App',
      status: 'completed',
      date: new Date('2024-10-08')
    },
    {
      id: '6',
      title: 'Learn Docker and Kubernetes for DevOps',
      status: 'not started',
      date: new Date('2024-10-20')
    },
    {
      id: '7',
      title: 'Write Technical Blog Posts',
      status: 'in progress',
      date: new Date('2024-10-14')
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
      overflow: 'auto',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      justifyContent: 'flex-start'
    }}>
      {goals.map((goal) => {
        const currentStatus = statusConfig[goal.status];
        return (
          <GoalCard key={goal.id} goal={goal} currentStatus={currentStatus} formatDate={formatDate} />
        );
      })}
    </div>
  );
};

// GoalCard component
const GoalCard: React.FC<{ goal: Goal; currentStatus: any; formatDate: (date: Date) => string }> = ({ goal, currentStatus, formatDate }) => {
  const [isHovered, setIsHovered] = React.useState(false);
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
    <div style={{
      width: 'calc(20% - 12.8px)',
      flex: '0 0 auto',
      height: '150px',
      backgroundColor: '#202020',
      borderRadius: '12px',
      padding: '16px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
        {/* Status pill */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: currentStatus.bgColor,
          borderRadius: '12px',
          padding: '4px 8px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {/* Circle dot */}
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: currentStatus.color
          }} />
          {currentStatus.text}
        </div>
        
        {/* Border-only container below the pill */}
        <div 
          style={{
            width: '100%',
            height: '70px',
            border: `1px solid ${isHovered ? '#555' : '#333'}`,
            borderRadius: '8px',
            marginTop: '40px',
            backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Goal name in top-left with edit functionality */}
          <div style={{
            padding: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
            boxSizing: 'border-box'
          }}>
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
                  fontSize: '16px',
                  fontWeight: '600',
                  width: '200px'
                }}
                placeholder="Enter goal title"
              />
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{
                  color: '#e5e5e5',
                  fontSize: '16px',
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '180px'
                }}>
                  {goalTitle}
                </div>
                <div style={{
                  color: '#a3a3a3',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {formatDate(goal.date)}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                title="Edit Goal"
                style={{
                  width: 20,
                  height: 20,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #333',
                  borderRadius: 6,
                  cursor: 'pointer',
                  padding: 0,
                  opacity: isHovered || editing ? 1 : 0,
                  pointerEvents: isHovered || editing ? 'auto' : 'none',
                  transition: 'opacity 150ms ease, background-color 150ms ease'
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3a3a3a'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
                onClick={() => { setDraftTitle(goalTitle); setEditing(true); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}>
                  <path fill="currentColor" d="M3.548 20.938h16.9a.5.5 0 0 0 0-1h-16.9a.5.5 0 0 0 0 1ZM9.71 17.18a2.587 2.587 0 0 0 1.12-.65l9.54-9.54a1.75 1.75 0 0 0 0-2.47l-.94-.93a1.788 1.788 0 0 0-2.47 0l-9.54 9.53a2.473 2.473 0 0 0-.64 1.12L6.04 17a.737.737 0 0 0 .19.72a.767.767 0 0 0 .53.22Zm.41-1.36a1.468 1.468 0 0 1-.67.39l-.97.26l-1-1l.26-.97a1.521 1.521 0 0 1 .39-.67l.38-.37l1.99 1.99Zm1.09-1.08l-1.99-1.99l6.73-6.73l1.99 1.99Zm8.45-8.45L18.65 7.3l-1.99-1.99l1.01-1.02a.748.748 0 0 1 1.06 0l.93.94a.754.754 0 0 1 0 1.06Z"/>
                </svg>
              </button>
              <button
                type="button"
                title="Menu"
                style={{
                  width: 20,
                  height: 20,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #333',
                  borderRadius: 6,
                  cursor: 'pointer',
                  padding: 0,
                  opacity: isHovered || editing ? 1 : 0,
                  pointerEvents: isHovered || editing ? 'auto' : 'none',
                  transition: 'opacity 150ms ease, background-color 150ms ease'
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3a3a3a'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2a2a2a'; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" style={{ color: '#e5e5e5' }}>
                  <path fill="currentColor" d="M7 12a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm7 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};

export default GoalBoardList;
