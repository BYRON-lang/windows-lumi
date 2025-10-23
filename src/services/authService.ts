// Auth service for Windows app - handles web-based authentication
const API_BASE_URL = 'https://auth-lumi.gridrr.com';

export interface User {
  id: string;
  email: string;
  full_name: string;
  profile_picture?: string;
  email_verified: boolean;
}

class AuthService {
  private token: string | null = null;
  private userData: User | null = null;

  constructor() {
    this.loadAuthData();
  }

  // Load stored authentication data from Electron store
  private async loadAuthData(): Promise<void> {
    try {
      if (window.electronAPI) {
        this.token = await window.electronAPI.getAuthToken();
        this.userData = await window.electronAPI.getUserData?.() || null;
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    }
  }

  // Login - opens web browser for authentication
  async login(): Promise<void> {
    if (window.electronAPI?.authLogin) {
      return window.electronAPI.authLogin();
    }
    throw new Error('Electron API not available');
  }

  // Signup - opens web browser for registration
  async signup(): Promise<void> {
    if (window.electronAPI?.authSignup) {
      return window.electronAPI.authSignup();
    }
    throw new Error('Electron API not available');
  }

  // Get current user data
  async getCurrentUser(): Promise<User | null> {
    await this.loadAuthData();
    if (this.token && this.userData) {
      return this.userData;
    }
    throw new Error('No authenticated user');
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    await this.loadAuthData();
    return !!(this.token && this.userData);
  }

  // Logout - clears stored data
  async logout(): Promise<void> {
    try {
      if (window.electronAPI?.removeAuthToken) {
        await window.electronAPI.removeAuthToken();
        this.token = null;
        this.userData = null;
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Get auth token
  getToken(): string | null {
    return this.token;
  }

  // Get auth headers for API requests
  getAuthHeaders(): Record<string, string> {
    if (this.token) {
      return {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  }
}

// Create singleton instance
export const authService = new AuthService();

// React hook to use auth service
export const useAuthService = () => authService;

