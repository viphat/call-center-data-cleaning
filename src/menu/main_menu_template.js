import { setupDatabase } from '../db/prepare_data';
import { mainWindow } from '../background';

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
