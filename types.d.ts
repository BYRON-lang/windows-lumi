declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

// Electron API types
interface ElectronAPI {
  closeApp: () => Promise<void>;
  minimizeApp: () => Promise<void>;
  maximizeApp: () => Promise<void>;
  
  // File system APIs
  openFile: () => Promise<any>;
  showSaveDialog: () => Promise<any>;
  showOpenDialog: (options: any) => Promise<any>;
  writeFile: (filePath: string, content: string) => Promise<any>;
  readFile: (filePath: string) => Promise<any>;
  pathJoin: (...paths: string[]) => Promise<string>;
  
  // Toast notifications
  showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
  
  // Auth related APIs
  authLogin: () => Promise<void>;
  authSignup: () => Promise<void>;
  authEmailLogin: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
  setAuthToken: (token: string) => Promise<boolean>;
  removeAuthToken: () => Promise<boolean>;
  getUserData: () => Promise<any>;
  setUserData: (userData: any) => Promise<boolean>;
  onAuthCallback: (callback: (token: string) => void) => void;
  removeAuthCallbackListener: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
