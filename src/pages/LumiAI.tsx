import * as React from 'react';
import ChatWelcomeInterface from '../components/ChatWelcomeInterface';
import ChatInterface from '../components/ChatInterface';
import Greeting from '../components/Greeting';
import SampleCommands from '../components/SampleCommands';
import { useAIChat } from '../services/AIChatService';

export default function LumiAI() {
  const [showTip, setShowTip] = React.useState(false);
  const [hoverPill, setHoverPill] = React.useState(false);
  const [isInChat, setIsInChat] = React.useState(false);
  const [chatTitle, setChatTitle] = React.useState('');
  const [initialMessage, setInitialMessage] = React.useState('');
  const { generateTitle } = useAIChat();

  // Function to generate a dynamic chat title based on the message
  const generateChatTitle = (message: string): string => {
    const trimmedMessage = message.trim().toLowerCase();
    
    // Greeting patterns
    if (trimmedMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|sup|what's up)/)) {
      return 'Greetings';
    }
    
    // Question patterns
    if (trimmedMessage.includes('?') || trimmedMessage.match(/^(what|how|why|when|where|who|can you|could you|would you)/)) {
      return 'Questions & Answers';
    }
    
    // Help patterns
    if (trimmedMessage.match(/^(help|assist|support|guide|tutorial|how to)/)) {
      return 'Help & Support';
    }
    
    // Code patterns
    if (trimmedMessage.match(/(code|coding|programming|function|class|variable|bug|error|debug|api|database)/)) {
      return 'Code & Programming';
    }
    
    // Creative patterns
    if (trimmedMessage.match(/(write|create|design|draw|story|poem|article|blog|content)/)) {
      return 'Creative Writing';
    }
    
    // Analysis patterns
    if (trimmedMessage.match(/(analyze|analysis|explain|describe|tell me about|what is|define)/)) {
      return 'Analysis & Explanation';
    }
    
    // Planning patterns
    if (trimmedMessage.match(/(plan|schedule|organize|project|task|goal|strategy)/)) {
      return 'Planning & Organization';
    }
    
    // Default fallback - use first few words or "New Chat"
    const words = message.trim().split(' ').slice(0, 3);
    if (words.length > 0 && words[0].length > 0) {
      return words.join(' ').charAt(0).toUpperCase() + words.join(' ').slice(1);
    }
    
    return 'New Chat';
  };

  const handleMessageSent = async (message: string) => {
    console.log('Message sent:', message);
    
    // Use AI service to generate title
    try {
      const title = await generateTitle(message);
      setChatTitle(title);
    } catch (error) {
      console.error('Failed to generate title:', error);
      // Fallback to local title generation
      const fallbackTitle = generateChatTitle(message);
      setChatTitle(fallbackTitle);
    }
    
    setInitialMessage(message);
    setIsInChat(true);
  };

  const handleNewChat = () => {
    // Reset to welcome interface for new chat
    setIsInChat(false);
    setChatTitle('');
    setInitialMessage('');
  };

  // If we're in chat mode, show the blank chat interface
  if (isInChat) {
    return <ChatInterface chatTitle={chatTitle} initialMessage={initialMessage} onMessageSent={handleMessageSent} onNewChat={handleNewChat} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'transparent', overflow: 'hidden' }}>
      <div style={{ padding: '12px' }}>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          {/* Private chat pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: '#ffffff',
              userSelect: 'none',
              padding: '4px 12px',
              borderRadius: 9999,
              backgroundColor: hoverPill ? '#2a2a2a' : '#202020',
              border: '1px solid #2a2a2a',
            }}
            onMouseEnter={() => { setShowTip(true); setHoverPill(true); }}
            onMouseLeave={() => { setShowTip(false); setHoverPill(false); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="#ffffff" d="M16 11H8a1 1 0 0 1-1-1V7a5 5 0 0 1 10 0v3a1 1 0 0 1-1 1ZM9 9h6V7a3 3 0 0 0-6 0Z" opacity=".8"/>
              <rect width="16" height="13" x="4" y="9" fill="#ffffff" rx="3"/>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Private chat</span>
          </div>

          {/* Chat History icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            style={{ display: 'inline-block', cursor: 'pointer' }}
          >
            <title>Chat History</title>
            <g fill="none">
              <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
              <path fill="#ffffff" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10H4a2 2 0 0 1-2-2v-8C2 6.477 6.477 2 12 2Zm0 2a8 8 0 0 0-8 8v8h8a8 8 0 1 0 0-16Zm0 10a1 1 0 0 1 .117 1.993L12 16H9a1 1 0 0 1-.117-1.993L9 14h3Zm3-4a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h6Z"/>
            </g>
          </svg>

          {showTip && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 6,
                backgroundColor: '#252525',
                color: '#808080',
                padding: '4px 8px',
                borderRadius: 6,
                fontSize: 12,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              Toggle private chat
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 48px)', gap: 0, marginTop: -48 }}>
        <div style={{ marginBottom: 24 }}>
          <Greeting />
        </div>
        <div>
          <ChatWelcomeInterface onMessageSent={handleMessageSent} />
        </div>
        <div style={{ marginTop: 16 }}>
          {/* Sample commands below chat input */}
          <SampleCommands width={680} />
        </div>
      </div>
    </div>
  );
}
