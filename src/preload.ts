import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.invoke('close-app'),
  minimizeApp: () => ipcRenderer.invoke('minimize-app'),
  maximizeApp: () => ipcRenderer.invoke('maximize-app'),
  
  // File system APIs
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  showSaveDialog: () => ipcRenderer.invoke('dialog:showSaveDialog'),
  showOpenDialog: (options: any) => ipcRenderer.invoke('dialog:showOpenDialog', options),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('file:write', filePath, content),
  readFile: (filePath: string) => ipcRenderer.invoke('file:read', filePath),
  pathJoin: (...paths: string[]) => ipcRenderer.invoke('path:join', ...paths),
  
  // Toast notifications
  showToast: (message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) => {
    ipcRenderer.send('show-toast', { message, type, duration });
  },
  
  // Auth related APIs
  authLogin: () => ipcRenderer.invoke('auth:login'),
  authSignup: () => ipcRenderer.invoke('auth:signup'),
  authEmailLogin: () => ipcRenderer.invoke('auth:emailLogin'),
  getAuthToken: () => ipcRenderer.invoke('auth:getToken'),
  setAuthToken: (token: string) => ipcRenderer.invoke('auth:setToken', token),
  removeAuthToken: () => ipcRenderer.invoke('auth:removeToken'),
  getUserData: () => ipcRenderer.invoke('auth:getUserData'),
  setUserData: (userData: any) => ipcRenderer.invoke('auth:setUserData', userData),
  onAuthCallback: (callback: (token: string) => void) => {
    ipcRenderer.on('auth:callback', (event, token) => callback(token));
  },
  removeAuthCallbackListener: () => ipcRenderer.removeAllListeners('auth:callback'),
});
