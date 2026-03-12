const { app, ipcMain, Menu, Tray } = require('electron');
const { menubar } = require('menubar');
const path = require('path');
const fs = require('fs');

// Enable launch at login on first run
const settingsPath = path.join(app.getPath('userData'), 'settings.json');
let settings = {};
try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')); } catch {}
if (!settings.loginItemConfigured) {
  app.setLoginItemSettings({ openAtLogin: true });
  settings.loginItemConfigured = true;
  fs.writeFileSync(settingsPath, JSON.stringify(settings));
}

const mb = menubar({
  index: `file://${path.join(__dirname, 'index.html')}`,
  icon: path.join(__dirname, 'assets', 'trayTemplate.png'),
  preloadWindow: true,
  browserWindow: {
    width: 420,
    height: 620,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  },
});

mb.on('ready', () => {
  // Right-click context menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Launch at Login',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: (menuItem) => {
        app.setLoginItemSettings({ openAtLogin: menuItem.checked });
      },
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);

  mb.tray.on('right-click', () => {
    mb.tray.popUpContextMenu(contextMenu);
  });

  // Listen for tray title updates from renderer
  ipcMain.on('update-tray-title', (_event, text) => {
    mb.tray.setTitle(` ${text}`, { fontType: 'monospacedDigit' });
  });
});

app.on('window-all-closed', (e) => e.preventDefault());
