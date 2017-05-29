// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from 'path';
import url from 'url';
import createWindow from './helpers/window';
import { app, Menu } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { mainMenuTemplate } from './menu/main_menu_template';
import { extractFile } from './main/extract_file';
import { readExcelFiles } from './main/read_excel_files';
import { validateSourceData } from './main/check_source_data';
import { checkHospitalNames, writeReportToExcelFile } from './main/check_hospital_names';
import { importMatchesFromFile } from './main/import_hospital_matches';
import { clearBatchData } from './main/clear_customers_data';
import { generateReport } from './main/generate_report';

const electron = require('electron');
const ipcMain = electron.ipcMain;
const _ = require('lodash');

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

export let mainWindow;
export let helpWindow;
export let importMatchesWindow;

function importMatches(inputFile) {
  inputFile = _.first(inputFile);
  return new Promise((resolve, reject) => {
    importMatchesFromFile(inputFile).then(response => {
      resolve(true);
    }).catch( errRes => {
      reject(errRes);
    })
  });
}

// function clearBatch(batch) {
//   return clearBatchData(batch);
// }

function processData(inputFile, outputDirectory, batch) {
  inputFile = _.first(inputFile);
  outputDirectory = _.first(outputDirectory);
  let extractFolder = outputDirectory + '/input/';
  return new Promise((resolve, reject) => {
    extractFile(inputFile, extractFolder).then(response => {
      return readExcelFiles(extractFolder);
    }, errRes => {
      reject(errRes);
    }).then(excelFiles =>{
      if (excelFiles.length === 0) {
        reject('Không tìm thấy File excel nào trong File dữ liệu đầu vào.');
      } else {
        return validateSourceData(excelFiles, batch, outputDirectory);
      }
    }, errRes => {
      reject(errRes);
    }).then((result) => {
      resolve('Xử lý thành công! Vui lòng kiểm tra kết quả ở thư mục ' + outputDirectory);
    });
  });
}

function checkData(inputFile, outputDirectory) {
  inputFile = _.first(inputFile);
  outputDirectory = _.first(outputDirectory);
  let extractFolder = outputDirectory + '/input/';
  return new Promise((resolve, reject) => {
    extractFile(inputFile, extractFolder).then(response => {
      // extractFile
      return readExcelFiles(extractFolder);
    }).catch((errResp) => {
      reject(errResp);
    }).then((excelFiles) =>{
      // readExcelFiles
      if (excelFiles.length === 0) {
        reject('We have not found any excel file in your input source.');
      } else {
        return checkHospitalNames(excelFiles);
      }
    }).catch((errRes) => {
      reject(errRes);
    }).then((checkResult) => {
      if (checkResult.fileTooBig.length > 0 || checkResult.hasErorInHospitalName.length > 0 ||
        checkResult.notFoundHospitalName.length > 0
      ) {
        return writeReportToExcelFile(outputDirectory + '/', checkResult);
      } else {
        resolve({ success: true });
      }
    }).catch((errRes) => {
      reject(errRes);
    }).then((resultFilePath) => {
      resolve('Data Input need to be revised before continue to processing. Please check in ' + resultFilePath);
    }).catch((errRes) => {
      reject(errRes);
    });
  });
}

exports.processData = processData;
exports.checkData = checkData;
exports.importMatches = importMatches;
exports.clearBatchData = clearBatchData;
exports.generateReport = generateReport;
// exports.clearBatch = clearBatch;
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
  });


  helpWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'help.html'),
    protocol: 'file:'
  }));

  helpWindow.on('closed', () => {
    helpWindow = null;
  });

});

ipcMain.on('close-help-window', () => {
  if (helpWindow) {
    helpWindow.close();
  }
});

ipcMain.on('open-import-matches-window', () =>{
  if (importMatchesWindow) {
    return;
  }

  importMatchesWindow = createWindow('import-matches',{
    width: 800,
    height: 600,
    parent: mainWindow
  });


  importMatchesWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'import-matches.html'),
    protocol: 'file:'
  }));

  importMatchesWindow.on('closed', () => {
    importMatchesWindow = null;
  });

});

ipcMain.on('close-import-matches-window', () => {
  if (importMatchesWindow) {
    importMatchesWindow.close();
  }
});
