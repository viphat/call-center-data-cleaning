// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import { app, Menu } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';
import { extractFile } from './main/extract_file';

const electron = require('electron');
const _ = require('lodash');
// const dialog = electron.dialog;

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

let mainWindow;
// let outputPath;
// exports.outputPath = outputPath;

// function selectDirectory() {
//   dialog.showOpenDialog(mainWindow, {
//     properties: ['openDirectory']
//   }, (folderPath) => {
//     outputPath = folderPath;
//   });
// }

function processData(inputFile, outputDirectory) {
  inputFile = _.first(inputFile);
  outputDirectory = _.first(outputDirectory);
  return new Promise((resolve, reject) => {
    extractFile(inputFile, outputDirectory).then(response => {
      resolve(response);
    }, errRes => {
      reject(errRes);
    });
  });
}

exports.processData = processData;
//

const setApplicationMenu = () => {
  const menus = [editMenuTemplate];
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
    width: 1000,
    height: 600,
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
