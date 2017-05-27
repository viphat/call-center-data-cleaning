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
      label: 'Import Matches',
      click: () => {
        mainWindow.webContents.send('openImportMatchesWindow');
      }
    },
    {
      label: 'Help',
      click: () => {
        mainWindow.webContents.send('openHelpWindow');
      }
    },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click: () => {
        app.quit();
      },
    }
  ]
}
