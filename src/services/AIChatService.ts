import * as React from 'react';

// API Configuration
const API_BASE_URL = 'https://api-lumi.gridrr.com';

// Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface TitleResponse {
  title: string;
}

// API Service Class
export class AIChatService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadAuthToken(); // This will be async but we'll handle it in methods
  }

  // Load auth token from Electron store or localStorage (for initialization)
  private async loadAuthToken(): Promise<void> {
    try {
      // Try Electron API first
      if (window.electronAPI && window.electronAPI.getAuthToken) {
        this.authToken = await window.electronAPI.getAuthToken();
        console.log('🔑 Loaded auth token from Electron store:', this.authToken ? 'Present' : 'Missing');
        return;
      }
      
      // Fallback to localStorage for web version
      this.authToken = localStorage.getItem('authToken');
      console.log('🔑 Loaded auth token from localStorage:', this.authToken ? 'Present' : 'Missing');
    } catch (error) {
      console.error('Failed to load auth token:', error);
    }
  }

  // Ensure we have the latest auth token before making API calls
  private async ensureAuthToken(): Promise<void> {
    try {
      // Try Electron API first
      if (window.electronAPI && window.electronAPI.getAuthToken) {
        this.authToken = await window.electronAPI.getAuthToken();
        return;
      }
      
      // Fallback to localStorage for web version
      this.authToken = localStorage.getItem('authToken');
    } catch (error) {
      console.error('Failed to refresh auth token:', error);
    }
  }

  // Set auth token
  public setAuthToken(token: string): void {
    this.authToken = token;
    try {
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Failed to save auth token:', error);
    }
  }

  // Clear auth token
  public clearAuthToken(): void {
    this.authToken = null;
    try {
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Failed to clear auth token:', error);
    }
  }

  // Get auth headers (no authentication required for public endpoints)
  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  // Regular chat (non-streaming)
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  }

  // Streaming chat with Server-Sent Events
  async sendStreamingMessage(
    request: ChatRequest,
    onMessage: (content: string) => void,
    onThinking?: (thinking: string) => void,
    onError?: (error: string) => void,
    onComplete?: () => void
  ): Promise<void> {
    try {
      console.log('🚀 Sending streaming message to public endpoint (no auth required)');
      console.log('📝 Request:', request);
      
      const response = await fetch(`${this.baseUrl}/chat/stream`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            onComplete?.();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                switch (data.type) {
                  case 'thinking':
                    onThinking?.(data.content);
                    break;
                  case 'content':
                    onMessage(data.content);
                    break;
                  case 'error':
                    onError?.(data.content);
                    break;
                  case 'end':
                    onComplete?.();
                    return;
                }
              } catch (e) {
                // Skip malformed JSON
                console.warn('Failed to parse SSE data:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error('Streaming chat API error:', error);
      onError?.(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }

  // Generate chat title
  async generateChatTitle(message: string): Promise<string> {
    try {
      console.log('🔑 Generating title for public endpoint (no auth required)');
      
      const response = await fetch(`${this.baseUrl}/chat/title`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: TitleResponse = await response.json();
      return data.title;
    } catch (error) {
      console.error('Title generation API error:', error);
      // Return a fallback title
      return 'New Chat';
    }
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.authToken;
  }

  // Test API connection
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🧪 Testing API connection to:', this.baseUrl);
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Health check response:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API is working:', data);
        return { success: true };
      } else {
        const errorText = await response.text();
        console.error('❌ API health check failed:', response.status, errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      console.error('💥 Connection test failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Create singleton instance
export const aiChatService = new AIChatService();

// React hook for AI chat
export function useAIChat() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const sendMessage = React.useCallback(async (request: ChatRequest): Promise<ChatResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await aiChatService.sendMessage(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendStreamingMessage = React.useCallback(async (
    request: ChatRequest,
    onMessage: (content: string) => void,
    onThinking?: (thinking: string) => void,
    onError?: (error: string) => void,
    onComplete?: () => void
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await aiChatService.sendStreamingMessage(request, onMessage, onThinking, onError, onComplete);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateTitle = React.useCallback(async (message: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await aiChatService.generateChatTitle(message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return 'New Chat'; // Fallback title
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    sendStreamingMessage,
    generateTitle,
    isLoading,
    error,
    isAuthenticated: aiChatService.isAuthenticated(),
  };
}
