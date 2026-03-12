const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('menubar', {
  isMenuBar: true,
  updateTrayTitle: (text) => ipcRenderer.send('update-tray-title', text),
});
