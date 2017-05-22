// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';

// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
// import { greet } from './hello_world/hello_world';
import env from './env';

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());
const mainProcess = remote.require('./background');
const dialog = remote.dialog;

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read('package.json', 'json');
let inputFile, outputDirectory, isProcessing;

const osMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux',
};

// document.querySelector('#greet').innerHTML = greet();
// document.querySelector('#os').innerHTML = osMap[process.platform];
// document.querySelector('#author').innerHTML = manifest.author;
// document.querySelector('#env').innerHTML = env.name;
// document.querySelector('#electron-version').innerHTML = process.versions.electron;
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

// document.getElementById('outputDirectory').addEventListener('change', _=>{
//   var input = document.getElementById('directoryLabel');
//   input.innerHTML = document.getElementById('outputDirectory').value;
// });

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
  // For Quick Development Purpose
  inputFile = ['/Users/viphat/Downloads/data-test.zip']
  outputDirectory = ['/Users/viphat/Downloads/2017']
  // End
  if (outputDirectory === undefined || inputFile === undefined) {
    dialog.showErrorBox('Lỗi!!!', 'Phải khai báo File nén (.zip) chứa dữ liệu chưa qua xử lý cũng như Thư mục chứa kết quả xử lý.');
    return null;
  }
  if (isProcessing === true) {
    dialog.showErrorBox('!', 'Đang xử lý...');
    return null;
  }
  isProcessing = true;
  document.getElementById('spinner').style.display = 'inherit';
  mainProcess.processData(inputFile, outputDirectory).then( response =>{
    disableSpinner();
    showSucceedBox(response);
  }, errRes => {
    disableSpinner();
    showFailedBox(errRes);
  });
});
