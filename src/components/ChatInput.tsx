import * as React from 'react';

interface ChatInputProps {
  onMessageSent?: (message: string) => void;
}

export default function ChatInput({ onMessageSent }: ChatInputProps) {
  const [text, setText] = React.useState('');
  const hasText = text.trim().length > 0;

  const handleSendMessage = () => {
    console.log('📤 ChatInput: handleSendMessage called');
    console.log('📝 Text:', text);
    console.log('✅ Has text:', hasText);
    console.log('🔗 OnMessageSent callback:', !!onMessageSent);
    
    if (hasText && onMessageSent) {
      console.log('🚀 Calling onMessageSent with:', text);
      onMessageSent(text);
      setText(''); // Clear the input after sending
      console.log('✅ Message sent and input cleared');
    } else {
      console.log('❌ Cannot send message - missing text or callback');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log('⌨️ Key pressed:', e.key);
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('✅ Enter key detected, preventing default and calling handleSendMessage');
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{
      width: 680,
      minHeight: 110,
      border: '2px solid #22c55e',
      borderRadius: 16,
      boxSizing: 'border-box',
      backgroundColor: '#202020',
      overflow: 'hidden'
    }}>
      <div style={{ height: '50%', padding: '0px' }}>
        <textarea
          placeholder="Ask, Search or Make Anything"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: 14,
            fontFamily: 'inherit',
            marginTop: 12,
            marginLeft:6,
            marginBottom: 6,
          }}
        />
      </div>
      <div style={{ height: '50%', padding: '8px', display: 'flex', marginBottom: 6, alignItems: 'center', gap: 8 }}>
        {/* Primary action button with rounded container and icon */}
        <button
          type="button"
          title="Upload files"
          onClick={() => (document.getElementById('chatFileUpload') as HTMLInputElement)?.click()}
          style={{
            width: 28,
            height: 28,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 9999,
            backgroundColor: '#2a2a2a',
            border: '1px solid #333',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M11.772 3.744a6 6 0 0 1 8.66 8.302l-.189.197l-8.8 8.798l-.036.03a3.723 3.723 0 0 1-5.49-4.973a.76.76 0 0 1 .085-.13l.054-.06l.087-.088l.141-.148l.003.003l7.436-7.454a.75.75 0 0 1 .976-.074l.084.073a.75.75 0 0 1 .074.976l-.072.084l-7.595 7.613A2.23 2.23 0 0 0 10.364 20l8.833-8.83a4.502 4.502 0 0 0-6.198-6.524l-.168.16l-.012.014l-9.537 9.536a.75.75 0 0 1-1.133-.977l.073-.084l9.549-9.55h.001Z"/>
          </svg>
        </button>

        {/* File upload */}
        <input id="chatFileUpload" type="file" style={{ display: 'none' }} multiple />

        {/* Add Content pill */}
        <button
          type="button"
          title="Add context"
          style={{
            height: 28,
            padding: '0 10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            borderRadius: 9999,
            backgroundColor: '#2a2a2a',
            border: '1px solid #333',
            color: '#e5e5e5',
            cursor: 'pointer',
            fontSize: 12
          }}
        >
          <span style={{ fontWeight: 700, lineHeight: 1 }}>@</span>
          <span>Add Context</span>
        </button>

        {/* All Sources pill */}
        <button
          type="button"
          title="All sources"
          style={{
            height: 28,
            padding: '0 10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            borderRadius: 9999,
            backgroundColor: '#2a2a2a',
            border: '1px solid #333',
            color: '#e5e5e5',
            cursor: 'pointer',
            fontSize: 12
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M13 14c-3.36 0-4.46 1.35-4.82 2.24C9.25 16.7 10 17.76 10 19a3 3 0 0 1-3 3a3 3 0 0 1-3-3c0-1.31.83-2.42 2-2.83V7.83A2.99 2.99 0 0 1 4 5a3 3 0 0 1 3-3a3 3 0 0 1 3 3c0 1.31-.83 2.42-2 2.83v5.29c.88-.65 2.16-1.12 4-1.12c2.67 0 3.56-1.34 3.85-2.23A3.006 3.006 0 0 1 14 7a3 3 0 0 1 3-3a3 3 0 0 1 3 3c0 1.34-.88 2.5-2.09 2.86C17.65 11.29 16.68 14 13 14m-6 4a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M7 4a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m10 2a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1Z"/>
          </svg>
          <span>All Sources</span>
        </button>

        {/* Send button (far right) */}
        <button
          type="button"
          title="Send"
          disabled={!hasText}
          onClick={() => {
            console.log('🖱️ Send button clicked');
            handleSendMessage();
          }}
          style={{
            marginLeft: 'auto',
            width: 28,
            height: 28,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 9999,
            backgroundColor: hasText ? '#22c55e' : '#2a2a2a',
            border: hasText ? '1px solid #1ea34f' : '1px solid #333',
            cursor: hasText ? 'pointer' : 'not-allowed',
            opacity: hasText ? 1 : 0.6,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="#0f0f0f" d="M13 20h-2V8l-5.5 5.5l-1.42-1.42L12 4.16l7.92 7.92l-1.42 1.42L13 8v12Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
