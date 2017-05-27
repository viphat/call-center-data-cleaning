// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import { app, Menu } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { mainMenuTemplate } from './menu/main_menu_template';
import createWindow from './helpers/window';
import { extractFile } from './main/extract_file';
import { readExcelFiles } from './main/read_excel_files';
import { validateSourceData } from './main/check_source_data';
import { buildTemplate } from './main/build_excel_template';
import { db } from './db/prepare_data.js';

const electron = require('electron');
const ipcMain = electron.ipcMain;
const _ = require('lodash');

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

export let mainWindow;
export let helpWindow;

function processData(inputFile, outputDirectory) {
  inputFile = _.first(inputFile);
  outputDirectory = _.first(outputDirectory);
  let extractFolder = outputDirectory + '/';
  return new Promise((resolve, reject) => {
    let templateFilePath = '/Users/viphat/Downloads/2017/valid.xlsx';
    buildTemplate(templateFilePath);
    // extractFile(inputFile, extractFolder).then(response => {
    //   return readExcelFiles(extractFolder);
    // }, errRes => {
    //   reject(errRes);
    // }).then(excelFiles =>{
    //   if (excelFiles.length === 0) {
    //     reject('Không tìm thấy File excel nào trong File dữ liệu đầu vào.');
    //   } else {
    //     return validateSourceData(excelFiles, extractFolder);
    //   }
    // }, errRes => {
    //   reject(errRes);
    // });
  });
}

exports.processData = processData;
//

const setApplicationMenu = () => {
  const menus = [mainMenuTemplate];
  if (env.name !== 'production') {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (${env.name})`);
}

app.on('ready', () => {
  setApplicationMenu();

  mainWindow = createWindow('main', {
    width: 800,
    height: 600
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true,
  }));

  if (env.name === 'development') {
    mainWindow.openDevTools();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('open-help-window', () =>{
  if (helpWindow) {
    return;
  }

  helpWindow = createWindow('help',{
    width: 800,
    height: 600,
    parent: mainWindow
  })


  helpWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'help.html'),
    protocol: 'file:'
  }))

  helpWindow.on('closed', () => {
    helpWindow = null;
  })

});

ipcMain.on('close-help-window', () => {
  if (helpWindow) {
    helpWindow.close();
  }
});
