const _  = require('lodash');
const Excel = require('exceljs');
const fs = require('fs');
import { db } from '../db/prepare_data.js';

const hospitalCell = 'I2';
const redundantString = 'Tên BV/PK:';
const workbook = new Excel.Workbook();
let fileTooBig = [];
let hasErorInHospitalName = [];
let notFoundHospitalName = [];
let fileIndex = 0;

export const writeReportToExcelFile = (extractFolder, checkResult) => {
  let resultFilePath = extractFolder + 'invalidCheckingResult.xlsx';
  return new Promise((resolve, reject) => {
    let workbook = new Excel.Workbook();
    writeUnfoundList(checkResult, workbook).then((response) => {
      return writeHospitalList(checkResult, workbook);
    }).catch((errRes) => {
      reject(errRes);
    }).then((response) => {
      return writeOtherErrors(checkResult, workbook);
    }).catch((errRes) => {
      reject(errRes);
    }).then((response) => {
      workbook.xlsx.writeFile(resultFilePath);
      resolve(resultFilePath);
    }).catch((errRes) => {
      reject(errRes);
    });
  });
}

function writeOtherErrors(checkResult, workbook) {
  return new Promise((resolve, reject) => {
    if (checkResult.hasErorInHospitalName.length == 0 || checkResult.fileTooBig.length == 0) {
      return resolve(false);
    }
    let worksheet = workbook.addWorksheet('Other Errors', {});
    if (checkResult.hasErorInHospitalName.length > 0) {
      worksheet.addRow(['File Size is too big']);
      _.each(checkResult.fileTooBig, (item) => {
        worksheet.addRow([item]);
      });
    }
    if (checkResult.hasErorInHospitalName.length > 0) {
      worksheet.addRow(['Has Error In Hospital Name']);
      _.each(checkResult.hasErorInHospitalName, (item) => {
        worksheet.addRow([item]);
      });
    }
    resolve(true);
  });
}

function writeUnfoundList(checkResult, workbook) {
  return new Promise((resolve, reject) => {
    if (checkResult.notFoundHospitalName.length == 0) {
      return resolve(false);
    }
    let worksheet = workbook.addWorksheet('Unfound List', {});
    worksheet.getColumn('A').width = 20.0;
    worksheet.getColumn('B').width = 9.0;
    worksheet.addRow(['Hospital Name', 'Equivalent ID']);
    _.each(checkResult.notFoundHospitalName, (item) => {
      worksheet.addRow([item]);
    });
    resolve(true);
  });
}

function writeHospitalList(checkResult, workbook) {
  return new Promise((resolve, reject) => {
    if (checkResult.notFoundHospitalName.length == 0) {
      return resolve(false);
    }
    let worksheet = workbook.addWorksheet('Hospital List', {});
    worksheet.getColumn('A').width = 20.0;
    worksheet.getColumn('B').width = 9.0;
    worksheet.addRow(['Hospital Name', 'ID']);
    resolve(fetchDbAsync(worksheet));
  });
}

function fetchDbAsync(worksheet) {
  return new Promise((resolve, reject) => {
    db.all('SELECT hospital_id, name FROM hospitals order by hospital_id;', (err, rows) => {
      if (err) {
        // Do nothing
        console.log(err);
      } else {
        _.each(rows, (row) =>{
          worksheet.addRow([row.name, row.hospital_id]);
        })
        resolve(true);
      }
    });
  })
}

export const checkHospitalNames = (excelFiles) => {
  return new Promise((resolve, reject) => {
    readFiles(excelFiles).then((response) => {
      resolve({
        fileTooBig: fileTooBig,
        hasErorInHospitalName: hasErorInHospitalName,
        notFoundHospitalName: notFoundHospitalName
      });
    }).catch( (errRes) =>{
      reject(errRes);
    });
  })
};

function readFiles(excelFiles) {
  return new Promise((resolve, reject) => {
    resolve(readNextExcelFile(excelFiles, fileIndex));
  });
}

function readNextExcelFile(excelFiles, fileIndex) {
  return new Promise((resolve, reject) => {
    let excelFile = excelFiles[fileIndex];
    let stats = fs.statSync(excelFile);
    if (stats.size / 1000000.0 > 1.0) {
      fileTooBig.push(excelFile);
      return resolve(readNextExcelFile(excelFiles, fileIndex + 1));
    } else {
      workbook.xlsx.readFile(excelFile).then(()=>{
        let worksheet = workbook.getWorksheet(1);
        let hospitalName = _.replace(worksheet.getCell(hospitalCell).value, redundantString, '');
        hospitalName = hospitalName.trim().replace(/\s+/g, ' ');
        if (hospitalName.length < 3) {
          hasErorInHospitalName.push(excelFile);
          return resolve(readNextExcelFile(excelFiles, fileIndex+1));
        } else {
          checkWithMatches(hospitalName);
        }
        if (fileIndex == excelFiles.length - 1) {
          return resolve(null);
        }
        resolve(readNextExcelFile(excelFiles, fileIndex + 1));
      }).catch((errRes) => {
        reject(errRes);
      });
    }
  });
}

function checkWithMatches(hospitalName) {
  db.get("SELECT hospital_id, name from matches where name LIKE ?", "%" + hospitalName + "%", (err, res) => {
    if (err) {
      return console.log(err);
    }
    if (res === undefined || res === null) {
      notFoundHospitalName.push(hospitalName);
    }
  });
}
