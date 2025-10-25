import * as React from 'react';
import AIResponse from './AIResponse';
import MarkdownRenderer from './MarkdownRenderer';

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
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = React.useState(false);


  // Scroll detection for showing/hiding scroll button
  React.useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isScrolled = scrollTop > 100; // Show button when scrolled more than 100px
        const hasOverflow = scrollHeight > clientHeight;
        
        setShowScrollButton(isScrolled && hasOverflow);
      }
    };

    const scrollContainer = messagesContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Check initial state
      handleScroll();
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [messages, streamingContent]);

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

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

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
          
          /* Custom scrollbar styling - matching settings modal */
          .messages-container::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          
          .messages-container::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 3px;
          }
          
          .messages-container::-webkit-scrollbar-thumb {
            background: #3a3a3a;
            border-radius: 3px;
            transition: all 0.2s ease;
            border: 1px solid transparent;
          }
          
          .messages-container::-webkit-scrollbar-thumb:hover {
            background: #4a4a4a;
            border-color: #525252;
          }
          
          .messages-container::-webkit-scrollbar-thumb:active {
            background: #555555;
          }
          
          .messages-container::-webkit-scrollbar-corner {
            background: transparent;
          }
          
          /* Firefox scrollbar styling */
          .messages-container {
            scrollbar-width: thin;
            scrollbar-color: #3a3a3a transparent;
          }
        `}
      </style>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent any overflow
        overflowX: 'hidden', // Specifically prevent horizontal scroll
        maxWidth: '100%' // Ensure it doesn't exceed parent width
      }}>

      {/* Messages Content Area */}
      <div 
        ref={messagesContainerRef}
        className="messages-container"
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 0',
          gap: '12px',
          overflowY: 'auto',
          overflowX: 'hidden', // Prevent horizontal scroll
          maxWidth: '100%', // Ensure it doesn't exceed parent width
          position: 'relative'
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
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '2px'
              }}>
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
                    <MarkdownRenderer content={message.content} />
                  </div>
                </div>
                
                {/* Action Buttons - Like, Dislike, Copy */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginLeft: '8px',
                  marginTop: '0px'
                }}>
                  {/* Like Button */}
                  <button
                    type="button"
                    title="Like this response"
                    style={{
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      opacity: 0.7
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2a2a2a';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.opacity = '0.7';
                    }}
                    onClick={() => {
                      console.log('Liked message:', message.id);
                    }}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="m20.975 12.185l-.739-.128l.74.128Zm-.705 4.08l-.74-.128l.74.128ZM6.938 20.477l-.747.065l.747-.065Zm-.812-9.393l.747-.064l-.747.064Zm7.869-5.863l.74.122l-.74-.122Zm-.663 4.045l.74.121l-.74-.121Zm-6.634.411l-.49-.568l.49.568Zm1.439-1.24l.49.569l-.49-.568Zm2.381-3.653l-.726-.189l.726.189Zm.476-1.834l.726.188l-.726-.188Zm1.674-.886l-.23.714l.23-.714Zm.145.047l.229-.714l-.23.714ZM9.862 6.463l.662.353l-.662-.353Zm4.043-3.215l-.726.188l.726-.188Zm-2.23-1.116l-.326-.675l.325.675ZM3.971 21.471l-.748.064l.748-.064ZM3 10.234l.747-.064a.75.75 0 0 0-1.497.064H3Zm17.236 1.823l-.705 4.08l1.478.256l.705-4.08l-1.478-.256Zm-6.991 9.193H8.596v1.5h4.649v-1.5Zm-5.56-.837l-.812-9.393l-1.495.129l.813 9.393l1.494-.13Zm11.846-4.276c-.507 2.93-3.15 5.113-6.286 5.113v1.5c3.826 0 7.126-2.669 7.764-6.357l-1.478-.256ZM13.255 5.1l-.663 4.045l1.48.242l.663-4.044l-1.48-.243Zm-6.067 5.146l1.438-1.24l-.979-1.136L6.21 9.11l.979 1.136Zm4.056-5.274l.476-1.834l-1.452-.376l-.476 1.833l1.452.377Zm1.194-2.194l.145.047l.459-1.428l-.145-.047l-.459 1.428Zm-1.915 4.038a8.378 8.378 0 0 0 .721-1.844l-1.452-.377A6.878 6.878 0 0 1 9.2 6.11l1.324.707Zm2.06-3.991a.885.885 0 0 1 .596.61l1.452-.376a2.385 2.385 0 0 0-1.589-1.662l-.459 1.428Zm-.863.313a.515.515 0 0 1 .28-.33l-.651-1.351c-.532.256-.932.73-1.081 1.305l1.452.376Zm.28-.33a.596.596 0 0 1 .438-.03l.459-1.428a2.096 2.096 0 0 0-1.548.107l.65 1.351Zm2.154 8.176h5.18v-1.5h-5.18v1.5ZM4.719 21.406L3.747 10.17l-1.494.129l.971 11.236l1.495-.129Zm-.969.107V10.234h-1.5v11.279h1.5Zm-.526.022a.263.263 0 0 1 .263-.285v1.5c.726 0 1.294-.622 1.232-1.344l-1.495.13ZM14.735 5.343a5.533 5.533 0 0 0-.104-2.284l-1.452.377a4.03 4.03 0 0 1 .076 1.664l1.48.243ZM8.596 21.25a.916.916 0 0 1-.911-.837l-1.494.129a2.416 2.416 0 0 0 2.405 2.208v-1.5Zm.03-12.244c.68-.586 1.413-1.283 1.898-2.19L9.2 6.109c-.346.649-.897 1.196-1.553 1.76l.98 1.137Zm13.088 3.307a2.416 2.416 0 0 0-2.38-2.829v1.5c.567 0 1 .512.902 1.073l1.478.256ZM3.487 21.25c.146 0 .263.118.263.263h-1.5c0 .682.553 1.237 1.237 1.237v-1.5Zm9.105-12.105a1.583 1.583 0 0 0 1.562 1.84v-1.5a.083.083 0 0 1-.082-.098l-1.48-.242Zm-5.72 1.875a.918.918 0 0 1 .316-.774l-.98-1.137a2.418 2.418 0 0 0-.83 2.04l1.495-.13Z"/>
                  </svg>
                  </button>
                  
                  {/* Dislike Button */}
                  <button
                    type="button"
                    title="Dislike this response"
                    style={{
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      opacity: 0.7
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2a2a2a';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.opacity = '0.7';
                    }}
                    onClick={() => {
                      console.log('Disliked message:', message.id);
                    }}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="m20.975 11.815l-.739.128l.74-.128Zm-.705-4.08l-.74.128l.74-.128ZM6.938 3.523l-.747-.065l.747.065Zm-.812 9.393l.747.064l-.747-.064Zm7.869 5.863l.74-.122l-.74.122Zm-.663-4.045l.74-.121l-.74.121Zm-6.634-.412l-.49.569l.49-.569Zm1.439 1.24l.49-.568l-.49.568Zm2.381 3.654l-.726.189l.726-.189Zm.476 1.834l.726-.188l-.726.188Zm1.674.886l-.23-.714l.23.714Zm.145-.047l.229.714l-.23-.714Zm-2.951-4.352l.662-.353l-.662.353Zm4.043 3.216l-.726-.189l.726.189Zm-2.23 1.115l-.326.675l.325-.675ZM3.971 2.529l-.748-.064l.748.064ZM3 13.766l.747.064a.75.75 0 0 1-1.497-.064H3Zm17.236-1.823l-.705-4.08l1.478-.256l.705 4.08l-1.478.256ZM13.245 2.75H8.596v-1.5h4.649v1.5Zm-5.56.838l-.812 9.392l-1.495-.129l.813-9.393l1.494.13Zm11.846 4.275c-.507-2.93-3.15-5.113-6.286-5.113v-1.5c3.826 0 7.126 2.669 7.764 6.357l-1.478.256ZM13.255 18.9l-.663-4.045l1.48-.242l.663 4.044l-1.48.243Zm-6.067-5.146l1.438 1.24l-.979 1.137l-1.438-1.24l.979-1.137Zm4.056 5.274l.476 1.834l-1.452.376l-.476-1.833l1.452-.377Zm1.194 2.194l.145-.047l.459 1.428l-.145.047l-.459-1.428Zm-1.915-4.038c.312.584.555 1.203.721 1.844l-1.452.377A6.877 6.877 0 0 0 9.2 17.89l1.324-.707Zm2.06 3.991a.885.885 0 0 0 .596-.61l1.452.376a2.385 2.385 0 0 1-1.589 1.662l-.459-1.428Zm-.863-.313a.513.513 0 0 0 .28.33l-.651 1.351a2.014 2.014 0 0 1-1.081-1.305l1.452-.376Zm.28.33a.596.596 0 0 0 .438.03l.459 1.428a2.096 2.096 0 0 1-1.548-.107l.65-1.351Zm2.154-8.176h5.18v1.5h-5.18v-1.5ZM4.719 2.594L3.747 13.83l-1.494-.129l.971-11.236l1.495.129Zm-.969-.107v11.279h-1.5V2.487h1.5Zm-.526-.022a.263.263 0 0 0 .263.285v-1.5c.726 0 1.294.622 1.232 1.344l-1.495-.13Zm11.511 16.192c.125.76.09 1.538-.104 2.284l-1.452-.377c.14-.543.167-1.11.076-1.664l1.48-.243ZM8.596 2.75a.916.916 0 0 0-.911.838l-1.494-.13A2.416 2.416 0 0 1 8.596 1.25v1.5Zm.03 12.244c.68.586 1.413 1.283 1.898 2.19l-1.324.707c-.346-.649-.897-1.196-1.553-1.76l.98-1.137Zm13.088-3.307a2.416 2.416 0 0 1-2.38 2.829v-1.5a.916.916 0 0 0 .902-1.073l1.478-.256ZM3.487 2.75a.263.263 0 0 0 .263-.263h-1.5c0-.682.553-1.237 1.237-1.237v1.5Zm9.105 12.105a1.583 1.583 0 0 1 1.562-1.84v1.5c-.05 0-.09.046-.082.098l-1.48.242Zm-5.72-1.875a.918.918 0 0 0 .316.774l-.98 1.137a2.418 2.418 0 0 1-.83-2.04l1.495.13Z"/>
                  </svg>
                  </button>
                  
                  {/* Copy Button */}
                  <button
                    type="button"
                    title="Copy response"
                    style={{
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      opacity: 0.7
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2a2a2a';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.opacity = '0.7';
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(message.content);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                        <path d="M16.75 5.75a3 3 0 0 0-3-3h-6.5a3 3 0 0 0-3 3v9.5a3 3 0 0 0 3 3h6.5a3 3 0 0 0 3-3z"/>
                        <path d="M19.75 6.75v8.5a6 6 0 0 1-6 6h-5.5"/>
                      </g>
                    </svg>
                  </button>
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
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '2px'
          }}>
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
                    lineHeight: '1.4'
                  }}>
                    <MarkdownRenderer content={streamingContent} />
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
            
            {/* Action Buttons - Only show when streaming is complete */}
            {streamingContent && !isStreaming && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginLeft: '8px',
                marginTop: '0px'
              }}>
                {/* Like Button */}
                <button
                  type="button"
                  title="Like this response"
                  style={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    opacity: 0.7
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.opacity = '0.7';
                  }}
                  onClick={() => {
                    console.log('Liked streaming response');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="m20.975 12.185l-.739-.128l.74.128Zm-.705 4.08l-.74-.128l.74.128ZM6.938 20.477l-.747.065l.747-.065Zm-.812-9.393l.747-.064l-.747.064Zm7.869-5.863l.74.122l-.74-.122Zm-.663 4.045l.74.121l-.74-.121Zm-6.634.411l-.49-.568l.49.568Zm1.439-1.24l.49.569l-.49-.568Zm2.381-3.653l-.726-.189l.726.189Zm.476-1.834l.726.188l-.726-.188Zm1.674-.886l-.23.714l.23-.714Zm.145.047l.229-.714l-.23.714ZM9.862 6.463l.662.353l-.662-.353Zm4.043-3.215l-.726.188l.726-.188Zm-2.23-1.116l-.326-.675l.325.675ZM3.971 21.471l-.748.064l.748-.064ZM3 10.234l.747-.064a.75.75 0 0 0-1.497.064H3Zm17.236 1.823l-.705 4.08l1.478.256l.705-4.08l-1.478-.256Zm-6.991 9.193H8.596v1.5h4.649v-1.5Zm-5.56-.837l-.812-9.393l-1.495.129l.813 9.393l1.494-.13Zm11.846-4.276c-.507 2.93-3.15 5.113-6.286 5.113v1.5c3.826 0 7.126-2.669 7.764-6.357l-1.478-.256ZM13.255 5.1l-.663 4.045l1.48.242l.663-4.044l-1.48-.243Zm-6.067 5.146l1.438-1.24l-.979-1.136L6.21 9.11l.979 1.136Zm4.056-5.274l.476-1.834l-1.452-.376l-.476 1.833l1.452.377Zm1.194-2.194l.145.047l.459-1.428l-.145-.047l-.459 1.428Zm-1.915 4.038a8.378 8.378 0 0 0 .721-1.844l-1.452-.377A6.878 6.878 0 0 1 9.2 6.11l1.324.707Zm2.06-3.991a.885.885 0 0 1 .596.61l1.452-.376a2.385 2.385 0 0 0-1.589-1.662l-.459 1.428Zm-.863.313a.515.515 0 0 1 .28-.33l-.651-1.351c-.532.256-.932.73-1.081 1.305l1.452.376Zm.28-.33a.596.596 0 0 1 .438-.03l.459-1.428a2.096 2.096 0 0 0-1.548.107l.65 1.351Zm2.154 8.176h5.18v-1.5h-5.18v1.5ZM4.719 21.406L3.747 10.17l-1.494.129l.971 11.236l1.495-.129Zm-.969.107V10.234h-1.5v11.279h1.5Zm-.526.022a.263.263 0 0 1 .263-.285v1.5c.726 0 1.294-.622 1.232-1.344l-1.495.13ZM14.735 5.343a5.533 5.533 0 0 0-.104-2.284l-1.452.377a4.03 4.03 0 0 1 .076 1.664l1.48.243ZM8.596 21.25a.916.916 0 0 1-.911-.837l-1.494.129a2.416 2.416 0 0 0 2.405 2.208v-1.5Zm.03-12.244c.68-.586 1.413-1.283 1.898-2.19L9.2 6.109c-.346.649-.897 1.196-1.553 1.76l.98 1.137Zm13.088 3.307a2.416 2.416 0 0 0-2.38-2.829v1.5c.567 0 1 .512.902 1.073l1.478.256ZM3.487 21.25c.146 0 .263.118.263.263h-1.5c0 .682.553 1.237 1.237 1.237v-1.5Zm9.105-12.105a1.583 1.583 0 0 0 1.562 1.84v-1.5a.083.083 0 0 1-.082-.098l-1.48-.242Zm-5.72 1.875a.918.918 0 0 1 .316-.774l-.98-1.137a2.418 2.418 0 0 0-.83 2.04l1.495-.13Z"/>
                  </svg>
                </button>
                
                {/* Dislike Button */}
                <button
                  type="button"
                  title="Dislike this response"
                  style={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    opacity: 0.7
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.opacity = '0.7';
                  }}
                  onClick={() => {
                    console.log('Disliked streaming response');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="m20.975 11.815l-.739.128l.74-.128Zm-.705-4.08l-.74.128l.74-.128ZM6.938 3.523l-.747-.065l.747.065Zm-.812 9.393l.747.064l-.747-.064Zm7.869 5.863l.74-.122l-.74.122Zm-.663-4.045l.74-.121l-.74.121Zm-6.634-.412l-.49.569l.49-.569Zm1.439 1.24l.49-.568l-.49.568Zm2.381 3.654l-.726.189l.726-.189Zm.476 1.834l.726-.188l-.726.188Zm1.674.886l-.23-.714l.23.714Zm.145-.047l.229.714l-.23-.714Zm-2.951-4.352l.662-.353l-.662.353Zm4.043 3.216l-.726-.189l.726.189Zm-2.23 1.115l-.326.675l.325-.675ZM3.971 2.529l-.748-.064l.748.064ZM3 13.766l.747.064a.75.75 0 0 1-1.497-.064H3Zm17.236-1.823l-.705-4.08l1.478-.256l.705 4.08l-1.478.256ZM13.245 2.75H8.596v-1.5h4.649v1.5Zm-5.56.838l-.812 9.392l-1.495-.129l.813-9.393l1.494.13Zm11.846 4.275c-.507-2.93-3.15-5.113-6.286-5.113v-1.5c3.826 0 7.126 2.669 7.764 6.357l-1.478.256ZM13.255 18.9l-.663-4.045l1.48-.242l.663 4.044l-1.48.243Zm-6.067-5.146l1.438 1.24l-.979 1.137l-1.438-1.24l.979-1.137Zm4.056 5.274l.476 1.834l-1.452.376l-.476-1.833l1.452-.377Zm1.194 2.194l.145-.047l.459 1.428l-.145.047l-.459-1.428Zm-1.915-4.038c.312.584.555 1.203.721 1.844l-1.452.377A6.877 6.877 0 0 0 9.2 17.89l1.324-.707Zm2.06 3.991a.885.885 0 0 0 .596-.61l1.452.376a2.385 2.385 0 0 1-1.589 1.662l-.459-1.428Zm-.863-.313a.513.513 0 0 0 .28.33l-.651 1.351a2.014 2.014 0 0 1-1.081-1.305l1.452-.376Zm.28.33a.596.596 0 0 0 .438.03l.459 1.428a2.096 2.096 0 0 1-1.548-.107l.65-1.351Zm2.154-8.176h5.18v1.5h-5.18v-1.5ZM4.719 2.594L3.747 13.83l-1.494-.129l.971-11.236l1.495.129Zm-.969-.107v11.279h-1.5V2.487h1.5Zm-.526-.022a.263.263 0 0 0 .263.285v-1.5c.726 0 1.294.622 1.232 1.344l-1.495-.13Zm11.511 16.192c.125.76.09 1.538-.104 2.284l-1.452-.377c.14-.543.167-1.11.076-1.664l1.48-.243ZM8.596 2.75a.916.916 0 0 0-.911.838l-1.494-.13A2.416 2.416 0 0 1 8.596 1.25v1.5Zm.03 12.244c.68.586 1.413 1.283 1.898 2.19l-1.324.707c-.346-.649-.897-1.196-1.553-1.76l.98-1.137Zm13.088-3.307a2.416 2.416 0 0 1-2.38 2.829v-1.5a.916.916 0 0 0 .902-1.073l1.478-.256ZM3.487 2.75a.263.263 0 0 0 .263-.263h-1.5c0-.682.553-1.237 1.237-1.237v1.5Zm9.105 12.105a1.583 1.583 0 0 1 1.562-1.84v1.5c-.05 0-.09.046-.082.098l-1.48.242Zm-5.72-1.875a.918.918 0 0 0 .316.774l-.98 1.137a2.418 2.418 0 0 1-.83-2.04l1.495.13Z"/>
                  </svg>
                </button>
                
                {/* Copy Button */}
                <button
                  type="button"
                  title="Copy response"
                  style={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    opacity: 0.7
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a2a';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.opacity = '0.7';
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(streamingContent);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                      <path d="M16.75 5.75a3 3 0 0 0-3-3h-6.5a3 3 0 0 0-3 3v9.5a3 3 0 0 0 3 3h6.5a3 3 0 0 0 3-3z"/>
                      <path d="M19.75 6.75v8.5a6 6 0 0 1-6 6h-5.5"/>
                    </g>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
        
            {/* Scroll anchor with padding */}
            <div ref={messagesEndRef} style={{ paddingBottom: '20px' }} />
          </div>
        </div>
        
        {/* Custom Scroll Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: '#2a2a2a',
              border: '1px solid #333',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              transition: 'all 0.2s ease',
              opacity: 0.8
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Scroll to bottom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </button>
        )}
      </div>
    </div>
    </>
  );
}
