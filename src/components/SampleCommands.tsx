import * as React from 'react';
import CommandCard from './CommandCard';

interface SampleCommandsProps {
  width?: number;
}

export default function SampleCommands({ width = 680 }: SampleCommandsProps) {
  const items = [
    {
      title: 'Set a reminder for tomorrow at 9:00 AM',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
          <path fill="none" stroke="#a3a3a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M37.275 32.678V21.47A13.27 13.27 0 0 0 27.08 8.569v-.985a3.102 3.102 0 0 0-6.203 0v.996a13.27 13.27 0 0 0-10.152 12.89v11.208L6.52 36.883v1.942h34.96v-1.942Zm-17.948 6.147a4.65 4.65 0 0 0 9.301.048v-.048"/>
        </svg>
      )
    },
    {
      title: 'Write notes from today\'s standup',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <g fill="none" stroke="#a3a3a3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
            <path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"/>
            <path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"/>
          </g>
        </svg>
      )
    },
    {
      title: 'Start a goal: Read 10 pages every day',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path fill="#a3a3a3" d="M20.172 6.75h-1.861l-4.566 4.564a1.874 1.874 0 1 1-1.06-1.06l4.565-4.565V3.828a.94.94 0 0 1 .275-.664l1.73-1.73a.249.249 0 0 1 .25-.063c.089.026.155.1.173.191l.46 2.301l2.3.46c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.731 1.73a.937.937 0 0 1-.663.275Z"/>
          <path fill="#a3a3a3" d="M2.625 12A9.375 9.375 0 0 0 12 21.375A9.375 9.375 0 0 0 21.375 12c0-.898-.126-1.766-.361-2.587A.75.75 0 0 1 22.455 9c.274.954.42 1.96.42 3c0 6.006-4.869 10.875-10.875 10.875S1.125 18.006 1.125 12S5.994 1.125 12 1.125c1.015-.001 2.024.14 3 .419a.75.75 0 1 1-.413 1.442A9.39 9.39 0 0 0 12 2.625A9.375 9.375 0 0 0 2.625 12Z"/>
        </svg>
      )
    }
  ];

  return (
    <div style={{ width, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {items.map((it) => (
        <CommandCard key={it.title} title={it.title} icon={it.icon} />
      ))}
    </div>
  );
}
