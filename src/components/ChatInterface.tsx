import * as React from 'react';
import ChatInput from './ChatInput';
import MessagesInterface from './MessagesInterface';
import { useAIChat, ChatMessage, aiChatService } from '../services/AIChatService';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  chatTitle: string;
  initialMessage?: string;
  onMessageSent?: (message: string) => void;
  onNewChat?: () => void;
}

export default function ChatInterface({ chatTitle, initialMessage, onMessageSent, onNewChat }: ChatInterfaceProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [streamingContent, setStreamingContent] = React.useState('');
  const [thinkingContent, setThinkingContent] = React.useState('');
  const { sendStreamingMessage, generateTitle, isLoading, error } = useAIChat();

  // Test API connection on component mount
  React.useEffect(() => {
    const testConnection = async () => {
      console.log('🧪 Testing API connection on ChatInterface mount...');
      try {
        const result = await aiChatService.testConnection();
        if (result.success) {
          console.log('✅ API connection successful');
        } else {
          console.error('❌ API connection failed:', result.error);
        }
      } catch (error) {
        console.error('💥 Connection test error:', error);
      }
    };
    
    testConnection();
  }, []);

  // Initialize with initial message if provided
  React.useEffect(() => {
    if (initialMessage) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: initialMessage,
        isUser: true,
        timestamp: new Date()
      };
      setMessages([userMessage]);
    }
  }, [initialMessage]);

  const handleMessageSent = async (message: string) => {
    console.log('💬 ChatInterface: Message sent:', message);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Prepare conversation history for AI
    const conversationHistory: ChatMessage[] = messages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content,
      timestamp: msg.timestamp
    }));

    console.log('📚 Conversation history:', conversationHistory);

    // Start streaming AI response
    setIsStreaming(true);
    setStreamingContent('');
    setThinkingContent('');
    
    console.log('🔄 Starting AI streaming...');

    try {
      await sendStreamingMessage(
        {
          message: message.trim(),
          conversationHistory
        },
        // onMessage - handle streaming content
        (content: string) => {
          console.log('📝 Received content:', content);
          setStreamingContent(prev => prev + content);
        },
        // onThinking - handle thinking process
        (thinking: string) => {
          console.log('🧠 Received thinking:', thinking);
          setThinkingContent(thinking);
        },
        // onError - handle errors
        (error: string) => {
          console.error('❌ AI streaming error:', error);
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `Sorry, I encountered an error: ${error}`,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        },
        // onComplete - finalize the response
        () => {
          console.log('✅ Streaming completed');
          if (streamingContent.trim()) {
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: streamingContent.trim(),
              isUser: false,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
          }
          setIsStreaming(false);
          setStreamingContent('');
          setThinkingContent('');
        }
      );
    } catch (error) {
      console.error('💥 Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I was unable to process your message. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsStreaming(false);
      setStreamingContent('');
      setThinkingContent('');
    }

    // Don't call parent callback to avoid creating new chats
    // The parent callback was causing new chat creation
  };

  const handleNewChat = () => {
    // Clear current messages
    setMessages([]);
    
    // Call parent callback to create new chat
    if (onNewChat) {
      onNewChat();
    }
  };
  return (
    <>
      <style>
        {`
          body, html {
            overflow: hidden !important;
          }
          * {
            box-sizing: border-box;
          }
        `}
      </style>
      <div style={{
        position: 'fixed',
        top: '60px',
        left: '250px',
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent any overflow that could cause bottom scroll
        overflowX: 'hidden', // Specifically prevent horizontal scroll
        maxWidth: 'calc(100vw - 250px)', // Ensure it doesn't exceed viewport width minus sidebar
        width: 'calc(100vw - 250px)' // Set explicit width
      }}>
      {/* Chat Title Header */}
      <div style={{
        height: '60px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: 'transparent',
          borderRadius: '9999px',
          border: '1px solid transparent',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2a2a2a';
          e.currentTarget.style.border = '1px solid #333';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.border = '1px solid transparent';
        }}
        >
          {/* Lumi AI Logo */}
          <div style={{
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="#22c55e" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          
          <span style={{
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 'normal',
            margin: 0,
            padding: 0
          }}>
            Lumi AI / {chatTitle}
          </span>
        </div>
        
        {/* New Chat Icon */}
        <button
          type="button"
          title="New Chat"
          onClick={handleNewChat}
          style={{
            width: 28,
            height: 28,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '9999px',
            backgroundColor: '#2a2a2a',
            border: '1px solid #333',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M3.548 20.938h16.9a.5.5 0 0 0 0-1h-16.9a.5.5 0 0 0 0 1ZM9.71 17.18a2.587 2.587 0 0 0 1.12-.65l9.54-9.54a1.75 1.75 0 0 0 0-2.47l-.94-.93a1.788 1.788 0 0 0-2.47 0l-9.54 9.53a2.473 2.473 0 0 0-.64 1.12L6.04 17a.737.737 0 0 0 .19.72a.767.767 0 0 0 .53.22Zm.41-1.36a1.468 1.468 0 0 1-.67.39l-.97.26l-1-1l.26-.97a1.521 1.521 0 0 1 .39-.67l.38-.37l1.99 1.99Zm1.09-1.08l-1.99-1.99l6.73-6.73l1.99 1.99Zm8.45-8.45L18.65 7.3l-1.99-1.99l1.01-1.02a.748.748 0 0 1 1.06 0l.93.94a.754.754 0 0 1 0 1.06Z"/>
          </svg>
        </button>
      </div>

      {/* Messages Area - Takes remaining space */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 16px',
        overflow: 'hidden'
      }}>
        <MessagesInterface 
          messages={messages} 
          onNewMessage={handleMessageSent}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          thinkingContent={thinkingContent}
        />
      </div>

      {/* Chat Input - Fixed height */}
      <div style={{
        height: '140px', // Increased to accommodate ChatInput minHeight of 110px
        display: 'flex',
        justifyContent: 'center',
        padding: '16px 16px 40px 16px', // Increased bottom margin
        flexShrink: 0
      }}>
        <ChatInput onMessageSent={(message) => {
          console.log('🔗 ChatInterface: Received message from ChatInput:', message);
          handleMessageSent(message);
        }} />
      </div>
    </div>
    </>
  );
}
