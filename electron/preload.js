import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  // Add other desktop-specific APIs here as needed
});
