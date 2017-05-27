import { setupDatabase } from '../db/prepare_data.js';
import { mainWindow } from '../background.js';

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

export const mainMenuTemplate = {
  label: 'main',
  submenu: [
    {
      label: 'Setup Database',
      click: () => {
        setupDatabase();
      }
    },
    {
      label: 'Help',
      click: () => {
        mainWindow.webContents.send('openHelpWindow');
      }
    }
  ]
}
