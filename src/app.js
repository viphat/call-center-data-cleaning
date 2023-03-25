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

let inputFile, outputDirectory, isProcessing, batch, source;

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
      { name: 'Excel File', extensions: ['xls', 'xlsx'] }
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

function assignFormValues() {
  batch = document.getElementById('txtBatch').value;

  if (document.querySelector('input[name="txtSource"]:checked') !== null) {
    source = document.querySelector('input[name="txtSource"]:checked').value;
  } else {
    source = undefined;
  }
}

function isFormInvalid() {
  return outputDirectory === undefined || inputFile === undefined || batch === undefined || batch === null || batch === '' || document.querySelector('input[name="txtSource"]:checked') === null
}

document.getElementById('btnExportMonthlyData').addEventListener('click', _ => {
  var monthYear = document.getElementById('txtMonthYear').value;

  if (monthYear === undefined || monthYear === null) {
    dialog.showErrorBox('Notification', 'You must fill in Month/Year Field before processing.');
    return null;
  }

  if (outputDirectory === undefined || outputDirectory === null) {
    dialog.showErrorBox('Notification', 'You must fill in output directory before processing.');
    return null;
  }

  if (isProcessing === true) {
    dialog.showErrorBox('Notification', 'Processing...');
    return null;
  }

  isProcessing = true;
  resetAlertAndShowSpinner();

  var month = monthYear.split('/')[0]
  var year = monthYear.split('/')[1]

  mainProcess.exportMonthlyData(month, year, outputDirectory).then((response) => {
    disableSpinner();
    showSucceedBox('Data Exported. Please check output folder');
  }, (errRes) => {
    disableSpinner();
    showFailedBox(errRes);
  });
});

// document.getElementById('btnFullBatchData').addEventListener('click', _ => {
//   // batch = 'W2';
//   // outputDirectory = ['/Users/viphat/projects/dct/output'];

//   if (batch === undefined || batch === null || batch === '') {
//     dialog.showErrorBox('Notification', 'You must fill in batch field before processing.');
//     return null;
//   }


//   if (outputDirectory === undefined || outputDirectory === null) {
//     dialog.showErrorBox('Notification', 'You must fill in output directory before processing.');
//     return null;
//   }

//   if (isProcessing === true) {
//     dialog.showErrorBox('Notification', 'Processing...');
//     return null;
//   }

//   isProcessing = true;
//   resetAlertAndShowSpinner();

//   mainProcess.exportFullBatchData(batch, outputDirectory).then((response) => {
//     disableSpinner();
//     showSucceedBox('Data Exported. Please check output folder');
//   }, (errRes) => {
//     disableSpinner();
//     showFailedBox(errRes);
//   });
// });

// document.getElementById('btnFullReport').addEventListener('click', _ => {
//   if (outputDirectory === undefined || outputDirectory === null) {
//     dialog.showErrorBox('Notification', 'You must fill in output directory before processing.');
//     return null;
//   }

//   if (isProcessing === true) {
//     dialog.showErrorBox('Notification', 'Processing...');
//     return null;
//   }

//   isProcessing = true;
//   resetAlertAndShowSpinner();

//   mainProcess.exportFullReport(outputDirectory).then((response) => {
//     disableSpinner();
//     showSucceedBox('Data Exported. Please check output folder');
//   }, (errRes) => {
//     disableSpinner();
//     showFailedBox(errRes);
//   });
// });

// document.getElementById('btnFullData').addEventListener('click', _ => {
//   if (outputDirectory === undefined || outputDirectory === null) {
//     dialog.showErrorBox('Notification', 'You must fill in output directory before processing.');
//     return null;
//   }

//   if (isProcessing === true) {
//     dialog.showErrorBox('Notification', 'Processing...');
//     return null;
//   }

//   isProcessing = true;
//   resetAlertAndShowSpinner();

//   mainProcess.exportFullData(outputDirectory).then((response) => {
//     disableSpinner();
//     showSucceedBox('Data Exported. Please check output folder');
//   }, (errRes) => {
//     disableSpinner();
//     showFailedBox(errRes);
//   });
// });

document.getElementById('btnReport').addEventListener('click', _ => {
  // outputDirectory = ['/Users/viphat/Downloads/hosca/output'];
  // batch = 'W1';
  // source = 'IMC';
  assignFormValues();

  if (batch === undefined || batch === null || batch === '') {
    dialog.showErrorBox('Notification', 'You must fill in batch field before processing.');
    return null;
  }

  if (source === undefined || source === null || source === '') {
    dialog.showErrorBox('Notification', 'You must fill in source field before processing.');
    return null;
  }

  if (outputDirectory === undefined || outputDirectory === null) {
    dialog.showErrorBox('Notification', 'You must fill in output directory before processing.');
    return null;
  }

  if (isProcessing === true) {
    dialog.showErrorBox('Notification', 'Processing...');
    return null;
  }

  isProcessing = true;
  resetAlertAndShowSpinner();

  mainProcess.generateReport(batch, source, outputDirectory).then( (reportFilePath) => {
    disableSpinner();
    showSucceedBox('Report generated. Please check file ' + reportFilePath);
  }, (errRes) => {
    disableSpinner();
    showFailedBox(errRes);
  });
});

document.getElementById('btnClearBatch').addEventListener('click', _ => {
  assignFormValues();

  if (batch === undefined || batch === null || batch === '') {
    dialog.showErrorBox('Notification', 'You must fill in batch field before processing.');
    return null;
  }

  if (source === undefined || source === null || source === '') {
    dialog.showErrorBox('Notification', 'You must fill in source field before processing.');
    return null;
  }

  if (isProcessing === true) {
    dialog.showErrorBox('Notification', 'Processing...');
    return null;
  }

  isProcessing = true;
  resetAlertAndShowSpinner();

  mainProcess.clearBatchData(batch, source).then( (response) => {
    disableSpinner();
    showSucceedBox('Clear All Data of ' + batch + ' Batch successfully.');
  }, (errRes) => {
    disableSpinner();
    showFailedBox(errRes);
  });
});

document.getElementById('btnProcess').addEventListener('click', _ => {
  assignFormValues();
  // inputFile = ['/Users/viphat/Downloads/hosca/IMC_Report Huggies 4 3-10 3-306 data.xlsx'];
  // outputDirectory = ['/Users/viphat/Downloads/hosca/output'];
  // batch = 'W1';
  // source = 'IMC';

  if (isFormInvalid()) {
    dialog.showErrorBox('Notification', 'You must fill out this form before processing.');
    return null;
  }

  if (isProcessing === true) {
    dialog.showErrorBox('Notification', 'Processing...');
    return null;
  }

  isProcessing = true;
  resetAlertAndShowSpinner();

  mainProcess.processData(inputFile, batch, source, outputDirectory).then( (response) => {
    disableSpinner();
    showSucceedBox(response);
  }, errRes => {
    disableSpinner();
    showFailedBox(errRes);
  });
});

document.getElementById('btnCheck').addEventListener('click', _ => {
  // inputFile = ['/Users/viphat/Downloads/hosca/OTB_Report Huggies 4.03- 10.03_11791 data.xlsx'];
  // outputDirectory = ['/Users/viphat/Downloads/hosca/output'];
  assignFormValues();

  if (outputDirectory === undefined || inputFile === undefined) {
    dialog.showErrorBox('Notification', 'Bạn phải khai báo Input File và Output Directory trước khi Kiểm tra Data.');
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
