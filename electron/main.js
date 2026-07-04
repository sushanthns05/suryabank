import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the app doesn't show hardware acceleration errors on some systems
app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true, // Should be true in production
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    show: false, // Don't show until ready-to-show
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open target links in external browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // Load Vite Dev Server
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    // Load built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers (if needed)
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
