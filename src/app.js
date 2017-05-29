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

let inputFile, outputDirectory, isProcessing, batch;

document.getElementById('outputDirectory').addEventListener('click', _=>{
  outputDirectory = dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  var label = document.getElementById('outputDirectoryLabel');
  label.innerHTML = outputDirectory;
});

document.getElementById('inputFile').addEventListener('click', _=>{
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

function resetAlertAndShowSpinner() {
  document.getElementById('failedBox').style.display = 'none';
  document.getElementById('succeedBox').style.display = 'none';
  document.getElementById('spinner').style.display = 'inherit';
}

document.getElementById('btnReport').addEventListener('click', _ => {
  batch = document.getElementById('txtBatch').value;
  batch = 'W1';

  if (batch === undefined || batch === null || batch === '') {
    dialog.showErrorBox('Notification', 'You must fill in batch field before processing.');
    return null;
  }

  if (isProcessing === true) {
    dialog.showErrorBox('Notification', 'Processing...');
    return null;
  }

  isProcessing = true;
  resetAlertAndShowSpinner();

  mainProcess.generateReport(batch).then( (response) => {
    disableSpinner();
    showSucceedBox('Report generated. Please check the output directory.');
  }, (errRes) => {
    disableSpinner();
    showFailedBox(errRes);
  });

});

document.getElementById('btnClearBatch').addEventListener('click', _ => {
  batch = document.getElementById('txtBatch').value;
  batch = 'W1';

  if (batch === undefined || batch === null || batch === '') {
    dialog.showErrorBox('Notification', 'You must fill in batch field before processing.');
    return null;
  }

  if (isProcessing === true) {
    dialog.showErrorBox('Notification', 'Processing...');
    return null;
  }

  isProcessing = true;
  resetAlertAndShowSpinner();

  mainProcess.clearBatchData(batch).then( (response) => {
    disableSpinner();
    showSucceedBox('Clear All Data of ' + batch + ' Batch successfully.');
  }, (errRes) => {
    disableSpinner();
    showFailedBox(errRes);
  });

});

document.getElementById('btnProcess').addEventListener('click', _ => {
  inputFile = ['/Users/viphat/projects/dct/data-sample.zip'];
  outputDirectory = ['/Users/viphat/projects/dct/output'];
  batch = document.getElementById('txtBatch').value;
  batch = 'W1';

  if (outputDirectory === undefined || inputFile === undefined || batch === undefined || batch === null || batch === '') {
    dialog.showErrorBox('Notification', 'You must fill out this form before processing.');
    return null;
  }

  if (isProcessing === true) {
    dialog.showErrorBox('Notification', 'Processing...');
    return null;
  }

  isProcessing = true;
  resetAlertAndShowSpinner();

  mainProcess.processData(inputFile, outputDirectory, batch).then( (response) => {
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
    dialog.showErrorBox('Notification', 'You must fill out this form before processing.');
    return null;
  }
  if (isProcessing === true) {
    dialog.showErrorBox('Notification', 'Processing...');
    return null;
  }

  isProcessing = true;
  resetAlertAndShowSpinner();

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
