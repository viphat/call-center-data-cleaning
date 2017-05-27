// Here is the starting point for your application code.

// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import env from './env';

const app = remote.app;
const mainProcess = remote.require('./background');
const dialog = remote.dialog;
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
// const manifest = appDir.read('package.json', 'json');
let inputFile, outputDirectory, isProcessing;

document.getElementById('outputDirectory').addEventListener('click', _=>{
  // document.getElementById('outputDirectory').click();
  // mainProcess.selectDirectory();
  // console.log(mainProcess.outputPath);
  outputDirectory = dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  var label = document.getElementById('outputDirectoryLabel');
  label.innerHTML = outputDirectory;
});

document.getElementById('inputFile').addEventListener('click', _=>{
  // document.getElementById('outputDirectory').click();
  // mainProcess.selectDirectory();
  // console.log(mainProcess.outputPath);
  inputFile = dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Archived File', extensions: ['zip'] }
    ]
  });
  var label = document.getElementById('inputFileLabel');
  label.innerHTML = inputFile;
});

function disableSpinner() {
  isProcessing = false;
  document.getElementById('spinner').style.display = 'none';
}

function showSucceedBox(content) {
  document.getElementById('failedBox').style.display = 'none';
  document.getElementById('succeedBox').style.display = 'inherit';
  document.getElementById('succeedBox').innerHTML = content;
}

function showFailedBox(content) {
  document.getElementById('succeedBox').style.display = 'none';
  document.getElementById('failedBox').style.display = 'inherit';
  document.getElementById('failedBox').innerHTML = content;
}

document.getElementById('btnProcess').addEventListener('click', _=>{
  inputFile = ['/Users/viphat/projects/dct/data-sample.zip'];
  outputDirectory = ['/Users/viphat/projects/dct/output'];

  if (outputDirectory === undefined || inputFile === undefined) {
    dialog.showErrorBox('Lỗi!!!', 'Phải khai báo File nén (.zip) chứa dữ liệu chưa qua xử lý cũng như Thư mục chứa kết quả xử lý.');
    return null;
  }
  if (isProcessing === true) {
    dialog.showErrorBox('!!!', 'Đang xử lý...');
    return null;
  }
  isProcessing = true;
  document.getElementById('spinner').style.display = 'inherit';
  mainProcess.processData(inputFile, outputDirectory).then( (response) => {
    disableSpinner();
    showSucceedBox(response);
  }, errRes => {
    disableSpinner();
    showFailedBox(errRes);
  });
});

document.getElementById('btnCheck').addEventListener('click', _ => {
  // For Quick Development Purpose
  // TODO: Clean it.
  inputFile = ['/Users/viphat/projects/dct/data-sample.zip'];
  outputDirectory = ['/Users/viphat/projects/dct/output'];
  // End

  if (outputDirectory === undefined || inputFile === undefined) {
    dialog.showErrorBox('Lỗi!!!', 'Phải khai báo File nén (.zip) chứa dữ liệu chưa qua xử lý cũng như Thư mục chứa kết quả xử lý.');
    return null;
  }
  if (isProcessing === true) {
    dialog.showErrorBox('!!!', 'Đang xử lý...');
    return null;
  }
  isProcessing = true;
  document.getElementById('spinner').style.display = 'inherit';
  mainProcess.checkData(inputFile, outputDirectory).then((checkResult) => {
    showSucceedBox(checkResult);
    disableSpinner();
  }).catch((errRes) => {
    showFailedBox(errRes);
    disableSpinner();
  });
});

ipcRenderer.on('openHelpWindow', () => {
  ipcRenderer.send('open-help-window');
  ipcRenderer.send('close-import-matches-window');
});

ipcRenderer.on('openImportMatchesWindow', () => {
  ipcRenderer.send('close-help-window');
  ipcRenderer.send('open-import-matches-window');
});
