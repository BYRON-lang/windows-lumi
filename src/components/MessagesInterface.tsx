import * as React from 'react';
import AIResponse from './AIResponse';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessagesInterfaceProps {
  messages: Message[];
  onNewMessage?: (message: string) => void;
  isStreaming?: boolean;
  streamingContent?: string;
  thinkingContent?: string;
}

export default function MessagesInterface({ 
  messages, 
  onNewMessage, 
  isStreaming = false, 
  streamingContent = '', 
  thinkingContent = '' 
}: MessagesInterfaceProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Get current date and format it
  const getFormattedDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
  };

  // Auto-scroll to bottom when new messages arrive or streaming content changes
  React.useEffect(() => {
    if (messagesEndRef.current) {
      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [messages, streamingContent]);

  // Remove old thinking logic - now handled by props

  return (
    <>
      <style>
        {`
          @keyframes thinking {
            0%, 80%, 100% { 
              opacity: 0.3;
              transform: scale(0.8);
            }
            40% { 
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          
          /* Custom scrollbar styling */
          .messages-container::-webkit-scrollbar {
            width: 8px;
          }
          
          .messages-container::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .messages-container::-webkit-scrollbar-thumb {
            background: #404040;
            border-radius: 4px;
          }
          
          .messages-container::-webkit-scrollbar-thumb:hover {
            background: #555555;
          }
        `}
      </style>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent any overflow
        overflowX: 'hidden', // Specifically prevent horizontal scroll
        maxWidth: '100%' // Ensure it doesn't exceed parent width
      }}>
      {/* Date Display */}
      <div style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '16px 0',
        zIndex: 1
      }}>
        <span style={{
          color: '#808080',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {getFormattedDate()}
        </span>
      </div>

      {/* Messages Content Area */}
      <div 
        className="messages-container"
        style={{
          position: 'absolute',
          top: '60px', // Below date
          left: 0,
          right: 0,
          bottom: '140px', // Account for ChatInput height (140px)
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 0',
          gap: '12px',
          overflowY: 'auto',
          overflowX: 'hidden', // Prevent horizontal scroll
          maxWidth: '100%' // Ensure it doesn't exceed parent width
        }}>
        {/* Centered Messages Container */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '0 16px',
          overflowX: 'hidden', // Prevent horizontal scroll
          maxWidth: '100%' // Ensure it doesn't exceed parent width
        }}>
          <div style={{
            width: 680,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
        {/* Render Messages */}
        {messages.map((message) => (
          <div key={message.id}>
            {message.isUser ? (
              /* User Message Bubble */
              <div 
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  const button = e.currentTarget.querySelector('button') as HTMLElement;
                  if (button) button.style.display = 'flex';
                }}
                onMouseLeave={(e) => {
                  const button = e.currentTarget.querySelector('button') as HTMLElement;
                  if (button) button.style.display = 'none';
                }}
              >
                {/* Copy Button - shows on hover */}
                <button
                  type="button"
                  title="Copy message"
                  style={{
                    width: 32,
                    height: 32,
                    display: 'none',
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
                    navigator.clipboard.writeText(message.content);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                      <path d="M16.75 5.75a3 3 0 0 0-3-3h-6.5a3 3 0 0 0-3 3v9.5a3 3 0 0 0 3 3h6.5a3 3 0 0 0 3-3z"/>
                      <path d="M19.75 6.75v8.5a6 6 0 0 1-6 6h-5.5"/>
                    </g>
                  </svg>
                </button>
                
                <div 
                  style={{
                    maxWidth: '70%',
                    backgroundColor: '#202020',
                    borderRadius: '18px 18px 4px 18px',
                    padding: '12px 16px',
                    color: '#ffffff',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    wordWrap: 'break-word'
                  }}
                >
                  {message.content}
                </div>
              </div>
            ) : (
              /* AI Message Bubble */
              <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
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
                  {message.content}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Streaming AI Response */}
        {(isStreaming || streamingContent) && (
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <div style={{
              maxWidth: '70%',
              backgroundColor: 'transparent',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              lineHeight: '1.4'
            }}>
              {/* Show thinking process if available */}
              {thinkingContent && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  {/* Thinking Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024">
                    <path fill="#808080" d="M1024 304q0 42-18.5 78T955 443q5 20 5 37q0 66-47 113t-113 47q-35 0-69-16q-26 37-67 58.5T576 704q-53 0-97.5-27T409 604q-38 36-89 36q-53 0-90.5-37.5T192 512q-80 0-136-56T0 320t56-136t136-56q41 0 79 17q24-64 81-104.5T480 0q50 0 94 21.5T650 80q14-36 46-58t72-22q53 0 90.5 37.5T896 128q0 1-.5 3.5t-.5 3.5q57 16 93 62.5t36 106.5zM192 896q27 0 45.5 18.5t18.5 45t-19 45.5t-45.5 19t-45-19t-18.5-45t18.5-45t45.5-19zm160-192q40 0 68 28t28 68t-28 68t-68 28t-68-28t-28-68t28-68t68-28z"/>
                  </svg>
                  
                  <span style={{
                    color: '#808080',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {thinkingContent}
                  </span>
                </div>
              )}

              {/* Show streaming content */}
              {streamingContent && (
                <div style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap'
                }}>
                  {streamingContent}
                  {isStreaming && (
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '16px',
                      backgroundColor: '#ffffff',
                      marginLeft: '2px',
                      animation: 'blink 1s infinite'
                    }}></span>
                  )}
                </div>
              )}

              {/* Show thinking animation if no content yet */}
              {!streamingContent && isStreaming && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
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
                  
                  {/* Animated Dots */}
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#808080',
                      animation: 'thinking 1.4s infinite ease-in-out'
                    }}></div>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#808080',
                      animation: 'thinking 1.4s infinite ease-in-out 0.2s'
                    }}></div>
                    <div style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#808080',
                      animation: 'thinking 1.4s infinite ease-in-out 0.4s'
                    }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
            {/* Scroll anchor with padding */}
            <div ref={messagesEndRef} style={{ paddingBottom: '20px' }} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
