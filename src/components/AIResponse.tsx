import * as React from 'react';

interface AIResponseProps {
  thinking?: string;
  response: string;
}

export default function AIResponse({ thinking, response }: AIResponseProps) {
  const [isThinkingExpanded, setIsThinkingExpanded] = React.useState(false);

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      gap: '8px'
    }}>
      {/* AI Response Bubble */}
      <div style={{
        maxWidth: '70%',
        backgroundColor: 'transparent',
        borderRadius: '18px 18px 18px 4px',
        padding: '12px 16px',
        color: '#ffffff',
        fontSize: '14px',
        lineHeight: '1.4',
        wordWrap: 'break-word'
      }}>
        {/* Thinking Section */}
        {thinking && (
          <div style={{
            marginBottom: '12px'
          }}>
            {/* Thinking Header */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
              onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
            >
              {/* Thinking Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024">
                <path fill="#808080" d="M1024 304q0 42-18.5 78T955 443q5 20 5 37q0 66-47 113t-113 47q-35 0-69-16q-26 37-67 58.5T576 704q-53 0-97.5-27T409 604q-38 36-89 36q-53 0-90.5-37.5T192 512q-80 0-136-56T0 320t56-136t136-56q41 0 79 17q24-64 81-104.5T480 0q50 0 94 21.5T650 80q14-36 46-58t72-22q53 0 90.5 37.5T896 128q0 1-.5 3.5t-.5 3.5q57 16 93 62.5t36 106.5zM192 896q27 0 45.5 18.5t18.5 45t-19 45.5t-45.5 19t-45-19t-18.5-45t18.5-45t45.5-19zm160-192q40 0 68 28t28 68t-28 68t-68 28t-68-28t-28-68t28-68t68-28z"/>
              </svg>
              
              <span style={{
                color: '#808080',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Thinking
              </span>
              
              {/* Collapse/Expand Icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24"
                style={{
                  transform: isThinkingExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  color: '#808080'
                }}
              >
                <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </div>
            
            {/* Thinking Content */}
            {isThinkingExpanded && (
              <div style={{
                color: '#b0b0b0',
                fontSize: '12px',
                lineHeight: '1.4'
              }}>
                {thinking}
              </div>
            )}
          </div>
        )}
        
         {/* AI Response */}
         <div style={{
           color: '#ffffff',
           fontSize: '14px',
           lineHeight: '1.4'
         }}>
           {response}
         </div>
         
         {/* Action Buttons */}
         <div style={{
           display: 'flex',
           alignItems: 'center',
           gap: '12px',
           marginTop: '12px'
         }}>
         {/* Copy Button */}
         <button
           type="button"
           title="Copy response"
           style={{
             width: 24,
             height: 24,
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             backgroundColor: 'transparent',
             border: 'none',
             cursor: 'pointer',
             opacity: 0.7,
             transition: 'opacity 0.2s ease'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.opacity = '1';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.opacity = '0.7';
           }}
           onClick={() => {
             navigator.clipboard.writeText(response);
           }}
         >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
             <g fill="none" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
               <path d="M16.75 5.75a3 3 0 0 0-3-3h-6.5a3 3 0 0 0-3 3v9.5a3 3 0 0 0 3 3h6.5a3 3 0 0 0 3-3z"/>
               <path d="M19.75 6.75v8.5a6 6 0 0 1-6 6h-5.5"/>
             </g>
           </svg>
         </button>

         {/* Like Button */}
         <button
           type="button"
           title="Like response"
           style={{
             width: 24,
             height: 24,
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             backgroundColor: 'transparent',
             border: 'none',
             cursor: 'pointer',
             opacity: 0.7,
             transition: 'opacity 0.2s ease'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.opacity = '1';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.opacity = '0.7';
           }}
           onClick={() => {
             console.log('Liked response');
           }}
         >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
             <path stroke="#808080" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
           </svg>
         </button>

         {/* Dislike Button */}
         <button
           type="button"
           title="Dislike response"
           style={{
             width: 24,
             height: 24,
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             backgroundColor: 'transparent',
             border: 'none',
             cursor: 'pointer',
             opacity: 0.7,
             transition: 'opacity 0.2s ease'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.opacity = '1';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.opacity = '0.7';
           }}
           onClick={() => {
             console.log('Disliked response');
           }}
         >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
             <path stroke="#808080" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/>
           </svg>
         </button>
         </div>
       </div>
     </div>
   );
 }
