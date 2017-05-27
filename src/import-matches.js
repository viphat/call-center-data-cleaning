// Here is the starting point for your application code.

// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from 'electron';
import jetpack from 'fs-jetpack';

const app = remote.app;
const mainProcess = remote.require('./background');
const dialog = remote.dialog;
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
let inputFile, outputDirectory, isProcessing;

document.getElementById('inputFile').addEventListener('click', _=>{
  // document.getElementById('outputDirectory').click();
  // mainProcess.selectDirectory();
  // console.log(mainProcess.outputPath);
  inputFile = dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Excel 2007+ File', extensions: ['xlsx'] }
    ]
  });
  var label = document.getElementById('inputFileLabel');
  label.innerHTML = inputFile;
});

function disableSpinner() {
  isProcessing = false;
  document.getElementById('spinner').style.display = 'none';
}

document.getElementById('btnProcess').addEventListener('click', _=>{
  if (inputFile === undefined) {
    dialog.showErrorBox('Error!!!', 'Must have input file (*.xlsx).');
    return null;
  }
  if (isProcessing === true) {
    dialog.showErrorBox('!!!', 'Đang xử lý...');
    return null;
  }
  isProcessing = true;
  document.getElementById('spinner').style.display = 'inherit';
  mainProcess.importMatches(inputFile).then( (response) => {
    disableSpinner();
    dialog.showMessageBox({type: 'info', title: 'Notification', message: 'Import successfully!'});
  }, errRes => {
    disableSpinner();
  });
});
