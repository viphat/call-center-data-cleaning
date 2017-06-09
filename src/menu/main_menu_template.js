import { setupDatabase } from '../db/prepare_data';
import { mainWindow } from '../background';

const electron = require('electron');
const dialog = electron.dialog;
const ipcRenderer = electron.ipcRenderer;

export const mainMenuTemplate = {
  label: 'Main Menu',
  submenu: [
    {
      label: 'Setup Database',
      click: () => {
        var message = 'Thao tác này sẽ khởi tạo và xóa hoàn toàn dữ liệu từ trước đến nay. Bạn có chắc không?';
        dialog.showMessageBox({
          message: message,
          buttons: ['OK', 'Cancel']
        }, (response) => {
          if (response === 0) {
            setupDatabase();
          }
        });
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
